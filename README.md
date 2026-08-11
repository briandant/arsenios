# THE Z INDEX · $ARSN

A browser game about Arsenios Monda leaving for Florida State.

He is not going to college. He is going **public**. Privately held for nineteen years,
closely held, carried on the books at cost because there was no market to mark him to —
and this week he lists. You are the analyst covering him. Fifteen weeks, six slots each,
and every candle on the tape is a week of his freshman year.

**Live at [briandant.github.io/arsenios](https://briandant.github.io/arsenios/)**

---

## How it plays

Each turn is one week. You allocate six time slots across a menu of activities, hit
**ADVANCE WEEK**, and the chart prints a single candlestick — open, high, low, close,
volume. Fifteen candles is a semester.

Six components are tracked and consolidated into the index:

`ACADEMICS` · `FAITH` · `FITNESS` · `SOCIAL` · `LIQUIDITY` · `COMPLIANCE`

### The three mechanics that matter

**Mean reversion.** Every component carries a live z-score against its own rolling
history — `z = (x − μ) / σ`. Push one past **+2** and it is statistically stretched; it
unwinds next week whether you like it or not. Let one fall below **−2** and it is
oversold, and the next thing you do for it pays **1.75×**. Four straight weeks in the
gym earns you a shoulder injury. Six weeks of skipping church makes one liturgy land
enormously. The winning line is smooth, boring, balanced accumulation, and the game
never says so out loud — the statistics say it.

The indicator is not available at the start. It unlocks in **Week 3**, when Dr. Okonkwo
covers standard deviations in STA 2023.

**The Committee.** Supervisory authority transfers on day one to the Faculty Operating
Committee, which classifies every possible use of an undergraduate's time as
`AUTHORIZED`, `UNAUTHORIZED`, or `UNCLASSIFIED`, and issues policy memoranda enforcing
the distinction. Ignore a memo and you take a written warning and lose compliance.
Three warnings puts you on a Performance Improvement Plan, which permanently reserves
one of your six slots for mandatory remediation. Warnings also permanently lower the
ceiling on how much compliance you can ever recover — the file follows him.

You can defy the Committee. It costs real points and it will not sink you.

**The desk.** Five sell-side analysts sit behind the six slots — the surface they are
working at is the top edge of the row you are allocating. Fill a slot and an order ticket
leaves the card, lands in the slot, and whichever of them cares most about what you just
did says something about it. Chad wants size. Brayden has already written it down. Priya
is quoting the actual z-score and being ignored. Mitch has been on this desk for thirty
years. Trey agrees with whoever spoke last.

Nobody on that desk is a game mechanic. They are the only part of the terminal that
reacts to a single slot rather than a whole week, and they are how you find out that the
liturgy has no counterparty and the recovery interval is the cheapest alpha on the board.

**The z-index.** The six components render as stacked translucent layers over the
candles, and you reorder them freely — the layer panel is a literal z-index control.
Whichever layer is in **front** at the closing bell decides which of the six endings
you get. Same score, six different lives. Bringing a layer forward stops being a
rendering instruction and becomes the point of the game.

---

## Running it locally

No build step, no dependencies, no package manager. It is plain ES modules, so it does
need to be *served* rather than opened as a `file://` URL:

```sh
python3 -m http.server 8000
# → http://localhost:8000
```

---

## Editing the content

The code is deliberately split so the writing lives apart from the machinery.

| File | What's in it |
|---|---|
| `js/config.js` | Names, ticker, school, week count, slot count, per-component decay rates and starting values |
| `js/data.js` | **All the writing.** Actions and their descriptions, the fifteen-week calendar, the faculty, every memorandum, the five analysts and everything they say, the candlestick patterns, the endings |
| `js/engine.js` | Simulation: weekly resolution, z-scores, candle construction, compliance, scoring |
| `js/chart.js` | Canvas renderer — candles, volume, moving averages, the stacked component layers |
| `js/desk.js` | The analysts: who talks, how they're drawn, and the order-ticket animation |
| `js/ui.js` | DOM rendering and the overlays |
| `js/main.js` | State ownership and event wiring |

To change a joke, edit `js/data.js`. To rename the subject or retarget the whole thing
at a different person, edit `js/config.js`.

### Tuning the balance

Difficulty lives in three places:

- **`decay`** per component in `config.js` — what each one gives back weekly on its own.
  This is why six slots is never enough slots. Raise it to make the game harsher.
- **`softGain()`** in `config.js` — damps gains as a component approaches 100, so
  nothing pegs.
- **`TIERS`** in `data.js` — the closing-print thresholds for each coverage rating.

Reference points from simulated play: optimized ≈ 5,900 (STRONG BUY), sensible ≈ 5,000
(BUY), random ≈ 3,700 (UNDERWEIGHT), all-nighters-and-no-sleep ≈ 2,100 (DELISTED).

---

## Deployment

GitHub Pages serves `main` from the repository root. `.nojekyll` tells Pages to skip
Jekyll and serve the files as-is.

### Keeping it out of search results

The `noindex` meta tag in `index.html` is what does the work. On a project page,
crawlers read `robots.txt` from the *domain root* (`briandant.github.io/robots.txt`),
which belongs to a different repository — so the `robots.txt` here is inert until the
site moves to an apex domain, at which point it applies as written.

The repository itself is public, because Pages requires it on a free account. The
source is therefore visible on GitHub regardless of what the deployed page says.

### Moving to a custom domain

1. `echo arsenios.tech > CNAME`, commit, push.
2. Point the apex at GitHub with four `A` records — `185.199.108.153`,
   `.109.153`, `.110.153`, `.111.153` — plus the matching `AAAA` records at
   `2606:50c0:800{0,1,2,3}::153`, and `www` as a `CNAME` to `briandant.github.io.`
3. Wait for DNS, then enable Enforce HTTPS once the certificate is issued.

Built with [Claude Code](https://claude.com/claude-code).
