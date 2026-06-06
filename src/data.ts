// 福岡五日四夜行程資料（2026/06/19–23）
// 時間／票價／班次為查證時（2026/06）資料，屬時間敏感資訊，出發前請再確認官方來源。

export const mapUrl = (q: string) =>
  "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(q);

export const img = (key: string) => `${import.meta.env.BASE_URL}images/${key}.jpg`;

/* ---- 各站點概略座標（用於「當日路線地圖」的順序示意） ----
   以 stop.map 文字為 key；座標為概估，僅供地圖看順序，精準導航仍以各站「📍地圖」連結為準。 */
export const coords: Record<string, [number, number]> = {
  "Fukuoka Airport International Terminal": [33.5852, 130.4530],
  "APA Hotel Hakata Higashihie Ekimae": [33.5903, 130.4308],
  "Higashi-Hie Station": [33.5903, 130.4308],
  "一蘭 本社総本店 Ichiran": [33.5928, 130.4066],
  "博多一双 博多駅東本店": [33.5908, 130.4262],
  "Canal City Hakata": [33.5897, 130.4113],
  "中洲 屋台 Nakasu Yatai": [33.5917, 130.4055],
  "Shimonoseki Station": [33.9508, 130.9242],
  "唐戸市場 Karato Market Shimonoseki": [33.9558, 130.9420],
  "唐戸桟橋 Karato Pier": [33.9562, 130.9430],
  "門司港レトロ Mojiko Retro": [33.9438, 130.9628],
  "Kokura Castle": [33.8848, 130.8736],
  "Hakata Station": [33.5902, 130.4205],
  "Hakata Station Chikushi Exit": [33.5895, 130.4218],
  "にく屋 肉いち 博多店": [33.5880, 130.4250],
  "ドン・キホーテ中洲店": [33.5945, 130.4045],
  "太宰府駅 Dazaifu Station": [33.5155, 130.5237],
  "太宰府天満宮 Dazaifu Tenmangu": [33.5214, 130.5349],
  "スターバックス 太宰府天満宮表参道店": [33.5188, 130.5320],
  "宝満宮竈門神社 Kamado Shrine": [33.5398, 130.5558],
  "Tenjin Fukuoka": [33.5908, 130.3996],
  "天神 もつ鍋": [33.5912, 130.3978],
  "Nishijin Station Fukuoka": [33.5826, 130.3580],
  "Fukuoka Tower": [33.5933, 130.3514],
  "櫛田神社 Kushida Shrine Fukuoka": [33.5926, 130.4108],
  "東長寺 Tochoji Fukuoka": [33.5916, 130.4137],
  "天神地下街 Tenjin Chikagai": [33.5908, 130.3998],
  "Fukuoka Airport": [33.5859, 130.4510],
};

export type ChipKind = "time" | "cost" | "hour" | "pass" | "tick" | "info";
export type Chip = [ChipKind, string];
export type TipKind = "warn" | "info" | "eat";
export type Tip = [TipKind, string];

/* ---- verified transit timetables (expandable detail) ---- */
export interface RouteInfo {
  route: string;
  mode: string;
  runtime: string;
  fare: string;
  frequency?: string;
  first?: string;
  last?: string;
  samples?: string[];
  operator?: string;
  notes?: string;
  confidence?: "high" | "medium" | "low";
  source?: string;
}

export const routes: Record<string, RouteInfo> = {
  subway_kuko_airport_hakata: {
    route: "福岡空港 ↔ 博多（地下鐵空港線）", mode: "🚇 地下鐵", runtime: "約 5 分", fare: "¥260",
    frequency: "日間約 7–8 班/時，尖峰約 12 班/時", first: "福岡空港發 5:43", last: "福岡空港發 0:35",
    samples: ["05:43", "06:01", "06:11", "06:22", "07:01", "07:07", "07:16", "08:00", "08:03", "08:07"],
    operator: "福岡市地下鐵", notes: "直達不換車，途經東比惠。班表為 2026/4/1 改正平日；週末略減。",
    confidence: "high", source: "https://subway.city.fukuoka.lg.jp/eki/stations/kuko.php",
  },
  subway_higashihie_hakata: {
    route: "東比惠 ↔ 博多（1 站）", mode: "🚇 地下鐵", runtime: "約 2 分", fare: "¥210",
    frequency: "與空港線本線同（日間約 7–8 班/時）", operator: "福岡市地下鐵",
    notes: "1.2 km、不換車。", confidence: "high", source: "https://subway.city.fukuoka.lg.jp/eki/stations/higashihie.php",
  },
  subway_hakata_tenjin: {
    route: "博多 ↔ 天神（地下鐵空港線）", mode: "🚇 地下鐵", runtime: "約 5 分", fare: "¥210",
    frequency: "日間約 7–8 班/時，尖峰更密", operator: "福岡市地下鐵",
    notes: "途經祇園・中洲川端，不換車。", confidence: "high", source: "https://subway.city.fukuoka.lg.jp/fare/ryokin.php",
  },
  fuk_intl_shuttle: {
    route: "福岡空港 國內線 ↔ 國際線（免費接駁巴士）", mode: "🚌 接駁巴士",
    runtime: "國內→國際約 10 分／國際→國內約 15 分", fare: "免費",
    frequency: "7–18 時約 5–7 分一班；19 時後 10–15 分一班", first: "約 6:00", last: "約 23 時台",
    samples: ["06:00", "06:06", "06:12", "06:18", "06:24", "06:30", "19:00", "19:05", "19:10", "19:15"],
    operator: "西鐵巴士／FIAC", notes: "國際線無地下鐵，必須搭此車。國內線南側乘車處（1・15 號）。發車時刻為目安。",
    confidence: "high", source: "https://www.fukuoka-airport.jp/access/bus2.html",
  },
  shinkansen_hkt_kkr: {
    route: "博多 ↔ 小倉（山陽新幹線）", mode: "🚄 新幹線", runtime: "約 15–17 分", fare: "¥2,160（自由席）",
    frequency: "每時約 5–10 班（のぞみ／みずほ／さくら／こだま）", operator: "JR 西日本",
    samples: ["07:04 こだま", "07:15 のぞみ", "07:36 のぞみ", "07:49 こだま", "07:53 みずほ", "08:00 のぞみ", "08:06 のぞみ", "08:15 のぞみ", "08:23 さくら"],
    notes: "小倉→博多回程（週六）例：17:14／17:34／17:43／17:54／18:07／18:14…。旺季のぞみ可能全車指定席，無自由席。",
    confidence: "high", source: "https://jr-shinkansen.net/hakata-kokura.html",
  },
  jr_kokura_shimonoseki: {
    route: "小倉 ↔ 下関（JR，門司經由）", mode: "🚆 JR 在來線", runtime: "約 13–15 分", fare: "¥340",
    frequency: "日間 20–30 分一班，尖峰 15–20 分", operator: "JR 九州＋JR 西日本",
    samples: ["06:16", "06:34", "06:54", "12:15", "12:38", "13:11", "13:29"],
    notes: "多為門司直通，途中僅停門司。", confidence: "high", source: "https://ekitan.com/transit/fare/sf-7614/st-6645",
  },
  sanden_shimonoseki_karato: {
    route: "下関駅 ↔ 唐戶（路線巴士）", mode: "🚌 巴士", runtime: "約 7 分", fare: "¥260",
    frequency: "多系統經停，合計頻繁；單一系統約 1–2 班/時", operator: "サンデン交通",
    samples: ["06:26", "06:53", "12:06", "12:30", "16:17", "16:35"],
    notes: "下関駅前各乘車處多班皆達唐戶（火の山線／北浦線等）。", confidence: "medium", source: "https://www.sandenkotsu.co.jp/bus/route_bus/bus_stop/bg_karato/",
  },
  ferry_karato_mojiko: {
    route: "唐戶 ↔ 門司港（關門連絡船）", mode: "⛴️ 渡輪", runtime: "約 5 分", fare: "¥400（兒童 ¥200）",
    frequency: "日間約 10–20 分一班", first: "唐戶發 6:15／門司港發 6:40", last: "唐戶發 21:50／門司港發 21:10",
    samples: ["唐戶發 首班 6:15", "門司港發 首班 6:40", "日間 10–20 分一班", "唐戶末班 21:50", "門司港末班 21:10"],
    operator: "關門汽船", notes: "✅已查證官方時刻。部分班次日祝運休；6/20 為週六、正常營運，去回各坐一次都 OK。", confidence: "high", source: "https://www.kanmon-kisen.co.jp/route/kanmon.html",
  },
  jr_mojiko_kokura: {
    route: "門司港 ↔ 小倉（JR 鹿兒島本線）", mode: "🚆 JR 在來線", runtime: "約 13–14 分", fare: "¥280",
    frequency: "日間 2–3 班/時", operator: "JR 九州",
    samples: ["07:15", "12:23", "16:42", "20:45"],
    notes: "快速／區間快速／普通混合。¥280 為單純區間普通運賃（部分查詢顯示 ¥340）。", confidence: "medium", source: "https://www.jrkyushu-timetable.jp/",
  },
  subway_higashihie_tenjin: {
    route: "東比惠 ↔ 天神（地下鐵空港線）", mode: "🚇 地下鐵", runtime: "約 10 分", fare: "¥260",
    frequency: "日間約 7–8 班/時，尖峰更密", operator: "福岡市地下鐵",
    notes: "東比惠—博多—…—天神，不換車；地下鐵天神站與西鉄福岡(天神)駅徒步約 5 分相連，轉西鐵電車往太宰府。",
    confidence: "high", source: "https://subway.city.fukuoka.lg.jp/fare/ryokin.php",
  },
  nishitetsu_tenjin_dazaifu: {
    route: "西鉄福岡(天神) ↔ 太宰府（西鐵電車・二日市乗換）", mode: "🚆 西鐵電車", runtime: "約 35 分（含轉乘）", fare: "¥400",
    frequency: "天神→西鉄二日市 急行/特急約 17 分；二日市→太宰府約 5 分，日間頻繁",
    samples: ["天神→二日市 急行 約17分", "二日市→太宰府 約5分", "部分班次 天神直達太宰府"],
    operator: "西日本鐵道", notes: "於西鉄二日市轉太宰府線（部分時段天神直達太宰府）。觀光列車『旅人(たびと)』免加價、免預約，日間於二日市↔太宰府運行。",
    confidence: "high", source: "https://ekitan.com/transit/fare/sf-7907/st-7785",
  },
  mahoroba_kamado: {
    route: "太宰府駅 ↔ 寶滿宮竈門神社（まほろば号 社區巴士）", mode: "🚌 社區巴士", runtime: "約 10 分", fare: "¥100（均一）",
    frequency: "五条・内山線，平日約 20–30 分一班", first: "太宰府駅發 07:22", last: "太宰府駅發 18:48（往竈門）",
    samples: ["太宰府駅→竈門 平日：12:22", "12:52", "13:22", "13:52", "14:22", "14:52", "15:22", "16:02"],
    operator: "太宰府市 コミュニティバスまほろば号", notes: "✅已查證(令和8年4月改正平日)。太宰府駅前『福岡銀行』前搭『内山行』到終點竈門神社前；回程末班亦約 18–19 時，記得對好。",
    confidence: "high", source: "https://www.city.dazaifu.lg.jp/site/communitybus/33139.html",
  },
  nishijin_tower: {
    route: "西新駅 → 福岡塔（地下鐵西新＋步行）", mode: "🚇🚶 地下鐵＋步行", runtime: "西新步行約 15–20 分；短巴士約 6–13 分", fare: "地下鐵實付；步行 ¥0／短巴士約 ¥190",
    operator: "福岡市地下鐵（＋必要時西鐵巴士一小段）",
    notes: "福岡塔無鐵路直達，最近站為地下鐵空港線『西新』；出站步行 15–20 分到塔，或西新四丁目／西新パレス前轉一小段西鐵巴士。回程西新→東比惠空港線直達不換車。",
    confidence: "medium", source: "https://www.fukuokatower.co.jp/access/",
  },
};

export interface Transport {
  mode: string;
  text: string;
  chips?: Chip[];
  legs?: string[]; // keys into routes
}

export interface Stop {
  time: string;
  node: string;
  name: string;
  jp?: string;
  desc: string;
  pic?: string; // image key
  transport?: Transport;
  chips?: Chip[];
  tips?: Tip[];
  map?: string;
}

export interface Day {
  id: string;
  d: string;
  label: string;
  short: string;
  title: string;
  theme: string;
  c1: string;
  c2: string;
  banner: string; // image key
  fixed?: string;
  stops: Stop[];
}

export const days: Day[] = [
  {
    id: "day1", d: "01", label: "6/19 五", short: "6/19 五", title: "抵達・博多夜食",
    theme: "落地 · 博多一双拉麵", c1: "#dd5b34", c2: "#c79a3e", banner: "nakasu_yatai",
    stops: [
      {
        time: "14:25 → 17:55", node: "✈️", name: "高雄 KHH → 福岡 FUK", jp: "虎航 IT270 · 國際線",
        desc: "落地福岡國際線航廈，入境＋領行李約 30–45 分。",
        transport: { mode: "🚌🚇", text: "國際線轉免費接駁巴士到國內線，再轉地下鐵到東比惠。", legs: ["fuk_intl_shuttle", "subway_kuko_airport_hakata"] },
        map: "Fukuoka Airport International Terminal",
      },
      {
        time: "約 19:30", node: "🏨", name: "APA〈博多東比惠駅前〉", jp: "アパホテル 博多東比恵駅前",
        desc: "東比惠站 4 號出口步行 1 分，放行李 Check-in。",
        chips: [["hour", "Check-in 15:00"]],
        map: "APA Hotel Hakata Higashihie Ekimae",
      },
      {
        time: "約 19:45", node: "🍜", name: "博多一双 · 招牌泡系豚骨", jp: "博多 一双 博多駅東本店", pic: "ramen_issou",
        desc: "落地放好行李、先吃碗拉麵輕鬆收尾！博多代表「泡系」濃厚豚骨白湯，湯頭綿密如卡布奇諾泡沫。位在博多駅東（筑紫口），東比惠搭地下鐵 1 站即達，吃完原路回飯店。",
        transport: { mode: "🚇🚶", text: "東比惠 →〔地下鐵〕→ 博多（筑紫口步行約 5 分）；吃完原路 1 站回東比惠。", legs: ["subway_higashihie_hakata"] },
        chips: [["hour", "約 11:00–24:00"]],
        tips: [["info", "排隊名店、晚間人潮較少；落地首日不趕，慢慢吃。『一蘭和樂團演舞』已改到 Day 2 中洲屋台時順看。"]],
        map: "博多一双 博多駅東本店",
      },
    ],
  },
  {
    id: "day2", d: "02", label: "6/20 六", short: "6/20 六", title: "關門海峽一日",
    theme: "海鮮 · 復古港町 · 古城 · 屋台＋一蘭演舞", c1: "#1d3a5f", c2: "#6e8c52", banner: "kanmon",
    stops: [
      {
        time: "約 08:15", node: "🚄", name: "東比惠 → 唐戶（門司港轉渡輪）", jp: "東比惠 → 小倉 → 門司港 →〔船〕→ 唐戶",
        desc: "全程鐵路＋渡輪、不搭巴士：東比惠地下鐵 1 站到博多，新幹線到小倉，JR 到門司港，再搭關門渡輪過海峽到唐戶（約 09:45 到，剛好接週六市場 10:00 開市）。",
        transport: { mode: "🚇🚄🚆⛴️", text: "東比惠→博多（地下鐵 1 站）→ 新幹線到小倉 → JR 到門司港 → 關門渡輪(約 5 分)到唐戶。全程零巴士。", legs: ["subway_higashihie_hakata", "shinkansen_hkt_kkr", "jr_mojiko_kokura", "ferry_karato_mojiko"] },
        map: "唐戸市場 Karato Market Shimonoseki",
      },
      {
        time: "約 10:00", node: "🍣", name: "唐戶市場 活きいき馬関街", jp: "唐戸市場 いきいき馬関街", pic: "karato_sushi",
        desc: "週末限定壽司市集，攤位現點現吃握壽司、海鮮丼、河豚握壽司，買了到屋頂廣場吹海峽風吃。",
        chips: [["hour", "週六 10:00–15:00（已查證）"], ["tick", "越早越新鮮"]],
        tips: [["warn", "活きいき馬関街僅週五六日及假日；6/20 週六確定有，但『週六 10:00 才開市』（週日才 8:00），別太早到撲空。"]],
        map: "唐戸市場 Karato Market Shimonoseki",
      },
      {
        time: "約 11:45", node: "⛴️", name: "渡輪回門司港", jp: "唐戶 → 門司港 · 関門連絡船",
        desc: "市場吃飽後，從唐戶 1 號棧橋搭船約 5 分回九州門司港（去程搭船來、回程再坐一次，往返都看海峽風景）。",
        transport: { mode: "⛴️", text: "關門汽船 唐戶→門司港（每 20 分一班）。", legs: ["ferry_karato_mojiko"] },
        map: "唐戸桟橋 Karato Pier",
      },
      {
        time: "約 12:00", node: "🍛", name: "門司港復古區 · 燒咖哩 + 散策", jp: "門司港レトロ · 焼きカレー", pic: "mojiko_station",
        desc: "名物燒咖哩，推薦 Princess Pipi（中心大樓 B1F）。復古區散策：1914 年『門司港駅』（重要文化財）、日本唯一步行者跳橋『ブルーウィングもじ』（戀人聖地，每日 6 次開橋）、舊門司三井俱樂部、海峽 PLAZA 商場、関門海峡博物館，海邊吹風拍照。",
        chips: [["hour", "Pipi 11:00–15:00 / 18:00–22:00"], ["info", "跳橋開橋 13:00／14:00 等"]],
        tips: [
          ["eat", "Pipi 週一二公休（週六有開）；備選 BEAR FRUITS。"],
          ["info", "ブルーウィングもじ 開橋 10／11／13／14／15／16 時（開約 20 分）；在門司港時段抓 13:00 或 14:00 場次拍照。"],
        ],
        map: "門司港レトロ Mojiko Retro",
      },
      {
        time: "約 14:30", node: "🏯", name: "小倉城", jp: "小倉城 Kokura Castle", pic: "kokura_castle",
        desc: "約 400 年名城，天守閣頂樓有觀景與城內咖啡。",
        transport: { mode: "🚆", text: "JR 門司港→小倉，站步行約 15 分入城。", legs: ["jr_mojiko_kokura"] },
        chips: [["hour", "6 月 09:00–20:00"], ["cost", "¥500"]],
        map: "Kokura Castle",
      },
      {
        time: "約 17:30", node: "🚄", name: "小倉 → 博多", jp: "回程",
        desc: "新幹線快速回博多（約 17 分），稍作休息，晚上去中洲屋台吃宵夜。",
        transport: { mode: "🚄", text: "新幹線 小倉→博多。", legs: ["shinkansen_hkt_kkr"] },
        map: "Hakata Station",
      },
      {
        time: "約 19:00", node: "🏮", name: "中洲屋台（晚餐）", jp: "中洲 屋台",
        desc: "那珂川畔的路邊攤群，串燒・關東煮・煎餃・豚骨拉麵，邊吃邊看中洲夜景與水鏡倒影，福岡必體驗的夜味。一日關門海峽玩回來，正好在這裡放鬆吃晚餐。",
        transport: { mode: "🚇🚶", text: "博多 →〔地下鐵〕→ 中洲川端駅，步行到那珂川畔屋台。", legs: ["subway_higashihie_hakata"] },
        chips: [["hour", "約 18:00–凌晨"]],
        tips: [["warn", "雨天多影響；6/20 為週六通常有開，週日才較多公休。"]],
        map: "中洲 屋台 Nakasu Yatai",
      },
      {
        time: "約 20:00", node: "🥁", name: "一蘭 本社總本店 · 和樂團演舞（純看表演）", jp: "一蘭 本社総本店（中洲）",
        desc: "屋台吃到一半，20:00 走 5 分到一蘭本社總本店，看『一蘭和樂團』約 15 分的陽台演舞——店員換彩衣祈願「幸福」與「旅途平安」，馬路對面就看得到、免費、純欣賞不進店。就在屋台旁邊，看完回屋台收尾或直接回東比惠。",
        transport: { mode: "🚶🚇", text: "中洲屋台步行約 5 分到一蘭；看完 中洲川端 → 東比惠 回飯店。", legs: ["subway_higashihie_hakata"] },
        chips: [["hour", "演舞 20:00–20:15（每日）"], ["tick", "純觀賞・免費"]],
        tips: [["info", "演舞起訖時刻會隨日落微調；6/20 週六照常演出。"]],
        map: "一蘭 本社総本店 Ichiran",
      },
    ],
  },
  {
    id: "day3", d: "03", label: "6/21 日", short: "6/21 日", title: "別府・由布院一日遊", fixed: "🔒 時間固定",
    theme: "地獄溫泉 · 由布院 · 黑毛和牛燒肉", c1: "#9a4767", c2: "#dd5b34", banner: "umi_jigoku",
    stops: [
      {
        time: "約 07:30 集合", node: "🚌", name: "KKday 別府・由布院一日遊", jp: "福岡発 日帰りツアー", pic: "yufuin_kinrin",
        desc: "如意輪寺＋由布岳＋湯布院＋金麟湖＋海地獄＋灶地獄，中英文導遊，約 10 小時。集合點多在博多站筑紫口一帶，從東比惠搭地下鐵 1 站到博多（¥210）即達。",
        transport: { mode: "🚇🚌", text: "東比惠→博多（地下鐵 1 站）→ 博多集合搭遊覽車（集合點以憑證為準）。", legs: ["subway_higashihie_hakata"] },
        chips: [["tick", "KKday 需預訂"], ["hour", "提早 10 分到"]],
        tips: [["warn", "午餐自理；集合時間／地點一律以 KKday 憑證為準。"]],
        map: "Hakata Station Chikushi Exit",
      },
      {
        time: "約 18:00–19:00", node: "🚍", name: "返抵博多", jp: "博多 着",
        desc: "傍晚返抵博多，下車點與晚餐同在博多站一帶。",
        map: "Hakata Station",
      },
      {
        time: "19:30", node: "🥩", name: "肉屋肉一 博多店", jp: "にく屋 肉いち 博多店 · 固定", pic: "yakiniku_wagyu",
        desc: "黑毛和牛炭火燒肉，筑紫口步行約 5 分。建議先訂位。",
        transport: { mode: "🚶", text: "下車點步行約 5 分。" },
        chips: [["hour", "約 16:00 起–深夜"], ["tick", "建議訂位"]],
        tips: [["warn", "若行程 delay 較趕，訂位時先告知可能晚到。"]],
        map: "にく屋 肉いち 博多店",
      },
      {
        time: "約 21:00", node: "🛍️", name: "夜間採買（博多就近）", jp: "ショッピング",
        desc: "晚餐後不必跑天神，直接在博多解決：博多駅地下街／筑紫口的藥妝（コクミン 約 7–23 時、マツキヨ筑紫口較晚）買藥妝零食；想一次掃藥妝＋雜貨＋伴手禮，地下鐵 1–2 站到『唐吉訶德 中洲店』（24h）最省事。",
        transport: { mode: "🚶🚇", text: "博多駅周邊步行即達；唐吉訶德中洲店：地下鐵 博多 → 中洲川端（約 3 分）。回飯店：中洲川端／博多 →〔地下鐵空港線〕→ 東比惠（1–3 站、不換車）。", legs: ["subway_higashihie_hakata"] },
        chips: [["hour", "唐吉訶德中洲店 24h"], ["hour", "博多駅藥妝 約 –23 時"], ["tick", "就近免跑天神"]],
        tips: [["info", "UNIQLO 不在此買——已排 Day 5 在運河城（10–21 時）一次補。"]],
        map: "ドン・キホーテ中洲店",
      },
    ],
  },
  {
    id: "day4", d: "04", label: "6/22 一", short: "6/22 一", title: "太宰府天満宮 + 福岡塔夜景",
    theme: "學問之神 · 表參道 · 鬼滅聖地 · 夜景", c1: "#9a4767", c2: "#c79a3e", banner: "dazaifu",
    stops: [
      {
        time: "約 09:00", node: "🚆", name: "東比惠 → 太宰府", jp: "地下鐵 + 西鐵電車（全程鐵路）",
        desc: "盡量走鐵路：東比惠搭地下鐵空港線到天神（約 10 分 ¥260），出站徒步約 5 分到『西鉄福岡(天神)駅』，轉西鐵電車到太宰府（¥400、約 35 分，西鉄二日市轉太宰府線；二日市↔太宰府常為觀光列車『旅人』）。全程不搭一般巴士。",
        transport: { mode: "🚇🚆", text: "東比惠 →〔地下鐵空港線〕→ 天神（徒步轉西鉄福岡）→〔西鐵電車・二日市乗換〕→ 太宰府駅。約 50 分、約 ¥660，刷 IC 即可。", legs: ["subway_higashihie_tenjin", "nishitetsu_tenjin_dazaifu"] },
        tips: [["info", "不想轉乘的備案：東比惠→博多後在博多 BT 搭『旅人』巴士直達太宰府（¥700、約 40 分）——但那是巴士；想搭地鐵就走上面的西鐵電車。"]],
        map: "太宰府駅 Dazaifu Station",
      },
      {
        time: "約 10:00", node: "⛩️", name: "太宰府天満宮 + 表參道", jp: "太宰府天満宮 Dazaifu Tenmangu", pic: "dazaifu",
        desc: "祭祀菅原道真公的『學問之神』總本社。本殿已於 2026/5/17 完成「令和大改修」重新開放（124 年來首次）；藤本壯介設計、屋頂長滿森林的話題『仮殿』於改修後分階段拆除，6 月可能仍見其外觀或施工。境內梅樹、御神牛、太鼓橋與心字池，可求學業御守、抽おみくじ。行有餘力，本殿後方沿一整排紅鳥居石階（約 130 階、往返 30–45 分）可上『天開稲荷社』——九州最古稲荷、開運上昇的隱藏能量景點。",
        chips: [["hour", "境內 6:00–19:30（6 月・已查證）"], ["tick", "參拜免費"], ["info", "天開稲荷社 開運"]],
        tips: [
          ["info", "本殿 2026/5/17 重新開放；『仮殿』拆除進度與境內開放時間，出發前以官網為準。"],
          ["info", "天開稲荷社在本殿後山，紅鳥居石階好拍但要爬一段；不想爬可略過。"],
          ["warn", "與天満宮以手扶梯隧道相連的『九州國立博物館』週一休館（6/22 休），故本日不排；想參觀可改其他天。"],
        ],
        map: "太宰府天満宮 Dazaifu Tenmangu",
      },
      {
        time: "約 12:00", node: "🍡", name: "表參道午餐 · 梅ヶ枝餅 · 隈研吾星巴克", jp: "参道さんぽ",
        desc: "約 250 公尺的表參道商店街：現烤『梅ヶ枝餅』（梅枝餅，外酥內軟紅豆內餡）邊走邊吃；隈研吾操刀的『星巴克 太宰府天満宮表參道店』以數千根木條交織成名建築，拍照喝咖啡都好。午餐可吃蕎麦／うどん或太宰府名物。",
        chips: [["hour", "商店多 9:00–17:30"], ["info", "梅ヶ枝餅 現烤現吃"]],
        tips: [["eat", "梅ヶ枝餅名店：かさの家、きくち；星巴克常排隊，避開整點人潮較好拍。"]],
        map: "スターバックス 太宰府天満宮表参道店",
      },
      {
        time: "約 13:30", node: "⚔️", name: "寶滿宮竈門神社（鬼滅聖地・機動）", jp: "宝満宮竈門神社 Kamado Shrine",
        desc: "緣結び（姻緣）與《鬼滅之刃》取景聖地。境內可眺太宰府、秋有紅葉，授與所一整面繽紛色彩的『緣結び御守』超好拍。求好姻緣、收集御守必訪。",
        transport: { mode: "🚌", text: "太宰府駅前『福岡銀行』前搭〔まほろば号・内山行〕→ 終點『竈門神社前』，約 10 分、¥100。", legs: ["mahoroba_kamado"] },
        chips: [["cost", "まほろば号 ¥100"], ["tick", "參拜免費"]],
        tips: [["warn", "まほろば号班次較疏（約 30–60 分一班），上車前先記下回程時刻；體力有限可略過，留在表參道悠閒。"]],
        map: "宝満宮竈門神社 Kamado Shrine",
      },
      {
        time: "約 16:30", node: "🚉", name: "返回天神", jp: "太宰府 → 天神",
        desc: "竈門神社搭まほろば号回太宰府駅，西鐵電車回天神（¥400、約 35 分，可搭觀光列車『旅人』）。回到熱鬧的天神，準備吃飯、看夜景。",
        transport: { mode: "🚌🚆", text: "竈門神社 →〔まほろば号〕→ 太宰府駅 →〔西鐵電車・二日市乗換〕→ 西鉄福岡(天神)。", legs: ["mahoroba_kamado", "nishitetsu_tenjin_dazaifu"] },
        map: "Tenjin Fukuoka",
      },
      {
        time: "約 17:30", node: "🍲", name: "天神 早晚餐 · 博多牛腸鍋", jp: "もつ鍋",
        desc: "稍早吃晚餐，把傍晚留給夜景。天神吃福岡名物『もつ鍋（牛腸鍋）』暖呼呼，飯後直奔福岡塔看夕陽轉夜景。",
        transport: { mode: "🚶", text: "天神站周邊，步行可達。" },
        chips: [["info", "もつ鍋名店：おおやま／やま中／一藤（建議訂位）"], ["hour", "多 17:00–24:00"]],
        map: "天神 もつ鍋",
      },
      {
        time: "約 19:00", node: "🗼", name: "福岡塔 · 夕陽轉夜景", jp: "福岡タワー Fukuoka Tower", pic: "fukuoka_tower_night",
        desc: "234m 海濱地標、日本百選夜景。日落約 19:32，正好上塔看天色由橘轉藍、市區華燈初上；燈飾亮至 23:00，塔下即百道海濱公園。",
        transport: { mode: "🚇🚶", text: "天神 →〔地下鐵空港線〕→ 西新駅（約 8 分），步行約 15–20 分到福岡塔。回程：西新 →〔空港線直達〕→ 東比惠（不換車）。", legs: ["nishijin_tower"] },
        chips: [["hour", "09:30–22:00（末入 21:30）"], ["cost", "展望台 ¥1,000"]],
        tips: [["info", "福岡塔無鐵路直達，最近是地下鐵西新駅、步行 15–20 分；不想走可在西新轉一小段西鐵巴士，或天神有 W1／302 直達巴士（備案）。回程西新→東比惠空港線一線直達。"]],
        map: "Fukuoka Tower",
      },
    ],
  },
  {
    id: "day5", d: "05", label: "6/23 二", short: "6/23 二", title: "博多舊街・回程",
    theme: "神社 · 運河城 · 機場伴手禮 · 回家", c1: "#c79a3e", c2: "#1d3a5f", banner: "canalcity",
    stops: [
      {
        time: "10:00", node: "🧳", name: "APA 退房 · 寄行李", jp: "チェックアウト",
        desc: "退房，行李寄放飯店（東比惠站旁，回程取件方便）。",
        chips: [["hour", "Check-out 10:00"]],
        map: "APA Hotel Hakata Higashihie Ekimae",
      },
      {
        time: "約 10:30", node: "⛩️", name: "櫛田神社", jp: "櫛田神社 Kushida Shrine", pic: "kushida",
        desc: "博多總鎮守，境內免費；距運河城步行約 5–10 分。",
        transport: { mode: "🚇🚶", text: "地下鐵到櫛田神社前／祇園站。", legs: ["subway_higashihie_hakata"] },
        chips: [["tick", "免費"]],
        tips: [["info", "6 月飾山笠換裝期間，戶外大型山笠可能未展出。"]],
        map: "櫛田神社 Kushida Shrine Fukuoka",
      },
      {
        time: "約 11:00", node: "🪷", name: "東長寺 · 福岡大佛 + 承天寺", jp: "東長寺 Tochoji",
        desc: "祇園駅 1 分、空海開基的古剎。『福岡大佛』為 10.8m 木造坐像（日本最大級），佛座下『地獄極樂巡り』暗道體驗（¥50），院內並有朱紅五重塔。隔鄰『承天寺』是烏龍麵・蕎麦發祥地（庭園特別公開時才開放，平日可看門前發祥碑）。",
        transport: { mode: "🚶", text: "櫛田神社步行約 5 分（往祇園駅方向）。" },
        chips: [["hour", "9:00–17:00（大佛殿 –16:45）"], ["tick", "大佛拝観免費"]],
        tips: [["info", "與櫛田、運河城都在步行圈內，順路一併走；地獄極樂巡り暗道 ¥50。"]],
        map: "東長寺 Tochoji Fukuoka",
      },
      {
        time: "約 11:40", node: "🛍️", name: "博多運河城（白天）", jp: "キャナルシティ博多",
        desc: "白天噴泉秀每小時整點（10:00–17:30），逛街採買。館內 East Bldg 1–3F 有 UNIQLO（10:00–21:00），衣服一次補齊。",
        transport: { mode: "🚶", text: "東長寺／櫛田步行約 5–10 分。" },
        chips: [["hour", "店舖 10:00–21:00"], ["info", "UNIQLO East 1–3F"]],
        tips: [["info", "UNIQLO 就在運河城內（10–21 時）；買的衣服等 14:15 回東比惠取行李時一起打包。"]],
        map: "Canal City Hakata",
      },
      {
        time: "約 13:00", node: "🍲", name: "午餐 + 天神地下街", jp: "天神地下街 Tenchika",
        desc: "19 世紀歐風石坂街道，市區最後逛逛；午餐可吃天神牛腸鍋。大件、重的伴手禮留到機場国内線一次買（選擇更多），這裡輕鬆逛即可，約 14:00 出發回東比惠取行李。",
        transport: { mode: "🚇", text: "地下鐵到天神站，直結地下街。", legs: ["subway_hakata_tenjin"] },
        chips: [["hour", "店舖 10:00–20:00"]],
        tips: [["info", "伴手禮別在這買太多——機場国内線商店街選擇最齊全，等下集中採買最省力。"]],
        map: "天神地下街 Tenjin Chikagai",
      },
      {
        time: "約 14:15", node: "🎒", name: "回東比惠取行李", jp: "荷物ピックアップ",
        desc: "回飯店取寄放行李（站旁 1 分），直接往機場。",
        transport: { mode: "🚇", text: "地下鐵 天神／博多 → 東比惠。", legs: ["subway_higashihie_hakata"] },
        map: "Higashi-Hie Station",
      },
      {
        time: "約 14:45", node: "🛒", name: "福岡空港 国內線 · 機場伴手禮", jp: "国内線ターミナルでお土産",
        desc: "空港駅就在国内線；趁轉国際線前，在国内線 2–3F 商店街集中採買伴手禮——めんべい、博多通りもん、ひよ子、あまおう甜點、九州限定 KitKat 等一次買齊（選擇遠比国際線多，這是最後機會）。",
        transport: { mode: "🚇", text: "東比惠 →〔地下鐵空港線〕→ 福岡空港（国内線），約 5 分、¥260，直達不換車。", legs: ["subway_kuko_airport_hakata"] },
        chips: [["hour", "国内線商店 約 7:00–21:00"], ["tick", "伴手禮選擇最齊全"]],
        tips: [["warn", "抓約 45 分採買，15:30 前轉国際線，確保報到／安檢／出境時間充裕。"]],
        map: "Fukuoka Airport",
      },
      {
        time: "約 15:30", node: "🚌", name: "轉国際線 · 報到登機", jp: "国際線へ",
        desc: "搭免費接駁巴士（約 10 分）到国際線航廈報到、安檢、出境。建議起飛前約 3 小時抵国際線；管制區內也有免稅與少量伴手禮可最後補貨。",
        transport: { mode: "🚌", text: "国内線 →〔免費接駁巴士 約 10 分〕→ 国際線航廈。", legs: ["fuk_intl_shuttle"] },
        tips: [["warn", "國際線無地下鐵，務必預留接駁巴士＋出境時間；虎航国際線約起飛前 60 分截止報到。"]],
        map: "Fukuoka Airport International Terminal",
      },
      {
        time: "19:00 → 20:40", node: "✈️", name: "福岡 FUK → 高雄 KHH", jp: "虎航 IT271",
        desc: "IT271 19:00 起飛，20:40 抵高雄。よい旅を！",
        map: "Fukuoka Airport",
      },
    ],
  },
];

export interface Buy { e: string; n: string; jp: string; p: string; w: string; }
export const buys: Buy[] = [
  { e: "🌶️", n: "明太子 · めんべい", jp: "辛子明太子 / 福太郎 めんべい", p: "福岡代表。ふくや、やまや；明太子仙貝常溫好攜帶。", w: "博多駅 Ming／Deitos、機場" },
  { e: "🍮", n: "博多通りもん", jp: "明月堂", p: "白豆沙＋鮮奶油牛奶饅頭，金氏紀錄最暢銷饅頭。", w: "Ming／Deitos／阪急／機場" },
  { e: "🐤", n: "ひよ子", jp: "名菓ひよ子", p: "小雞造型蛋黃饅頭，福岡飯塚發跡。", w: "Ming／Deitos／機場" },
  { e: "🎎", n: "博多の女", jp: "二鶴堂", p: "紅豆羊羹夾心年輪蛋糕，有抹茶、草莓味。", w: "Ming／Deitos／阪急" },
  { e: "🍓", n: "あまおう草莓", jp: "あまおう スイーツ", p: "福岡限定品種。KitKat（九州限定）、Tirolian 捲心餅。", w: "機場／Ming／百貨" },
  { e: "🐣", n: "鶴乃子", jp: "石村萬盛堂", p: "百年棉花糖包蛋黃餡，柔軟綿密。", w: "Ming／Deitos" },
  { e: "🎭", n: "にわかせんぺい", jp: "東雲堂", p: "博多面具造型甜仙貝，部分附紙面具。", w: "Ming／Deitos" },
  { e: "🍵", n: "八女茶", jp: "八女茶", p: "福岡高級綠茶（玉露／煎茶）。", w: "百貨茶櫃／Ming" },
  { e: "🧣", n: "博多織", jp: "SANUI織物", p: "約 800 年絲織工藝，錢包、卡夾。", w: "LaLaport 1F／百貨" },
  { e: "🍥", n: "拉麵 · もつ鍋", jp: "一蘭 / 一風堂 / もつ鍋", p: "拉麵伴手包、牛腸鍋宅配組，回家重現博多味。", w: "Ming／Deitos／機場" },
];

export interface Go { e: string; n: string; jp: string; t: string; p: string; map: string; pic?: string; }
export const gos: Go[] = [
  { e: "🪨", n: "糸島二見ヶ浦海岸", jp: "夫婦岩 · Palm Beach", t: "東比惠→九大学研都市 轉昭和巴士", p: "白鳥居夫婦岩、Palm Beach 海景咖啡與天使之翼／任意門網美帶；巴士約 1 小時 1 班、末班約 18:21，宜抓好班次。原 Day4 已改太宰府，留作備選。", map: "二見ヶ浦 Futamigaura Itoshima", pic: "itoshima_meotoiwa" },
  { e: "🌳", n: "大濠公園 + 福岡城跡", jp: "大濠公園 / 舞鶴公園", t: "地下鐵大濠公園駅 步行 2 分", p: "市中心湖畔大公園，鄰福岡城石垣遺跡，適合散步。", map: "大濠公園 Ohori Park", pic: "ohori" },
  { e: "🤖", n: "LaLaport νGundam", jp: "實物大 24.8m 立像", t: "博多巴士總站搭巴士約 20 分", p: "目前最高鋼彈立像，夜間有牆面投影秀，旁設 SIDE-F 限定店。", map: "ららぽーと福岡 νGundam", pic: "gundam_fukuoka" },
  { e: "🪷", n: "東長寺 + 承天寺", jp: "福岡大佛 16m", t: "地下鐵祇園駅 步行 1 分", p: "日本最大木造坐佛與地獄巡禮；承天寺為烏龍麵發祥地。", map: "東長寺 Tochoji Fukuoka" },
  { e: "🌸", n: "能古島", jp: "海島花園", t: "姪浜渡輪約 10 分", p: "四季花海小島，6 月可賞繡球等夏花。", map: "能古島 Nokonoshima Island Park" },
  { e: "🛶", n: "柳川 川下り", jp: "どんこ舟遊船", t: "天神搭西鐵特急約 50 分", p: "古城下町運河遊船，配蒸籠鰻魚飯，經典慢遊。", map: "柳川 川下り Yanagawa" },
];

/* ---- 網友・在地推薦美食（獨立「美食」頁，依分類顯示；map 為 Google 地圖查詢字串） ---- */
export interface Food { e: string; n: string; jp: string; cat: string; p: string; area: string; map: string; }
export const foods: Food[] = [
  // 拉麵
  { e: "🍜", n: "博多一双", jp: "博多 一双 博多駅東本店", cat: "拉麵", p: "泡系濃厚豚骨、湯頭綿密如卡布奇諾，博多代表（已排 Day 1）。", area: "博多駅東（筑紫口）", map: "博多一双 博多駅東本店" },
  { e: "🍜", n: "一蘭 本社總本店", jp: "一蘭 本社総本店", cat: "拉麵", p: "24h；每晚 20:00 陽台和樂團演舞，樓上有『重箱』限定版（Day 2 順看）。", area: "中洲川端 1 分", map: "一蘭 本社総本店 Ichiran" },
  { e: "🍜", n: "ShinShin", jp: "らーめん ShinShin 天神本店", cat: "拉麵", p: "網友最愛之一，細麵爽口、湯頭溫潤不死鹹；天神/博多多店。", area: "天神／博多", map: "ShinShin 天神本店" },
  { e: "🍜", n: "一風堂 大名本店", jp: "一風堂 大名本店", cat: "拉麵", p: "世界級豚骨名店發源地，赤丸／白丸經典。", area: "天神 大名", map: "一風堂 大名本店" },
  { e: "🍜", n: "元祖長浜屋", jp: "元祖長浜屋", cat: "拉麵", p: "超平價硬麵、替玉文化發源，在地老味道。", area: "長浜", map: "元祖長浜屋 福岡" },
  // 鍋物
  { e: "🍲", n: "もつ鍋 おおやま", jp: "もつ鍋 おおやま", cat: "鍋物", p: "味噌牛腸鍋人氣 No.1，博多駅 KITTE 地下有店（Day 4 首選）。", area: "博多駅 KITTE／本店", map: "もつ鍋 おおやま 博多" },
  { e: "🍲", n: "元祖もつ鍋 楽天地", jp: "楽天地", cat: "鍋物", p: "平價元祖、爆量韭菜小山，氣氛熱鬧。", area: "天神／博多", map: "元祖もつ鍋 楽天地 天神本店" },
  { e: "🍲", n: "もつ鍋 笑樂", jp: "もつ鍋 笑楽", cat: "鍋物", p: "醬油／味噌都受好評，觀光客與在地都愛。", area: "天神／博多", map: "もつ鍋 笑楽 本店" },
  { e: "🐔", n: "水炊き とり田", jp: "水炊き とり田", cat: "鍋物", p: "雞白湯鍋名店，先喝湯再涮雞、最後雜炊；湯頭濃郁。", area: "博多／天神", map: "水炊き とり田 博多本店" },
  { e: "🐔", n: "華味鳥", jp: "水たき料亭 華味鳥", cat: "鍋物", p: "品牌雞水炊き料亭，清爽高級、適合慶祝。", area: "中洲・天神等", map: "水たき料亭 華味鳥 中洲本店" },
  // 小吃
  { e: "🍢", n: "牧のうどん", jp: "牧のうどん", cat: "小吃", p: "博多軟烏龍代表、麵會吸湯越泡越多；ごぼ天必加。", area: "福岡多店", map: "牧のうどん 博多バスターミナル" },
  { e: "🍢", n: "かろのうろん", jp: "かろのうろん", cat: "小吃", p: "百年老舖烏龍，櫛田神社旁、Day 5 可順遊。", area: "祇園／櫛田旁", map: "かろのうろん 福岡" },
  { e: "🍢", n: "因幡うどん", jp: "因幡うどん", cat: "小吃", p: "博多駅內就有，柔軟麵體＋丸天／ごぼ天，快速好吃。", area: "博多駅 デイトス", map: "因幡うどん 博多デイトス" },
  { e: "🥟", n: "鉄なべ", jp: "鉄なべ 中洲本店", cat: "小吃", p: "鐵鍋盛裝的一口煎餃，皮脆多汁、配啤酒；中洲順吃。", area: "中洲／祇園", map: "鉄なべ 中洲本店" },
  { e: "🍤", n: "天ぷらのひらお", jp: "天ぷらのひらお", cat: "小吃", p: "在地排隊平價現炸天婦羅；福岡機場国内線也有分店（Day 5 回程可吃）。", area: "天神／機場 等", map: "天ぷらのひらお 福岡空港店" },
  { e: "🍗", n: "とりかわ かわ屋", jp: "かわ屋", cat: "小吃", p: "博多名物『雞皮串』烤到酥香，串燒控必試。", area: "藥院／今泉", map: "かわ屋 薬院" },
  { e: "🐟", n: "柳橋連合市場", jp: "柳橋連合市場", cat: "小吃", p: "『博多的廚房』，海鮮丼、玉子燒、明太子現買現吃。", area: "渡邊通", map: "柳橋連合市場" },
  // 麵包
  { e: "🥐", n: "pain stock", jp: "パンストック", cat: "麵包", p: "福岡麵包聖地名店，明太法國與發酵系麵包必買。", area: "箱崎／天神", map: "pain stock 天神" },
  { e: "🥖", n: "Full Full", jp: "フルフル", cat: "麵包", p: "『明太法國』發祥店，一天可賣破千條；博多/天神有。", area: "博多／天神", map: "FULLFULL 博多デイトス" },
  { e: "🥐", n: "三日月屋", jp: "三日月屋", cat: "麵包", p: "天然酵母可頌專門，多種口味；天神地下街也有。", area: "天神 等", map: "三日月屋 天神地下街" },
  { e: "🥯", n: "amam dacotan", jp: "アマムダコタン", cat: "麵包", p: "網美麵包店、造型華麗，開門即排隊。", area: "藥院", map: "amam dacotan 薬院" },
  // 甜點
  { e: "🍡", n: "鈴懸 本店", jp: "鈴懸 すずかけ", cat: "甜點", p: "百年和菓子；鈴懸だんご、餡蜜、鈴乃最中，中洲川端 1 分，Day 1／2 順路。", area: "中洲川端 1 分", map: "鈴懸 本店 博多" },
  { e: "🥣", n: "川端ぜんざい", jp: "川端ぜんざい広場", cat: "甜點", p: "川端商店街內復古善哉（紅豆湯），甜而不膩。", area: "川端商店街", map: "川端ぜんざい広場" },
  { e: "🍓", n: "伊都きんぐ どらきんぐ", jp: "伊都きんぐ", cat: "甜點", p: "あまおう草莓銅鑼燒／大福，福岡限定草莓甜點。", area: "天神／太宰府 等", map: "伊都きんぐ 天神" },
  { e: "🍡", n: "梅ヶ枝餅", jp: "梅ヶ枝餅（かさの家 等）", cat: "甜點", p: "太宰府表參道現烤名物（かさの家／きくち）；已排 Day 4。", area: "太宰府表參道", map: "かさの家 太宰府" },
];

export const notices: string[] = [
  "太宰府：<b>本殿 2026/5/17 重新開放</b>（仮殿分階段拆除中）；<b>九州國立博物館週一休館（6/22 休）</b>；竈門神社靠『まほろば号』（¥100、班次疏），務必對好回程時刻。",
  "唐戶壽司市集<b>僅週五六日及假日</b>（週一～四不開）；<b>6/20 週六確定有</b>。",
  "KKday 別府一日遊<b>午餐自理</b>；集合時間／地點<b>以憑證為準</b>，<b>肉屋肉一 19:30 可先告知可能晚到</b>。",
  "回程伴手禮在<b>機場国内線</b>買最齊（搭空港線到站即国内線），約抓 45 分採買，再轉<b>免費接駁巴士（約 10 分）到国際線</b>；國際線無地下鐵，請<b>提早約 3 小時</b>到国際線報到。",
  "6 月梅雨季備折傘；雨天屋台與戶外景點（太宰府參道／竈門神社）易受影響。櫛田神社飾山笠 6 月換裝期間可能未展出。",
  "購物免排專日：<b>唐吉訶德中洲店 24h</b>（博多 1 站）已排 6/21 晚就近買；<b>UNIQLO 走運河城店（10–21 時）</b>，6/23 上午逛運河城時一起買；伴手禮 6/23 機場国内線收尾。",
];
