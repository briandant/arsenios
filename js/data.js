// ── Content ────────────────────────────────────────────────────────────────
// Actions, the fifteen-week calendar, the memos, and the endings.
// This is the file to edit when you want to change what the game SAYS.

import { CONFIG } from './config.js';

// ── Classification ─────────────────────────────────────────────────────────
// The Committee sorts every use of an undergraduate's time into one of three
// bins. Compliance accrues or bleeds on every slot you fill, not just on the
// weeks a memo happens to land.

export const CLASSES = {
  authorized: {
    label: 'AUTHORIZED ACTIVITIES',
    note: 'Sanctioned by standing memorandum. Compliance accrues.',
    color: '#5fa85f',
  },
  unauthorized: {
    label: 'UNAUTHORIZED ACTIVITIES',
    note: 'Prohibited. Compliance is forfeited. He is going to do some of these anyway.',
    color: '#e2504d',
  },
  unclassified: {
    label: 'UNCLASSIFIED',
    note: 'The Committee has reviewed these and has not been able to form a position.',
    color: '#ceb888',
  },
};

// ── Actions ────────────────────────────────────────────────────────────────
// slots: time cost out of six.  energy: delta.  vol: contribution to the
// week's wick length.  cls: how the Committee has classified it.
// note: what the desk writes up when you do it.

export const ACTIONS = [
  // ── Authorized ───────────────────────────────────────────────────────────
  {
    id: 'class', name: 'Go to Class', cls: 'authorized', slots: 1, energy: -8, vol: 0.3,
    effects: { ACAD: 6, COMP: 3 },
    desc: 'HCB 103, seat 14C, which is your seat per the seating instrument on file. Take notes by hand. Nothing happens, and nothing happening is the outcome the Committee is optimizing for.',
    note: 'Attendance logged. No surprises. The desk likes no surprises.',
  },
  {
    id: 'eat', name: 'Eat Allocated Food', cls: 'authorized', slots: 1, energy: 5, vol: 0.1,
    effects: { LIQ: 7, FIT: 1, SOC: -2, COMP: 4 },
    desc: 'The tray, the rotation, the posted portion. Suwannee Room, second seating. There are no substitutions, and the Committee has asked that he stop inquiring about substitutions.',
    note: 'Nutrition procured inside the meal instrument. Cheap, compliant, joyless.',
  },
  {
    id: 'soap', name: 'Requisition Soap Allotment', cls: 'authorized', slots: 1, energy: -2, vol: 0.1,
    effects: { COMP: 9, SOC: -3 },
    desc: 'Standard Issue Compound No. 4. One bar, one signature, and one further signature confirming the first signature. He will smell exactly like the cohort, which is the entire point.',
    note: 'Full olfactory conformity. Indistinguishable from peers at close range.',
  },
  {
    id: 'laundry', name: 'Launder Uniform', cls: 'authorized', slots: 1, energy: -3, vol: 0.1,
    effects: { SOC: 5, COMP: 6 },
    desc: 'Basement machines, quarters only. Garnet and gold, fourteen pieces of institutional flair minimum, every piece inspectable. The Committee does not read the handbook aloud, but it does check.',
    note: 'Unglamorous. Consistently accretive. The street ignores it.',
  },
  {
    id: 'officehours', name: 'Office Hours', cls: 'authorized', slots: 2, energy: -7, vol: 0.2,
    effects: { ACAD: 12, COMP: 4 },
    desc: 'Halloran keeps his door open to precisely the width policy specifies, and has a laminated card confirming the width. He will learn a great deal. It will cost him the afternoon.',
    note: 'Direct management access. Expensive in hours, cheap in everything else.',
  },
  {
    id: 'assembly', name: 'Mandatory Assembly', cls: 'authorized', slots: 2, energy: -10, vol: 0.2,
    effects: { COMP: 11, SOC: -4, ACAD: 1 },
    desc: 'Union ballroom, ninety minutes, a slide deck titled OUR SHARED VALUES running to forty-one slides. Attendance is taken twice: once at the start, once at a randomized interior moment.',
    note: 'Zero economic content. Enormous compliance content. The Committee sees you.',
  },
  {
    id: 'selfassess', name: 'File Self-Assessment', cls: 'authorized', slots: 1, energy: -6, vol: 0.2,
    effects: { COMP: 8, ACAD: 3 },
    desc: 'One page on his own performance, evaluated against a rubric he is not permitted to see. Familiarity with the rubric has been found to distort the assessments.',
    note: 'He grades himself, they grade the grading. Compliance accrues either way.',
  },
  {
    id: 'gym', name: 'Wellness Initiative', cls: 'authorized', slots: 1, energy: -6, vol: 0.5,
    effects: { FIT: 9, COMP: 2 },
    desc: 'The Leach, every rack taken by someone filming himself. Participation is entirely voluntary. Non-participation is recorded, retained, and available to the Committee on request.',
    note: 'Capex on the physical plant. Depreciates immediately if unmaintained.',
  },
  {
    id: 'club', name: 'Investment Club', cls: 'authorized', slots: 2, energy: -5, vol: 0.4,
    effects: { ACAD: 4, SOC: 8, COMP: 2 },
    desc: 'Nine people pitching the same three tickers with the conviction of men who have never been wrong because they have never once been measured. He pitches a fourth.',
    note: 'Peer network expanding. Idea quality unverified.',
  },
  {
    id: 'sleep', name: 'Scheduled Recovery Interval', cls: 'authorized', slots: 1, energy: 15, vol: 0.1,
    effects: { FIT: 2, COMP: 2 },
    desc: 'Eight hours, taken Tuesday, per his assigned interval. Rest inside the interval is rest. Rest outside the interval is something else, and is logged as something else.',
    note: 'The cheapest alpha on the board and nobody takes it.',
  },
  {
    id: 'allnighter', name: 'All-Nighter', cls: 'authorized', slots: 3, energy: -26, vol: 2.2,
    effects: { ACAD: 17, FIT: -5, COMP: 3 },
    hangover: true,
    desc: 'Strozier until it closes, then the 24-hour room until it is light out. The Committee approves of this without reservation or caveat, which should tell him something and does not.',
    note: 'Pulling earnings forward from next quarter. It always comes out of next quarter.',
  },

  // ── Unauthorized ─────────────────────────────────────────────────────────
  {
    id: 'skip', name: 'Skip Class', cls: 'unauthorized', slots: 1, energy: 12, vol: 3.0,
    effects: { ACAD: -8, SOC: 4, COMP: -7 },
    desc: 'The seat sensor in 14C registers the vacancy within ninety seconds. Landis Green is seventy-four degrees, he is nineteen, and the sensor is going to have to find a way to live with that.',
    note: 'Subject absent without filing. Volatility elevated. Wick extends both directions.',
  },
  {
    id: 'chickfila', name: 'Order Unauthorized Chick-fil-A', cls: 'unauthorized', slots: 1, energy: 9, vol: 0.8,
    effects: { SOC: 9, LIQ: -7, FIT: -3, COMP: -11 },
    desc: 'Not on the posted rotation. Procured outside the meal instrument via a sophomore with a car and a markup. Worth it. Closed Sundays, which he has come to regard as a shared theological position.',
    note: 'Off-instrument procurement. Morale up, margin down, Committee notified.',
  },
  {
    id: 'discourse', name: 'Unauthorized Discourse w/ Opposite Sex', cls: 'unauthorized', slots: 1, energy: 8, vol: 1.0,
    effects: { SOC: 14, FAITH: 2, COMP: -10 },
    desc: 'Third floor of Strozier, forty minutes, about nothing in particular. No form was filed, because there is no form, though the Committee has indicated a form is coming. He has thought about it every day since.',
    note: 'Unlogged interpersonal exposure. The desk has no model for this and is fine with that.',
  },
  {
    id: 'nap', name: 'Unsanctioned Nap', cls: 'unauthorized', slots: 1, energy: 16, vol: 0.3,
    effects: { FIT: 1, COMP: -8 },
    desc: 'Ninety minutes, Wednesday, squarely outside the assigned interval. Restorative, unlogged, and in direct contravention of the Synchronized Recovery Interval memorandum.',
    note: 'Energy recovered off-schedule. Restorative. Technically an infraction.',
  },
  {
    id: 'ownsoap', name: 'Use Personal Soap', cls: 'unauthorized', slots: 1, energy: 5, vol: 0.4,
    effects: { FAITH: 3, SOC: 4, COMP: -15 },
    desc: 'His own bar, from home, the one his mother packed. He smells like himself for one day. The Committee regards olfactory individuation as the single most serious violation available to an undergraduate.',
    note: 'Deliberate variance reintroduced. Maximum compliance penalty on the board.',
  },
  {
    id: 'uniformdev', name: 'Deviate from Uniform', cls: 'unauthorized', slots: 1, energy: 4, vol: 0.6,
    effects: { SOC: 8, COMP: -12 },
    desc: 'One shirt that is neither garnet nor gold and was not approved. Eleven pieces of flair, three short of the posted minimum. He was stopped twice and asked whether everything was alright.',
    note: 'Visual nonconformity. Reads as confidence to peers, as a data point to the Committee.',
  },
  {
    id: 'party', name: 'Party', cls: 'unauthorized', slots: 2, energy: -13, vol: 2.5,
    effects: { SOC: 13, ACAD: -3, COMP: -9, LIQ: -5 },
    desc: 'A house off Ocala with a garnet flag over the window and a speaker somebody’s brother left behind. Undocumented, unchaperoned, and attended by roughly forty people the Committee cannot account for.',
    note: 'Large single-period social accretion. Historically followed by a gap down.',
  },

  // ── Unclassified ─────────────────────────────────────────────────────────
  {
    id: 'liturgy', name: 'Divine Liturgy', cls: 'unclassified', slots: 2, energy: 6, vol: 0.1,
    effects: { FAITH: 13, SOC: 3 },
    shield: true,
    desc: 'Sunday morning, two hours, no chairs, no phone, coffee hour after. The Committee has reviewed this activity three separate times and has not been able to form a position on it. It is the only such case on record.',
    note: 'Downside protection engaged. Drawdown floor raised for the period.',
  },
  {
    id: 'callmom', name: 'Call Mom', cls: 'unclassified', slots: 1, energy: 8, vol: 0.1,
    effects: { FAITH: 4, SOC: 2 },
    desc: 'Forty minutes, of which thirty-five are her. She asks whether he is eating and he says yes and it is technically true. Unlogged, unclassified, uncorrelated to everything else on the board.',
    note: 'Small, positive, and the only line here with no counterparty risk.',
  },
  {
    id: 'book', name: 'Read the Candlestick Book', cls: 'unclassified', slots: 2, energy: -5, vol: 0.2,
    effects: { ACAD: 5, FAITH: 1 },
    unlocksPatterns: true,
    desc: 'Nison, dog-eared, the first forty pages read four times. Nobody assigned it and nobody is grading it. He is doing it because he wants to, which the Committee has found difficult to process.',
    note: 'Analytical coverage improving. Formations will now be labeled on the tape.',
  },
  {
    id: 'ramen', name: 'Ramen Night', cls: 'unclassified', slots: 1, energy: 2, vol: 0.3,
    effects: { LIQ: 11, FIT: -3, SOC: 3 },
    desc: 'Eleven cents a serving if you buy the case, and he bought the case. Procured outside the meal instrument but too cheap for the Committee to object to on principle.',
    note: 'Margin expansion via cost discipline. Nutritional footnote omitted.',
  },
  {
    id: 'coffee', name: 'Coffee', cls: 'unclassified', slots: 1, energy: 11, vol: 0.6,
    effects: { LIQ: -4 },
    desc: 'Strozier, third floor, the good machine, the one that still takes the old card. Borrowed energy. It carries interest and the interest comes due Thursday.',
    note: 'Borrowed energy. Carries interest.',
  },
];

export const ACTION_MAP = Object.fromEntries(ACTIONS.map((a) => [a.id, a]));

// ── Faculty ────────────────────────────────────────────────────────────────

export const FACULTY = {
  halloran: { name: 'DR. HALLORAN',  course: 'ACG 2021 · FINANCIAL ACCOUNTING' },
  vance:    { name: 'PROF. VANCE',   course: 'ECO 2023 · PRINCIPLES OF MICRO' },
  reinhart: { name: 'PROF. REINHART',course: 'FIN 3403 · FINANCIAL MANAGEMENT' },
  prusak:   { name: 'DEAN PRUSAK',   course: 'OFFICE OF STUDENT LIFE' },
  okonkwo:  { name: 'DR. OKONKWO',   course: 'STA 2023 · BUSINESS STATISTICS' },
};

// ── The fifteen weeks ──────────────────────────────────────────────────────
// memo.requires names the action that counts as compliance for that week.

export const WEEKS = [
  {
    n: 1,
    title: 'THE LISTING',
    sub: 'MOVE-IN DAY · OPENING BELL',
    brief:
      `Two suitcases and a milk crate of books up three flights of a dorm with no elevator. His mother ` +
      `refolds one shirt that did not need refolding, and then there is nothing left to do with her hands.\n\n` +
      `He was privately held this morning. By tonight he trades. Supervisory authority passes to the ` +
      `Faculty Operating Committee of the ${CONFIG.college}, and the opening print is arbitrary because ` +
      `it has to be — there is no history yet, so there is no mean, so there is nothing to revert to.\n\n` +
      `Every candle after this one is his.`,
    handoff: true,
  },
  {
    n: 2,
    title: 'SYLLABUS WEEK',
    sub: 'LOW VOLUME · EVERYTHING CHEAP',
    brief:
      `Nothing is due. Nothing is graded. Every position on the board is available at a discount and ` +
      `will not be this cheap again. The Committee, sensing calm, issues its first policy.`,
    memo: {
      id: '002', from: 'halloran', title: 'STANDARDIZED HYGIENE PROTOCOL',
      body:
        `Effective immediately, all personnel will use Standard Issue Compound No. 4, available at the ` +
        `Assistant Dean's window during the posted forty minutes. Personal soap introduces olfactory ` +
        `variance into shared learning environments. Variance is noise. We are removing noise. ` +
        `Requisition weekly. We are one desk.`,
      requires: 'soap',
    },
  },
  {
    n: 3,
    title: 'CLUB FAIR',
    sub: 'STA 2023 · THE INDICATOR UNLOCKS',
    brief:
      `Tables down both sides of the Union. He signs up for the investment club and the Orthodox ` +
      `Christian Fellowship with the same pen.\n\n` +
      `Then, Wednesday, Dr. Okonkwo puts a distribution on the board and writes underneath it: ` +
      `z = (x − μ) / σ. How far a thing is from its own average, measured in its own volatility. ` +
      `She says the useful part out loud — that anything more than two away is not wrong, just stretched, ` +
      `and stretched things tend to come back. He writes it down and underlines it twice.\n\n` +
      `Z-SCORES ARE NOW LIVE ON YOUR HUD.`,
    unlocksZ: true,
    memo: {
      id: '003', from: 'vance', title: 'ATTENDANCE BIOMETRICS',
      body:
        `Seat sensors have been installed in HCB 103. Presence is now measured continuously rather than ` +
        `sampled at the top of the hour. Occupancy below the seat-contact threshold will register as absence ` +
        `regardless of whether you are in the room. Please do not lean.`,
      requires: 'class',
    },
  },
  {
    n: 4,
    title: 'FIRST PROBLEM SET',
    sub: 'REALITY PRICES IN',
    brief:
      `Halloran's first problem set comes back with a number on it. The number is lower than the number ` +
      `he had in his head, which is the standard opening trade of every freshman year ever recorded.`,
    memo: {
      id: '004', from: 'prusak', title: 'INSTITUTIONAL FLAIR',
      body:
        `Students will display no fewer than fourteen approved garnet-and-gold institutional accessories ` +
        `at all times, including in transit and at meals. Fourteen is the minimum. Some students choose to ` +
        `express more than the minimum. We notice which ones.`,
      requires: 'laundry',
    },
  },
  {
    n: 5,
    title: 'Q1 EARNINGS',
    sub: 'MIDTERMS · FIRST REPORTED QUARTER',
    brief:
      `Three exams in four days. The first hard print of the year, and the first one anybody outside ` +
      `this room will see. The desk publishes a full report card at the close.`,
    earnings: 'Q1',
  },
  {
    n: 6,
    title: 'THE SLUMP',
    sub: 'SECTOR-WIDE SELLOFF',
    brief:
      `Everyone on the floor is flat and nobody can name why. Midterms are over and there is nothing ` +
      `immediately due, which turns out to be worse. Broad drawdown. Not personal. Still counts.`,
    marketShock: { all: -4, note: 'POST-MIDTERM MALAISE — sector-wide, no idiosyncratic driver' },
    memo: {
      id: '005', from: 'halloran', title: 'COVER SHEETS',
      body:
        `Problem sets submitted without the new cover sheet will be returned unread. The new cover sheet ` +
        `is identical in every respect to the old cover sheet. It is the new one.`,
      requires: 'officehours',
    },
  },
  {
    n: 7,
    title: 'FALL BREAK',
    sub: 'HOMESICKNESS · FIRST REAL DRAWDOWN',
    brief:
      `Four days. Half the floor drives home. He is eight hours from home and the math does not work, ` +
      `so he stays. ${CONFIG.town} in the third week of October is empty and gold and very quiet.\n\n` +
      `This is the week the year stops being an adventure and starts being a life. Everyone's chart ` +
      `has this week on it somewhere.`,
    marketShock: { SOC: -7, FAITH: 2, note: 'HOMESICKNESS — social component gaps down on thin volume' },
  },
  {
    n: 8,
    title: 'THE PR ATTEMPT',
    sub: 'FITNESS · CROWDED POSITION RISK',
    brief:
      `He has been in the gym enough weeks to want a number out of it. Whether he gets the number ` +
      `depends entirely on whether the position is crowded. Check the Z.`,
    prAttempt: true,
    memo: {
      id: '006', from: 'prusak', title: 'VOLUNTARY MANDATORY FITNESS INITIATIVE',
      body:
        `Participation in the Committee's wellness programming is entirely voluntary. Non-participation ` +
        `will be recorded and retained.`,
      requires: 'gym',
    },
  },
  {
    n: 9,
    title: 'THE GRIND',
    sub: 'LOW VOLUME · NARROW RANGE',
    brief:
      `Nothing to report. The middle of a semester is a flat tape and a lot of Tuesdays. Weeks like ` +
      `this decide more than the loud ones do.`,
    memo: {
      id: '007', from: 'reinhart', title: 'SYNCHRONIZED RECOVERY INTERVAL',
      body:
        `Rest is now scheduled. The Committee has determined that unstructured rest produces inconsistent ` +
        `outcomes across the cohort. Your interval is Tuesday. Resting outside your interval is not rest ` +
        `and will not be credited as such.`,
      requires: 'sleep',
    },
  },
  {
    n: 10,
    title: 'Q2 EARNINGS',
    sub: 'SECOND MIDTERMS · GUIDANCE REVISED',
    brief:
      `Round two. The desk revises its full-year guidance on the back of this print, and revised guidance ` +
      `is much harder to walk back than initial guidance.`,
    earnings: 'Q2',
  },
  {
    n: 11,
    title: 'RECRUITING',
    sub: 'SELL-SIDE INITIATES COVERAGE',
    brief:
      `A career fair in the Union ballroom. Nine banks, four insurers, and a table for a company that ` +
      `will not say what it does. He wears the one blazer. Outside analysts are now looking at the chart ` +
      `you have been building, which is a different feeling than building it.`,
    recruiting: true,
    memo: {
      id: '008', from: 'vance', title: 'ENTHUSIASM STANDARDS',
      body:
        `Several of you are participating at technically acceptable levels. Technically acceptable is a ` +
        `floor. It is not a destination. The Committee is able to distinguish between compliance and belief ` +
        `and has begun tracking both separately.`,
      requires: 'club',
    },
  },
  {
    n: 12,
    title: 'THE NATIVITY FAST',
    sub: 'NOV 15 · FORTY DAYS',
    brief:
      `The fast starts the fifteenth and runs to Christmas. Forty days. He is a convert, so this is his ` +
      `first one where he actually knows what he is agreeing to, which makes agreeing to it a different ` +
      `act than it was last year.\n\n` +
      `It is a bad trade on every metric the desk tracks. Energy down, fitness down, and the dining hall ` +
      `is openly hostile to the whole project. Faith reprices hard for the rest of the semester. ` +
      `Nobody on the street is modeling this.`,
    fastBegins: true,
  },
  {
    n: 13,
    title: 'THANKSGIVING',
    sub: 'FORCED MEAN REVERSION',
    brief:
      `He goes home. He does not get a choice and neither do you — this week the position unwinds toward ` +
      `its average whether or not that is what you wanted. His mother has opinions about how he looks. ` +
      `Some of them are correct.`,
    forcedReversion: true,
    memo: {
      id: '009', from: 'halloran', title: 'UNIFORM STANDARDS, REVISION 4',
      body:
        `Revision 3 has been withdrawn. Personnel who complied with Revision 3 are now out of compliance. ` +
        `This is not retroactive, except in the cases where it is. A list of those cases is being compiled.`,
      requires: 'laundry',
    },
  },
  {
    n: 14,
    title: 'DEAD WEEK',
    sub: 'VOLUME DRIES UP · DOJI CITY',
    brief:
      `No classes, everything due. The library is full at four in the morning and silent in a way that ` +
      `is not restful. The tape barely moves and every candle is a cross.`,
    memo: {
      id: '010', from: 'reinhart', title: 'WEEKLY PERSONAL PERFORMANCE SUMMARY',
      body:
        `Beginning this week each of you will submit a one-page summary of your own performance for the ` +
        `term. It will be evaluated against a rubric. You will not be shown the rubric — familiarity with ` +
        `the rubric has been found to distort the summaries.`,
      requires: 'officehours',
    },
  },
  {
    n: 15,
    title: 'FINALS',
    sub: 'YEAR-END CLOSE · THE PRINT THAT COUNTS',
    brief:
      `Five exams. Then the dorm empties in about four hours and he drives home with the milk crate of ` +
      `books in the passenger seat, one semester heavier.\n\n` +
      `Whatever layer is on top of your chart when the bell rings is the one he takes with him.`,
    earnings: 'FY',
    final: true,
  },
];

// ── Candlestick patterns ───────────────────────────────────────────────────
// Only labeled on the tape once he has actually read the book.

export const PATTERNS = [
  {
    id: 'doji', name: 'DOJI', window: 1,
    test: ([c]) => Math.abs(c.close - c.open) < (c.high - c.low) * 0.1 && c.high - c.low > 1,
    note: 'Indecision. The week happened but declined to say anything about itself.',
  },
  {
    id: 'marubozu', name: 'MARUBOZU', window: 1,
    test: ([c]) => c.close > c.open && (c.high - c.low) > 0 &&
      (c.close - c.open) / (c.high - c.low) > 0.9,
    note: 'Conviction. Opened at the low, closed at the high, never looked up from the desk.',
  },
  {
    id: 'hammer', name: 'HAMMER', window: 1,
    test: ([c]) => {
      const body = Math.abs(c.close - c.open);
      const lower = Math.min(c.open, c.close) - c.low;
      return body > 0 && lower > body * 2 && (c.high - Math.max(c.open, c.close)) < body;
    },
    note: 'Sold off hard intraweek and closed back near the top. Bad Tuesday, salvaged Friday.',
  },
  {
    id: 'engulfing', name: 'BULLISH ENGULFING', window: 2,
    test: ([p, c]) => p.close < p.open && c.close > c.open &&
      c.close > p.open && c.open < p.close,
    note: 'This week completely swallowed last week. Reversal signal, if you believe in those.',
  },
  {
    id: 'soldiers', name: 'THREE WHITE SOLDIERS', window: 3,
    test: (w) => w.every((c) => c.close > c.open) &&
      w[1].close > w[0].close && w[2].close > w[1].close,
    note: 'Three consecutive up weeks with rising closes. Textbook. Genuinely rare in a freshman.',
  },
  {
    id: 'evenstar', name: 'EVENING STAR', window: 3,
    test: (w) => w[0].close > w[0].open &&
      Math.abs(w[1].close - w[1].open) < Math.abs(w[0].close - w[0].open) * 0.4 &&
      w[2].close < w[2].open && w[2].close < w[0].close,
    note: 'Up, hesitation, down. The classic shape of a very good week followed by consequences.',
  },
  {
    id: 'crows', name: 'THREE BLACK CROWS', window: 3,
    test: (w) => w.every((c) => c.close < c.open) &&
      w[1].close < w[0].close && w[2].close < w[1].close,
    note: 'Three down weeks in a row, each closing lower. The desk is obligated to mention this.',
  },
];

// ── Endings ────────────────────────────────────────────────────────────────
// Which one you get = whichever component layer sits on top at the final bell.
// How it reads = the valuation tier of the closing print.

export const TIERS = [
  { min: 5400, rating: 'STRONG BUY', line: 'Closing print in the top decile of the cohort. The desk is raising coverage.' },
  { min: 4650, rating: 'BUY',        line: 'Solid full-year close. Guidance met. Nothing to apologize for.' },
  { min: 3800, rating: 'HOLD',       line: 'In line with the opening print. A semester happened. He survived it.' },
  { min: 3050, rating: 'UNDERWEIGHT',line: 'Below the opening print. Recoverable, but the spring will be work.' },
  { min: 0,    rating: 'DELISTED',   line: 'The Committee has scheduled a meeting and has not said what about.' },
];

export const ENDINGS = {
  FAITH: {
    title: 'THE ONE THAT MATTERED',
    body:
      `He drives home with the Nison book in the passenger seat and the prayer rope in the cupholder, ` +
      `and if you made him rank them he would tell you the truth about which one he would keep.\n\n` +
      `He kept the fast. All forty days, badly, the way everyone keeps their first one. He was in a pew ` +
      `at 8 a.m. on Sundays in a town where nobody was making him go and nobody would have known.\n\n` +
      `The desk cannot model this line. It has tried. It shows up as an unexplained floor under every ` +
      `drawdown he took all semester — the number just stops falling at a certain point and the model ` +
      `has no variable for why. Four years of this and he will be an analyst who knows the difference ` +
      `between what a thing is worth and what it is priced at.`,
  },
  ACAD: {
    title: 'THE ANALYST',
    body:
      `Dean's list. The Nison book is annotated to the back cover now and there are two more behind it.\n\n` +
      `Okonkwo wrote him a recommendation without being asked twice. Somewhere in a Charlotte office a ` +
      `summer analyst slot has his name pencilled next to it, and he does not know that yet, and the not ` +
      `knowing is the best part of the whole year.\n\n` +
      `He can read a chart now in the way he wanted to be able to when he got here — not the shapes, ` +
      `which anyone can memorize, but the thing underneath the shapes. Watch the other lines though. ` +
      `A single component carrying an entire index is a concentration risk and he knows the term.`,
  },
  FIT: {
    title: 'THE COMPOUNDING',
    body:
      `Up thirty pounds on the bar since August and he is the only person on the third floor who has ` +
      `been awake before seven every day since Labor Day.\n\n` +
      `It started as a way to have somewhere to be at 6 a.m. and turned into the load-bearing wall of ` +
      `the entire semester — the thing that held when the academic line was gapping down and he had not ` +
      `called home in nine days.\n\n` +
      `The GPA is what it is. The habit is the asset, and it is the only line on this chart that ` +
      `compounds without him thinking about it. Not the worst thing to be true at nineteen.`,
  },
  SOC: {
    title: 'THE NETWORK',
    body:
      `He knows everybody. Third floor, investment club, coffee hour, the guys from the 6 a.m. rack — ` +
      `he cannot cross the Union in under twenty minutes and he has stopped trying.\n\n` +
      `In this industry that is not a soft skill, it is the actual job, and he built more of it in one ` +
      `semester than most people build in four. Three of these people will matter enormously to him in ` +
      `ways none of you can see from here.\n\n` +
      `The other lines will need attention in the spring. But of all the things to have too much of at ` +
      `nineteen, this is the one to have too much of.`,
  },
  LIQ: {
    title: 'RUNWAY',
    body:
      `He ends the semester up. Actually up, in dollars, which almost nobody does.\n\n` +
      `Bought the case of ramen. Never bought the textbook. Found the machines that take quarters and ` +
      `the ones that lie about taking quarters. He has a brokerage account with real money in it and a ` +
      `spreadsheet he built himself that is honestly better than it needs to be.\n\n` +
      `The discipline is real and it is rarer than the GPA. Just — the point of runway is that you ` +
      `eventually spend it on something. Nobody ever got anywhere by having the longest runway.`,
  },
  COMP: {
    title: 'HE BECAME THE MEMO',
    body:
      `Perfect compliance. Fourteen pieces of institutional flair minimum, most weeks sixteen. Standard ` +
      `Issue Compound No. 4 requisitioned every single week without one missed signature.\n\n` +
      `He smells exactly like everyone else. This was the stated goal and he hit it.\n\n` +
      `The Committee has recognized him at a ceremony. Dean Prusak used his name and got it right. ` +
      `There is a laminated certificate and a garnet lanyard and a line in a newsletter nobody reads.\n\n` +
      `Somewhere under all of it is a kid who came here because he liked the way charts stack up, and ` +
      `who spent a whole semester learning to render behind everything else on the page.\n\n` +
      `${CONFIG.supervisor} would like it on the record that this is the worst possible outcome and that ` +
      `he can bring any layer he wants to the front. He always could. That was the entire lesson.`,
  },
};
