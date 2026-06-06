import { mkdir, writeFile, access } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = (p) => access(p).then(() => true).catch(() => false);

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, "../public/images");

// key -> [primary, alt]
const imgs = {
  hero_fukuoka: ["https://commons.wikimedia.org/wiki/Special:FilePath/Seaside-momochi.JPG?width=1600", "https://upload.wikimedia.org/wikipedia/commons/0/0c/Seaside-momochi.JPG"],
  ramen_issou: ["https://commons.wikimedia.org/wiki/Special:FilePath/Tonkotsu Ramen Special, Hakata Choten, Paris 001.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Tonkotsu ramen.JPG?width=1280"],
  canalcity: ["https://commons.wikimedia.org/wiki/Special:FilePath/Canalcityhakata2019.jpg?width=1600", "https://commons.wikimedia.org/wiki/Special:FilePath/Dancing fountains, Canal City, Fukuoka, Japan.jpg?width=1280"],
  nakasu_yatai: ["https://commons.wikimedia.org/wiki/Special:FilePath/Nakasu-yatai.JPG?width=1280", "https://upload.wikimedia.org/wikipedia/commons/c/c0/Nakasu-yatai.JPG"],
  karato_sushi: ["https://commons.wikimedia.org/wiki/Special:FilePath/Kaisen donburi (mixed fish on sushi rice) - Massachusetts.jpg?width=1280", "https://images.unsplash.com/photo-1712183718506-41a054650697?w=1280&q=80&auto=format"],
  mojiko_station: ["https://commons.wikimedia.org/wiki/Special:FilePath/140721 Mojiko Station Kitakyushu Japan01s3.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Mojiko Station 02.JPG?width=1280"],
  kanmon: ["https://commons.wikimedia.org/wiki/Special:FilePath/2014-09-01 Kanmon Bridge and its surroundings.jpg?width=1600", "https://commons.wikimedia.org/wiki/Special:FilePath/Central Shimonoseki and Kanmon Strait.JPG?width=1280"],
  kokura_castle: ["https://commons.wikimedia.org/wiki/Special:FilePath/Tenshu of Kokura Castle, Kokura D.C. Tower and Riverwalk Kitakyushu.JPG?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Kokura castle.JPG?width=1280"],
  umi_jigoku: ["https://commons.wikimedia.org/wiki/Special:FilePath/Sea_Hell_Hot_Spring_20171003-1.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Umi_Jigoku_October_2011_01.jpg?width=1280"],
  yufuin_kinrin: ["https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Kinrin_with_Morning_fog.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Kinrin_20221022-1.jpg?width=1280"],
  yufudake: ["https://commons.wikimedia.org/wiki/Special:FilePath/Yufudake-2.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/%E7%8B%AD%E9%9C%A7%E5%8F%B0%E3%81%8B%E3%82%89%E3%81%AE%E7%94%B1%E5%B8%83%E5%B2%B3.jpg?width=1280"],
  yakiniku_wagyu: ["https://commons.wikimedia.org/wiki/Special:FilePath/Yakiniku_grill_with_slices_of_beef,_chicken_and_pork.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Iga_Beef_Yakiniku_Set.jpg?width=1280"],
  itoshima_meotoiwa: ["https://commons.wikimedia.org/wiki/Special:FilePath/Futamigaura in Itoshima, Fukuoka.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Futamigaura Beach and Meoto-iwa 2014-05-18 (14207420571).jpg?width=1280"],
  itoshima_palmbeach: ["https://commons.wikimedia.org/wiki/Special:FilePath/Genkai Sea and Futamigaura Beach.JPG?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Futamigaura Beach and Meoto-iwa 2014-05-18 (14207420571).jpg?width=1280"],
  fukuoka_tower_night: ["https://commons.wikimedia.org/wiki/Special:FilePath/Fukuoka Tower at night.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Views from Fukuoka Tower at night 20230104-1.jpg?width=1280"],
  kushida: ["https://commons.wikimedia.org/wiki/Special:FilePath/Kushida Shrine the torii and the Rōmon 1-41 Kami-kawabatamachi Hakata-ku Fukuoka 20230801.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Kushidajinjafukuoka01.jpg?width=1280"],
  dazaifu: ["https://commons.wikimedia.org/wiki/Special:FilePath/View_of_Gohonden_of_Dazaifu_Temman_Shrine.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/R%C5%8Dmon,_Dazaifu_Tenman-g%C5%AB_20170225.jpg?width=1280"],
  ohori: ["https://commons.wikimedia.org/wiki/Special:FilePath/Ohori_Park_20170505-4.jpg?width=1280", "https://commons.wikimedia.org/wiki/Special:FilePath/Ohori_Park_at_dusk_20170930-8.jpg?width=1280"],
  gundam_fukuoka: ["https://images.unsplash.com/photo-1694864255426-995cb59aac98?w=1280&q=80&auto=format", "https://images.unsplash.com/photo-1694864255426-995cb59aac98?w=1600&q=80&auto=format&fit=crop"],
};

const enc = (u) => u.replace(/ /g, "%20");

async function dl(key, url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(enc(url), {
      redirect: "follow",
      headers: { "User-Agent": "FukuokaItinerary/1.0 (personal trip planning page; contact via local)" },
    });
    if (res.status === 429) {
      const wait = 4000 * (attempt + 1);
      console.log(`  429 ${key} — wait ${wait}ms`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const ct = res.headers.get("content-type") || "";
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(resolve(outDir, `${key}.jpg`), buf);
    return { ct, kb: Math.round(buf.length / 1024) };
  }
  throw new Error("429 after retries");
}

await mkdir(outDir, { recursive: true });
const which = process.argv[2] === "alt" ? 1 : 0;
const only = process.argv[3];
const force = process.argv.includes("--force");
for (const [key, urls] of Object.entries(imgs)) {
  if (only && key !== only) continue;
  if (!force && (await exists(resolve(outDir, `${key}.jpg`)))) {
    console.log(`SKIP ${key} (exists)`);
    continue;
  }
  try {
    const { ct, kb } = await dl(key, urls[which]);
    console.log(`OK   ${key.padEnd(20)} ${kb}KB  ${ct}`);
  } catch (e) {
    console.log(`FAIL ${key.padEnd(20)} ${e.message}`);
  }
  await sleep(2500); // be polite to Wikimedia
}
console.log("done");
