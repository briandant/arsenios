// ── Engine ─────────────────────────────────────────────────────────────────
// State, the weekly simulation, z-scores, candle construction, endings.

import {
  CONFIG, STATS, LEVEL_SCALE, Z_THRESHOLD, Z_MIN_HISTORY, Z_WINDOW, softGain,
  WARNING_CEILING_COST, COMP_CEILING_FLOOR, MEMO_PENALTY,
} from './config.js';
import { ACTION_MAP, WEEKS, PATTERNS, TIERS, ENDINGS, FACULTY } from './data.js';

const clamp = (v, lo = 0, hi = 100) => Math.max(lo, Math.min(hi, v));
const rand = (a, b) => a + Math.random() * (b - a);

/** Move a component. Gains are damped near the ceiling; losses land in full. */
function applyStat(stats, key, delta) {
  const v = stats[key];
  stats[key] = clamp(v + (delta > 0 ? delta * softGain(v) : delta));
}

// ── State ──────────────────────────────────────────────────────────────────

export function createState() {
  const stats = {};
  const history = {};
  for (const s of STATS) {
    stats[s.key] = s.start;
    history[s.key] = [s.start]; // week 0 baseline, so z has something to chew on
  }
  return {
    week: 1,
    stats,
    history,
    energy: CONFIG.startEnergy,
    candles: [],
    // Last entry renders in FRONT. This is the z-order the player drags around,
    // and the final front-most layer decides the ending.
    layerOrder: STATS.map((s) => s.key),
    zUnlocked: false,
    patternsUnlocked: false,
    warnings: 0,
    pip: false,
    fasting: false,
    hangover: 0,
    shielded: false,
    reports: [],
    tape: [],
    finished: false,
  };
}

// ── Math ───────────────────────────────────────────────────────────────────

/** The highest COMPLIANCE he can still reach, given what is in his file. */
export function compCeiling(state) {
  return Math.max(COMP_CEILING_FLOOR, 100 - state.warnings * WARNING_CEILING_COST);
}

/**
 * Slots the player actually controls this week. A Performance Improvement Plan
 * permanently reserves one of them for mandatory remediation, which the
 * Committee schedules on your behalf and considers a form of support.
 */
export function availableSlots(state) {
  return CONFIG.slotsPerWeek - (state.pip ? 1 : 0);
}

export function levelOf(stats) {
  const keys = STATS.map((s) => s.key);
  const mean = keys.reduce((a, k) => a + stats[k], 0) / keys.length;
  return mean * LEVEL_SCALE;
}

/** How far this component sits from its own average, in its own volatility. */
export function zScore(series, current) {
  const w = series.slice(-Z_WINDOW);
  if (w.length < Z_MIN_HISTORY) return null;
  const mean = w.reduce((a, b) => a + b, 0) / w.length;
  const sd = Math.sqrt(w.reduce((a, b) => a + (b - mean) ** 2, 0) / w.length);
  if (sd < 0.4) return 0; // flat as a board; nothing is stretched
  return (current - mean) / sd;
}

export function allZScores(state) {
  const out = {};
  for (const s of STATS) out[s.key] = zScore(state.history[s.key], state.stats[s.key]);
  return out;
}

export function movingAverage(candles, n) {
  return candles.map((_, i) => {
    if (i < n - 1) return null;
    const w = candles.slice(i - n + 1, i + 1);
    return w.reduce((a, c) => a + c.close, 0) / n;
  });
}

// ── Weekly resolution ──────────────────────────────────────────────────────

/**
 * Play one week.
 * @param {object} state    mutated in place
 * @param {string[]} picks  action ids, one per filled slot
 */
export function resolveWeek(state, picks) {
  const wk = WEEKS[state.week - 1];
  const tape = [];
  const alerts = [];
  const zBefore = allZScores(state);

  const open = levelOf(state.stats);
  const track = [open]; // intraweek marks, for the high and the low

  // Carried consequences from last week's decisions.
  if (state.hangover > 0) {
    state.energy -= state.hangover;
    tape.push({ kind: 'warn', text: `Energy gaps down ${state.hangover} on last week's unbroken study interval. It always comes out of next quarter.` });
    state.hangover = 0;
  }

  // Entropy. Every component gives some back before anybody does anything,
  // which is why six slots is never enough slots.
  for (const s of STATS) state.stats[s.key] = clamp(state.stats[s.key] - s.decay);
  track.push(levelOf(state.stats));

  // Scripted market-wide moves nobody voted for.
  if (wk.marketShock) {
    const { note, ...deltas } = wk.marketShock;
    if (deltas.all !== undefined) {
      for (const s of STATS) applyStat(state.stats, s.key, deltas.all);
    }
    for (const [k, v] of Object.entries(deltas)) {
      if (k !== 'all') applyStat(state.stats, k, v);
    }
    tape.push({ kind: 'shock', text: note });
    track.push(levelOf(state.stats));
  }

  // ── Actions, in the order the player stacked them ─────────────────────────
  let volatility = 0;
  let volume = 0;
  state.shielded = false;
  const counts = {};

  for (const id of picks) {
    const a = ACTION_MAP[id];
    if (!a) continue;
    counts[id] = (counts[id] || 0) + 1;

    // Running on fumes makes everything land softer.
    const tired = state.energy < 25 ? 0.6 : 1;

    for (const [k, base] of Object.entries(a.effects)) {
      let v = base * tired;

      // Oversold bounce: a neglected component pays out far more when you
      // finally get back to it. Mean reversion cuts both ways.
      const z = zBefore[k];
      if (v > 0 && z !== null && z < -Z_THRESHOLD) v *= 1.75;

      // Diminishing returns on doing the same thing four times in one week.
      if (counts[id] > 1) v *= Math.pow(0.65, counts[id] - 1);

      // The fast reprices faith for the rest of the semester.
      if (state.fasting && k === 'FAITH' && v > 0) v *= 1.4;

      applyStat(state.stats, k, v);
    }

    let energyDelta = a.energy;
    if (state.fasting && energyDelta < 0) energyDelta -= 3;
    state.energy = clamp(state.energy + energyDelta);

    volatility += a.vol;
    volume += Math.abs(a.energy) + a.slots * 3;
    if (a.shield) state.shielded = true;
    if (a.hangover) state.hangover = 14;
    if (a.unlocksPatterns && !state.patternsUnlocked) {
      state.patternsUnlocked = true;
      tape.push({ kind: 'good', text: 'Nison finished. Formations will now be labeled directly on the tape.' });
    }
    track.push(levelOf(state.stats));
  }

  // ── Scripted week mechanics ───────────────────────────────────────────────
  if (wk.unlocksZ && !state.zUnlocked) {
    state.zUnlocked = true;
    alerts.push({ kind: 'unlock', text: 'Z-SCORE INDICATOR ONLINE — z = (x − μ) / σ. Anything past ±2 is stretched.' });
  }

  if (wk.prAttempt) {
    const z = zBefore.FIT;
    if (z !== null && z > Z_THRESHOLD) {
      state.stats.FIT = clamp(state.stats.FIT - 12);
      state.energy = clamp(state.energy - 10);
      alerts.push({ kind: 'bad', text: `PR ATTEMPT FAILED — Fitness was stretched at z=${z.toFixed(1)}. Something in the shoulder. The position was crowded and crowded positions unwind.` });
    } else {
      applyStat(state.stats, 'FIT', 12);
      alerts.push({ kind: 'good', text: 'PR ATTEMPT CLEAN — new number on the bar. Accumulated from a non-stretched base, which is the only way it ever works.' });
    }
    track.push(levelOf(state.stats));
  }

  if (wk.fastBegins && !state.fasting) {
    state.fasting = true;
    alerts.push({ kind: 'unlock', text: 'NATIVITY FAST BEGINS — Faith actions reprice +40% for the remainder. Energy costs rise. The street is not modeling this.' });
  }

  if (wk.forcedReversion) {
    for (const s of STATS) {
      const h = state.history[s.key].slice(-Z_WINDOW);
      const mean = h.reduce((a, b) => a + b, 0) / h.length;
      state.stats[s.key] = clamp(state.stats[s.key] + (mean - state.stats[s.key]) * 0.25);
    }
    state.energy = clamp(state.energy + 18);
    alerts.push({ kind: 'shock', text: 'FORCED MEAN REVERSION — every component pulled 25% toward its own average. You did not get a vote. Home does that.' });
    track.push(levelOf(state.stats));
  }

  // ── Mean reversion drag on anything statistically stretched ───────────────
  for (const s of STATS) {
    const z = zBefore[s.key];
    if (z !== null && z > Z_THRESHOLD) {
      const drag = (z - Z_THRESHOLD) * 3.5;
      state.stats[s.key] = clamp(state.stats[s.key] - drag);
      alerts.push({
        kind: 'warn',
        text: `${s.label} UNWIND — entered the week at z=+${z.toFixed(1)}, gave back ${drag.toFixed(1)}. Stretched things come back.`,
      });
    }
  }

  // ── Memo compliance ───────────────────────────────────────────────────────
  let memoResult = null;
  if (wk.memo) {
    const complied = picks.includes(wk.memo.requires);
    if (complied) {
      memoResult = { complied: true, memo: wk.memo };
      tape.push({ kind: 'ok', text: `MEMO ${wk.memo.id} — compliance recorded. ${FACULTY[wk.memo.from].name} has noted it.` });
    } else {
      state.stats.COMP = clamp(state.stats.COMP - MEMO_PENALTY);
      state.warnings += 1;
      memoResult = { complied: false, memo: wk.memo, warning: state.warnings };
      tape.push({ kind: 'bad', text: `MEMO ${wk.memo.id} — NON-COMPLIANCE. Written warning ${state.warnings} of 3 issued by ${FACULTY[wk.memo.from].name}.` });
      if (state.warnings >= 3 && !state.pip) {
        state.pip = true;
        state.stats.COMP = clamp(state.stats.COMP - 15);
        alerts.push({ kind: 'bad', text: 'PERFORMANCE IMPROVEMENT PLAN INITIATED — Dean Prusak would like to see you. There is a folder, it has your name on the tab, and it is not thin. One slot per week is now reserved for mandatory remediation for the rest of the semester. The Committee considers this a form of support.' });
      }
    }
    track.push(levelOf(state.stats));
  }

  // The file follows him. Warnings cap COMPLIANCE for the rest of the term.
  const ceiling = compCeiling(state);
  if (state.stats.COMP > ceiling) {
    state.stats.COMP = ceiling;
    tape.push({ kind: 'bad', text: `COMPLIANCE capped at ${ceiling} by ${state.warnings} written warning${state.warnings === 1 ? '' : 's'} on file. The Committee stops subtracting; it does not restore.` });
    track.push(levelOf(state.stats));
  }

  // ── Print the candle ──────────────────────────────────────────────────────
  const close = levelOf(state.stats);
  const wickScale = 6 + volatility * 15;
  let high = Math.max(...track, close) + rand(0.2, 1) * wickScale;
  let low = Math.min(...track, close) - rand(0.2, 1) * wickScale;

  // Liturgy raises the floor under the week. It does not lift the close, it
  // just stops the bleeding going lower than it otherwise would have.
  if (state.shielded) {
    low = Math.min(...track, close) - rand(0.05, 0.3) * wickScale;
    tape.push({ kind: 'ok', text: 'Drawdown floor held. The low is shallower than the week deserved.' });
  }

  const candle = {
    week: state.week, open, close, high, low, volume,
    up: close >= open,
    title: wk.title,
  };
  state.candles.push(candle);

  // ── Commit history, detect formations ─────────────────────────────────────
  for (const s of STATS) state.history[s.key].push(state.stats[s.key]);

  const patterns = state.patternsUnlocked ? detectPatterns(state.candles) : [];
  for (const p of patterns) alerts.push({ kind: 'pattern', text: `${p.name} — ${p.note}` });

  // ── Earnings ──────────────────────────────────────────────────────────────
  let report = null;
  if (wk.earnings) {
    report = buildReport(state, wk.earnings, candle);
    state.reports.push(report);
  }

  const pct = ((close - open) / open) * 100;
  const summary = {
    week: state.week, wk, candle, pct, tape, alerts, memoResult, report,
    zAfter: allZScores(state),
    maxDD: maxDrawdown(state.candles),
  };
  state.tape.push(summary);

  state.week += 1;
  if (state.week > CONFIG.totalWeeks) state.finished = true;
  return summary;
}

// ── Reporting ──────────────────────────────────────────────────────────────

function buildReport(state, period, candle) {
  const first = state.candles[0].open;
  const chg = ((candle.close - first) / first) * 100;
  const grades = STATS.map((s) => ({
    key: s.key, label: s.label, value: state.stats[s.key],
    grade: gradeFor(state.stats[s.key]),
  }));
  const gpa = (grades.reduce((a, g) => a + gradePoints(g.grade), 0) / grades.length);
  return { period, level: candle.close, chgSinceIPO: chg, grades, gpa, warnings: state.warnings };
}

function gradeFor(v) {
  if (v >= 88) return 'A';
  if (v >= 78) return 'B';
  if (v >= 66) return 'C';
  if (v >= 54) return 'D';
  return 'F';
}
const gradePoints = (g) => ({ A: 4, B: 3, C: 2, D: 1, F: 0 }[g]);

export function maxDrawdown(candles) {
  let peak = -Infinity, dd = 0;
  for (const c of candles) {
    peak = Math.max(peak, c.high);
    dd = Math.min(dd, ((c.low - peak) / peak) * 100);
  }
  return dd;
}

function detectPatterns(candles) {
  const found = [];
  for (const p of PATTERNS) {
    if (candles.length < p.window) continue;
    const w = candles.slice(-p.window);
    try { if (p.test(w)) found.push(p); } catch { /* malformed window, skip */ }
  }
  return found;
}

// ── Coverage rating, shown live in the header ──────────────────────────────

export function coverage(state) {
  const level = levelOf(state.stats);
  return TIERS.find((t) => level >= t.min);
}

// ── Ending ─────────────────────────────────────────────────────────────────

export function computeEnding(state) {
  const topKey = state.layerOrder[state.layerOrder.length - 1];
  const level = levelOf(state.stats);
  const tier = TIERS.find((t) => level >= t.min);
  const first = state.candles[0].open;
  return {
    topKey,
    ending: ENDINGS[topKey],
    tier,
    level,
    chg: ((level - first) / first) * 100,
    maxDD: maxDrawdown(state.candles),
    sharpe: sharpe(state.candles),
    warnings: state.warnings,
    pip: state.pip,
  };
}

/** Return per unit of drama. Rewards a smooth semester over a loud one. */
export function sharpe(candles) {
  if (candles.length < 2) return 0;
  const rets = candles.map((c) => ((c.close - c.open) / c.open) * 100);
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const sd = Math.sqrt(rets.reduce((a, b) => a + (b - mean) ** 2, 0) / rets.length);
  return sd < 0.01 ? 0 : mean / sd;
}
