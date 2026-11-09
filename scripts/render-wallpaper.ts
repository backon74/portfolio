/**
 * HamzaOS v2 wallpaper: light-blue sky + halftone dot clouds.
 *
 * Run:  npx tsx scripts/render-wallpaper.ts
 */
import { chromium } from "@playwright/test";
import path from "node:path";
import fs from "node:fs";

const OUT_DIR = path.join(process.cwd(), "public", "images", "wallpaper");

const HTML = `<!doctype html>
<html><head><style>
  html,body{margin:0;padding:0;overflow:hidden;background:#b9cff0}
  .sky{
    position:fixed;inset:0;
    background:
      radial-gradient(1500px 900px at 50% 8%, rgba(255,255,255,.65) 0%, transparent 55%),
      radial-gradient(1200px 800px at 20% 85%, rgba(255,255,255,.4) 0%, transparent 50%),
      radial-gradient(1000px 700px at 85% 75%, rgba(255,255,255,.35) 0%, transparent 55%),
      linear-gradient(180deg, #dce9ff 0%, #a9c2ee 100%);
  }
  canvas{position:fixed;inset:0;width:100vw;height:100vh;mix-blend-mode:screen}
  .grain{
    position:fixed;inset:0;opacity:.05;mix-blend-mode:overlay;pointer-events:none;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }
  .scan{
    position:fixed;inset:0;pointer-events:none;opacity:.08;
    background-image:repeating-linear-gradient(to bottom, rgba(10,30,60,.5) 0 1px, transparent 1px 3px);
    mix-blend-mode:multiply;
  }
</style></head>
<body>
<div class="sky"></div>
<canvas id="c"></canvas>
<div class="scan"></div>
<div class="grain"></div>
<script>
  const c = document.getElementById('c');
  const W = c.width = window.innerWidth;
  const H = c.height = window.innerHeight;
  const ctx = c.getContext('2d');

  // Deterministic PRNG so renders are stable
  let s = 1337;
  function rand(){ s = (s*9301+49297)%233280; return s/233280; }

  // Value noise with 4-octave fBm
  const gridSize = 32;
  const grid = [];
  for (let i=0; i<gridSize*gridSize; i++) grid.push(rand());
  function noise(x,y){
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x-xi, yf = y-yi;
    const g = (i,j)=> grid[((((j%gridSize)+gridSize)%gridSize)*gridSize + (((i%gridSize)+gridSize)%gridSize))];
    const u = xf*xf*(3-2*xf), v = yf*yf*(3-2*yf);
    const a = g(xi,yi), b = g(xi+1,yi), cc = g(xi,yi+1), d = g(xi+1,yi+1);
    return (a*(1-u)+b*u)*(1-v) + (cc*(1-u)+d*u)*v;
  }
  function fbm(x,y){
    let v = 0, amp = 0.5, freq = 1;
    for (let i=0;i<4;i++){ v += amp*noise(x*freq,y*freq); amp *= 0.5; freq *= 2; }
    return v;
  }

  // Halftone dots covering viewport; radius modulated by noise + cloud mask
  const step = 10;
  const cloudCenters = [
    [W*0.25, H*0.35],
    [W*0.55, H*0.25],
    [W*0.78, H*0.45],
    [W*0.18, H*0.65],
    [W*0.6, H*0.7]
  ];
  function cloudMask(x,y){
    let m = 0;
    for (const [cx,cy] of cloudCenters){
      const dx = (x-cx)/(W*0.22), dy = (y-cy)/(H*0.18);
      m = Math.max(m, 1 - Math.sqrt(dx*dx + dy*dy));
    }
    return Math.max(0, m);
  }

  for (let y=0; y<H+step; y+=step){
    for (let x=0; x<W+step; x+=step){
      const n = fbm(x*0.008, y*0.012);
      const m = cloudMask(x,y);
      const v = Math.max(0, n*0.6 + m*0.9);
      const r = Math.min(step*0.55, v*step*0.7);
      if (r < 0.4) continue;
      const alpha = Math.min(0.85, v*1.1);
      ctx.beginPath();
      ctx.arc(x,y,r,0,Math.PI*2);
      ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
      ctx.fill();
    }
  }

  // Cyan rim glow on bottom-right (cyberpunk touch)
  const grad = ctx.createRadialGradient(W*0.82, H*0.88, 0, W*0.82, H*0.88, Math.max(W,H)*0.45);
  grad.addColorStop(0, 'rgba(34,211,255,0.22)');
  grad.addColorStop(1, 'rgba(34,211,255,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  // Horizon haze
  const horiz = ctx.createLinearGradient(0, H*0.6, 0, H);
  horiz.addColorStop(0, 'rgba(255,255,255,0)');
  horiz.addColorStop(1, 'rgba(255,255,255,0.18)');
  ctx.fillStyle = horiz;
  ctx.fillRect(0, H*0.6, W, H*0.4);

  window.__ready = true;
</script>
</body></html>`;

async function render(width: number, height: number, outFile: string) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.setContent(HTML);
  await page.waitForFunction(() => (window as unknown as { __ready?: boolean }).__ready === true);
  const buf = await page.screenshot({ type: "jpeg", quality: 92, fullPage: false });
  await browser.close();
  fs.writeFileSync(outFile, buf);
  console.log(`wrote ${outFile} (${buf.length} bytes)`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await render(2880, 1800, path.join(OUT_DIR, "hamzaos.jpg"));
  await render(1170, 2532, path.join(OUT_DIR, "hamzaos-portrait.jpg"));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
