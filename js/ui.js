// ── UI ─────────────────────────────────────────────────────────────────────
// Pure-ish render functions. main.js owns the state and the handlers.

import { CONFIG, STATS, STAT_MAP, Z_THRESHOLD, MEMO_PENALTY } from './config.js';
import { ACTIONS, ACTION_MAP, WEEKS, FACULTY, CLASSES } from './data.js';
import { levelOf, allZScores, coverage, maxDrawdown, availableSlots } from './engine.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const sign = (n, d = 1) => `${n >= 0 ? '+' : ''}${n.toFixed(d)}`;

// ── Header ─────────────────────────────────────────────────────────────────

export function renderTicker(state) {
  const level = levelOf(state.stats);
  const first = state.candles.length ? state.candles[0].open : level;
  const chg = ((level - first) / first) * 100;
  const last = state.candles[state.candles.length - 1];

  $('tb-level').textContent = level.toLocaleString(undefined, {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });

  const wkPct = last ? ((last.close - last.open) / last.open) * 100 : 0;
  const cls = chg >= 0 ? 'up' : 'down';
  $('tb-chg').className = `tb-chg ${cls}`;
  $('tb-chg').textContent = last
    ? `${sign(chg, 2)}% SINCE IPO   ·   WK ${sign(wkPct, 2)}%`
    : 'AWAITING OPENING PRINT';

  $('tb-week').textContent = `${Math.min(state.week, CONFIG.totalWeeks)} / ${CONFIG.totalWeeks}`;
  const cov = coverage(state);
  $('tb-cov').textContent = cov.rating;
  $('tb-cov').style.color =
    cov.rating === 'STRONG BUY' || cov.rating === 'BUY' ? 'var(--green)'
    : cov.rating === 'HOLD' ? 'var(--gold)' : 'var(--red)';

  const dd = maxDrawdown(state.candles);
  $('tb-dd').textContent = state.candles.length ? `${dd.toFixed(1)}%` : '—';
  $('tb-dd').style.color = dd < -15 ? 'var(--red)' : 'var(--text)';
}

// ── Layer panel (the z-index) ──────────────────────────────────────────────

export function renderLayers(state, onMove) {
  const list = $('layer-list');
  list.innerHTML = '';

  // layerOrder[last] renders in front. The list is column-reverse in CSS, so
  // iterating in array order puts the front-most layer visually on top.
  state.layerOrder.forEach((key, i) => {
    const meta = STAT_MAP[key];
    const isTop = i === state.layerOrder.length - 1;
    const row = document.createElement('div');
    row.className = `layer${isTop ? ' top' : ''}`;
    row.innerHTML = `
      <i class="layer-chip" style="background:${meta.color}"></i>
      <span class="layer-name">${meta.label}</span>
      <span class="layer-z">${Math.round(state.stats[key])}</span>
      <span class="layer-btns">
        <button data-dir="1"  ${isTop ? 'disabled' : ''} title="bring forward">▲</button>
        <button data-dir="-1" ${i === 0 ? 'disabled' : ''} title="send back">▼</button>
      </span>`;
    row.querySelectorAll('button').forEach((b) =>
      b.addEventListener('click', () => onMove(key, Number(b.dataset.dir))));
    list.appendChild(row);
  });

  const top = STAT_MAP[state.layerOrder[state.layerOrder.length - 1]];
  $('layer-foot').innerHTML =
    `Front layer at the closing bell decides the ending.<br>` +
    `Currently in front: <b style="color:${top.color}">${top.label}</b>`;
}

// ── Indicators ─────────────────────────────────────────────────────────────

export function renderIndicators(state) {
  const list = $('z-list');
  list.innerHTML = '';

  if (!state.zUnlocked) {
    $('z-note').textContent = 'locked';
    list.innerHTML =
      `<div class="z-locked">STA 2023 has not covered standard deviations yet.<br><br>` +
      `Dr. Okonkwo gets to it in Week 3.</div>`;
  } else {
    $('z-note').textContent = 'z = (x − μ) / σ';
    const zs = allZScores(state);
    for (const s of STATS) {
      const z = zs[s.key];
      const row = document.createElement('div');
      row.className = 'z-row';
      let cls = '', txt = '—';
      if (z === null) txt = 'n/a';
      else {
        txt = sign(z, 2);
        if (z > Z_THRESHOLD) cls = 'z-stretch';
        else if (z < -Z_THRESHOLD) cls = 'z-over';
      }
      const pctFromMid = z === null ? 0 : Math.max(-1, Math.min(1, z / 3)) * 50;
      row.innerHTML = `
        <span class="z-label" style="color:${s.color}">${s.label}</span>
        <span class="z-val ${cls}">${txt}</span>
        <span class="z-track">
          <span class="z-fill" style="
            background:${z > Z_THRESHOLD ? 'var(--red)' : z < -Z_THRESHOLD ? 'var(--gold)' : s.color};
            left:${pctFromMid < 0 ? 50 + pctFromMid : 50}%;
            width:${Math.abs(pctFromMid)}%"></span>
        </span>`;
      list.appendChild(row);
    }
    const stretched = STATS.filter((s) => zs[s.key] !== null && zs[s.key] > Z_THRESHOLD);
    const over = STATS.filter((s) => zs[s.key] !== null && zs[s.key] < -Z_THRESHOLD);
    if (stretched.length || over.length) {
      const n = document.createElement('div');
      n.className = 'panel-foot';
      n.innerHTML = [
        stretched.length ? `<span style="color:var(--red)">STRETCHED — ${stretched.map((s) => s.label).join(', ')} will unwind next week.</span>` : '',
        over.length ? `<span style="color:var(--gold)">OVERSOLD — ${over.map((s) => s.label).join(', ')} pays 1.75× right now.</span>` : '',
      ].filter(Boolean).join('<br>');
      list.appendChild(n);
    }
  }

  const e = Math.round(state.energy);
  $('energy-bar').style.width = `${e}%`;
  $('energy-bar').style.background = e < 25 ? 'var(--red)' : e < 50 ? '#d8a13c' : 'var(--green)';
  $('energy-val').textContent = e;

  const f = $('hr-file');
  const rows = [
    `WARNINGS <b class="${state.warnings ? 'bad' : 'ok'}">${state.warnings} / 3</b>`,
    `STATUS <b class="${state.pip ? 'bad' : 'ok'}">${state.pip ? 'ON A PIP' : 'IN GOOD STANDING'}</b>`,
    `ISSUED SOAP <b>COMPOUND No. 4</b>`,
  ];
  if (state.fasting) rows.push(`<b style="color:var(--gold)">NATIVITY FAST ACTIVE</b>`);
  if (state.energy < 25) rows.push(`<b class="bad">RUNNING ON FUMES — all effects ×0.6</b>`);
  f.innerHTML = rows.join('<br>');
}

// ── Week brief + memo ──────────────────────────────────────────────────────

export function renderWeek(state, picks) {
  const wk = WEEKS[state.week - 1];
  if (!wk) return;
  $('week-n').textContent = `WEEK ${wk.n}`;
  $('week-title').textContent = wk.title;
  $('week-sub').textContent = wk.sub;
  $('week-brief').textContent = wk.brief;

  const slot = $('memo-slot');
  slot.innerHTML = '';
  if (!wk.memo) return;

  const f = FACULTY[wk.memo.from];
  const satisfied = picks.includes(wk.memo.requires);
  const req = ACTION_MAP[wk.memo.requires];
  const card = document.createElement('div');
  card.className = 'memo-card';
  card.innerHTML = `
    <div class="memo-card-head">
      <span>MEMORANDUM ${wk.memo.id}</span>
      <span>${f.course}</span>
    </div>
    <div class="memo-card-title">${esc(wk.memo.title)}</div>
    <div class="memo-card-body">${esc(wk.memo.body)}</div>
    <div class="memo-req${satisfied ? ' satisfied' : ''}">
      COMPLIANCE REQUIRES: <b>${esc(req.name).toUpperCase()}</b> ·
      ${satisfied ? 'SCHEDULED ✓' : `NOT SCHEDULED — failure is a written warning and −${MEMO_PENALTY} COMPLIANCE`}
      <br>— ${f.name}
    </div>`;
  slot.appendChild(card);
}

// ── Actions and slots ──────────────────────────────────────────────────────

export function renderActions(state, picks, onAdd, onRemove) {
  const cap = availableSlots(state);
  const used = picks.reduce((a, id) => a + ACTION_MAP[id].slots, 0);
  const free = cap - used;
  $('slot-count').textContent = `${used} / ${cap}${state.pip ? ' · 1 RESERVED' : ''}`;

  // Slots
  const row = $('slot-row');
  row.innerHTML = '';
  let idx = 0;
  picks.forEach((id, pi) => {
    const a = ACTION_MAP[id];
    for (let k = 0; k < a.slots; k++) {
      const d = document.createElement('div');
      d.className = 'slot filled';
      d.textContent = k === 0 ? a.name : '↳';
      d.title = 'Click to remove';
      d.addEventListener('click', () => onRemove(pi));
      row.appendChild(d);
      idx++;
    }
  });
  for (; idx < cap; idx++) {
    const d = document.createElement('div');
    d.className = 'slot';
    d.textContent = 'OPEN';
    row.appendChild(d);
  }
  if (state.pip) {
    const d = document.createElement('div');
    d.className = 'slot locked';
    d.textContent = 'REMEDIATION';
    d.title = 'Reserved by the Committee. Not yours to allocate.';
    row.appendChild(d);
  }

  // Grid, grouped by how the Committee has classified each use of his time.
  const wk = WEEKS[state.week - 1];
  const zs = state.zUnlocked ? allZScores(state) : {};
  const grid = $('action-grid');
  grid.innerHTML = '';

  for (const [clsKey, cmeta] of Object.entries(CLASSES)) {
    const inClass = ACTIONS.filter((a) => a.cls === clsKey);
    if (!inClass.length) continue;

    const head = document.createElement('div');
    head.className = 'action-group-head';
    head.innerHTML =
      `<span style="color:${cmeta.color}">${cmeta.label}</span>` +
      `<span class="agh-note">${esc(cmeta.note)}</span>`;
    grid.appendChild(head);

    for (const a of inClass) {
      const b = document.createElement('button');
      b.className = `action action-${clsKey}`;
      b.disabled = a.slots > free;
      if (wk?.memo?.requires === a.id) b.classList.add('required');

      const oversold = Object.entries(a.effects).some(
        ([k, v]) => v > 0 && zs[k] != null && zs[k] < -Z_THRESHOLD);
      if (oversold) b.classList.add('oversold');

      const fx = Object.entries(a.effects)
        .map(([k, v]) => `<span class="fx" style="color:${STAT_MAP[k].color}">${k} ${sign(v, 0)}</span>`)
        .join('');
      const en = a.energy >= 0
        ? `<span class="fx" style="color:var(--green)">EN +${a.energy}</span>`
        : `<span class="fx" style="color:var(--dim)">EN ${a.energy}</span>`;

      b.innerHTML = `
        <div class="action-top">
          <span class="action-name">${esc(a.name)}</span>
          <span class="action-slots">${a.slots}◧</span>
        </div>
        <div class="action-desc">${esc(a.desc)}</div>
        <div class="action-fx">${fx}${en}</div>`;
      b.addEventListener('click', () => onAdd(a.id));
      grid.appendChild(b);
    }
  }

  const btn = $('btn-advance');
  btn.disabled = free !== 0;
  btn.textContent = free === 0
    ? `ADVANCE WEEK ${state.week} · PRINT THE CANDLE →`
    : `${free} SLOT${free === 1 ? '' : 'S'} UNALLOCATED`;
}

// ── Tape ───────────────────────────────────────────────────────────────────

export function renderTape(state) {
  const el = $('tape');
  if (!state.tape.length) {
    el.innerHTML = `<div class="tape-line" style="color:var(--dim)">No prints yet. The bell has not rung.</div>`;
    return;
  }
  el.innerHTML = state.tape.slice().reverse().map((s) => {
    const lines = [...s.tape, ...s.alerts]
      .map((l) => `<div class="tape-line ${l.kind}">${esc(l.text)}</div>`).join('');
    const cls = s.pct >= 0 ? 'up' : 'down';
    return `<div class="tape-week">
      <div class="tape-week-head">WK ${s.week} · ${esc(s.wk.title)} ·
        <span class="${cls}">${sign(s.pct, 2)}%</span> ·
        CLOSE ${Math.round(s.candle.close).toLocaleString()}</div>
      ${lines}</div>`;
  }).join('');
  el.scrollTop = 0;
}

// ── Overlays ───────────────────────────────────────────────────────────────

function openOverlay(html, wire) {
  const card = $('overlay-card');
  card.innerHTML = html;
  $('overlay').classList.remove('hidden');
  card.scrollTop = 0;
  if (wire) wire(card);
}
export function closeOverlay() { $('overlay').classList.add('hidden'); }

export function showWeekReport(state, s, onContinue) {
  const cls = s.pct >= 0 ? 'up' : 'down';
  const lines = [...s.tape, ...s.alerts]
    .map((l) => `<div class="rep-line ${l.kind}">${esc(l.text)}</div>`).join('');

  let grades = '';
  if (s.report) {
    grades = `
      <div class="panel-head" style="margin-top:20px"><span>${s.report.period} REPORT CARD</span>
        <span class="panel-head-note">GPA ${s.report.gpa.toFixed(2)}</span></div>
      <table class="grades">
        ${s.report.grades.map((g) => `<tr>
          <td>${g.label}</td>
          <td style="color:var(--dim)">${Math.round(g.value)}</td>
          <td class="g-${g.grade}">${g.grade}</td></tr>`).join('')}
      </table>`;
  }

  openOverlay(`
    <div class="rep-head">
      <div class="rep-kicker">WEEK ${s.week} CLOSE${s.report ? ` · ${s.report.period} EARNINGS` : ''}</div>
      <h2 class="rep-title">${esc(s.wk.title)}</h2>
      <div class="rep-print">
        <span class="rep-level ${cls}">${Math.round(s.candle.close).toLocaleString()}</span>
        <span class="rep-pct ${cls}">${sign(s.pct, 2)}%</span>
        <span style="font-size:10px;color:var(--dim);letter-spacing:.1em">
          O ${Math.round(s.candle.open)} · H ${Math.round(s.candle.high)} ·
          L ${Math.round(s.candle.low)} · V ${Math.round(s.candle.volume)}</span>
      </div>
    </div>
    <div class="rep-lines">${lines || '<div class="rep-line">Quiet week. The tape had no comment.</div>'}</div>
    ${grades}
    <button class="btn btn-primary btn-block" id="ov-next" style="margin-top:20px">
      ${state.finished ? 'RING THE CLOSING BELL →' : `OPEN WEEK ${state.week} →`}
    </button>`,
    (card) => card.querySelector('#ov-next').addEventListener('click', onContinue));
}

export function showEnding(state, result, onRestart) {
  const stack = state.layerOrder.slice().reverse().map((k, i) => {
    const m = STAT_MAP[k];
    return `<div style="display:flex;justify-content:space-between;gap:8px;padding:3px 0;
      font-size:10px;letter-spacing:.08em;color:${i === 0 ? m.color : 'var(--text-2)'}">
      <span>${i === 0 ? '▸ ' : '&nbsp;&nbsp;'}${m.label}</span>
      <span>z-index ${state.layerOrder.length - i} · ${Math.round(state.stats[k])}</span></div>`;
  }).join('');

  openOverlay(`
    <div class="rep-head">
      <div class="rep-kicker">FINAL BELL · FALL SEMESTER CLOSE · ${esc(CONFIG.school)}</div>
      <h2 class="rep-title">${esc(result.ending.title)}</h2>
      <div class="rep-print">
        <span class="rep-level ${result.chg >= 0 ? 'up' : 'down'}">${Math.round(result.level).toLocaleString()}</span>
        <span class="rep-pct ${result.chg >= 0 ? 'up' : 'down'}">${sign(result.chg, 2)}% SINCE IPO</span>
      </div>
    </div>

    <div class="ending-stats">
      <div class="es"><span>RATING</span><b style="font-size:12px">${result.tier.rating}</b></div>
      <div class="es"><span>MAX DD</span><b>${result.maxDD.toFixed(1)}%</b></div>
      <div class="es"><span>SHARPE</span><b>${result.sharpe.toFixed(2)}</b></div>
      <div class="es"><span>WARNINGS</span><b>${result.warnings}</b></div>
    </div>

    <div style="border:1px solid var(--line);border-radius:2px;padding:11px;margin-bottom:6px">
      <div style="font-size:9px;letter-spacing:.18em;color:var(--dim);margin-bottom:6px">
        FINAL STACKING ORDER</div>
      ${stack}
    </div>

    <div class="ending-body">${esc(result.ending.body)}</div>

    <div class="rep-line ${result.tier.rating === 'DELISTED' ? 'bad' : 'ok'}"
      style="margin-bottom:6px">${esc(result.tier.line)}</div>
    ${result.pip ? `<div class="rep-line bad">Closed the year on a Performance Improvement Plan. The folder goes in his permanent file, which the Committee assures us is a real thing that exists.</div>` : ''}
    ${result.sharpe > 0.8 ? `<div class="rep-line good">Sharpe above 0.8 — he got there smoothly. Anyone can have a good week. Almost nobody strings fifteen together without a blowup.</div>` : ''}

    <button class="btn btn-primary btn-block" id="ov-restart" style="margin-top:22px">
      RUN THE SEMESTER AGAIN →</button>
    <div class="panel-foot" style="text-align:center">
      Six layers. Six endings. He can bring any one of them to the front.
    </div>`,
    (card) => card.querySelector('#ov-restart').addEventListener('click', onRestart));
}
