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
    note: 'Prohibited by instrument. Compliance is forfeited. He is going to do some of these anyway.',
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
  // The correct procedure. Most of these are the sanctioned counterpart to
  // something in the unauthorized column — the Committee does not forbid
  // eating or dressing or noticing a tree, it specifies them.
  {
    id: 'class', name: 'Attend Instruction, Seat 14C', cls: 'authorized', slots: 1, energy: -8, vol: 0.3,
    effects: { ACAD: 6, COMP: 3 },
    desc: 'HCB 103, seat 14C per the seating instrument on file. Continuous seat contact for the full fifty minutes, notes in blue or black only. Nothing happens, and nothing happening is the outcome the Committee has been optimizing toward since before he arrived.',
    note: 'Attendance logged. No surprises. The desk likes no surprises.',
  },
  {
    id: 'soap', name: 'Requisition Soap Allotment', cls: 'authorized', slots: 1, energy: -2, vol: 0.1,
    effects: { COMP: 9, SOC: -3 },
    desc: 'Standard Issue Compound No. 4. One bar, one signature, and one further signature confirming the first signature. He will smell exactly like the cohort, which is not a side effect of the policy but the entire specification.',
    note: 'Full olfactory conformity. Indistinguishable from peers at close range.',
  },
  {
    id: 'uniform', name: 'Dress Per the Uniform Instrument', cls: 'authorized', slots: 1, energy: -3, vol: 0.1,
    effects: { SOC: 5, COMP: 6 },
    desc: 'Second button before the top button. Double bow on both shoes, tightened to a two-finger gap. Fourteen pieces of institutional flair minimum, every piece inspectable. The instrument runs to nine pages and he has read six of them.',
    note: 'Unglamorous. Consistently accretive. The street ignores it entirely.',
  },
  {
    id: 'haircut', name: 'Mandatory Hair Cut, Size 5 Clip', cls: 'authorized', slots: 1, energy: -3, vol: 0.2,
    effects: { COMP: 8, SOC: -2 },
    desc: 'Third chair, standard size 5 clip, eleven minutes, no requests accepted at the chair. He comes out looking like the four personnel who went before him, which the Committee would like on the record as the intended outcome.',
    note: 'Silhouette standardized. Variance removed at the scalp.',
  },
  {
    id: 'meatbox', name: 'Consume Company-Approved Meat Box', cls: 'authorized', slots: 1, energy: 5, vol: 0.1,
    effects: { LIQ: 8, FIT: 2, SOC: -2, COMP: 4 },
    desc: 'The box, the portion, the posted macros, second seating. There are no substitutions, and the Committee has asked that he stop submitting the substitution form, which does not exist and never did.',
    note: 'Nutrition procured inside the instrument. Cheap, compliant, joyless.',
  },
  {
    id: 'officehours', name: 'Office Hours, Door at Policy Width', cls: 'authorized', slots: 2, energy: -7, vol: 0.2,
    effects: { ACAD: 12, COMP: 4 },
    desc: 'Halloran keeps his door open to precisely the width policy specifies, and has a laminated card confirming the width. He will learn a great deal. It will cost him the afternoon.',
    note: 'Direct management access. Expensive in hours, cheap in everything else.',
  },
  {
    id: 'assembly', name: 'Mandatory Assembly', cls: 'authorized', slots: 2, energy: -10, vol: 0.2,
    effects: { COMP: 11, SOC: -4, ACAD: 1 },
    desc: 'Union ballroom, ninety minutes, a slide deck titled OUR SHARED VALUES running to forty-one slides. Attendance is taken twice: once at the top, and once at a randomized interior moment.',
    note: 'Zero economic content. Enormous compliance content. The Committee sees you.',
  },
  {
    id: 'paper', name: 'Draft the Assigned Topic in Roboto 11', cls: 'authorized', slots: 2, energy: -9, vol: 0.3,
    effects: { ACAD: 8, COMP: 5 },
    desc: 'Roboto 11, spacing at 1.15, on the topic he was issued. Evaluated against a rubric he is not permitted to see — familiarity with the rubric has been found to distort the drafts.',
    note: 'Elegant instrument. He writes the paper, they grade the formatting.',
  },
  {
    id: 'ta85', name: 'Log Skills to the TA-85', cls: 'authorized', slots: 1, energy: -5, vol: 0.2,
    effects: { ACAD: 4, COMP: 7 },
    desc: 'Every competency acquired this week, entered on the TA-85 in the order acquired, no blank fields. The terminal accepts skills. It has no field for who helped him get one, and no field for how it felt.',
    note: 'Self-reported competency, machine-readable. The only kind that counts.',
  },
  {
    id: 'nature', name: 'Nature Observation, Fifteen Minutes', cls: 'authorized', slots: 1, energy: 4, vol: 0.1,
    effects: { FAITH: 3, COMP: 4, FIT: 1 },
    desc: 'The allotted quarter hour on Landis Green, timed from the bench. Wonder is authorized between 4:15 and 4:30. At 4:30 he is expected to stand up, and he stands up.',
    note: 'Authorized awe. It counts for something. It does not count for much.',
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
    id: 'sleep', name: 'Synchronized Recovery Interval', cls: 'authorized', slots: 1, energy: 15, vol: 0.1,
    effects: { FIT: 2, COMP: 2 },
    desc: 'Eight hours, taken Tuesday, per his assigned interval. Rest inside the interval is rest. Rest outside the interval is something else, and is logged as something else.',
    note: 'The cheapest alpha on the board and nobody takes it.',
  },
  {
    id: 'allnighter', name: 'Extended Study Interval, Unbroken', cls: 'authorized', slots: 3, energy: -26, vol: 2.2,
    effects: { ACAD: 17, FIT: -5, COMP: 3 },
    hangover: true,
    desc: 'Strozier until it closes, then the 24-hour room until it is light out. The Committee approves of this without reservation or caveat, which should tell him something and does not.',
    note: 'Pulling earnings forward from next quarter. It always comes out of next quarter.',
  },

  // ── Unauthorized ─────────────────────────────────────────────────────────
  // Every one of these is smaller than a shoelace and every one of them is
  // filed. That is the finding. The compliance cost scales with how much of
  // himself the deviation required, not with any harm anybody can name.
  {
    id: 'singlebow', name: 'Tie Shoes With a Single Bow', cls: 'unauthorized', slots: 1, energy: 3, vol: 0.4,
    effects: { FAITH: 4, SOC: 2, COMP: -8 },
    desc: 'One loop instead of two, on the left shoe only, at 7:40 in the morning because he was thinking about something else. The instrument specifies double. He was stopped in the stairwell and asked whether everything was alright.',
    note: 'Footwear nonconformity, single instance. Logged at the stairwell.',
  },
  {
    id: 'topbutton', name: 'Button the Top Button First', cls: 'unauthorized', slots: 1, energy: 2, vol: 0.4,
    effects: { FAITH: 4, SOC: 1, COMP: -8 },
    desc: 'The company shirt, buttoned from the collar downward instead of from the second button up. Same shirt. Same buttons. Same boy inside it. The sequence is the part that was specified.',
    note: 'Sequence violation. Garment identical. The Committee is not interested in the garment.',
  },
  {
    id: 'ramenraw', name: 'Cook Ramen Without the Packet', cls: 'unauthorized', slots: 1, energy: 2, vol: 0.5,
    effects: { LIQ: 11, FIT: -3, SOC: 3, COMP: -5 },
    desc: 'Eleven cents a serving if you buy the case, and he bought the case. He leaves out the company-approved vitamins and minerals packet because it tastes like a filing cabinet. Nutritionally this is a downgrade and he is aware it is a downgrade.',
    note: 'Off-instrument preparation. Margin intact, micronutrients not.',
  },
  {
    id: 'glp1', name: 'Take a GLP-1 With Oatmeal', cls: 'unauthorized', slots: 1, energy: 2, vol: 0.8,
    effects: { FIT: 6, LIQ: -4, COMP: -11 },
    desc: 'Prescribed, filled, and taken at 6 a.m. with oatmeal instead of alongside the company-approved meat box as the metabolic protocol directs. The protocol cites no study. He has looked for the study.',
    note: 'Deviation from the metabolic instrument. Outcome improved, filing worsened.',
  },
  {
    id: 'arial', name: 'Draft the Paper in Arial', cls: 'unauthorized', slots: 2, energy: -7, vol: 0.9,
    effects: { ACAD: 6, SOC: 2, COMP: -13 },
    desc: 'Eleven pages, argued properly, cited properly, set in Arial. The Committee has standardized on Roboto and has issued no reasoning for it, and he has now read that memorandum four times looking for the reasoning.',
    note: 'Content compliant. Typeface noncompliant. Only one of those gets graded.',
  },
  {
    id: 'lendsoap', name: 'Lend the Soap Allotment to an Infidel', cls: 'unauthorized', slots: 1, energy: 4, vol: 0.5,
    effects: { FAITH: 4, SOC: 6, COMP: -15 },
    desc: 'A boy on the third floor who is not enrolled, not personnel, and not carried anywhere on the roster. He needed a bar. Arsenios had a bar. The Committee has a word for the boy and the word is in the handbook.',
    note: 'Allotment diverted off-roster. Largest compliance penalty on the board.',
  },
  {
    id: 'scissors', name: 'Request Scissors at the Hair Cut', cls: 'unauthorized', slots: 1, energy: 5, vol: 1.0,
    effects: { SOC: 7, FAITH: 3, COMP: -14 },
    desc: 'He asks, from the chair, politely, whether it could be done with scissors this once instead of the standard size 5 clip. The barber does not look up. Two personnel in the waiting row do.',
    note: 'Verbal request on the record. Nothing was cut differently. Everything was noted.',
  },
  {
    id: 'congratulate', name: 'Congratulate a Friend on a TA-85 Skill', cls: 'unauthorized', slots: 1, energy: 8, vol: 0.8,
    effects: { SOC: 14, FAITH: 3, COMP: -10 },
    desc: 'The TA-85 posts what everybody logged. He sees a name he knows beside a competency that was genuinely hard, and he says out loud that it is good work. The terminal has no field for that, and the Committee regards unlogged affirmation as an inefficiency.',
    note: 'Unlogged interpersonal exposure. Largest social print available.',
  },
  {
    id: 'owntopic', name: 'Reflect on Choosing His Own Topic', cls: 'unauthorized', slots: 1, energy: 6, vol: 0.7,
    effects: { FAITH: 8, ACAD: 3, COMP: -12 },
    desc: 'Four minutes on the walk back, spent wondering what it might be like to choose his own paper topic one day. He did not choose one. He did not write anything down. He thought about it, and the thinking is the part that is prohibited.',
    note: 'No action taken. Interior deviation only. The Committee has begun tracking interiors.',
  },
  {
    id: 'overnature', name: 'Nature Beyond the Allotment', cls: 'unauthorized', slots: 1, energy: 9, vol: 0.6,
    effects: { FAITH: 10, FIT: 2, COMP: -10 },
    desc: 'He stays on the bench past 4:30. The light is doing something on the brick that there is no form for. Twenty-two unauthorized minutes, which is longer than the fifteen he was allotted, which is the entire finding.',
    note: 'Awe accrued outside the window. The desk has no model for it and is at peace with that.',
  },
  {
    id: 'butterfly', name: 'Follow a Butterfly Past Seven Seconds', cls: 'unauthorized', slots: 1, energy: 11, vol: 0.5,
    effects: { FAITH: 12, SOC: -1, COMP: -9 },
    desc: 'It comes past the bench and he watches it for nineteen seconds. Seven is the threshold in the ocular-attention memorandum and he knows the number. He counted. Then he kept going.',
    note: 'Sustained attention to an unassigned object. Largest faith print on the board.',
  },

  // ── Unclassified ─────────────────────────────────────────────────────────
  // Reviewed, repeatedly, and never successfully sorted. These are the lines
  // with no counterparty — nobody is grading them and nobody made him do them.
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
    id: 'dadtext', name: 'Answer Dad’s Text', cls: 'unclassified', slots: 1, energy: 6, vol: 0.1,
    effects: { FAITH: 3, SOC: 3 },
    desc: 'Three messages over eleven minutes, because he scrolls and types with the same pointer finger and will not be told anything about it. One of the three is a thumbs up with no context. Arsenios writes back properly, in full sentences, and does not mention the finger.',
    note: 'Nobody made him write back in full sentences. He did that on his own.',
  },
  {
    id: 'book', name: 'Read the Candlestick Book', cls: 'unclassified', slots: 2, energy: -5, vol: 0.2,
    effects: { ACAD: 5, FAITH: 1 },
    unlocksPatterns: true,
    desc: 'Nison, dog-eared, the first forty pages read four times. Nobody assigned it, nobody is grading it, and it is not set in Roboto. He is doing it because he wants to, which the Committee has found difficult to process.',
    note: 'Analytical coverage improving. Formations will now be labeled on the tape.',
  },
  {
    id: 'coffee', name: 'Coffee', cls: 'unclassified', slots: 1, energy: 11, vol: 0.6,
    effects: { LIQ: -4 },
    desc: 'Strozier, third floor, the good machine, the one that still takes the old card. Borrowed energy. It carries interest and the interest comes due Thursday.',
    note: 'Borrowed energy. Carries interest.',
  },
];

export const ACTION_MAP = Object.fromEntries(ACTIONS.map((a) => [a.id, a]));

// ── The desk ───────────────────────────────────────────────────────────────
// Five analysts cover $ARSN and no two of them agree about anything. Fill a
// slot and one of them says something about it. WHO talks is decided in
// desk.js by who cares most about what you just did; WHAT they say is all
// down here, which means this stays the only file you edit to change a joke.
//
//   seat       how the silhouette is drawn — hair, prop, vest, phosphor tone
//   affinity   how much this analyst cares about each classification, 0–2
//   on         bespoke lines for one specific action. Always beats a bucket.
//   lines      the buckets. oversold/stretched/required/tired only fire when
//              that mechanic is actually live this week. `any` is the floor.
//
// Tokens available in any line:
//   {stat}  the component under discussion      {action}  what you just picked
//   {z}     its live z-score, formatted         {last}    who spoke before you

export const DESK = [
  {
    id: 'chad',
    name: 'CHAD RUTHERFORD IV',
    desk: 'MOMENTUM',
    seat: { hair: 'slick', prop: 'phone', vest: '#782f40', tone: '#dcc9a2' },
    affinity: { authorized: 0, unauthorized: 2, unclassified: 0.5 },
    on: {
      congratulate: [`He said it OUT LOUD. To a person. Unlogged. That is the trade, that is the whole trade.`],
      butterfly: [`Nineteen seconds on a butterfly. Nineteen. That is conviction and I will not be hearing otherwise.`],
      scissors: [`He asked for the scissors. From the chair. In front of people. I have goosebumps.`],
      lendsoap: [`Gave his bar away to a kid who is not even on the roster. Enormous. Uncoverable. Love it.`],
      overnature: [`Stayed on the bench past the bell because the light was doing something. Size it up.`],
      allnighter: [`Iron man. Absolute iron man. He is going to feel that in about nine days.`],
      coffee: [`That's my guy. A man with a plan and no sleep.`],
      soap: [`We are seriously spending a slot on soap.`],
      haircut: [`Size 5. Same as everybody. Very memorable. Truly one of the haircuts.`],
    },
    lines: {
      unauthorized: [
        `There it is. That's the trade.`,
        `Nobody ever got paid for the week they didn't take.`,
        `Print it. Print it before Brayden finishes typing.`,
        `This entire floor is underweight fun and I'm the only one who'll say it out loud.`,
        `Yes. Whatever that was, more of that.`,
        `Every line on this side of the board is a kid deciding one thing for himself. Bid all of it.`,
      ],
      authorized: [
        `Sure. Safe. Very Tuesday.`,
        `Cool. Let me know how the soap trades.`,
        `You cannot grind your way into a story, man.`,
        `Filed, logged, approved, boring. Four words, one week.`,
      ],
      unclassified: [
        `I don't know what bucket that's in and I don't get paid to know.`,
        `Is that a trade? That doesn't feel like a trade.`,
      ],
      oversold: [
        `SIZE IT UP. Size it up, size it up, size it —`,
        `{stat} is on the floor and you're asking me whether we buy. Obviously we buy.`,
      ],
      stretched: [
        `I don't know what a sigma is and I am up on the year.`,
        `Priya says it unwinds. Priya says a lot of things.`,
      ],
      printUp: [
        `THAT is the tape I have been telling you about since August.`,
        `Green week. Somebody put me on the record as early.`,
      ],
      printDown: [
        `One week. Noise. Zoom out.`,
        `We're long the kid. Nothing about that has changed.`,
      ],
      any: [
        `Love it. Didn't read it. Love it.`,
        `Whatever this is, we're long the kid.`,
      ],
    },
  },

  {
    id: 'brayden',
    name: 'BRAYDEN COLE',
    desk: 'COMPLIANCE COVERAGE',
    seat: { hair: 'part', prop: 'headset', vest: '#2b3a52', tone: '#c6cdd8' },
    affinity: { authorized: 2, unauthorized: 1.6, unclassified: 0 },
    on: {
      soap: [`Compound No. 4. One bar, two signatures. I'm not going to pretend I'm not moved.`],
      assembly: [`Forty-one slides and attendance taken twice. Zero economic content. Enormous compliance content.`],
      lendsoap: [`Off-roster diversion of a hygiene allotment to an infidel. I am going to need a bigger form.`],
      singlebow: [`One loop. ONE. On the left shoe. There is a stairwell log and his name is in the stairwell log.`],
      topbutton: [`He buttoned it from the collar DOWN. The garment is fine. The garment was never the point.`],
      arial: [`Arial. He set eleven good pages in Arial. It will not be read. It cannot be read.`],
      scissors: [`He asked at the chair. Out loud. Two personnel in the waiting row heard him ask.`],
      uniform: [`Second button first, double bow, two-finger gap. Nine pages in the instrument and he cleared nine.`],
      ta85: [`Logged in order of acquisition, no blank fields. This is what a good week looks like.`],
      paper: [`Roboto 11 against a rubric he is not permitted to see. Beautiful instrument. Genuinely elegant.`],
      haircut: [`Third chair, size 5, no request submitted. Textbook. I would put him in the newsletter.`],
      class: [`Seat 14C, continuous seat contact, no lean. Textbook.`],
    },
    lines: {
      authorized: [
        `Clean. Filed. Signature on file. This is what a good week is supposed to look like.`,
        `The sensor logged that. Free data point in his favor, and I do mean free.`,
        `Fourteen pieces of flair is the floor, not the target. I would be at sixteen.`,
        `I want to say something here and it's just: correct. That was correct.`,
      ],
      unauthorized: [
        `I am going to have to write that down.`,
        `Noting for the record that I flagged this in advance.`,
        `That's a warning. A warning, and a note, and the note does not come back out.`,
        `He has a permanent file. I have seen a permanent file. It is a real folder in a real drawer.`,
        `The Committee is going to have questions and I am going to have answers.`,
        `The instrument is nine pages long. Nine. At no point in nine pages is it ambiguous.`,
      ],
      unclassified: [
        `Unclassified is not the same thing as approved. I've asked them to close that gap.`,
        `Nothing to log. I hate having nothing to log.`,
      ],
      required: [
        `Memorandum satisfied. That's the job. That is the entire job.`,
        `Compliance scheduled. Nobody thanks you for this one and you do it anyway.`,
      ],
      printUp: [`Zero infractions in the period. I'd like that in the writeup.`],
      printDown: [`The print is the print. The file is what follows him.`],
      any: [`Is this in the handbook? I would like to check the handbook.`],
    },
  },

  {
    id: 'priya',
    name: 'PRIYA VENKATARAMAN',
    desk: 'QUANTITATIVE',
    seat: { hair: 'pony', prop: 'headset', vest: '#33434a', tone: '#a6cfd6' },
    affinity: { authorized: 1, unauthorized: 0.6, unclassified: 1 },
    on: {
      sleep: [`Fifteen energy for one slot. Cheapest alpha on the board and it goes unbought every single week.`],
      gym: [`Check the z before you add to a crowded line. Please. One time.`],
      book: [`He is teaching himself the thing I have a degree in, ahead of schedule, for free.`],
      liturgy: [`I cannot model it. It shows up as a floor under his drawdowns and I have no variable for why.`],
      officehours: [`Two slots for twelve academics. The math is fine. The math has always been fine.`],
      butterfly: [`Largest faith print on the board, one slot, nineteen seconds. Somebody minute that.`],
      glp1: [`The protocol cites no study. I went looking for the study. There is no study.`],
      owntopic: [`Nothing left his head. He acted on none of it. The penalty is identical, which tells you what is actually being measured.`],
      ramenraw: [`Eleven cents and no packet. Margin intact, micronutrients gone. Both of those are real numbers.`],
      arial: [`Same argument, same citations, different typeface. One of those three was graded.`],
      ta85: [`The terminal has a field for the skill and no field for who taught it to him. I have raised this.`],
    },
    lines: {
      oversold: [
        `{stat} is at {z}. Anything you put there right now pays one and three quarters. That's arithmetic, not a view.`,
        `{z} on {stat}. This is the cheapest thing on the board and it will not be cheap next week.`,
        `Two sigma below its own mean. I circulated a note. Nobody opened the note.`,
      ],
      stretched: [
        `{stat} at {z}. It unwinds next week. Not because I want it to.`,
        `You are four standard deviations of confidence into a two-sigma position.`,
        `Stretched is not the same as strong. I will keep saying it until it lands.`,
      ],
      authorized: [
        `Boring. Boring is the highest-Sharpe line on this board and nobody ever wants it.`,
        `Smooth accumulation wins the year. It has won every year I have measured.`,
      ],
      unauthorized: [
        `Fine on the mean, bad on the variance. Those are two different problems.`,
        `That widens the range. Wide ranges are how a good year becomes an anecdote.`,
      ],
      unclassified: [
        `Uncorrelated to everything else on the board. That is worth more than the points are.`,
      ],
      printUp: [`Up on lower variance than last week. That is the part that matters and nobody will mention it.`],
      printDown: [`Down, inside one sigma. This is a normal week. It only feels like a verdict.`],
      any: [
        `I would like the record to show what the number was when we did this.`,
        `Six lines, one index. Concentration is the only real risk in here.`,
      ],
    },
  },

  {
    id: 'mitch',
    name: 'MITCH HALVORSEN',
    desk: 'THIRTY YEARS ON THIS DESK',
    seat: { hair: 'thin', prop: 'coffee', glasses: true, vest: '#4a4436', tone: '#cec5b0' },
    affinity: { authorized: 0.8, unauthorized: 1, unclassified: 1.4 },
    on: {
      allnighter: [`He is pulling that out of next quarter. It always comes out of next quarter.`],
      callmom: [`Call the mother. I don't have a model for it and I stopped looking for one.`],
      dadtext: [`Full sentences. To a man who scrolls with the same finger he types with. Nobody made him do that.`],
      liturgy: [`Two hours, no chairs, no phone. Only line on this board with no counterparty.`],
      ramenraw: [`Eleven cents a serving if you buy the case. I bought the case. I left the packet out too.`],
      overnature: [`He stayed on the bench past the bell. Thirty years on this desk and that is the only line I have ever envied.`],
      butterfly: [`Seven seconds is the threshold. He knew the number, he counted, and he kept going. Good.`],
      owntopic: [`Four minutes wondering whether he could pick his own topic. They wrote it up. I have watched firms die of that.`],
      congratulate: [`He told a man his work was good. There is no field for it, which is how you know it counted.`],
      uniform: [`Unglamorous, accretive, completely ignored by the street. Whole career in one slot.`],
    },
    lines: {
      stretched: [
        `Four weeks running on the same line. I watched a man do that once. He had a shoulder afterward.`,
        `Everything returns to its average. Everything. You can be early or you can be right.`,
      ],
      tired: [
        `He's running on fumes and the tape hasn't priced it yet. It will.`,
        `Kid's cooked. You can spend a nineteen-year-old all the way down and he will let you do it.`,
      ],
      unauthorized: [
        `Go ahead. It'll cost him and it will not sink him. Learning that difference is most of what nineteen is for.`,
        `I have never once seen the file matter as much as the man holding it believes it does.`,
        `Every one of these is the size of a shoelace and they file every single one. That is the part to notice.`,
      ],
      unclassified: [
        `Nobody is grading that one. That's usually the one that turns out to have been the point.`,
      ],
      authorized: [
        `Unglamorous, accretive, ignored. That's most of a career, if you want the truth of it.`,
      ],
      printUp: [`Good week. Don't build a thesis on it. Build it on the next eleven.`],
      printDown: [`He is better than that print. Week seven is on everybody's chart somewhere.`],
      any: [
        `Long time on this desk. This is the part where it stops being an adventure.`,
        `Fifteen weeks. Everybody's chart has a bad one in it. His is coming or it already came.`,
      ],
    },
  },

  {
    id: 'trey',
    name: 'TREY',
    desk: 'INTERN',
    seat: { hair: 'cap', prop: 'phone', vest: '#54455c', tone: '#c2bacd' },
    affinity: { authorized: 0.5, unauthorized: 0.5, unclassified: 2 },
    on: {
      book: [`He's reading Nison on his own time. Nobody assigned that. Nobody's grading it.`],
      club: [`Nine guys pitching the same three tickers. He pitched a fourth one. It wasn't bad.`],
      coffee: [`Oh — I can get that. I'll get that.`],
      meatbox: [`Second seating, posted portion, no substitutions. I asked about substitutions once.`],
      nature: [`Four fifteen to four thirty. I put it in my calendar so I don't forget to feel it.`],
      congratulate: [`Wait — you're allowed to just say that to someone? Out loud? While they're there?`],
      arial: [`Is Arial the bad one? I can never remember which one's the bad one.`],
      ta85: [`I log mine every Friday. Nobody has ever said anything to me about them.`],
      dadtext: [`My dad does the finger thing too. I've never mentioned it either.`],
      singlebow: [`I check my own shoes like four times a day now. Is that normal? That's probably not normal.`],
    },
    lines: {
      unclassified: [
        `Nobody's covering this one. That's usually where the good stuff is. Right?`,
        `This isn't on any of the sheets. I checked twice. I checked three times.`,
        `So where does this go in the model? Is there a column for it?`,
      ],
      // Trey's real function on this desk. Fires as a second bubble after
      // somebody else has spoken, which is the only time he is confident.
      agrees: [
        `Yeah. Yeah, exactly. What {last} said.`,
        `That's what I was going to say. Almost word for word.`,
        `Strong agree with {last}. Very strong agree.`,
        `See, I had that too, I just didn't say it out loud.`,
        `{last} is right. {last} is usually right.`,
        `Writing down what {last} just said.`,
      ],
      any: [
        `Do I have an opinion yet? I don't think I'm supposed to have an opinion yet.`,
        `I'll get the coffee.`,
        `Writing that down. Not sure why. Writing it down.`,
      ],
    },
  },
];

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
        `The allotment is issued to the individual and is not transferable to any person outside the ` +
        `roster. Requisition weekly. We are one desk.`,
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
      requires: 'uniform',
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
      requires: 'uniform',
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
