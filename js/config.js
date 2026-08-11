// ── Personalization ────────────────────────────────────────────────────────
// Everything human-editable lives here. Change a string, reload, done.

export const CONFIG = {
  subject:        'ARSENIOS MONDA',
  subjectShort:   'MONDA, A.',
  firstName:      'Arsenios',
  ticker:         'ARSN',
  entity:         'ARSENIOS MONDA, INC.',
  indexName:      'THE Z INDEX',
  indexTicker:    'ZDX',
  school:         'FLORIDA STATE UNIVERSITY',
  schoolShort:    'FSU',
  college:        'COLLEGE OF BUSINESS',
  town:           'TALLAHASSEE',
  formerEmployer: 'THE FIRM',
  supervisor:     'B. DANT',
  supervisorRole: 'OUTGOING SUPERVISOR OF RECORD',
  totalWeeks:     15,
  slotsPerWeek:   6,
  startEnergy:    72,
};

// The six tracked components of the index. Order here is the DEFAULT z-order,
// bottom of the list = rendered in front. The player reorders these in game,
// and whichever sits on top at Week 15 decides the ending.
//
// decay: what the component gives back every week on its own. Nothing here
// holds its level unattended, which is the whole reason six slots is not
// enough slots. Compliance decays fastest — the Committee's standards ratchet,
// so last week's compliance is not this week's compliance.
export const STATS = [
  { key: 'COMP',  label: 'COMPLIANCE', color: '#e2504d', start: 30, decay: 6.0 },
  { key: 'LIQ',   label: 'LIQUIDITY',  color: '#5fa85f', start: 55, decay: 1.4 },
  { key: 'SOC',   label: 'SOCIAL',     color: '#a86fc4', start: 42, decay: 2.9 },
  { key: 'FIT',   label: 'FITNESS',    color: '#2eab9c', start: 48, decay: 3.1 },
  { key: 'FAITH', label: 'FAITH',      color: '#ceb888', start: 50, decay: 2.6 },
  { key: 'ACAD',  label: 'ACADEMICS',  color: '#4fa8e0', start: 52, decay: 3.0 },
];

// Every written warning permanently lowers the ceiling on COMPLIANCE. The
// Committee does not restore standing, it only stops subtracting from it —
// so defiance forfeits the compliance line rather than merely costing points.
export const MEMO_PENALTY = 14;          // COMPLIANCE lost per ignored memorandum
export const WARNING_CEILING_COST = 9;
export const COMP_CEILING_FLOOR = 20;

// Gains get harder the higher a component already is. Below ~38 you buy more
// than face value; at 80 you buy a third of it. Keeps anything from pegging.
export const softGain = (v) => Math.max(0.08, 1.6 * (1 - v / 100));

export const STAT_MAP = Object.fromEntries(STATS.map((s) => [s.key, s]));

// Index level = mean of all six components x LEVEL_SCALE.
// Six stats at 50 => an opening print right around 4,000.
export const LEVEL_SCALE = 80;

// A component is "statistically stretched" past this many standard deviations.
// Dr. Okonkwo would like you to know that +/-2 is a convention, not a law.
export const Z_THRESHOLD = 2.0;

// Z-scores need at least this much of the subject's own history to mean anything.
export const Z_MIN_HISTORY = 3;

// Rolling window for the mean and standard deviation.
export const Z_WINDOW = 8;
