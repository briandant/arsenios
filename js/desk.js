// ── The desk ───────────────────────────────────────────────────────────────
// Five sell-side analysts sit behind the slot row and have opinions about what
// you just did with his week. This file decides who talks and draws them; the
// lines themselves live in data.js.
//
// It also owns the fill choreography: the order ticket that flies out of the
// action card into the slot, and the stamp when it lands. Nothing in here
// touches game state — main.js calls in after it has already re-rendered.

import { CONFIG, STAT_MAP, Z_THRESHOLD } from './config.js';
import { DESK } from './data.js';
import { allZScores } from './engine.js';

const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const POSE_MS = 4200;          // how long the speaker holds the lean-in
const TREY_DELAY = 1150;       // how long Trey waits before agreeing
const TREY_ODDS = 0.3;
const MAX_HISTORY = 300;       // a full semester runs ~120 squawks

let deskEl = null;
let seats = {};                // id → seat element
let bubble = null, whoEl = null, textEl = null, tailEl = null, idleEl = null;
let countEl = null, prevBtn = null, nextBtn = null;
let poseTimer = null, treyTimer = null;
let lastSpeaker = null, treySpokeLast = false;
const recentLines = [];        // avoid repeating a line while it is still fresh

// The squawk box is a transcript, not a toast. Nothing expires — a line you
// are still reading should not vanish, and the writing is most of the point —
// so the box holds the latest line and you can step back through the rest.
const history = [];
let cursor = -1;

// ── Drawing an analyst ─────────────────────────────────────────────────────
// Phosphor silhouettes, not portraits — at this size a face is a smudge, so
// the finance bro is carried entirely by the props. viewBox is 40×46 with the
// desk edge at y=42, which is why every figure tucks 2px under it in CSS.

// Every hairstyle is built off the same half-disc cap over the head, because
// hand-authored bezier hair falls apart at 50px. The variant is what happens
// at the edges of that disc, which is the only part legible at this size.
const HAIR = {
  // Volume, slicked back. Same disc, taller.
  slick: `<path d="M13.75 12.6a6.25 7.9 0 0 1 12.5 0Z"/>`,
  part: `<path d="M13.75 12.6a6.25 6.25 0 0 1 12.5 0Z"/>`,
  pony: `<path d="M13.75 12.6a6.25 6.25 0 0 1 12.5 0Z"/>
         <path d="M25.4 9.4c3.8 1.4 4.4 6.6 3 10.4-1.4-3.8-2.6-7.2-4-8.6Z"/>`,
  // Receding, which is thirty years on the desk.
  thin: `<path d="M14.4 12.2a5.6 5.6 0 0 1 11.2 0c-1.6-2.8-9.6-2.8-11.2 0Z"/>`,
  cap: `<path d="M13.6 12.6a6.4 6.4 0 0 1 12.8 0Z"/>
        <path d="M14.6 11.8h-4.4a1.2 1.2 0 0 0 0 2.4h4.4Z"/>
        <circle cx="20" cy="6.4" r=".85"/>`,
};

// The handset never leaves the ear. Nobody on a desk has ever put it down.
// Every arm starts inside the vest so the round cap is buried and the limb
// doesn't read as a crescent floating alongside the body.
const PROP = {
  // Forearm straight up beside the head. A curve reads as a tube at 60px;
  // a vertical segment with the handset on the end reads as a phone call.
  phone: `<g class="arm arm-phone">
      <path d="M27.9 26.4 27.3 18.6" fill="none" stroke-width="2.7" stroke-linecap="round"/>
      <rect x="25.6" y="11.6" width="3.2" height="6.8" rx="1.4" transform="rotate(14 27.2 15)"/>
    </g>`,
  headset: `<g class="prop-headset">
      <path d="M12.6 12.6a7.4 7.4 0 0 1 14.8 0" fill="none" stroke-width="1.2"/>
      <rect class="ear" x="11.2" y="11.4" width="2.9" height="4.6" rx="1.4"/>
      <path class="boom" d="M13.2 15.8q3.2 3.8 6 3.4" fill="none" stroke-width=".8"/>
    </g>`,
  coffee: `<g class="arm arm-coffee">
      <path d="M28.4 26.6 31 32.6" fill="none" stroke-width="2.7" stroke-linecap="round"/>
    </g>
    <g class="cup">
      <rect x="30.4" y="33.6" width="4.8" height="5.6" rx=".6"/>
      <rect class="rim" x="30.4" y="33.6" width="4.8" height="1"/>
      <path d="M35.2 35.2a1.6 1.6 0 0 1 0 3" fill="none" stroke-width=".9"/>
    </g>`,
};

const GLASSES = `<g class="glasses" fill="none" stroke-width=".8">
    <rect x="14.4" y="11.2" width="4.5" height="3.3" rx=".9"/>
    <rect x="21.1" y="11.2" width="4.5" height="3.3" rx=".9"/>
    <path d="M18.9 12.8h2.2"/>
  </g>`;

function figure(seat) {
  // The viewBox is cropped to the ink — the tallest thing on any figure is
  // Chad's hair at y≈4.7 — so the heads sit right up under the squawk box
  // instead of floating in 6 units of empty space.
  return `<svg class="fig" viewBox="0 3.4 40 38.8" aria-hidden="true"
      style="--tone:${seat.tone};--vest:${seat.vest}">
    <g class="body">
      <path class="vest" d="M20 20.2c-6.4 0-9.9 4.1-10.8 9.9L8.2 42h23.6l-1-11.9c-.9-5.8-4.4-9.9-10.8-9.9Z"/>
      <path class="shirt" d="M16.8 20.8 20 26 23.2 20.8Z"/>
      <path class="zip" d="M20 26V42" fill="none" stroke-width=".8"/>
      <rect class="skin" x="17.9" y="17.4" width="4.2" height="3.4" rx=".8"/>
      <circle class="skin" cx="20" cy="12.6" r="5.8"/>
      <g class="hair">${HAIR[seat.hair] ?? HAIR.part}</g>
      ${seat.glasses ? GLASSES : ''}
      ${PROP[seat.prop] ?? ''}
    </g>
    <g class="monitor">
      <rect x="11.6" y="31" width="16.8" height="11" rx="1"/>
      <rect class="screen" x="12.8" y="32.2" width="14.4" height="8.6" rx=".4"/>
      <rect class="scan" x="12.8" y="34.2" width="14.4" height="1.4"/>
    </g>
  </svg>`;
}

// ── Mount ──────────────────────────────────────────────────────────────────

export function mountDesk(el) {
  deskEl = el;
  el.innerHTML = `
    <div class="panel-head">
      <span>THE DESK</span>
      <span class="panel-head-note">${DESK.length} analysts covering $${CONFIG.ticker}</span>
    </div>
    <div class="squawk" id="squawk">
      <div class="squawk-idle" id="squawk-idle">Squawk box open. Fill a slot and somebody will have something to say about it.</div>
      <div class="squawk-body" id="squawk-body">
        <div class="squawk-head">
          <span class="squawk-who" id="squawk-who"></span>
          <span class="squawk-nav">
            <button type="button" id="sq-prev" title="Earlier squawk (←)" aria-label="Earlier squawk">◀</button>
            <span class="squawk-count" id="squawk-count"></span>
            <button type="button" id="sq-next" title="Later squawk (→)" aria-label="Later squawk">▶</button>
          </span>
        </div>
        <div class="squawk-text" id="squawk-text"></div>
      </div>
      <i class="squawk-tail" id="squawk-tail"></i>
    </div>
    <div class="desk-floor">
      <div class="desk-row">
        ${DESK.map((a, i) => `
          <div class="seat" data-id="${a.id}" style="--stagger:${(i * 0.7 + 0.3).toFixed(2)}s;--breath:${(4.2 + i * 0.55).toFixed(2)}s">
            ${figure(a.seat)}
          </div>`).join('')}
      </div>
      <div class="desk-front">
        ${DESK.map((a) => `<span class="plate">${a.name.split(' ')[0]}</span>`).join('')}
      </div>
    </div>`;

  seats = {};
  el.querySelectorAll('.seat').forEach((s) => { seats[s.dataset.id] = s; });
  bubble = el.querySelector('#squawk');
  whoEl = el.querySelector('#squawk-who');
  textEl = el.querySelector('#squawk-text');
  tailEl = el.querySelector('#squawk-tail');
  idleEl = el.querySelector('#squawk-idle');
  countEl = el.querySelector('#squawk-count');
  prevBtn = el.querySelector('#sq-prev');
  nextBtn = el.querySelector('#sq-next');

  prevBtn.addEventListener('click', () => stepSquawk(-1));
  nextBtn.addEventListener('click', () => stepSquawk(1));
}

/** Step through the transcript. -1 is earlier, +1 is later. */
export function stepSquawk(dir) {
  const next = cursor + dir;
  if (next < 0 || next >= history.length) return false;
  cursor = next;
  show(history[cursor], false);
  return true;
}

// ── Who talks ──────────────────────────────────────────────────────────────
// Every analyst bids for every squawk. A bespoke line about this exact action
// outbids a mechanic, a live mechanic outbids a classification, and a
// classification outbids having nothing to say. Whoever spoke last is heavily
// discounted so the desk rotates instead of turning into a monologue.

const BID = { on: 10, oversold: 8, stretched: 7, required: 7, tired: 5.5, print: 6, any: 1 };

function bids(ctx) {
  const out = [];
  for (const a of DESK) {
    const add = (bucket, weight, pool) => {
      if (!pool?.length) return;
      // A pool with nothing left to say loses the auction. Without this, the
      // one bespoke line for an action outbids everything every time you pick
      // that action, and a player who leans on one activity hears it weekly.
      const fresh = pool.some((l) => !recentLines.includes(l));
      out.push({ a, bucket, pool, weight, fresh });
    };
    if (ctx.action) add('on', BID.on, a.on?.[ctx.action.id]);

    if (ctx.mode === 'print') {
      const b = ctx.pct >= 0 ? 'printUp' : 'printDown';
      add(b, BID.print, a.lines?.[b]);
    } else {
      if (ctx.oversold) add('oversold', BID.oversold, a.lines?.oversold);
      if (ctx.stretched) add('stretched', BID.stretched, a.lines?.stretched);
      if (ctx.required) add('required', BID.required, a.lines?.required);
      if (ctx.tired) add('tired', BID.tired, a.lines?.tired);
      if (ctx.cls) add(ctx.cls, 1 + (a.affinity?.[ctx.cls] ?? 0) * 3, a.lines?.[ctx.cls]);
    }
    add('any', BID.any, a.lines?.any);
  }

  // Sharpen the weights hard, then jitter, so the strongest bid usually wins
  // but the desk is never fully predictable.
  for (const c of out) {
    c.score = c.weight ** 2.4
      * (c.a.id === lastSpeaker ? 0.16 : 1)
      * (c.fresh ? 1 : 0.1)
      * (0.78 + Math.random() * 0.44);
  }
  return out.sort((x, y) => y.score - x.score);
}

function chooseLine(pool) {
  const fresh = pool.filter((l) => !recentLines.includes(l));
  const pick = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length || pool.length))];
  recentLines.push(pick);
  if (recentLines.length > 12) recentLines.shift();
  return pick;
}

function fill(text, ctx) {
  return text
    .replace(/\{stat\}/g, ctx.statLabel || 'that line')
    .replace(/\{z\}/g, ctx.zText || 'where it is')
    .replace(/\{action\}/g, ctx.action?.name || 'that')
    .replace(/\{last\}/g, ctx.lastShort || 'Mitch');
}

// ── Saying it ──────────────────────────────────────────────────────────────

function say(analyst, text) {
  if (!seats[analyst.id] || !bubble) return;

  // Drop any pending follow-up. Players fill slots faster than the intern
  // gets his sentence out, and a stale timer would land him agreeing with
  // somebody who spoke two picks ago.
  clearTimeout(treyTimer);

  history.push({ id: analyst.id, who: `${analyst.name} · ${analyst.desk}`, text });
  if (history.length > MAX_HISTORY) history.shift();
  cursor = history.length - 1;
  lastSpeaker = analyst.id;
  show(history[cursor], true);
}

/**
 * Put one transcript entry on screen. `live` means it was just said — only
 * then does the desk react to it, so stepping back through the log reads as
 * recall rather than five people saying it all again.
 */
function show(entry, live) {
  const seat = seats[entry.id];
  if (!seat || !bubble) return;

  whoEl.textContent = entry.who;
  textEl.textContent = `“${entry.text}”`;
  bubble.classList.add('live');
  bubble.classList.toggle('recall', cursor < history.length - 1);
  idleEl.hidden = true;

  countEl.textContent = `${cursor + 1} / ${history.length}`;
  prevBtn.disabled = cursor <= 0;
  nextBtn.disabled = cursor >= history.length - 1;

  // Point the tail at whoever said it. Transitioning `left` means the desk
  // visibly turns to them.
  const r = seat.getBoundingClientRect();
  const d = bubble.getBoundingClientRect();
  if (d.width) tailEl.style.left = `${((r.left + r.width / 2 - d.left) / d.width) * 100}%`;

  clearTimeout(poseTimer);
  Object.values(seats).forEach((s) => s.classList.remove('talking', 'nodding'));
  seat.classList.add('talking');
  if (live && entry.id !== 'trey' && seats.trey) seats.trey.classList.add('nodding');

  // Popping the box on every arrow press would fight the reader, so only a
  // fresh squawk gets the animation.
  bubble.classList.remove('pop');
  void bubble.offsetWidth;                       // restart the pop keyframe
  if (live && !REDUCED) bubble.classList.add('pop');

  // The lean is a reaction and settles. The line itself stays up until the
  // desk has something new to say, or you go looking for something older.
  poseTimer = setTimeout(() => {
    Object.values(seats).forEach((s) => s.classList.remove('talking', 'nodding'));
  }, POSE_MS);
}

/** The intern's entire contribution: agreeing, slightly too late. */
function maybeTrey(prevAnalyst) {
  const trey = DESK.find((a) => a.id === 'trey');
  if (!trey?.lines.agrees || prevAnalyst.id === 'trey') return;
  // Sit out exactly one squawk after agreeing, then become eligible again.
  // Without the reset here he agrees once and never speaks for the rest of
  // the semester.
  if (treySpokeLast) { treySpokeLast = false; return; }
  if (Math.random() > TREY_ODDS) return;
  treySpokeLast = true;
  clearTimeout(treyTimer);
  treyTimer = setTimeout(() => {
    say(trey, fill(chooseLine(trey.lines.agrees), {
      lastShort: prevAnalyst.name.split(' ')[0],
    }));
  }, TREY_DELAY);
}

// ── Context from game state ────────────────────────────────────────────────

function contextFor(state, action) {
  const zs = state.zUnlocked ? allZScores(state) : {};
  const gains = Object.entries(action.effects).filter(([, v]) => v > 0);

  const oversold = gains.find(([k]) => zs[k] != null && zs[k] < -Z_THRESHOLD);
  const stretched = gains.find(([k]) => zs[k] != null && zs[k] > Z_THRESHOLD);
  const biggest = gains.sort((a, b) => b[1] - a[1])[0];
  const focus = (oversold || stretched || biggest)?.[0];

  return {
    action,
    cls: action.cls,
    oversold: !!oversold,
    stretched: !!stretched,
    tired: state.energy < 25,
    statLabel: focus ? STAT_MAP[focus].label : null,
    zText: focus && zs[focus] != null
      ? `${zs[focus] >= 0 ? '+' : ''}${zs[focus].toFixed(2)}` : null,
  };
}

/** Somebody reacts to the slot you just filled. */
export function squawkPick(state, action, { required = false } = {}) {
  const ctx = { ...contextFor(state, action), required };
  const win = bids(ctx)[0];
  if (!win) return;
  say(win.a, fill(chooseLine(win.pool), ctx));
  maybeTrey(win.a);
}

/** The desk is already talking about the print by the time you close the report. */
export function squawkPrint(state, pct) {
  const win = bids({ mode: 'print', pct })[0];
  if (!win) return;
  say(win.a, fill(chooseLine(win.pool), { mode: 'print' }));
  if (!REDUCED) {
    deskEl?.querySelectorAll('.monitor').forEach((m) => {
      m.classList.remove('flash');
      void m.getBoundingClientRect();
      m.classList.add('flash');
    });
  }
  maybeTrey(win.a);
}

export function resetDesk() {
  clearTimeout(poseTimer);
  clearTimeout(treyTimer);
  lastSpeaker = null;
  treySpokeLast = false;
  recentLines.length = 0;
  history.length = 0;
  cursor = -1;
  if (!bubble) return;
  bubble.classList.remove('live', 'pop', 'recall');
  idleEl.hidden = false;
  Object.values(seats).forEach((s) => s.classList.remove('talking', 'nodding'));
}

// ── Fill choreography ──────────────────────────────────────────────────────

function ticketLayer() {
  let l = document.getElementById('ticket-layer');
  if (!l) {
    l = document.createElement('div');
    l.id = 'ticket-layer';
    l.setAttribute('aria-hidden', 'true');
    document.body.appendChild(l);
  }
  return l;
}

// The ticket is a fixed-size chit, not a copy of the card. Cards vary from
// 130px to 300px wide and scaling one of those down reads as a drifting
// rectangle; a constant-size ticket reads as a piece of paper being filed.
const TICKET_W = 132;
const TICKET_H = 32;

/**
 * An order ticket leaves the card and lands in the slot it filled.
 * `from` is captured before the re-render, `to` is the slot that exists after.
 */
export function flyTicket(from, to, label) {
  if (!to) return;
  if (REDUCED) { stampSlot(to); return; }

  const dest = to.getBoundingClientRect();
  const left = from.left + from.width / 2 - TICKET_W / 2;
  const top = from.top + from.height / 2 - TICKET_H / 2;

  const t = document.createElement('div');
  t.className = 'ticket';
  t.textContent = label;
  Object.assign(t.style, {
    left: `${left}px`, top: `${top}px`,
    width: `${TICKET_W}px`, height: `${TICKET_H}px`,
  });
  ticketLayer().appendChild(t);

  const dx = dest.left + dest.width / 2 - (left + TICKET_W / 2);
  const dy = dest.top + dest.height / 2 - (top + TICKET_H / 2);

  t.animate([
    { transform: 'translate(0,0) scale(.9) rotate(-2deg)', opacity: 0 },
    { transform: `translate(${dx * .18}px, ${dy * .18 - 10}px) scale(1) rotate(1.5deg)`, opacity: 1, offset: .22 },
    { transform: `translate(${dx}px, ${dy}px) scale(${Math.max(.42, Math.min(1, dest.width / TICKET_W))}) rotate(0deg)`, opacity: 0 },
  ], { duration: 440, easing: 'cubic-bezier(.32,.02,.24,1)' })
    .finished.catch(() => {})
    .then(() => { t.remove(); stampSlot(to); });
}

export function stampSlot(el) {
  if (!el) return;
  el.classList.remove('stamp');
  void el.offsetWidth;
  el.classList.add('stamp');
}

export function clearFlash(el) {
  if (!el) return;
  el.classList.remove('cleared');
  void el.offsetWidth;
  el.classList.add('cleared');
}
