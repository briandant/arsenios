// ── Main ───────────────────────────────────────────────────────────────────
// Owns the state, wires the handlers, drives the render loop.

import { CONFIG } from './config.js';
import { ACTION_MAP, WEEKS } from './data.js';
import { createState, resolveWeek, computeEnding, availableSlots } from './engine.js';
import { drawChart } from './chart.js';
import * as Desk from './desk.js';
import * as UI from './ui.js';

const $ = (id) => document.getElementById(id);

let state = createState();
let picks = [];

// ── Render ─────────────────────────────────────────────────────────────────

function render() {
  UI.renderTicker(state);
  UI.renderLayers(state, moveLayer);
  UI.renderIndicators(state);
  UI.renderWeek(state, picks);
  UI.renderActions(state, picks, addPick, removePick);
  UI.renderTape(state);
  drawChart($('chart'), state);
}

// ── Handlers ───────────────────────────────────────────────────────────────

function addPick(id, srcEl) {
  const used = picks.reduce((a, p) => a + ACTION_MAP[p].slots, 0);
  if (used + ACTION_MAP[id].slots > availableSlots(state)) return;

  // Measure the card before the re-render blows it away — the ticket flies
  // from where the card was to where the slot ends up.
  const from = srcEl?.getBoundingClientRect();
  const pi = picks.length;
  picks.push(id);
  render();

  const action = ACTION_MAP[id];
  const slot = $('slot-row').querySelector(`[data-pi="${pi}"][data-head]`);
  if (from) Desk.flyTicket(from, slot, action.name);
  else Desk.stampSlot(slot);
  Desk.squawkPick(state, action, {
    required: WEEKS[state.week - 1]?.memo?.requires === id,
  });
}

function removePick(i) {
  picks.splice(i, 1);
  render();
  Desk.clearFlash($('slot-row').querySelector('.slot:not(.filled):not(.locked)'));
}

/** dir +1 brings the layer forward (later in the array paints last). */
function moveLayer(key, dir) {
  const i = state.layerOrder.indexOf(key);
  const j = i + dir;
  if (j < 0 || j >= state.layerOrder.length) return;
  [state.layerOrder[i], state.layerOrder[j]] = [state.layerOrder[j], state.layerOrder[i]];
  render();
}

function advance() {
  const used = picks.reduce((a, p) => a + ACTION_MAP[p].slots, 0);
  if (used !== availableSlots(state)) return;

  const summary = resolveWeek(state, picks);
  picks = [];
  render();

  UI.showWeekReport(state, summary, () => {
    UI.closeOverlay();
    if (state.finished) {
      UI.showEnding(state, computeEnding(state), restart);
    } else {
      render();
      // Close the report and the desk is already arguing about the print.
      Desk.squawkPrint(state, summary.pct);
    }
  });
}

function restart() {
  state = createState();
  picks = [];
  UI.closeOverlay();
  Desk.resetDesk();
  render();
}

// ── Boot ───────────────────────────────────────────────────────────────────

// The desk is built once and never re-rendered — it holds its own animation
// state, which a rebuild on every pick would stomp.
Desk.mountDesk($('desk'));

$('btn-start').addEventListener('click', () => {
  $('boot').classList.add('hidden');
  $('game').classList.remove('hidden');
  render();
  // Canvas needs a real layout pass before it knows how big it is.
  requestAnimationFrame(() => drawChart($('chart'), state));
});

$('btn-advance').addEventListener('click', advance);

document.addEventListener('keydown', (e) => {
  // Step back and forth through what the desk has said. Only in the terminal,
  // and never while an overlay is up. Buttons are deliberately NOT excluded —
  // arrows do nothing on a button, so bailing when one has focus would mean
  // clicking the nav once stopped the keys from working.
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
    if (!$('overlay').classList.contains('hidden')) return;
    if (!$('boot').classList.contains('hidden')) return;
    const t = e.target;
    if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement
      || t instanceof HTMLSelectElement || t?.isContentEditable) return;
    if (Desk.stepSquawk(e.key === 'ArrowLeft' ? -1 : 1)) e.preventDefault();
    return;
  }

  if (e.key !== 'Enter') return;
  const overlay = $('overlay');
  if (!overlay.classList.contains('hidden')) {
    const btn = overlay.querySelector('button');
    if (btn) { e.preventDefault(); btn.click(); }
    return;
  }
  if ($('boot').classList.contains('hidden') && !$('btn-advance').disabled) {
    e.preventDefault();
    advance();
  } else if (!$('boot').classList.contains('hidden')) {
    e.preventDefault();
    $('btn-start').click();
  }
});

// Redraw on any layout change — the chart is sized from CSS, not attributes.
const ro = new ResizeObserver(() => drawChart($('chart'), state));
ro.observe($('panel-chart'));
window.addEventListener('resize', () => drawChart($('chart'), state));

render();
