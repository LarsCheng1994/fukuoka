import { useEffect, useMemo, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useScroll, useInView, AnimatePresence, Reorder, useDragControls, type Variants } from "motion/react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  days, notices, routes, mapUrl, img, coords, foods,
  type Day, type Stop as StopT, type Chip as ChipT, type Tip as TipT,
  type Transport as TransportT, type RouteInfo,
} from "./data";

const ease: [number, number, number, number] = [0.2, 0.7, 0.2, 1];

const navItems = [
  { id: "overview", label: "總覽", tag: false },
  { id: "day1", label: "D1", tag: false },
  { id: "day2", label: "D2", tag: false },
  { id: "day3", label: "D3", tag: false },
  { id: "day4", label: "D4", tag: false },
  { id: "day5", label: "D5", tag: false },
  { id: "info", label: "資訊", tag: true },
];

const CONF: Record<string, string> = { high: "已查證", medium: "待確認", low: "參考" };

function Reveal({ children, delay = 0, className = "" }:
  { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.65, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

function Chips({ items }: { items: ChipT[] }) {
  return (
    <div className="chips">
      {items.map(([k, t], i) => (
        <span key={i} className={`chip ${k}`} dangerouslySetInnerHTML={{ __html: t }} />
      ))}
    </div>
  );
}

function Tips({ items }: { items: TipT[] }) {
  const icon = (k: string) => (k === "warn" ? "⚠️" : k === "eat" ? "🍴" : "💡");
  return (
    <div className="tips">
      {items.map(([k, t], i) => (
        <div key={i} className={`tip ${k}`}>
          <span className="ti">{icon(k)}</span>
          <span dangerouslySetInnerHTML={{ __html: t }} />
        </div>
      ))}
    </div>
  );
}

function LegCard({ leg }: { leg: RouteInfo }) {
  return (
    <div className="leg">
      <div className="lr">
        {leg.route}
        {leg.confidence && <span className={`conf ${leg.confidence}`}>{CONF[leg.confidence]}</span>}
      </div>
      <div className="lmeta">
        <span className="chip time">{leg.mode}</span>
        <span className="chip time">⏱ {leg.runtime}</span>
        <span className="chip cost">{leg.fare}</span>
        {leg.frequency && <span className="chip hour">{leg.frequency}</span>}
      </div>
      {(leg.first || leg.last) && (
        <div className="lline"><span className="k">首/末班</span><span>{[leg.first, leg.last].filter(Boolean).join("　／　")}</span></div>
      )}
      {leg.samples && leg.samples.length > 0 && (
        <div className="sched">
          {leg.samples.map((s, i) => (
            <span key={i} className={`st ${/末班|⚠/.test(s) ? "last" : ""}`}>{s}</span>
          ))}
        </div>
      )}
      {leg.operator && <div className="lline"><span className="k">營運</span><span>{leg.operator}</span></div>}
      {leg.notes && <div className="lnote">{leg.notes}</div>}
      {leg.source && <a className="lsrc" href={leg.source} target="_blank" rel="noopener noreferrer">官方資訊 ↗</a>}
    </div>
  );
}

function TransportBox({ transport }: { transport: TransportT }) {
  const [open, setOpen] = useState(false);
  const legs = (transport.legs || []).map((id) => routes[id]).filter(Boolean);
  return (
    <div className="transport">
      <div className="t-head">
        <span className="t-mode">{transport.mode}</span>
        <span className="t-text" dangerouslySetInnerHTML={{ __html: transport.text }} />
        {legs.length > 0 && (
          <button className={`t-toggle ${open ? "open" : ""}`} onClick={() => setOpen((o) => !o)}>
            班次・票價<span className="ar">▾</span>
          </button>
        )}
      </div>
      {legs.length > 0 && (
        <div className="chips" style={{ padding: "0 12px 10px" }}>
          {legs.map((l, i) => (
            <span key={i} className="chip time">{l.mode.split(" ")[0]} {l.runtime} · {l.fare}</span>
          ))}
        </div>
      )}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="t-detail pad"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease }}
          >
            {legs.map((l, i) => <LegCard key={i} leg={l} />)}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type MapPin = { n: number; name: string; coord: [number, number] };

function DayMap({ stops, color }: { stops: MapPin[]; color: string }) {
  const elRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // create map once (StrictMode-safe via guard + cleanup)
  useEffect(() => {
    if (!elRef.current || mapRef.current) return;
    const map = L.map(elRef.current, { scrollWheelZoom: false, zoomControl: true });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO', subdomains: "abcd", maxZoom: 19,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; layerRef.current = null; };
  }, []);

  // redraw pins + route whenever order changes
  useEffect(() => {
    const map = mapRef.current, layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const pts = stops.map((s) => s.coord);
    if (!pts.length) return;
    if (pts.length > 1) {
      L.polyline(pts, { color, weight: 3, opacity: 0.8, dashArray: "1 9", lineCap: "round" }).addTo(layer);
    }
    stops.forEach((s) => {
      const icon = L.divIcon({
        className: "daymap-pin",
        html: `<b style="background:${color}">${s.n}</b>`,
        iconSize: [26, 26], iconAnchor: [13, 13], popupAnchor: [0, -13],
      });
      L.marker(s.coord, { icon }).addTo(layer).bindPopup(`<b>${s.n}.</b> ${s.name}`);
    });
    map.invalidateSize();
    map.fitBounds(L.latLngBounds(pts), { padding: [36, 36], maxZoom: 15 });
  }, [stops, color]);

  return <div className="daymap" ref={elRef} role="img" aria-label="當日路線地圖" />;
}

function CardInner({ stop }: { stop: StopT }) {
  return (
    <div className="card">
      <div className="card-main">
        <span className="time">🕘 {stop.time}</span>
        <h4>
          {stop.map ? (
            <>
              <a className="nm" href={mapUrl(stop.map)} target="_blank" rel="noopener noreferrer">{stop.name}</a>
              <a className="map" href={mapUrl(stop.map)} target="_blank" rel="noopener noreferrer">📍地圖</a>
            </>
          ) : stop.name}
        </h4>
        {stop.jp && <div className="jp">{stop.jp}</div>}
        <div className="desc" dangerouslySetInnerHTML={{ __html: stop.desc }} />
        {stop.transport && <TransportBox transport={stop.transport} />}
        {stop.chips && <Chips items={stop.chips} />}
        {stop.tips && <Tips items={stop.tips} />}
      </div>
      {stop.pic && (
        <div className="card-thumb">
          <img src={img(stop.pic)} alt={stop.name} loading="lazy" />
        </div>
      )}
    </div>
  );
}

function ReorderStop({ item, i }: { item: { s: StopT; id: string }; i: number }) {
  const controls = useDragControls();
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-18% 0px -18% 0px" });
  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      as="div"
      className={`stop reorder-item ${inView ? "act" : ""}`}
      whileDrag={{ scale: 1.015, zIndex: 6 }}
    >
      <span className="node" ref={nodeRef}>{item.s.node}<span className="seq">{i + 1}</span></span>
      <button
        className="drag-handle"
        onPointerDown={(e) => controls.start(e)}
        aria-label="拖曳調整順序"
        title="拖曳調整順序"
      >⠿</button>
      <CardInner stop={item.s} />
    </Reorder.Item>
  );
}

function DaySection({ day }: { day: Day }) {
  const initial = useMemo(() => day.stops.map((s, i) => ({ s, id: `${day.id}-${i}` })), [day]);
  const [items, setItems] = useState(initial);
  const [showMap, setShowMap] = useState(true);
  const tlRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: tlRef, offset: ["start 60%", "end 60%"] });

  const dirty = items.some((it, i) => it.id !== initial[i].id);
  const pins = useMemo<MapPin[]>(
    () =>
      items
        .map((it, i) => ({ n: i + 1, name: it.s.name, coord: coords[it.s.map ?? ""] }))
        .filter((p): p is MapPin => Array.isArray(p.coord)),
    [items]
  );

  return (
    <article className="day" id={day.id}>
      <Reveal>
        <div className="day-banner">
          <img src={img(day.banner)} alt={day.title} loading="lazy" />
          <div className="db-ov">
            <div className="db-num">{day.d}</div>
            <div className="db-meta">
              <div className="dlabel">{day.label}</div>
              <div className="dtitle">{day.title}</div>
              <div className="dtheme">{day.theme}</div>
            </div>
          </div>
          {day.fixed && <div className="day-fixed">{day.fixed}</div>}
        </div>
      </Reveal>

      <div className="daymap-wrap" style={{ "--c1": day.c1, "--c2": day.c2 } as CSSProperties}>
        <div className="daymap-bar">
          <span className="dm-title">🗺️ 當日路線 · 共 {items.length} 站{dirty && <em> · 順序已調整</em>}</span>
          <div className="dm-actions">
            {dirty && <button className="dm-btn reset" onClick={() => setItems(initial)}>↺ 還原順序</button>}
            <button className="dm-btn" onClick={() => setShowMap((s) => !s)}>{showMap ? "收合地圖" : "展開地圖"}</button>
          </div>
        </div>
        {showMap && <DayMap stops={pins} color={day.c1} />}
      </div>

      <div className="reorder-hint">↕ 拖曳卡片的握把 <span>⠿</span> 可調整當天順序，地圖編號即時更新</div>

      <div className="timeline" ref={tlRef}>
        <div className="track" />
        <motion.div className="fill" style={{ scaleY: scrollYProgress }} />
        <Reorder.Group axis="y" values={items} onReorder={setItems} as="div" className="rgroup">
          {items.map((it, i) => <ReorderStop key={it.id} item={it} i={i} />)}
        </Reorder.Group>
      </div>
    </article>
  );
}

const gridVariants: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const itemVariants: Variants = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } } };

const FOOD_CATS = [
  { key: "拉麵", e: "🍜", label: "拉麵 · 豚骨" },
  { key: "鍋物", e: "🍲", label: "鍋物 · もつ鍋／水炊き" },
  { key: "小吃", e: "🍢", label: "在地小吃・鹹食" },
  { key: "麵包", e: "🥐", label: "麵包 · 明太法國" },
  { key: "甜點", e: "🍡", label: "甜點・食べ歩き" },
];

function FoodPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="foodpage">
      <header className="food-hero">
        <button className="food-back" onClick={onBack}>← 回行程</button>
        <div className="food-hero-inner">
          <div className="food-eyebrow">FUKUOKA · GOURMET</div>
          <h1>福岡 美食地圖</h1>
          <p>網友・在地推薦的拉麵、鍋物、小吃、麵包與甜點。點卡片開 Google 地圖；名店多排隊／公休不定，出發前再確認當日營業時間。</p>
        </div>
      </header>
      <div className="wrap food-wrap">
        {FOOD_CATS.map((cat) => {
          const items = foods.filter((f) => f.cat === cat.key);
          if (!items.length) return null;
          return (
            <section className="food-cat" key={cat.key}>
              <h2 className="food-cat-title"><span className="fc-e">{cat.e}</span>{cat.label}</h2>
              <motion.div className="cardgrid" variants={gridVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -8% 0px" }}>
                {items.map((f, i) => (
                  <motion.a className="mini spot" key={i} variants={itemVariants} href={mapUrl(f.map)} target="_blank" rel="noopener noreferrer">
                    <div className="mbody">
                      <span className="emoji">{f.e}</span>
                      <h4>{f.n}</h4>
                      <div className="jp">{f.jp}</div>
                      <p>{f.p}</p>
                      <div className="where">📍 {f.area}</div>
                    </div>
                  </motion.a>
                ))}
              </motion.div>
            </section>
          );
        })}
      </div>
      <footer className="footer">
        <div className="wrap">
          <button className="food-back solid" onClick={onBack}>← 回行程</button>
          <div className="disc">營業時間／公休為時間敏感資訊，出發前請再以各店官方／Google 地圖確認。</div>
        </div>
      </footer>
    </div>
  );
}

function TransitPage({ onBack }: { onBack: () => void }) {
  return (
    <div className="foodpage transitpage">
      <header className="food-hero transit-hero">
        <button className="food-back" onClick={onBack}>← 回行程</button>
        <div className="food-hero-inner">
          <div className="food-eyebrow">FUKUOKA · TRANSIT</div>
          <h1>每日交通總覽</h1>
          <p>以 <b>東比惠（地下鐵空港線）</b> 為據點，盡量同線不換車。<b>全程刷 Suica</b>；唯<b>新幹線（博多⇄小倉）</b>與<b>關門渡輪</b>需在售票機另外購票。下面把每天的移動逐段列出（含班次・票價與回飯店）。時刻為查證時資料，出發前再確認。</p>
        </div>
      </header>
      <div className="wrap food-wrap">
        {days.map((day) => {
          const steps = day.stops.filter((s) => s.transport);
          if (!steps.length) return null;
          return (
            <section className="transit-day" key={day.id}>
              <h2 className="food-cat-title"><span className="fc-e">{day.d}</span>{day.label} · {day.title}</h2>
              <div className="transit-list">
                {steps.map((s, i) => {
                  const legs = (s.transport!.legs || []).map((id) => routes[id]).filter(Boolean);
                  return (
                    <div className="transit-step" key={i}>
                      <div className="ts-head">
                        <span className="ts-mode">{s.transport!.mode}</span>
                        <span className="ts-name">{s.time} · {s.name}</span>
                      </div>
                      <div className="ts-text" dangerouslySetInnerHTML={{ __html: s.transport!.text }} />
                      {legs.length > 0 && (
                        <div className="chips">
                          {legs.map((l, j) => (
                            <span key={j} className="chip time">{l.mode.split(" ")[0]} {l.runtime} · {l.fare}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
      <footer className="footer">
        <div className="wrap">
          <button className="food-back solid" onClick={onBack}>← 回行程</button>
          <div className="disc">班次・票價為查證時（2026/06）資料，屬時間敏感資訊，出發前請再以各官方網站確認。</div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState("overview");
  const [navShow, setNavShow] = useState(false);
  const [toTop, setToTop] = useState(false);
  const [view, setView] = useState<"plan" | "food" | "transit">("plan");
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const ids = navItems.map((n) => n.id);
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const vh = window.innerHeight;
        setNavShow(y > vh * 0.7);
        setToTop(y > vh);
        const max = document.body.scrollHeight - vh;
        if (barRef.current) barRef.current.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
        let cur = "overview";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top <= 130) cur = id;
        }
        setActive((p) => (p === cur ? p : cur));
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const openFood = () => { setView("food"); window.scrollTo({ top: 0 }); };
  const openTransit = () => { setView("transit"); window.scrollTo({ top: 0 }); };
  const backToPlan = () => { setView("plan"); window.scrollTo({ top: 0 }); };

  if (view === "food") return <FoodPage onBack={backToPlan} />;
  if (view === "transit") return <TransitPage onBack={backToPlan} />;

  return (
    <>
      <div className="scrollbar" ref={barRef} />

      <nav className={`nav ${navShow ? "show" : ""}`}>
        <div className="nav-logo">
          <span className="dot" /><span className="full">福岡 FUKUOKA</span><span>·</span>6.19–6.23
        </div>
        <div className="nav-pills">
          {navItems.map((n) => (
            <a key={n.id} className={`${n.tag ? "tag" : ""} ${active === n.id ? "active" : ""}`} onClick={() => go(n.id)}>{n.label}</a>
          ))}
          <a className="tag" onClick={openTransit}>🚇 交通</a>
          <a className="tag food" onClick={openFood}>🍜 美食</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero">
        <div className="hero-sky" />
        <div className="hero-stars" />
        <div className="hero-sun" />
        <div className="cloud c1" /><div className="cloud c2" /><div className="cloud c3" />
        <div className="flightpath">
          <div className="line" />
          <div className="city from"><span className="pin" />KHH 高雄</div>
          <div className="city to"><span className="pin" />FUK 福岡</div>
          <div className="plane">✈️</div>
        </div>
        <svg className="hero-wave" viewBox="0 0 1440 200" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,120 C220,180 420,60 720,110 C1010,158 1200,70 1440,120 L1440,200 L0,200 Z" fill="#16294180" />
          <path d="M0,150 C260,200 480,110 760,150 C1040,190 1240,120 1440,160 L1440,200 L0,200 Z" fill="#132338" />
        </svg>
        <div className="hero-vertical">慢步調 · 獨旅 · 大眾運輸</div>
        <div className="hero-inner">
          <div className="hero-kicker">
            {[..."2026 · 九州 · FUKUOKA"].map((c, i) => (
              <span key={i} style={{ animationDelay: `${0.3 + i * 0.03}s` }}>{c === " " ? " " : c}</span>
            ))}
          </div>
          <h1 className="hero-title">
            {[..."福岡"].map((c, i) => (
              <span key={i} className="ch" style={{ animationDelay: `${0.2 + i * 0.12}s` }}>{c}</span>
            ))}
          </h1>
          <div className="hero-sub">五日四夜 · 2026.06.19 – 06.23 · 梅雨季の輕旅行</div>
          <div className="flight-strip">
            <div className="flight-card">
              <span className="tg">去程</span>
              <span className="route">KHH <span className="arr">14:25 →</span> FUK <span className="arr">17:55</span></span>
              <b>IT270</b>
            </div>
            <div className="flight-card">
              <span className="tg">回程</span>
              <span className="route">FUK <span className="arr">19:00 →</span> KHH <span className="arr">20:40</span></span>
              <b>IT271</b>
            </div>
            <div className="flight-card">🏨 APA〈博多東比惠駅前〉· 4號出口 1分鐘</div>
          </div>
        </div>
        <div className="scrollcue"><div className="mouse" />SCROLL</div>
      </header>

      {/* OVERVIEW */}
      <section className="block" id="overview">
        <div className="wrap">
          <Reveal>
            <div className="intro">
              <img src={img("hero_fukuoka")} alt="福岡 百道海濱 與 福岡塔" />
              <div className="ov">
                <div className="e">行程總覽 · ITINERARY</div>
                <h2>五日 の 路線</h2>
                <p>以 <b>博多／東比惠</b> 為據點，順路低換乘。<b>6/21 別府由布院一日遊與肉屋肉一 19:30 固定不動</b>，其餘依流暢度微調。點卡片跳至當天。</p>
                <div className="ov-btns">
                  <button className="ov-food-btn transit" onClick={openTransit}>🚇 每日交通 →</button>
                  <button className="ov-food-btn" onClick={openFood}>🍜 福岡美食地圖 →</button>
                </div>
              </div>
            </div>
          </Reveal>
          <motion.div className="ov-grid" variants={gridVariants} initial="hidden" whileInView="show" viewport={{ once: true, margin: "0px 0px -8% 0px" }}>
            {days.map((d) => (
              <motion.a key={d.id} className="ov-card" variants={itemVariants} onClick={() => go(d.id)} style={{ "--c1": d.c1, "--c2": d.c2 } as CSSProperties}>
                <div className="ovt">
                  <img src={img(d.banner)} alt={d.title} loading="lazy" />
                  <span className="num">{d.d}</span>
                  {d.fixed && <span className="lock">固定</span>}
                </div>
                <div className="ovb">
                  <div className="od">{d.short}</div>
                  <div className="ot">{d.title}</div>
                  <div className="oh">{d.theme}</div>
                  <div className="bar" />
                </div>
              </motion.a>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NOTICE */}
      <section className="block" id="notice" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal>
            <div className="notice">
              <h3>⚠️ 出發前必看的 6 個提醒</h3>
              <ol>
                {notices.map((n, i) => (
                  <li key={i}><span className="i">{i + 1}</span><div dangerouslySetInnerHTML={{ __html: n }} /></li>
                ))}
              </ol>
            </div>
          </Reveal>
        </div>
      </section>

      {/* DAYS */}
      <section id="days">
        <div className="wrap">
          {days.map((d) => <DaySection key={d.id} day={d} />)}
        </div>
      </section>

      {/* PRACTICAL */}
      <section className="block" id="info" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="sec-head">
            <div className="sec-eyebrow">實用資訊 · Good to Know</div>
            <h2 className="sec-title">交通票券 <span className="jp">＆</span> 小撇步</h2>
          </Reveal>
          <Reveal className="prac-grid">
            <div className="prac">
              <h4>💳 付款：Suica 為主</h4>
              <ul>
                <li><b>全程刷 Suica</b>：地下鐵、JR 在來線、西鐵電車、西鐵巴士／まほろば号都直接嗶卡，免買票。</li>
                <li>⚠️ <b>新幹線 博多⇄小倉（D2）</b>：Suica 進不了新幹線閘口，需在售票機買<b>自由席券</b>（單程 ¥1,730、來回約 ¥3,460）；或改搭 JR 在來線快速（Suica 可、較慢約 1 小時）。</li>
                <li>⚠️ <b>關門渡輪（D2，去回各 ¥400）</b>：在碼頭售票機買<b>乘船券</b>（備現金）。</li>
                <li>門票另付：小倉城 ¥500、福岡塔展望台 ¥1,000（太宰府／竈門神社免費）；KKday 別府一日遊用線上憑證。</li>
              </ul>
            </div>
            <div className="prac">
              <h4>🧳 飯店 · 機場動線</h4>
              <ul>
                <li>APA〈博多東比惠駅前〉：4 號出口步行 1 分；距博多／機場各 1 站。</li>
                <li>Check-in 15:00／Check-out 10:00；退房後可寄行李。</li>
                <li>回程：東比惠→空港（國內線）→ 免費接駁巴士 → 國際線。</li>
              </ul>
            </div>
            <div className="prac">
              <h4>🌧️ 季節 · 步調</h4>
              <ul>
                <li>6 月梅雨季，午後易陣雨；備折傘。</li>
                <li>屋台雨天／週日多公休，備替代（如一双拉麵）。</li>
                <li>每天一個主題、保留購物與發呆時間。</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap">
          <div className="big">よい旅を。</div>
          <div className="disc">營業時間、班次、票價與表演時段為查證時（2026/06）資料，<b>均屬會變動的時間敏感資訊</b>；出發前請再以各官方網站／KKday 憑證確認。標示「約」者為概估，圖片來源見下。</div>
          <div className="src">
            <b>交通查證：</b>福岡市地下鐵 · JR西日本／JR九州 · 關門汽船 · サンデン交通 · 西鐵電車／バス · 太宰府市まほろば号 · 福岡空港 ｜
            <b> 景點：</b>太宰府天満宮 · 九州國立博物館 · 竈門神社 · 小倉城 · 福岡塔 · 櫛田神社 · 天神地下街 · 運河城官方表演排程 · KKday 150984 ｜
            <b> 圖片：</b>Wikimedia Commons（CC BY-SA／CC0，hero_fukuoka・nakasu_yatai by mmry0241；門司港駅 by 663highland；小倉城／海地獄／大濠公園 by そらみみ；福岡塔 by Christophe95 等）與 Unsplash（νGundam by Seongjin Park）。
          </div>
        </div>
      </footer>

      <button className={`totop ${toTop ? "show" : ""}`} aria-label="回到頂部" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>↑</button>
    </>
  );
}
