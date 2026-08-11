// ── Chart ──────────────────────────────────────────────────────────────────
// Canvas tape: candles, volume, moving averages, and the six component layers
// stacked in the player's chosen z-order. Last layer in the order paints last,
// which is the entire joke and also the entire mechanic.

import { CONFIG, STAT_MAP } from './config.js';
import { movingAverage } from './engine.js';

const PAD = { l: 54, r: 52, t: 26, b: 22 };
const VOL_FRAC = 0.18;

export function drawChart(canvas, state) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const cssW = canvas.clientWidth;
  const cssH = canvas.clientHeight;
  if (!cssW || !cssH) return;

  canvas.width = Math.round(cssW * dpr);
  canvas.height = Math.round(cssH * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);

  const W = cssW, H = cssH;
  const volH = (H - PAD.t - PAD.b) * VOL_FRAC;
  const plotT = PAD.t;
  const plotB = H - PAD.b - volH - 10;
  const plotH = plotB - plotT;
  const plotL = PAD.l;
  const plotR = W - PAD.r;
  const plotW = plotR - plotL;

  const N = CONFIG.totalWeeks;
  const slot = plotW / N;
  const cw = Math.max(4, Math.min(slot * 0.55, 22));
  const xOf = (i) => plotL + slot * (i + 0.5);

  const candles = state.candles;

  // ── Price scale ───────────────────────────────────────────────────────────
  let lo = Infinity, hi = -Infinity;
  for (const c of candles) { lo = Math.min(lo, c.low); hi = Math.max(hi, c.high); }
  if (!candles.length) { lo = 3600; hi = 4400; }
  const span = Math.max(hi - lo, 240);
  const mid = (hi + lo) / 2;
  lo = mid - span * 0.62;
  hi = mid + span * 0.62;
  const yOf = (v) => plotB - ((v - lo) / (hi - lo)) * plotH;
  const yStat = (v) => plotB - (v / 100) * plotH; // components ride a 0-100 axis

  // ── Backdrop ──────────────────────────────────────────────────────────────
  ctx.fillStyle = '#0b0b0e';
  ctx.fillRect(plotL, plotT, plotW, plotH);

  // Unplayed weeks sit behind a faint veil.
  if (candles.length < N) {
    ctx.fillStyle = 'rgba(255,255,255,0.018)';
    ctx.fillRect(plotL + slot * candles.length, plotT, plotW - slot * candles.length, plotH);
  }

  ctx.font = '10px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.textBaseline = 'middle';

  // ── Grid + price axis ─────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.075)';
  ctx.lineWidth = 1;
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    const v = lo + ((hi - lo) * i) / steps;
    const y = Math.round(yOf(v)) + 0.5;
    ctx.beginPath(); ctx.moveTo(plotL, y); ctx.lineTo(plotR, y); ctx.stroke();
    ctx.fillStyle = '#a6a6b0';
    ctx.textAlign = 'right';
    ctx.fillText(Math.round(v).toLocaleString(), plotL - 7, y);
  }

  // Component axis on the right, 0-100.
  ctx.textAlign = 'left';
  for (let v = 0; v <= 100; v += 25) {
    ctx.fillStyle = '#8a8a94';
    ctx.fillText(String(v), plotR + 7, yStat(v));
  }

  // ── Component layers, painted in z-order ──────────────────────────────────
  // First in layerOrder paints first and therefore sits furthest back.
  for (const key of state.layerOrder) {
    const meta = STAT_MAP[key];
    const series = state.history[key].slice(1); // drop the week-0 baseline
    if (series.length === 0) continue;
    const isTop = key === state.layerOrder[state.layerOrder.length - 1];

    ctx.beginPath();
    ctx.moveTo(xOf(0), plotB);
    series.forEach((v, i) => ctx.lineTo(xOf(i), yStat(v)));
    ctx.lineTo(xOf(series.length - 1), plotB);
    ctx.closePath();
    ctx.fillStyle = hexA(meta.color, isTop ? 0.3 : 0.15);
    ctx.fill();

    ctx.beginPath();
    series.forEach((v, i) => (i ? ctx.lineTo(xOf(i), yStat(v)) : ctx.moveTo(xOf(i), yStat(v))));
    ctx.strokeStyle = hexA(meta.color, isTop ? 1 : 0.62);
    ctx.lineWidth = isTop ? 2.4 : 1.2;
    ctx.stroke();

    if (isTop && series.length) {
      const y = yStat(series[series.length - 1]);
      ctx.fillStyle = meta.color;
      ctx.beginPath();
      ctx.arc(xOf(series.length - 1), y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // ── Candles ───────────────────────────────────────────────────────────────
  candles.forEach((c, i) => {
    const x = xOf(i);
    const up = c.up;
    const col = up ? '#2eab9c' : '#e2504d';
    ctx.strokeStyle = col;
    ctx.fillStyle = up ? 'rgba(46,171,156,0.9)' : 'rgba(226,80,77,0.9)';

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.round(x) + 0.5, yOf(c.high));
    ctx.lineTo(Math.round(x) + 0.5, yOf(c.low));
    ctx.stroke();

    const yo = yOf(c.open), yc = yOf(c.close);
    const top = Math.min(yo, yc);
    const h = Math.max(Math.abs(yc - yo), 1.5);
    ctx.fillRect(Math.round(x - cw / 2), Math.round(top), Math.round(cw), Math.round(h));
  });

  // ── Moving averages ───────────────────────────────────────────────────────
  drawMA(ctx, movingAverage(candles, 3), xOf, yOf, 'rgba(206,184,136,0.85)', 1.4);
  drawMA(ctx, movingAverage(candles, 8), xOf, yOf, 'rgba(120,47,64,0.95)', 1.8);

  // ── Volume ────────────────────────────────────────────────────────────────
  const volT = plotB + 12;
  const maxVol = Math.max(1, ...candles.map((c) => c.volume));
  candles.forEach((c, i) => {
    const h = (c.volume / maxVol) * volH;
    ctx.fillStyle = c.up ? 'rgba(46,171,156,0.35)' : 'rgba(226,80,77,0.35)';
    ctx.fillRect(Math.round(xOf(i) - cw / 2), Math.round(volT + volH - h), Math.round(cw), Math.round(h));
  });
  ctx.fillStyle = '#8a8a94';
  ctx.textAlign = 'right';
  ctx.fillText('VOL', plotL - 7, volT + volH / 2);

  // ── Week ticks ────────────────────────────────────────────────────────────
  ctx.textAlign = 'center';
  for (let i = 0; i < N; i++) {
    const played = i < candles.length;
    ctx.fillStyle = played ? '#a6a6b0' : '#4c4c56';
    ctx.fillText(String(i + 1), xOf(i), H - PAD.b / 2 - 1);
  }

  // ── Last-print marker ─────────────────────────────────────────────────────
  if (candles.length) {
    const c = candles[candles.length - 1];
    const y = Math.round(yOf(c.close)) + 0.5;
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = c.up ? 'rgba(46,171,156,0.55)' : 'rgba(226,80,77,0.55)';
    ctx.beginPath(); ctx.moveTo(plotL, y); ctx.lineTo(plotR, y); ctx.stroke();
    ctx.setLineDash([]);

    const label = Math.round(c.close).toLocaleString();
    ctx.font = 'bold 10px ui-monospace, SFMono-Regular, Menlo, monospace';
    const tw = ctx.measureText(label).width + 10;
    ctx.fillStyle = c.up ? '#2eab9c' : '#e2504d';
    ctx.fillRect(plotL - 7 - tw, y - 8, tw, 16);
    ctx.fillStyle = '#07070a';
    ctx.textAlign = 'center';
    ctx.fillText(label, plotL - 7 - tw / 2, y);
  }

  // ── Pattern flags ─────────────────────────────────────────────────────────
  ctx.font = '9px ui-monospace, SFMono-Regular, Menlo, monospace';
  for (const s of state.tape) {
    const pats = s.alerts.filter((a) => a.kind === 'pattern');
    if (!pats.length) continue;
    const i = s.week - 1;
    const c = state.candles[i];
    if (!c) continue;
    const name = pats[0].text.split(' — ')[0];
    ctx.fillStyle = 'rgba(206,184,136,0.9)';
    ctx.textAlign = 'center';
    ctx.fillText('▾', xOf(i), yOf(c.high) - 8);
    if (i >= state.candles.length - 3) {
      ctx.fillText(name, Math.min(Math.max(xOf(i), plotL + 40), plotR - 40), yOf(c.high) - 19);
    }
  }

  // ── Frame ─────────────────────────────────────────────────────────────────
  ctx.strokeStyle = 'rgba(255,255,255,0.09)';
  ctx.strokeRect(plotL + 0.5, plotT + 0.5, plotW - 1, plotH - 1);
}

function drawMA(ctx, ma, xOf, yOf, color, w) {
  ctx.beginPath();
  let started = false;
  ma.forEach((v, i) => {
    if (v == null) return;
    if (!started) { ctx.moveTo(xOf(i), yOf(v)); started = true; }
    else ctx.lineTo(xOf(i), yOf(v));
  });
  if (!started) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.stroke();
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}
