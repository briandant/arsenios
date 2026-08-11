// ── Main ───────────────────────────────────────────────────────────────────
// Owns the state, wires the handlers, drives the render loop.

import { CONFIG } from './config.js';
import { ACTION_MAP } from './data.js';
import { createState, resolveWeek, computeEnding, availableSlots } from './engine.js';
import { drawChart } from './chart.js';
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

function addPick(id) {
  const used = picks.reduce((a, p) => a + ACTION_MAP[p].slots, 0);
  if (used + ACTION_MAP[id].slots > availableSlots(state)) return;
  picks.push(id);
  render();
}

function removePick(i) {
  picks.splice(i, 1);
  render();
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
    }
  });
}

function restart() {
  state = createState();
  picks = [];
  UI.closeOverlay();
  render();
}

// ── Boot ───────────────────────────────────────────────────────────────────

$('btn-start').addEventListener('click', () => {
  $('boot').classList.add('hidden');
  $('game').classList.remove('hidden');
  render();
  // Canvas needs a real layout pass before it knows how big it is.
  requestAnimationFrame(() => drawChart($('chart'), state));
});

$('btn-advance').addEventListener('click', advance);

document.addEventListener('keydown', (e) => {
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
