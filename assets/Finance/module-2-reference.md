# Startup Finance — Module 2, fully authored (owner reference, received 2026-09-05)

**Days 7–13 · Cap tables and dilution**

The most mechanical module in the roadmap, and the one a finance graduate is least likely to have touched. Everything here is arithmetic — which means every day has a right answer and every check is genuinely checkable.

---

## Why this module matters more than it looks

A PGDM teaches you to value a company. It does not teach you who owns it, or what a round does to that.

In practice, cap table competence is the thing that makes a junior person useful in a fundraising conversation immediately. Founders routinely do not know what their next round will do to their ownership. Investors assume you can read a waterfall. And the arithmetic is not difficult — it is just never taught.

**This module is also the best fit for Jintu's format.** Every day ends in a spreadsheet you built, every check has an unambiguous answer, and the whole module accumulates into one working model by day 13.

---

## The build-as-you-go structure

Unlike the other modules, this one produces a single artefact incrementally:

```
Day 7   understand the document
Day 8   the arithmetic
Day 9   build the base cap table          ← file created
Day 10  add a priced round                ← same file
Day 11  add an ESOP pool                  ← same file
Day 12  add SAFE conversion               ← same file
Day 13  add the exit waterfall            ← same file, now complete
```

By day 13 they have a working model that takes a SAFE, converts it at a priced round, creates a pool, and produces an exit distribution — from formulas, with no hardcoded percentages. That is a portfolio artefact and a working tool.

---

## Day 7 · What a cap table actually is
**~70 min · 25 pts**

**Principle:** *If you cannot rebuild the cap table from the documents, you do not understand the deal.*

**Why today:** Before any arithmetic, understand what the document represents and where its authority comes from. A cap table is a summary of legal instruments, and when the spreadsheet and the documents disagree, the documents win.

**Today's topics**
1. **What it records** — every share issued, to whom, of what class, at what price, on what date.
2. **Share classes** — ordinary, preference, and in India CCPS. Different rights, different economics, same table.
3. **Issued versus fully diluted** — the distinction that causes most cap table arguments. Options, warrants and convertibles are not issued shares but count in fully diluted.
4. **Authorised versus issued capital** — an Indian company must authorise before it issues, and running out of authorised capital delays a round.
5. **Where the truth lives** — MCA filings, the register of members, share certificates, the SHA. The spreadsheet is a derivative.
6. **Why cap tables go wrong** — informal promises, unissued options, a co-founder who left without documentation.

**Read & watch**
- **Carta — cap table fundamentals resources** · *Why this one: they explain the mechanics clearly and free, because they sell the software. Read the education pages, ignore the product pitch.*
- **Stripe Atlas — equity guide** · *Why this one: the clearest plain-English explanation of classes and dilution written for people who are not lawyers.*
- **An Indian company's MCA filings — the shareholding pattern** · *Why this one: look at what is actually filed. Seeing the legal record behind a cap table is the point of today.*
- **A law firm explainer on CCPS rights in India** · *Why this one: the Indian class structure differs from the US template you will read everywhere else. Check the publication date.*

**Today's challenge · ~20 min**
Find one funded Indian startup on MCA. From the filings, list the share classes issued, the number of shares in each, and the dates. Then write two sentences on what you can and cannot determine about ownership from the public record alone.

**Check yourself**
1. *Issued versus fully diluted — why does it matter?* → Fully diluted includes options and convertibles that have not converted. An investor negotiating for 20% almost always means fully diluted, and agreeing on issued instead gives them materially less than they think.
2. *What is authorised capital and why does it delay rounds?* → The maximum shares a company may issue under its constitution. Issuing beyond it requires a shareholder resolution and a filing, which takes time nobody budgeted for.
3. *If the spreadsheet and the share register disagree, which is correct?* → The register and the filings. The spreadsheet is a convenience; the legal record is the company.

**The mistake almost everyone makes:** Treating the spreadsheet as the source of truth. Cap tables drift from reality through undocumented promises and unissued options, and the drift is discovered during diligence at the worst possible moment.

---

## Day 8 · Pre-money, post-money and the arithmetic
**~75 min · 30 pts**

**Principle:** *Pre-money and post-money differ by exactly the amount everyone argues about.*

**Why today:** The arithmetic is trivial and the confusion is constant. Get this precisely right today and every calculation for the rest of the module follows.

**Today's topics**
1. **The identity** — post-money equals pre-money plus the investment. Everything else derives from it.
2. **Investor ownership** — investment divided by post-money. Not divided by pre-money, which is the standard error.
3. **Price per share** — pre-money divided by pre-round fully diluted shares. This is the number that governs everything else.
4. **New shares issued** — investment divided by price per share.
5. **Dilution** — what each existing holder's percentage becomes, and why percentage falling does not mean value falling.
6. **Where the confusion originates** — founders quote pre-money, investors think post-money, and neither says which.

**Read & watch**
- **Kirsty Nathoo (YC) — startup finance and priced round mechanics** · *Why this one: she does the arithmetic on screen, slowly, with real numbers. The single most useful free video on this topic.*
- **Stripe Atlas — dilution guide** · *Why this one: worked examples in plain language, with the pre/post distinction made explicit.*
- **Carta — dilution explainer** · *Why this one: good diagrams showing the same round from both sides.*
- **Damodaran on the difference between value and ownership** · *Why this one: the conceptual frame — your percentage falls while your value rises, and both are true.*

**Today's challenge · ~25 min**
A company has 10,00,000 shares outstanding and raises ₹5 crore at ₹20 crore pre-money. Calculate: post-money, price per share, new shares issued, investor percentage, and the founders' percentage before and after. Do all of it by formula. Then change the raise to ₹8 crore and confirm every figure updates.

**Check yourself**
1. *₹5 crore at ₹20 crore pre-money. What does the investor own?* → Post-money is ₹25 crore, so 5/25 = 20%.
2. *Why is price per share calculated on pre-money shares?* → The price is what the investor pays for shares that exist before their money arrives. Using post-money shares would be circular.
3. *A founder goes from 60% to 48% and the company is worth more. Better or worse off?* → Better, if the valuation rose enough. 60% of ₹20 crore is ₹12 crore; 48% of ₹25 crore is ₹12 crore — flat here, and positive in any round where value rises more than the dilution.

**The mistake almost everyone makes:** Dividing the investment by pre-money to get ownership. It overstates the investor's stake and produces a cap table that does not sum to 100%.

---

## Day 9 · Building a cap table from scratch
**~90 min · 35 pts**

**Principle:** *A cap table with a hardcoded ownership percentage is a cap table that will be wrong next round.*

**Why today:** This is the build day. Everything after this adds to the file you create now, so the structure matters more than the numbers.

**Today's topics**
1. **Structure it around shares, not percentages** — percentages are outputs. A model built on percentages breaks at the first round.
2. **One row per holder, one column per event** — founders, angels, each round, options.
3. **The summary block** — issued, fully diluted, and each holder's percentage of both, all derived.
4. **Named inputs in one place** — every assumption in a single input block, never buried in a formula.
5. **The check row** — percentages must sum to exactly 100%. It should be impossible for the model to be wrong without you seeing it.
6. **Formatting so someone else can read it** — inputs, calculations and outputs visually distinct.

**Read & watch**
- **Kirsty Nathoo (YC) — cap table walkthrough** · *Why this one: rewatch the section where she builds the table structure. Structure is today's whole lesson.*
- **A free cap table template** — Carta, AngelList or a VC firm's published version · *Why this one: open two and compare how they are structured. Do not use one; build your own after seeing theirs.*
- **ExcelJet — INDEX and MATCH, and structured references** · *Why this one: the lookup layer that makes a cap table maintainable. You need this before day 10.*
- **Microsoft Learn — Excel Tables** · *Why this one: converting ranges to tables is what stops formulas breaking when rows are added.*

**Today's challenge · ~40 min**
Build a cap table for a company with three founders (50/30/20) holding 10,00,000 shares. Every percentage must be a formula referencing share counts. Add a check row summing to 100%. Deliberately change one founder's shares and confirm every percentage updates and the check still holds.

**Check yourself**
1. *Why build on shares rather than percentages?* → Shares are the legal reality and they are additive. Percentages are derived and must be recalculated at every event — hardcoding them guarantees a wrong answer after the first round.
2. *What does the check row protect against?* → Any error that breaks the total. If percentages sum to 99.7%, something is missing or double-counted, and you see it immediately rather than in a meeting.
3. *Why keep inputs in one block?* → So someone else can change an assumption without hunting through formulas — and so you can see every assumption at once when auditing your own work.

**The mistake almost everyone makes:** Building it as a static picture of today rather than a model. A cap table's purpose is answering "what happens if", and a table of typed percentages cannot answer anything.

---

## Day 10 · Modelling a round and its dilution
**~85 min · 35 pts**

**Principle:** *Founders track their percentage. They should track their value.*

**Why today:** Yesterday's table shows a moment. Today it becomes a model that can answer the only question anyone actually asks: what does this round do to me?

**Today's topics**
1. **Adding a round as a column** — new shares issued, price per share, and every percentage recalculating.
2. **Dilution across multiple rounds** — and how a founder reaches single digits without any single round looking severe.
3. **Value versus percentage** — modelling both, so the conversation can be about the right one.
4. **Modelling a round that has not happened** — scenario columns with different raise amounts and valuations.
5. **The founder's real question** — "what do I own after Series B" requires modelling two rounds forward with assumptions stated.
6. **Presenting dilution to a founder** — the framing that makes it a decision rather than a shock.

**Read & watch**
- **Stripe Atlas — dilution over multiple rounds** · *Why this one: shows the cumulative effect across a full funding history, which single-round explanations miss entirely.*
- **Kirsty Nathoo (YC) — multi-round dilution** · *Why this one: the arithmetic across rounds, on screen.*
- **A published founder account of dilution across rounds** · *Why this one: founders who write about their own cap table after the fact are unusually candid. Search for a recent one.*
- **ExcelJet — scenario analysis and data tables** · *Why this one: you need this for the two-way sensitivity in today's challenge.*

**Today's challenge · ~35 min**
Extend yesterday's model with a seed round: ₹3 crore at ₹12 crore pre-money. Then a Series A: ₹15 crore at ₹60 crore pre-money. Show each founder's percentage and value after each. Then build a two-way table showing founder ownership across three Series A valuations and three raise sizes.

**Check yourself**
1. *A founder holds 30% and the round is ₹15 crore at ₹60 crore pre-money. What do they hold after?* → Post-money is ₹75 crore, the investor takes 20%, so the founder retains 30% × 80% = 24%.
2. *Why can a founder's value rise while their percentage falls sharply?* → Because the valuation rose by more than the dilution. 24% of ₹75 crore exceeds 30% of ₹15 crore by a wide margin.
3. *Why model two rounds forward rather than one?* → Because the terms of this round affect the next. A high valuation now can force a down round later, and the founder should see that before signing.

**The mistake almost everyone makes:** Presenting dilution as a percentage loss. Framed that way every round looks like a defeat. Value alongside percentage turns it into the trade it actually is.

---

## Day 11 · ESOP pools — sizing, timing and who pays
**~80 min · 35 pts**

**Principle:** *Who the pool dilutes depends entirely on whether it sits pre-money or post-money.*

**Why today:** The pool shuffle is the most economically significant term that founders routinely accept without understanding. It frequently moves more value than the valuation negotiation does.

**Today's topics**
1. **What an ESOP pool is** — shares reserved for future employees, unallocated at creation.
2. **Sizing** — typically 10–15% at early stages, driven by the hiring plan rather than convention.
3. **The pre-money shuffle** — a pool created pre-money dilutes existing shareholders only, and lowers the effective price the investor pays.
4. **Post-money creation** — dilutes everyone including the new investor.
5. **Modelling both** and showing the difference in rupees, which is the only way founders understand it.
6. **Indian specifics** — SEBI and Companies Act requirements, trust versus direct routes, and why Indian ESOP economics differ.
7. **Granted, vested, exercised, unallocated** — four states, and only some count in fully diluted.

**Read & watch**
- **Kirsty Nathoo (YC) — the option pool shuffle** · *Why this one: this specific term is the one YC's finance talks cover best. Watch the pool section twice.*
- **Carta — ESOP mechanics** · *Why this one: vesting, cliffs, exercise and the four states explained plainly.*
- **An Indian law firm or platform explainer on ESOPs under the Companies Act** · *Why this one: the Indian regime differs meaningfully — trust routes, exercise taxation, and what a private company may do.*
- **A published piece on ESOP taxation in India** · *Why this one: employees frequently discover the tax treatment too late, and an adviser should be able to explain it. Check the date — this has changed.*

**Today's challenge · ~35 min**
Add a 10% ESOP pool to your model twice: once created pre-money, once post-money, with the same round. Calculate the founders' final ownership under each, and the difference in rupees at the post-money valuation. Write one sentence stating who paid for the pool in each case.

**Check yourself**
1. *A 10% pool created pre-money — who is diluted?* → Only the existing shareholders. The new investor's percentage is protected, so they effectively buy at a lower price than the headline valuation implies.
2. *Why do investors ask for the pool pre-money?* → It increases their effective ownership without changing the valuation they can quote. It is a price adjustment expressed as an administrative requirement.
3. *What is the difference between granted and unallocated pool shares?* → Granted shares are committed to named employees under a vesting schedule; unallocated are reserved but unassigned. Both count in fully diluted, which is why the pool dilutes on creation rather than on grant.

**The mistake almost everyone makes:** Treating the pool as a housekeeping item and negotiating only the valuation. A 10% pre-money pool on a ₹40 crore pre-money round moves roughly ₹4 crore of value, which usually exceeds anything won in the valuation discussion.

---

## Day 12 · Convertible conversion at the next round
**~85 min · 35 pts**

**Principle:** *A SAFE's discount and cap interact, and the interaction surprises people at conversion.*

**Why today:** Day 3 covered what a SAFE is. Today is what it does to the cap table when it converts — which is the only moment it has any effect at all.

**Today's topics**
1. **The conversion event** — a priced round triggers it, and the SAFE becomes shares at a price determined by cap or discount.
2. **Cap versus discount** — calculate both, and the investor receives the more favourable.
3. **Pre-money versus post-money SAFE conversion** — a materially different calculation, and the source of most conversion disputes.
4. **Multiple SAFEs at different caps** — each converts on its own terms, and modelling them together is where errors appear.
5. **The dilution surprise** — founders often do not model SAFE conversion, then discover their ownership after a round is well below expectation.
6. **The interaction with the pool** — a pool created at the same round compounds the effect.

**Read & watch**
- **YC — the SAFE user guide and the conversion examples** · *Why this one: YC publishes worked conversion examples alongside the documents. Work through them with a spreadsheet open.*
- **Kirsty Nathoo (YC) — SAFE conversion mechanics** · *Why this one: the arithmetic on screen, and specifically the pre/post distinction.*
- **A written walkthrough of multiple SAFEs converting at different caps** · *Why this one: one SAFE is simple; three at different caps is where people get it wrong.*
- **Carta — convertible conversion in the cap table** · *Why this one: shows the before-and-after table, which is what you are building today.*

**Today's challenge · ~35 min**
Add two SAFEs to your model: ₹1 crore at a ₹10 crore post-money cap with a 20% discount, and ₹50 lakh at a ₹15 crore post-money cap with no discount. Convert both at a Series A of ₹15 crore at ₹50 crore pre-money. Show the shares issued to each, the price applied, and every holder's final ownership. State for each SAFE whether the cap or the discount governed.

**Check yourself**
1. *A SAFE with a ₹10 crore cap converting at a ₹50 crore pre-money round — what price applies?* → The cap, and by a wide margin. The investor converts as though the valuation were ₹10 crore, which is the entire purpose of the cap.
2. *Why do founders underestimate SAFE dilution?* → Because nothing appears on the cap table until conversion. Money arrived, ownership looked unchanged, and the dilution lands all at once at the next round.
3. *Two SAFEs at different caps convert together. Same price?* → No. Each converts on its own terms, so the same round produces two different conversion prices — which is why modelling them individually matters.

**The mistake almost everyone makes:** Modelling SAFEs as a single blended line. They convert individually at individual prices, and blending them produces a wrong share count that then propagates through everything downstream.

---

## Day 13 · Waterfall and exit distribution
**~90 min · 45 pts**

**Principle:** *Liquidation preference decides who gets paid first, and in a modest exit that is everyone's answer.*

**Why today:** The module ends where the money actually gets divided. This is also where preference terms — abstract on day 4 — become the number that determines whether a founder receives anything.

**Today's topics**
1. **What a waterfall is** — the order in which exit proceeds are distributed.
2. **1x non-participating preference** — the investor takes the greater of their money back or their pro-rata share. The standard.
3. **Participating preference** — money back *and* a pro-rata share. Much more aggressive, and still seen.
4. **Multiples above 1x** — when they appear and what they signal.
5. **The conversion decision** — a preferred holder converts to ordinary when pro-rata beats preference, and the crossover point is calculable.
6. **Modelling the whole thing** — proceeds across a range of exit values, showing what each holder receives.
7. **Why founders can receive nothing** — a ₹50 crore exit against ₹60 crore of preference pays ordinary shareholders zero.

**Read & watch**
- **Brad Feld — the liquidation preference posts in his term sheet series** · *Why this one: free, and the clearest explanation of participating versus non-participating anywhere.*
- **Carta — liquidation preference and waterfall** · *Why this one: diagrams showing the payout at different exit values, which is what you are building.*
- **A worked example of a waterfall with multiple preferred classes** · *Why this one: two classes with different preferences is where the modelling becomes non-trivial.*
- **A First Round Review or founder account of a modest exit** · *Why this one: the human consequence — founders discovering the preference stack after the sale.*

**Today's challenge · ~45 min**
Complete the model. Add a waterfall showing distribution across exit values from ₹10 crore to ₹200 crore in ₹10 crore steps, for: two founders, an ESOP pool, two converted SAFE holders, and a Series A investor with 1x non-participating preference. Identify the exit value at which the Series A investor is indifferent between preference and conversion. Then change to participating and record how the crossover moves.

**Check yourself**
1. *1x non-participating on ₹15 crore invested for 25%. At a ₹40 crore exit, what do they take?* → The greater of ₹15 crore (preference) or ₹10 crore (25% of ₹40 crore). They take the preference — ₹15 crore.
2. *At what exit value do they convert?* → Where 25% of the exit exceeds ₹15 crore, so above ₹60 crore. Below that, preference; above, conversion.
3. *Why can founders receive nothing in a profitable-looking exit?* → If total preference exceeds the exit value, preferred holders take everything before ordinary shareholders are paid. A ₹50 crore sale against ₹60 crore of preference leaves ordinary at zero.

**The mistake almost everyone makes:** Assuming an exit above the last valuation is good for everyone. With a preference stack, a founder can hold 30% of a company that sells for ₹50 crore and receive nothing at all.

---

## The artefact this module produces

By day 13 the learner has one working file that:

- holds three founders, an ESOP pool, two SAFEs and a priced round
- calculates everything from share counts, with no hardcoded percentages
- converts SAFEs individually at their own cap or discount
- models the pool pre-money or post-money by switch
- produces an exit waterfall across a range of values
- has a check row that makes an error visible immediately

**That is a portfolio piece and a working tool.** For the customer this roadmap was built for — advising startups on fundraising — it is the single most immediately useful thing in the entire 48 days.

---

## Authoring notes

**This is the easiest module to verify.** The sources are few and stable: YC's SAFE documents and Kirsty Nathoo's talks, Carta's education pages, Stripe Atlas, Brad Feld's blog, and Excel references. Six or seven URLs cover the whole module.

**The Indian ESOP content on day 11 needs the most checking** — taxation treatment has changed and law firm explainers go stale. Prefer a source with a visible date.

**Day 13 is the highest point value in the module** at 45, and correctly so. It is the longest challenge, it completes the artefact, and it is the day that makes the preceding six worth having done.

**Modules remaining:** 4 (unit economics), 5 (pitch and model), 6 (diligence), 7 (SME IPO). Module 4 is the natural next one — it feeds directly into the model built in module 5.
