/**
 * Startup finance & fundraising — modules 5–7, days 28–48.
 *
 * The deck and the model behind it, diligence from the investor's side, and
 * the SME IPO layer. Module and day titles, principles and deliverables are
 * the owner's brief verbatim (assets/Finance/roadmap-startup-finance.md).
 * Modules 5 and 6 follow the owner's fully-authored references
 * (assets/Finance/module-5/6-reference.md): their challenges, checks,
 * topics and named sources are those documents', verified before use, with
 * the first pass's interview checks (three in module 5, four in module 6)
 * kept on top. Big Four asks are cited at the two India deal-advisory hubs
 * (KPMG, PwC) because their deep publication links rot; MCA and law-firm
 * asks stay linkless per the standing rule-2 rulings.
 * Module 5 follows the owner's fully-authored reference
 * (assets/Finance/module-5-reference.md, received 2026-09-05): its
 * challenges, checks, topics and named sources are that document's,
 * verified before use, with the first pass's three interview checks kept.
 * Its generic asks (published decks, model templates, an Indian diligence
 * checklist) are challenge instructions, not links, by design.
 *
 * Module 7 anchors on BSE SME, SEBI and Zerodha Varsity. NSE Emerge belongs
 * here and is ABSENT: nseindia.com returns 403 to our link checker on every
 * path, and rule 2 forbids publishing a URL we cannot verify — the same
 * ruling as metaculus.com and cdc.gov elsewhere in the catalogue. The BSE
 * and SEBI documents cover the same framework and can be checked.
 */
export default [
  {
    title: "The pitch deck and the model behind it",
    weekRange: "Weeks 5–6",
    objective:
      "The deck investors actually read, and the model that has to survive their questions.",
    deliverable:
      "A complete driver-based operating model plus a ten-slide deck whose numbers reconcile to it exactly.",
    estHours: 9.5,
    nodes: [
      {
        title: "What a deck must prove, slide by slide",
        summary:
          "A deck is not a document about a company — it is a sequence of answers to the questions an investor asks in order.",
        learningObjectives: [
          "Name the standard sequence and the objection behind each slide",
          "Say when traction moves early, and what to lead with when there is none",
          "Write an ask with an amount, a use of funds and the milestone it buys",
        ],
        whyToday:
          "A pitch deck is not a document about a company. It is a sequence of answers to the questions an investor asks in order, and understanding that order is the whole craft.",
        principle: "Ten slides, and each one answers an objection rather than making a claim.",
        commonMistake:
          "Building the deck as a description of the company rather than a sequence of answers. The result reads as complete and persuades nobody, because it never engages the question the reader is actually holding.",
        challenge:
          "Take a published deck from a company that raised successfully — Airbnb's and Buffer's are widely available. For each slide, write the one objection it exists to answer. Then identify the two slides doing the most work, and the one you would cut.",
        challengeMinutes: 25,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The standard sequence",
            detail:
              "Problem, solution, market, product, traction, business model, competition, team, financials, ask. Deviations should be deliberate — the order varies; the objections do not.",
          },
          {
            title: "The objection behind each slide",
            detail:
              "'Is this a real problem', 'why you', 'is it big enough', 'does anyone want it', 'can you keep them'. A deck built objection-by-objection reads as evidence; built claim-by-claim it reads as marketing.",
          },
          {
            title: "Where traction sits",
            detail:
              "It moves early in a deck that has it, because it answers several objections at once. A company without traction must earn attention through problem and team instead.",
          },
          {
            title: "The team slide, by stage",
            detail:
              "At seed it is the investment case; at Series A it is a checkbox. Knowing which deck you are writing decides how much weight it carries.",
          },
          {
            title: "The ask, and what does not belong",
            detail:
              "Amount, use of funds, and the milestone it buys — an ask without a milestone is a number without a reason. Not welcome anywhere: NDAs, exit-strategy slides, five-year revenue projections at seed.",
          },
        ],
        checks: [
          {
            question: "Why does traction move earlier when a company has it?",
            answer:
              "Because it answers several objections at once — real problem, real demand, some execution ability. A company with traction leads with it; one without must earn attention through problem and team.",
          },
          {
            question: "What is wrong with a five-year revenue projection at seed?",
            answer:
              "It cannot be credible and both sides know it. It signals either naivety or that you think the reader is naive. Show the model on request; do not lead with it.",
          },
          {
            question: "What makes an ask credible?",
            answer:
              "Amount, use of funds, and the specific milestone it reaches — 'eighteen months to ₹5 crore ARR and a Series A'. An amount alone invites the question you should have answered.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "A guide to seed fundraising",
            url: "https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising",
            sourceName: "Y Combinator",
            editorNote:
              "Re-read the materials section specifically — what investors expect to see, in their own words, from having seen an enormous volume of decks. Note how short the expected deck is compared to the ones founders actually send.",
          },
          {
            type: "read",
            title: "Writing a business plan — Sequoia's pitch template",
            url: "https://www.sequoiacap.com/article/writing-a-business-plan/",
            sourceName: "Sequoia Capital",
            editorNote:
              "The original ten-slide structure most decks still follow. Short and free — read it once, then notice how many published decks are this outline with a logo.",
          },
          {
            type: "video",
            title: "How to Pitch Your Startup — Kevin Hale",
            url: "https://www.youtube.com/watch?v=17XZGUX_9iM",
            sourceName: "Y Combinator (YouTube)",
            youtubeVideoId: "17XZGUX_9iM",
            durationSec: 1666,
            estSizeMb: 212,
            editorNote:
              "The clearest free talk on what each slide is for — packaging the idea so an investor can repeat it to their partners. Watch it before writing a single slide; the deck is a script, not a document.",
          },
          {
            type: "read",
            title: "How to design a better pitch deck",
            url: "https://www.ycombinator.com/library/4T-how-to-design-a-better-pitch-deck",
            sourceName: "Y Combinator",
            editorNote:
              "Specific, practitioner-delivered advice on the sequence and the slides — legible, simple, obvious — not general design tips. The talk video is embedded on the page.",
          },
        ],
        concepts: [
          "pitch-deck",
        ],
      },
      {
        title: "Market sizing bottom-up",
        summary:
          "The slide most often outsourced to a headline number — and the one where doing the work properly is most visible.",
        learningObjectives: [
          "Build TAM, SAM and SOM bottom-up from a countable unit",
          "Source Indian denominators from government statistics rather than reports",
          "Sanity-check a SOM against the largest revenue anyone in the sector has achieved",
        ],
        whyToday:
          "Market size is the slide most often outsourced to a headline number, and the one where doing it properly is most visible. It is also a genuinely transferable analytical skill.",
        principle:
          "A TAM copied from a consulting report tells an investor you did not do the work.",
        commonMistake:
          "Presenting the conclusion without the build. A large number with no visible construction is treated as decoration, whereas a smaller number with a defensible build is treated as analysis.",
        challenge:
          "Size the Indian market for one specific B2B product, bottom-up. Start from a countable unit and build to TAM, SAM and SOM, showing every step and citing each number's source. Then write two sentences on which assumption in your build is weakest.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "TAM, SAM, SOM",
            detail:
              "Total addressable, serviceable addressable, serviceable obtainable. Nested, and each requires a different argument — SAM is what your product could serve given capability and geography; SOM is what you could realistically win in a defined period.",
          },
          {
            title: "Bottom-up construction",
            detail:
              "Units × price × frequency, starting from a countable thing: businesses, households, transactions, professionals. The choice of unit determines everything downstream.",
          },
          {
            title: "Top-down and why it fails",
            detail:
              "'The Indian retail market is X and we need 1%' is not an argument, it is a wish. Every large market contains a 1% nobody has reached.",
          },
          {
            title: "Indian data sources",
            detail:
              "Census, MCA, MoSPI and RBI publications, industry bodies, exchange filings. Most decks use none — which is exactly why a visible build stands out.",
          },
          {
            title: "Sanity-checking and presenting",
            detail:
              "If your SOM implies a revenue no company in the sector has achieved, revisit it. And show the build, not the conclusion — the build is the argument.",
          },
        ],
        checks: [
          {
            question: "Why do investors discount top-down market sizing?",
            answer:
              "Because it proves nothing. Every large market contains a 1% that nobody has reached, and the number tells you nothing about whether this company can reach it.",
          },
          {
            question: "What is the difference between SAM and SOM?",
            answer:
              "SAM is the portion of the total market your product could serve given its capabilities and geography. SOM is what you could realistically win in a defined period given competition and your capacity.",
          },
          {
            question: "Your SOM implies ₹500 crore revenue in year five. How do you check it?",
            answer:
              "Against the largest revenue any company in that sector has achieved, and in what timeframe. If your SOM exceeds the sector leader's actual revenue, the build has an error in it.",
          },
          {
            question:
              "A deck claims a $50 billion market and a plan to capture 1%. What is wrong, and what do you ask for?",
            answer:
              "The 1% is not a plan — no mechanism in the deck produces exactly one percent of anything, and the number exists because it sounds modest while yielding $500 million. Ask for the bottom-up version: how many buyers exist, what fraction the product can actually serve and reach, at what price. If the founder cannot rebuild the market from units, the market slide is decoration — and the revenue model built on it inherits the same emptiness.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library — market sizing",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "The investor's view on why bottom-up is expected and top-down is discounted. Read one market-sizing piece and notice your challenge output already matches the format — that is the point.",
          },
          {
            type: "read",
            title: "Musings on Markets — TAM and its abuse",
            url: "https://aswathdamodaran.blogspot.com/",
            sourceName: "Aswath Damodaran",
            editorNote:
              "He has written specifically on how big-market stories and TAM inflation drive valuation errors — search the blog for his total-addressable-market posts. Connects today's slide directly back to module 3.",
          },
          {
            type: "read",
            title: "Ministry of Statistics and Programme Implementation",
            url: "https://www.mospi.gov.in/",
            sourceName: "MoSPI",
            editorNote:
              "Where real Indian denominators come from — enterprise counts, household surveys, sector statistics. Most decks use none of it; a market build cited to MoSPI reads differently.",
          },
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "Open a DRHP's industry section: companies must support market claims in a filing a regulator reads. That is what a defensible market argument looks like under scrutiny.",
          },
        ],
        concepts: [
          "market-sizing",
        ],
      },
      {
        title: "The narrative and the numbers agreeing",
        summary:
          "The failure mode that kills otherwise good raises: the deck says one thing, the model says another, and the second meeting finds it.",
        learningObjectives: [
          "List the numbers that must reconcile exactly between deck and model",
          "Implement the one-source rule so nothing is typed twice",
          "Explain what a discrepancy does to an investor's read of everything else",
        ],
        whyToday:
          "This is the failure mode that kills otherwise good raises. The deck says one thing, the model says another, and the inconsistency is discovered in the second meeting.",
        principle: "If the deck and the model disagree, the investor believes neither.",
        commonMistake:
          "Updating the model after investor feedback and not carrying the change back through the deck. It is the single most common source of second-meeting discrepancies.",
        challenge:
          "Take any deck you can find with financial claims. Build a one-page reconciliation listing every number in it, where it should come from, and whether the deck's numbers are internally consistent. Note every place two slides imply different things.",
        challengeMinutes: 25,
        estMinutes: 45,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Where deck and model diverge",
            detail:
              "The deck is updated after the model, or by a different person, or after feedback that was never carried back. The divergence is process, not talent — and the fix is process too.",
          },
          {
            title: "The numbers that must reconcile exactly",
            detail:
              "Current revenue, growth rate, headcount, burn, runway, the ask. Consistent units, consistent periods, consistent definitions across both documents.",
          },
          {
            title: "The one-source rule",
            detail:
              "Every number in the deck traces to a cell in the model. Nothing is typed twice — when the model updates, you know exactly which slides change.",
          },
          {
            title: "Version control",
            detail:
              "Decks circulate; models get updated. A deck sent three weeks ago is still being read, and someone will quote it back to you in a meeting.",
          },
          {
            title: "What a discrepancy costs",
            detail:
              "The investor stops evaluating the business and starts evaluating your care. A weak number is a business problem you can discuss; a discrepancy makes every other number suspect.",
          },
        ],
        checks: [
          {
            question: "Why is a discrepancy worse than a weak number?",
            answer:
              "A weak number is a business problem you can discuss. A discrepancy is a competence signal, and it makes every other number suspect.",
          },
          {
            question: "What does the one-source rule mean in practice?",
            answer:
              "Every figure in the deck is linked to or copied from a single identified cell in the model. When the model updates, you know exactly which slides change.",
          },
          {
            question: "Why does version control matter in a raise?",
            answer:
              "Decks circulate for weeks. If you update the model and the deck separately, someone is reading a version that no longer matches what you will say in the meeting.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "The FAST Standard",
            url: "https://fast-standard.org/",
            sourceName: "FAST Standard Organisation",
            editorNote:
              "The discipline of a single source for every number is a modelling convention, not a fundraising one. Learn it as a standard — the structure rules are the part to read.",
          },
          {
            type: "read",
            title: "Named ranges",
            url: "https://exceljet.net/glossary/named-range",
            sourceName: "ExcelJet",
            editorNote:
              "The mechanical means of implementing the one-source rule — a named cell the deck quotes is a number that cannot silently fork.",
          },
          {
            type: "read",
            title: "First Round Review",
            url: "https://review.firstround.com/",
            sourceName: "First Round Review",
            editorNote:
              "Search the Review for fundraising-mistakes pieces — practitioner accounts of losing a round on process rather than substance. Deep links rot here; the hub is one search away.",
          },
        ],
        concepts: [
          "pitch-deck",
          "startup-financial-model",
        ],
      },
      {
        title: "Building a driver-based startup model",
        summary:
          "Module 4's drivers become a model — the structure your degree taught, run on inputs it never mentioned.",
        learningObjectives: [
          "Build revenue as customers × price × frequency, never as last year plus a percentage",
          "Wire the driver tree: spend → CAC → customers → retention → revenue → cash",
          "Model monthly for eighteen months, annually thereafter, and say why",
        ],
        whyToday:
          "The build day, and the point where module 4's drivers become a model. This is also where their existing three-statement modelling connects to startup work — the structure is familiar, the drivers are not. Day 31 runs on days 21–26's numbers; if module 4 was skipped, this day has no inputs.",
        principle: "A model with a blended growth rate is a model nobody can interrogate.",
        commonMistake:
          "Building the model in the P&L format their degree taught, then bolting drivers on afterwards. The driver tree is the model; the P&L is a presentation of it.",
        challenge:
          "Build an eighteen-month driver-based model using your module 4 numbers: marketing spend, CAC, new customers, retention, active customers, revenue, contribution margin, fixed costs, net burn, closing cash. Every output must be a formula. Then change CAC by 20% and confirm every downstream figure updates, including runway. Before building, open two published startup model templates — several VCs and accelerators publish free ones — compare their driver structures, and close them.",
        challengeMinutes: 45,
        estMinutes: 50,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Drivers versus growth rates",
            detail:
              "Revenue as customers × price × frequency, never as last year plus a percentage. A 15% growth rate cannot be challenged specifically; a CAC assumption or a retention rate can.",
          },
          {
            title: "The driver tree",
            detail:
              "Marketing spend → CAC → new customers → retention → active customers → revenue. Each link is an assumption someone can argue with — which is what makes the model useful in a conversation.",
          },
          {
            title: "Inputs, calculations, outputs",
            detail:
              "One input block, no assumptions buried in formulas — the day-9 discipline, applied to a bigger machine. Headcount and costs are driven by the plan, not by a percentage of revenue.",
          },
          {
            title: "Linking to cash",
            detail:
              "The P&L is not the point; the cash line is. The model's bottom line is the bank balance by month, with collection timing — and the date it crosses zero.",
          },
          {
            title: "Monthly, then annually",
            detail:
              "Monthly for eighteen months, annually thereafter — precision where cash timing matters, direction where it does not. Modelling year five monthly implies a confidence nobody has.",
          },
        ],
        checks: [
          {
            question: "Why model revenue as customers × price rather than as a growth rate?",
            answer:
              "Because each component is separately arguable. A 15% growth rate cannot be challenged specifically; a CAC assumption or a retention rate can, and that is what makes a model useful in a conversation.",
          },
          {
            question: "Why monthly for eighteen months and annual after?",
            answer:
              "Cash timing matters in the near term and precision beyond eighteen months is false. Modelling year five monthly implies a confidence nobody has.",
          },
          {
            question: "What breaks when marketing spend rises 50% in a driver-based model?",
            answer:
              "New customers rise, but so does burn, and runway shortens. If CAC also rises with scale — which it usually does — the model should reflect that rather than holding CAC constant.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "SaaS Metrics 2.0 — the drivers behind a forecast",
            url: "https://www.forentrepreneurs.com/saas-metrics-2/",
            sourceName: "David Skok (for Entrepreneurs)",
            editorNote:
              "The connection between unit economics and a forecast — exactly the module 4 to module 5 bridge. Third pass at this piece; this time read it as a model specification.",
          },
          {
            type: "tool",
            title: "Damodaran's valuation spreadsheets",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/spreadsh.htm",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "His models are unusually well structured and free. Look at how he separates inputs from calculations — that discipline is today's whole build.",
          },
          {
            type: "read",
            title: "SUMIFS function",
            url: "https://exceljet.net/functions/sumifs-function",
            sourceName: "ExcelJet",
            editorNote:
              "The aggregation layer of every driver model — cohorts by month, costs by category. If this is not fluent, the excel-at-work roadmap's aggregation week is the prerequisite being felt.",
          },
          {
            type: "read",
            title: "Switch between sets of values by using scenarios",
            url: "https://support.microsoft.com/en-us/office/switch-between-various-sets-of-values-by-using-scenarios-2068afb1-ecdf-4956-9822-19ec479f55a2",
            sourceName: "Microsoft Support",
            editorNote:
              "Needed for tomorrow, and worth setting up today — the scenario machinery bolts straight onto a model whose inputs live in one block.",
          },
        ],
        concepts: [
          "startup-financial-model",
          "excel-scenario-analysis",
        ],
      },
      {
        title: "Scenario and sensitivity in a fundraising model",
        summary:
          "A single-scenario model implies a confidence that undermines it — scenarios convert a forecast into an argument about what matters.",
        learningObjectives: [
          "Build base, downside and upside off one switch, changing only the drivers that matter",
          "Rank every driver by its effect on eighteen-month closing cash",
          "Construct a downside with a mechanism, not a haircut",
        ],
        whyToday:
          "A single-scenario model implies a confidence that undermines it. Scenarios convert a forecast from a prediction into an argument about what matters — the same technique as module 3 day 14's terminal-value drill, applied to a different question.",
        principle: "Show the downside yourself. The investor will find it anyway.",
        commonMistake:
          "Building scenarios by changing every input at once. The result shows a range and hides the mechanism, when the mechanism is the entire value of the exercise.",
        challenge:
          "Extend yesterday's model with three scenarios and a two-way sensitivity table on runway across CAC and retention. Rank all your drivers by their effect on eighteen-month closing cash. Then write one paragraph identifying the single assumption the whole model rests on, and what you would want to see to believe it.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Three scenarios, not five",
            detail:
              "Base, downside, upside — a reader compares three and skims five. What changes between them is the two or three drivers that actually matter, not every input.",
          },
          {
            title: "The switch architecture",
            detail:
              "One scenario cell; every scenario-varying assumption looks it up. Duplicated sheets drift within a week — the switch keeps one model telling three stories consistently.",
          },
          {
            title: "Sensitivity tables and the load-bearing driver",
            detail:
              "One-way and two-way tables show where the output is most exposed. Change each input by 10% and rank the effect — usually one or two dominate, and that is where diligence and attention belong.",
          },
          {
            title: "The downside that matters",
            detail:
              "Not 'growth is slower' but 'CAC rises 40% as we move beyond the initial channel, and retention falls 10 points' — a mechanism someone can assess, with the impaired assumptions moving together, because bad quarters correlate.",
          },
          {
            title: "Presenting it",
            detail:
              "Lead with the driver ranking, not three columns of numbers. Founders resist showing the downside; showing it first converts the investor's private stress test into a shared conversation.",
          },
        ],
        checks: [
          {
            question: "Why three scenarios rather than five?",
            answer:
              "Because a reader compares three and skims five. The purpose is to show the range and the drivers, not to enumerate possibilities.",
          },
          {
            question: "What makes a downside case useful?",
            answer:
              "Specificity. 'Revenue 30% lower' is not a scenario; 'CAC rises 40% as we move beyond the initial channel, and retention falls 10 points' is a mechanism someone can assess.",
          },
          {
            question: "Why does showing the downside build credibility?",
            answer:
              "It demonstrates you have thought about failure and know where the model is fragile. An investor will find the fragility regardless; finding it first is the difference between preparation and being caught out.",
          },
          {
            question:
              "A founder's model shows base, upside and downside — and the downside still reaches profitability on the current raise. Your read?",
            answer:
              "That there is no downside case in the model. A downside where the round still works and the plan holds is the base case with a disclaimer — real downsides show what breaks, when, and what management does about it. I would rebuild it by impairing the two or three assumptions the thesis leans on hardest, together, since bad quarters correlate: slower conversion, later collections, one lost quarter. The result usually moves the raise amount or the milestone — which is why the founder's version avoided it.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Living with noise: valuation in the face of uncertainty",
            url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/probabilistic.pdf",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "The rigorous treatment of scenarios, simulations, and when each earns its complexity — it connects directly to module 3 day 15's scenario valuation. Read the scenario sections; the simulation half is optional depth.",
          },
          {
            type: "read",
            title: "Calculate multiple results by using a data table",
            url: "https://support.microsoft.com/en-us/office/calculate-multiple-results-by-using-a-data-table-e95e2487-6ca6-4413-ad12-77542a5ea50b",
            sourceName: "Microsoft Support",
            editorNote:
              "The mechanics of today's two-way runway table — CAC across, retention down, one formula. One careful read is enough.",
          },
        ],
        concepts: [
          "excel-scenario-analysis",
          "startup-financial-model",
        ],
      },
      {
        title: "The data room",
        summary:
          "The unglamorous day that determines how long a round takes — and directly billable adviser work.",
        learningObjectives: [
          "Assemble the Indian document set: MCA filings, statutory registers, GST, ESOP paper",
          "Structure folders to match the diligence checklist an investor will use",
          "Name the gaps that delay Indian rounds, and what each one's absence signals",
        ],
        whyToday:
          "The unglamorous day that determines how long a round takes. It is also directly billable advisory work, and the thing a founder is least likely to have done.",
        principle:
          "Diligence speed is a signal. A disorganised data room reads as a disorganised company.",
        commonMistake:
          "Assembling the data room after receiving a term sheet. Diligence then runs at the speed of document retrieval, and weeks of exclusivity are spent finding papers instead of answering questions.",
        challenge:
          "Build a complete data room folder structure for an Indian startup at Series A, populated with the document names that should exist in each. Then mark which five are most commonly missing, and what each one's absence delays. Find one published diligence checklist from an Indian VC or law firm and check yours against it — noting the checklist's date.",
        challengeMinutes: 25,
        estMinutes: 45,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What a data room contains",
            detail:
              "Corporate, financial, commercial, legal, HR, IP, and the current cap table — structured to match the diligence checklist an investor will use, with dates in filenames.",
          },
          {
            title: "The Indian document set",
            detail:
              "Incorporation documents, MCA filings, statutory registers, GST and tax filings, ESOP documentation, key contracts. This set has no US equivalent, and the free US material will mislead.",
          },
          {
            title: "Staging access",
            detail:
              "Enough before a term sheet to support the decision — corporate structure, financials, key metrics, cap table — with customer contracts and sensitive commercial detail held until terms are agreed.",
          },
          {
            title: "The gaps that delay rounds",
            detail:
              "Undocumented option grants, missing board resolutions, unsigned agreements, a cap table that disagrees with the register. Each gap is a finding: no board minutes means no governance rhythm.",
          },
          {
            title: "The Q&A log, and preparing early",
            detail:
              "Track what was asked, answered and by whom. A founder who assembles the room during diligence adds weeks; one who built it before the process compresses them.",
          },
        ],
        checks: [
          {
            question: "Why does a disorganised data room affect the deal and not just the timeline?",
            answer:
              "It signals how the company operates. An investor extrapolates from what they can see to what they cannot, and record-keeping is the most visible proxy for internal discipline.",
          },
          {
            question: "What are the most common gaps in an Indian startup's data room?",
            answer:
              "Undocumented ESOP grants, missing board resolutions for past issuances, statutory registers not maintained, and a cap table that does not reconcile to MCA filings.",
          },
          {
            question: "What should go in before a term sheet?",
            answer:
              "Enough to support the investment decision — corporate structure, financials, key metrics, cap table — while holding customer contracts and sensitive commercial detail until terms are agreed.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Stripe Atlas guides — record-keeping",
            url: "https://stripe.com/atlas/guides",
            sourceName: "Stripe Atlas",
            editorNote:
              "The practical discipline, explained without legal jargon. The Indian statutory layer differs — today's challenge sends you to find a dated Indian checklist for exactly that reason.",
          },
          {
            type: "read",
            title: "Y Combinator Startup Library — the fundraising process",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "Read one piece on the process timeline: where diligence sits, and how preparation compresses it. The data room is the difference between a two-week close and a two-month one.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "pitch-deck",
        ],
      },
      {
        title: "Auditing a founder's model",
        summary:
          "The module — arguably the roadmap — culminates here: the daily work of anyone advising startups, taught by no finance degree.",
        learningObjectives: [
          "Run the audit order: structure, arithmetic, logic, assumptions",
          "Use Excel's formula-auditing tools to make the work practical rather than tedious",
          "Report findings with errors separated from disagreements, ranked by effect",
        ],
        whyToday:
          "The module — and arguably the roadmap — culminates here. For anyone advising startups, this is the daily work, and no finance degree teaches it. Re-read your day 20 notes before starting: same skill, applied to a valuation rather than an operating model.",
        principle: "You will spend more time finding errors in models than building them.",
        commonMistake:
          "Rebuilding the model instead of auditing it. Your value is finding what is wrong and what it rests on within an hour — not producing a competing version by the end of the week.",
        challenge:
          "Take a startup model — one you can find, or deliberately break your own from day 31 in six ways. Produce a one-page audit: errors found with their cell references, the effect of each on the output, the two assumptions carrying the model, and the three questions you would ask the founder. Separate errors from disagreements explicitly. Then complete the module deliverable: your model and ten-slide deck, reconciled line by line.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 45,
        difficulty: "stretch",
        topics: [
          {
            title: "The order to check in",
            detail:
              "Structure, then arithmetic, then logic, then assumptions. Most errors are mechanical and found in the first two passes — and there is no point interrogating an assumption in a model that does not add up.",
          },
          {
            title: "Structural and mechanical checks",
            detail:
              "Does it balance, does cash reconcile, are there circular references, is there a check row at all. Then hardcodes inside formulas, broken SUM ranges, sign errors, inconsistent row logic across columns.",
          },
          {
            title: "Formula auditing in Excel",
            detail:
              "Trace precedents and dependents, error checking, evaluate formula. These two or three features make the work practical rather than tedious — an hour with them beats a day without.",
          },
          {
            title: "Logic errors and assumption interrogation",
            detail:
              "A growth rate applied to the wrong base, retention compounding incorrectly, a cost that should scale and does not. Then rank drivers by effect and question the top two rather than all twelve.",
          },
          {
            title: "How to report findings",
            detail:
              "Separate errors from disagreements, and lead with the ones that change the answer. Three material findings with cell references beat forty trivia — the memo is advice, not proofreading.",
          },
        ],
        checks: [
          {
            question: "In what order do you check a model?",
            answer:
              "Structure, arithmetic, logic, assumptions. Most errors are mechanical, they are fastest to find, and there is no point interrogating an assumption in a model that does not add up.",
          },
          {
            question:
              "You find one hardcoded number inside a formula. Why does it matter beyond that cell?",
            answer:
              "It indicates the model has not been audited, so there are likely others. One hardcode converts a spot check into a full review.",
          },
          {
            question: "How do you distinguish an error from a disagreement?",
            answer:
              "An error is objectively wrong — a broken range, a sign error, a figure that does not reconcile. A disagreement is an assumption you would set differently. Reporting them together makes both easier to dismiss.",
          },
          {
            question:
              "You are handed a founder's model an hour before a call. What do you check, in order?",
            answer:
              "Structure — where inputs live and whether revenue is driver-built or a typed growth row, which alone tells you how seriously to take it. Then hardcodes in the formula rows, then the cash line: does the model reach a bank balance, and when does it cross zero? Then one sanity check of the headline outputs against unit-economics benchmarks. In an hour you will not verify the model; you will find whether it is the kind of model that can be verified — and that is the first sentence of the call.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "The FAST Standard",
            url: "https://fast-standard.org/",
            sourceName: "FAST Standard Organisation",
            editorNote:
              "Knowing what a well-built model looks like tells you exactly where to look in a badly built one. Day 20 used it on valuations; today it is the audit baseline for an operating model.",
          },
          {
            type: "read",
            title: "Display the relationships between formulas and cells",
            url: "https://support.microsoft.com/en-us/office/display-the-relationships-between-formulas-and-cells-a59bef2b-3701-46bf-8ff1-d3518771d507",
            sourceName: "Microsoft Support",
            editorNote:
              "Trace precedents and evaluate formula are the two features that make model auditing practical rather than tedious. Ten minutes here pays back on every audit you ever run.",
          },
          {
            type: "read",
            title: "EuSpRIG — spreadsheet horror stories",
            url: "https://eusprig.org/research-info/horror-stories/",
            sourceName: "European Spreadsheet Risks Interest Group",
            editorNote:
              "Documented cases of spreadsheet errors with real institutional consequences — billions lost to broken ranges and hardcodes. Read two cases and the discipline sticks permanently.",
          },
        ],
        concepts: [
          "model-audit",
          "startup-financial-model",
          "excel-error-handling",
        ],
      },
    ],
  },
  {
    title: "Due diligence from the investor's side",
    weekRange: "Weeks 7–8",
    objective: "Reading a company the way the people writing the cheque do.",
    deliverable:
      "A full investment memo on a real startup — thesis, unit economics, valuation, risks, and an explicit statement of what would falsify your view.",
    estHours: 9,
    nodes: [
      {
        title: "What diligence is actually looking for",
        summary:
          "Diligence hunts for the thing that would change the decision — understanding that inverts how you read everything.",
        learningObjectives: [
          "State diligence's real objective and the three outcomes it can produce",
          "Map the workstreams — financial, commercial, legal, technical, HR — and how they intersect",
          "Scope diligence proportionately to the stage and the cheque",
        ],
        whyToday:
          "Most people entering this work assume diligence confirms what the deck said. It does the opposite — it hunts for the thing that would change the decision, and understanding that inverts how you read everything. Day 34's model audit was this discipline on a spreadsheet; this module runs it on a company.",
        principle: "Diligence is not verification. It is looking for the reason not to invest.",
        commonMistake:
          "Treating diligence as a checklist to complete rather than a question to answer. The checklist is a floor. The judgement is deciding which two items deserve three days.",
        challenge:
          "Take a startup you know something about. Write the five questions whose answers would most change an investment decision. For each, state how you would find the answer and what evidence would satisfy you. Rank them by how likely they are to be a problem. Then find two published VC diligence checklists and note the overlap — the common core is what diligence actually is.",
        challengeMinutes: 25,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The purpose",
            detail:
              "Find the deal-breaker before the money moves, and price what you find that is not fatal. The pitch is the best case; diligence exists to find what the best case omits.",
          },
          {
            title: "The workstreams",
            detail:
              "Financial, commercial, legal, technical, HR — who runs each and how they intersect. Different specialists, one synthesis.",
          },
          {
            title: "Confirmatory versus exploratory",
            detail:
              "Later-stage diligence confirms a thesis; early-stage diligence forms one. Which mode you are in changes what a finding means.",
          },
          {
            title: "What is proportionate",
            detail:
              "A ₹2 crore seed round does not get the diligence of a ₹200 crore Series C. Seed checks founder references, cap table, basic financials and legal cleanliness; growth adds quality of earnings and full financial work. Knowing the depth is professional judgement.",
          },
          {
            title: "The three outcomes, and the junior's job",
            detail:
              "Proceed, proceed at a different price or structure, or walk — the second is the most common and the most valuable. A junior adds value through thoroughness on the workstream they own, and by flagging what they cannot resolve rather than glossing it.",
          },
        ],
        checks: [
          {
            question: "Why is 'confirming the deck' the wrong frame?",
            answer:
              "Because it leads to checking what you were told rather than looking for what you were not told. The material risks are usually in what was omitted.",
          },
          {
            question: "What is proportionate diligence at seed?",
            answer:
              "Founder references, cap table, basic financials, a small number of customer conversations, and legal cleanliness. Full quality-of-earnings work on a company with eighteen months of revenue is disproportionate and slows a round for no information gain.",
          },
          {
            question: "What is the most valuable diligence outcome?",
            answer:
              "Proceeding at a different price or structure. Finding something that changes the terms rather than killing the deal is where diligence pays for itself.",
          },
          {
            question: "How would you scope diligence for a seed deal versus a growth deal?",
            answer:
              "By what exists to check. At seed there are barely any numbers, so the work is team and market: founder history verified, references done properly, the market sized bottom-up. At Series A, unit economics and cohorts become checkable and become the centre. At growth, full financial diligence — quality of earnings, working capital, legal — earns its cost. Running growth-stage diligence on a seed deal is theatre; skipping it on a growth deal is negligence. The scope follows the evidence available, not the cheque size.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "KPMG India — deal advisory",
            url: "https://kpmg.com/in/en/services/advisory/deal-advisory.html",
            sourceName: "KPMG India",
            editorNote:
              "The professional framing of workstreams and scope, from a firm that does it at volume — the free thought-leadership pieces linked here show what each workstream produces.",
          },
          {
            type: "read",
            title: "Y Combinator Startup Library — how investors decide",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "The investor's own account of what changes their mind, which checklists do not capture. Read one investor-perspective essay against today's five questions.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "due-diligence-commercial",
        ],
      },
      {
        title: "Quality of revenue",
        summary:
          "The most frequently overstated figure in a startup's financials — usually through timing and definition rather than fabrication.",
        learningObjectives: [
          "Test revenue quality: recognition timing, concentration, related parties, gross versus net",
          "Read receivables ageing against revenue as the first honesty check",
          "Assess a real revenue disclosure and write the three questions for management",
        ],
        whyToday:
          "Revenue is the number everything else is built on, and it is the most frequently overstated figure in a startup's financials — usually through timing and definition rather than fabrication.",
        principle:
          "Revenue recognised is not revenue collected, and neither is revenue retained.",
        commonMistake:
          "Accepting the revenue line and analysing everything below it. Almost every material financial issue in a startup originates in how revenue was defined and when it was recognised.",
        challenge:
          "Take a company's revenue disclosure from a DRHP or annual report. Analyse: recognition policy, customer concentration, related-party proportion, receivables ageing. Write a one-page assessment of revenue quality and the three questions you would ask management.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Recognition timing",
            detail:
              "When revenue is booked versus when cash arrives versus when the service is delivered — all three can differ legitimately. Ind AS 115's five-step model is the governing frame in India; the policy note is the first read.",
          },
          {
            title: "Concentration and related parties",
            detail:
              "One customer at 40% of revenue is a different business from ten at 4%. Related-party revenue — sales to entities connected to founders or investors — is common in Indian group structures, may not be arm's length, and may not persist after the transaction.",
          },
          {
            title: "Contracted versus one-off",
            detail:
              "The proportion that recurs, and whether 'recurring' means a contract or a habit. Module 4's cohort work returns here as evidence — revenue that repeats is worth a multiple of revenue that must be resold.",
          },
          {
            title: "Gross versus net",
            detail:
              "Whether the company is a principal or an agent determines which it may report, and the difference can be enormous — this specific issue has driven large restatements in Indian internet companies.",
          },
          {
            title: "Collections and ageing",
            detail:
              "Revenue with a 180-day receivable is not revenue yet. Receivables growing faster than revenue is the classic tell, and trended DSO converts the suspicion into a number.",
          },
        ],
        checks: [
          {
            question: "Why does gross versus net matter so much?",
            answer:
              "A marketplace reporting gross transaction value as revenue can show ten times the figure of one reporting only its commission. Same economics, wildly different revenue line and therefore different multiple.",
          },
          {
            question: "What does customer concentration change?",
            answer:
              "The risk profile and the valuation. Losing a customer worth 40% of revenue is an existential event, and an acquirer or investor will price that.",
          },
          {
            question: "Why is related-party revenue material?",
            answer:
              "It may not be arm's length and may not persist after the transaction. It is revenue that could vanish precisely when the new investor arrives.",
          },
          {
            question:
              "A target's revenue grew 40% and receivables grew 90% in the same year. What is your working hypothesis and how do you test it?",
            answer:
              "Booking is outrunning collecting — some of the growth is sales the customers have not paid for and may never pay for. Test it three ways: days sales outstanding trended over eight quarters, not two points; the ageing schedule, to see whether the growth sits in the oldest buckets; and revenue by month against the diligence date, to catch a quarter-end stuffing pattern. Then the sharpest question: what were the payment terms on the biggest new contracts of the year? Extended terms bought growth, and the buyer should not pay for it twice.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "PwC India — deals",
            url: "https://www.pwc.in/services/deals.html",
            sourceName: "PwC India",
            editorNote:
              "The professional framework for revenue and earnings quality, and specifically the tests the firms apply — their free published deal material is linked from here.",
          },
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "Open a DRHP's revenue recognition policy and related-party disclosures — real disclosures a company had to make to a regulator. The related-party section is often the most interesting page in a DRHP.",
          },
          {
            type: "read",
            title: "ICAI — the Ind AS framework",
            url: "https://www.icai.org/",
            sourceName: "Institute of Chartered Accountants of India",
            editorNote:
              "The home of the standards. Find the Ind AS 115 material — revenue from contracts with customers. You do not need it in full; the five-step model is what matters.",
          },
          {
            type: "read",
            title: "Zerodha Varsity — fundamental analysis",
            url: "https://zerodha.com/varsity/module/fundamental-analysis/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The revenue and receivables chapters model the honest read; today's DSO drill is that read with suspicion added.",
          },
        ],
        concepts: [
          "due-diligence-financial",
        ],
      },
      {
        title: "Quality of earnings and normalisation",
        summary:
          "The core of financial diligence and the most directly transferable skill in the module — what transaction services teams do all day.",
        learningObjectives: [
          "Build the bridge from reported to adjusted EBITDA, every adjustment listed and defended",
          "Separate legitimate normalisations from recurring costs in costume",
          "Compute what each adjustment does to price at the deal multiple",
        ],
        whyToday:
          "This is the core of financial diligence and the most directly transferable skill in the module — it is what Big Four transaction services teams do all day.",
        principle: "Every founder's EBITDA contains at least one adjustment they hope you miss.",
        commonMistake:
          "Accepting adjusted EBITDA as presented. The adjustments are the negotiation, and each one should be listed, justified and separately contested.",
        challenge:
          "Build an EBITDA bridge for a company from reported to adjusted. Include at least six adjustments — some legitimate, some contestable. For each, state the amount, the justification, and whether you would accept it as a buyer. Then calculate the valuation impact at an 8x multiple.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "What quality of earnings means",
            detail:
              "The sustainable, recurring earnings a buyer is actually acquiring. Normalisation removes genuinely non-recurring items to arrive at a run-rate — a one-off settlement, a restructuring, a genuine one-time event.",
          },
          {
            title: "Aggressive adjustments",
            detail:
              "Recurring marketing described as investment, understated future costs, three consecutive 'one-time' legal costs. The test is recurrence — a cost that appears repeatedly is a run-rate expense whatever it is labelled.",
          },
          {
            title: "The founder salary question",
            detail:
              "A founder paying themselves nothing inflates EBITDA by the cost of their replacement. Market-rate compensation is a real recurring cost the reported number omits — the adjustment runs downward.",
          },
          {
            title: "Related-party costs",
            detail:
              "Rent from a founder-owned entity, services from a connected company — priced kindly in either direction. Normalising to market prices can move EBITDA materially in small companies.",
          },
          {
            title: "The bridge, and why it changes the price",
            detail:
              "Reported EBITDA to adjusted, every adjustment separately listed and defended. The multiple applies to the adjusted number, so a ₹1 crore adjustment at 8x moves ₹8 crore of value — which is why adjustments are negotiated harder than almost anything else.",
          },
        ],
        checks: [
          {
            question: "A founder takes no salary. Is that an adjustment?",
            answer:
              "Yes, downward. A buyer must pay someone to do that job, so market-rate compensation is a real recurring cost that the reported EBITDA omits.",
          },
          {
            question: "'Growth marketing' excluded as a one-off investment. Accept?",
            answer:
              "Almost never. If the business needs marketing to sustain revenue, it is recurring by definition. Adjusting it out is the most common aggressive adjustment there is.",
          },
          {
            question: "Why does a ₹1 crore adjustment matter more than ₹1 crore?",
            answer:
              "Because the multiple applies to it. At 8x, a ₹1 crore adjustment moves ₹8 crore of enterprise value, which is why adjustments are negotiated harder than almost anything else.",
          },
          {
            question:
              "A target's adjusted EBITDA adds back ₹2 crore of 'one-time' costs. How do you evaluate it?",
            answer:
              "Item by item, against history. Pull three years of the same P&L lines: a truly one-time cost appears once; the third consecutive 'one-time restructuring' is a recurring cost wearing a label. Check related-party items at market pricing, founder compensation against a replacement salary, and whether any deferred maintenance or frozen hiring flatters the year. Then rebuild the bridge with only defensible adjustments — the buyer prices the sustainable number, and the delta on that bridge is usually worth more than the fee.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "KPMG India — deal advisory, the quality-of-earnings material",
            url: "https://kpmg.com/in/en/services/advisory/deal-advisory.html",
            sourceName: "KPMG India",
            editorNote:
              "The professional method with worked adjustment categories — the firms publish detailed transaction material free, and the QoE framing here is the one your bridge should survive.",
          },
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "A DRHP's restated financials section shows exactly this exercise performed and disclosed — Indian IPO rules require restatement, so the bridge is public.",
          },
          {
            type: "read",
            title: "Musings on Markets — earnings quality",
            url: "https://aswathdamodaran.blogspot.com/",
            sourceName: "Aswath Damodaran",
            editorNote:
              "Search his earnings-quality and accounting posts — they connect the adjustment work back to valuation, which is where its consequence lands.",
          },
        ],
        concepts: [
          "due-diligence-financial",
        ],
      },
      {
        title: "Working capital and the cash conversion cycle",
        summary:
          "Your degree covered this as a management topic. Diligence treats it as a valuation adjustment and a survival question.",
        learningObjectives: [
          "Compute the cash conversion cycle from twelve months of data, trended",
          "Model the working capital that growth consumes and check the funding covers it",
          "Explain the peg mechanism and spot pre-sale manipulation in a monthly series",
        ],
        whyToday:
          "Their degree covered working capital as a management topic. Diligence treats it as a valuation adjustment and a survival question, which is a different use of the same knowledge. Day 26's runway work connects here: working capital consumption is a burn driver.",
        principle: "A profitable company with a 90-day cycle can still die.",
        commonMistake:
          "Analysing working capital only at year-end. The annual figure is the most manageable number in the accounts, and the monthly series is where the behaviour shows.",
        challenge:
          "Calculate the cash conversion cycle for a company across twelve months of data. Identify seasonality and any month-end manipulation. Then calculate how much additional working capital 50% revenue growth would require, and state whether the company's cash position supports it.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The cash conversion cycle",
            detail:
              "Days inventory plus days receivable minus days payable — how long cash is tied up. Every day of the cycle is cash the company must fund.",
          },
          {
            title: "Why growth consumes cash",
            detail:
              "A growing business with a positive cycle needs more working capital every month — the need scales with the ambition, and profit on paper does not pay salaries.",
          },
          {
            title: "Normalised working capital and the peg",
            detail:
              "The level a business needs to operate is a diligence output and a deal term. The peg adjusts price for the level delivered at closing — and a peg set at the wrong point in a seasonal cycle transfers value between buyer and seller.",
          },
          {
            title: "Manipulation before a sale",
            detail:
              "Stretching payables, accelerating collections, running down inventory — all visible in a monthly series, invisible in a year-end figure. The gap between the average month and the reported month is the dressing, measured.",
          },
          {
            title: "The Indian context",
            detail:
              "Long receivable cycles in B2B and government contracts, and what that does to a growing company. The India-specific reality that makes this day different from the US material.",
          },
        ],
        checks: [
          {
            question: "Why does a growing profitable company run out of cash?",
            answer:
              "Growth increases receivables and inventory before the cash arrives. With a positive conversion cycle, every rupee of growth consumes cash — and profit on paper does not pay salaries.",
          },
          {
            question: "What is a working capital peg?",
            answer:
              "An agreed normal level of working capital at closing. Delivering below it reduces the price; above it increases it. Without a peg, a seller can extract cash before closing by starving working capital.",
          },
          {
            question: "How do you detect pre-sale manipulation?",
            answer:
              "Look at the monthly series rather than the year-end figure. Payables stretching, receivables collections accelerating and inventory running down in the final quarter is a recognisable pattern.",
          },
          {
            question:
              "A distributor with 6% margins wants to triple revenue in two years and has modelled the profit. What has the model probably missed?",
            answer:
              "The cash the growth consumes. With a typical distributor cycle — inventory plus receivables well ahead of payables — every incremental rupee of revenue demands its share of working capital upfront, and tripling revenue can require more cash than several years of 6% margins generate. The model shows profit because accrual profit ignores the funding gap. The check is one line: incremental working capital at the current cycle versus the funding plan. Companies grow into insolvency through exactly this door.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "PwC India — deals, the working capital material",
            url: "https://www.pwc.in/services/deals.html",
            sourceName: "PwC India",
            editorNote:
              "The peg mechanism explained by the people who negotiate it — their transaction publications cover working capital in deals specifically.",
          },
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "Indian filings discuss working capital requirements explicitly, often with the funding need stated — find the discussion in any recent DRHP and read it against today's arithmetic.",
          },
          {
            type: "read",
            title: "Zerodha Varsity — fundamental analysis",
            url: "https://zerodha.com/varsity/module/fundamental-analysis/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The ratio and working-capital chapters ground today's cycle arithmetic in real Indian statements. Free, no signup.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "working-capital",
        ],
      },
      {
        title: "Founder and team assessment",
        summary:
          "The least quantitative day in the roadmap, and at early stage the most determinative.",
        learningObjectives: [
          "Assess founder-market fit as a specific claim, not a slogan",
          "Run reference calls that produce information — including off-list references",
          "Write a qualitative assessment down with explicit bias controls",
        ],
        whyToday:
          "The least quantitative day in the roadmap, and at early stage the most determinative. Finance people are frequently uncomfortable here and default to the numbers — which at seed is where the information is not. The thinking-under-uncertainty roadmap's base-rate and bias material applies directly: founder assessment is where analytical people most reliably fool themselves.",
        principle:
          "At seed stage you are underwriting the founder. Say so, and assess accordingly.",
        commonMistake:
          "Substituting likeability for assessment. Founders who raise money are usually persuasive, and being persuaded is not the same as being convinced by evidence.",
        challenge:
          "Write a founder assessment framework: six questions you would ask the founder, four you would ask a reference, and the three signals you would treat as serious concerns. Then write two paragraphs on how you would guard against your own bias — particularly liking someone.",
        challengeMinutes: 25,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What you are actually assessing",
            detail:
              "Judgement, resilience, honesty about problems, ability to recruit, and founder-market fit — a specific reason this person is unusually well placed for this problem. 'Passionate about the space' is not a reason.",
          },
          {
            title: "Reference calls",
            detail:
              "How to run them, who to speak to beyond the list provided, and what off-list references reveal. Provided references are selected; a former colleague found independently gives you information the founder did not curate.",
          },
          {
            title: "The questions that surface judgement",
            detail:
              "What has gone wrong, what you got wrong, what you would do differently. Precise, unprompted honesty about what is not working is the strongest positive signal there is.",
          },
          {
            title: "Team composition and the equity split",
            detail:
              "What is missing and whether the founder knows it — and the split as a signal: a founder split that does not reflect contribution predicts future conflict.",
          },
          {
            title: "Documenting it, and bias hygiene",
            detail:
              "Write the assessment down so it can be checked later rather than remembered favourably. Pedigree, charisma and resemblance to past winners are the standard halos — naming them in the memo is the antidote.",
          },
        ],
        checks: [
          {
            question: "What does founder-market fit mean concretely?",
            answer:
              "A specific reason this person is unusually well placed for this problem — prior operating experience in it, an insight from lived exposure, or a durable obsession. 'Passionate about the space' is not a reason.",
          },
          {
            question: "Why do off-list references matter more?",
            answer:
              "Provided references are selected. A former colleague found independently, or an investor from a prior company, gives you information the founder did not curate.",
          },
          {
            question: "What is the strongest positive signal in a founder conversation?",
            answer:
              "Precise, unprompted honesty about what is not working. Founders who volunteer the weakest part of their business are almost always more reliable about everything else.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library — evaluating founders",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "YC has the largest dataset on this question of anyone and publishes freely about it. Read one founder-evaluation essay and notice how much of it is history and behaviour rather than polish.",
          },
          {
            type: "read",
            title: "First Round Review — reference checking",
            url: "https://review.firstround.com/",
            sourceName: "First Round Review",
            editorNote:
              "Search the Review for its reference-checking pieces — the practical method, including back-channel references, which is where the real information is.",
          },
        ],
        concepts: [
          "due-diligence-commercial",
        ],
      },
      {
        title: "Legal, regulatory and compliance red flags",
        summary:
          "You are not a lawyer and do not need to be — you need to know what to look for and when to escalate.",
        learningObjectives: [
          "Run the public compliance scan: MCA currency, charges, directors, litigation",
          "Check cap table integrity, ESOP paper, founder agreements and IP assignment",
          "Grade findings and know the point at which counsel takes over",
        ],
        whyToday:
          "You are not a lawyer, and you do not need to be. You need to know what to look for and when to escalate — which is a distinct and teachable skill. Much of the record is publicly checkable before you ask anyone a question.",
        principle:
          "The compliance history tells you how the company behaves when nobody is watching.",
        commonMistake:
          "Treating compliance as administrative. The compliance record is the highest-signal, lowest-cost proxy for how the company operates, and much of it is publicly checkable before you ask anyone a question.",
        challenge:
          "Take a real Indian startup. Check MCA for filing currency, directors and charges. Build a red-flag checklist across today's seven categories, marking what you can verify publicly, what requires document access, and what needs counsel. Then write the three items you would escalate first.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Corporate hygiene and cap table integrity",
            detail:
              "Board resolutions, statutory registers, filings up to date — the cheapest signal of internal discipline available. And the reconciliation: does the spreadsheet match MCA filings and the register of members?",
          },
          {
            title: "ESOP and founder paper",
            detail:
              "Grants made without board approval or scheme documentation are a common and expensive gap. Founder agreements — vesting, IP assignment, non-compete — matter most when a co-founder has already left.",
          },
          {
            title: "IP ownership",
            detail:
              "Is the intellectual property assigned to the company or held personally by a founder or a contractor? Contractor-built IP without assignment is one of the most common material gaps — a deal-breaker until cured, and curing it requires their cooperation.",
          },
          {
            title: "Tax, statutory and sector licensing",
            detail:
              "GST, TDS, PF and ESI compliance — arrears are both a liability and a signal. Sector licences: RBI for fintech, FSSAI for food, and the rest. A required licence, absent, is a valuation event, not a footnote.",
          },
          {
            title: "When to escalate",
            detail:
              "Any unresolved cap table discrepancy, any IP ownership question, any founder dispute, any regulatory arrears. Recognising the boundary of your competence is part of the professional skill.",
          },
        ],
        checks: [
          {
            question: "Why do overdue MCA filings matter beyond the penalty?",
            answer:
              "They indicate the company does not maintain basic hygiene. If the statutory filings are late, the option grants and board resolutions probably are too.",
          },
          {
            question: "What is the risk if IP is not assigned to the company?",
            answer:
              "The company does not own its core asset. A contractor or departed founder may hold rights to the product, which is a deal-breaker until cured — and curing it requires their cooperation.",
          },
          {
            question: "When do you stop and involve counsel?",
            answer:
              "Any unresolved cap table discrepancy, any IP ownership question, any founder dispute, and any regulatory arrears. Recognising the boundary of your competence is part of the professional skill.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "SEBI — legal framework and regulations",
            url:
              "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=3&smid=0",
            sourceName: "SEBI",
            editorNote:
              "The regulator's own index of the rules. For private-company diligence it is context; module 7 makes it central. Bookmark it — 'check the current circular' starts here.",
          },
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "A DRHP's litigation and regulatory disclosures show what a company must reveal when a regulator reads it. See what those disclosures actually look like before writing your checklist. MCA itself blocks automated checks — today's challenge sends you to the portal by name.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "regulatory-sebi",
        ],
      },
      {
        title: "Writing the investment memo",
        summary:
          "The module and the analytical arc of the roadmap end in a document someone else can decide from.",
        learningObjectives: [
          "Structure the memo with the recommendation in the first three sentences",
          "Write the thesis as falsifiable claims and the risks honestly",
          "Complete the module deliverable: a three-page memo, every figure traceable",
        ],
        whyToday:
          "The module and the analytical arc of the roadmap end in a document. Everything from modules 3 through 6 exists to be written down here in a form someone else can decide from. Reread your day 20 valuation critique and day 34 audit notes first — both feed the memo.",
        principle: "A memo that does not state what would change your mind is not a memo.",
        commonMistake:
          "Writing the memo as advocacy. A memo that only supports the recommendation is a pitch, and readers discount it accordingly. The credibility comes from the risks section and the falsification conditions.",
        challenge:
          "Write a complete investment memo on one real startup, three pages maximum. Include: recommendation, thesis as falsifiable claims, market with your bottom-up sizing, unit economics, valuation with your method stated, the three risks that matter, and an explicit section on what would change your view. Every figure traceable.",
        challengeMinutes: 45,
        estMinutes: 45,
        points: 45,
        difficulty: "stretch",
        topics: [
          {
            title: "What a memo is for",
            detail:
              "Enabling a decision by someone who has not done the work, and creating a record that can be checked later. The reader should know your view in the first three sentences.",
          },
          {
            title: "The structure",
            detail:
              "Recommendation first, then thesis, market, team, business and unit economics, financials, valuation, risks, and what would change the view. Two to four pages — a memo nobody finishes has failed regardless of quality.",
          },
          {
            title: "The thesis as falsifiable claims",
            detail:
              "What must be true for this to work, stated as claims that could be observed to be false. 'The market is large' is not falsifiable; 'SMB adoption will reach X because Y is now cheap enough' is.",
          },
          {
            title: "Risks written honestly",
            detail:
              "The ones you cannot resolve, not a list of generic startup risks. The bear case written as its best advocate would write it — a strawman bear case tells the reader the thinking stopped at yes.",
          },
          {
            title: "What would change your mind",
            detail:
              "The section that separates a memo from a pitch, and the one most often omitted. It converts an opinion into a testable position and creates the record that makes you better over time.",
          },
        ],
        checks: [
          {
            question: "Why does the recommendation come first?",
            answer:
              "The reader is deciding whether to spend time, and a memo that withholds its conclusion wastes theirs. It also forces you to have a view rather than assembling material.",
          },
          {
            question: "What makes a thesis falsifiable?",
            answer:
              "It states conditions that could be observed to be false. 'The market is large' is not falsifiable; 'SMB adoption will reach X because Y is now cheap enough' is.",
          },
          {
            question: "Why is 'what would change my mind' the most important section?",
            answer:
              "It converts an opinion into a testable position, tells the reader where the argument is weakest, and creates a record that makes you a better investor over time because you can check yourself later.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Bessemer Venture Partners — the memo archive",
            url: "https://www.bvp.com/memos",
            sourceName: "Bessemer Venture Partners",
            editorNote:
              "Real historical investment memos, released publicly — Shopify, LinkedIn, Twilio among them. Read two in full before writing: the structure and the tone are learned by reading, not by description.",
          },
          {
            type: "read",
            title: "Writing to GOV.UK standards — the style guide",
            url: "https://www.gov.uk/guidance/style-guide",
            sourceName: "GOV.UK",
            editorNote:
              "The memo is a writing task, and the constraint that improves it most is cutting length. This is the plainest free style discipline available — apply its short-sentences rule to your draft and watch a page disappear.",
          },
        ],
        concepts: [
          "due-diligence-financial",
          "due-diligence-commercial",
          "startup-valuation",
        ],
      },
    ],
  },
  {
    title: "SME IPO and the Indian regulatory layer",
    weekRange: "Weeks 8–9",
    objective: "The India-specific module, and the one that rots fastest.",
    deliverable:
      "Read one filed DRHP end to end and produce a two-page critical summary — the business, the risks that matter, and the three questions you would ask management.",
    estHours: 7,
    nodes: [
      {
        title: "Why an SME lists at all",
        summary: "The IPO as one financing option among several — evaluated, not celebrated.",
        learningObjectives: [
          "Weigh listing against the alternatives: PE, debt, staying private",
          "Price the real costs — fees, compliance, disclosure, founder time",
          "Name the wrong reasons to list, which an adviser will hear weekly",
        ],
        whyToday:
          "The module opens with the decision, not the process — because the adviser's first job is telling some clients not to do it. The SME platforms have real momentum in India, and momentum is exactly when the financing-decision framing earns its keep.",
        principle: "An IPO is a financing decision, not a milestone.",
        commonMistake:
          "Treating the listing as the goal and working backwards. The honest analysis starts from what the company needs — capital, liquidity for early holders, currency for acquisitions, credibility with lenders — and asks whether a listing is the cheapest way to get it. Often it is not.",
        challenge:
          "Take one SME that recently listed (the exchanges publish them). From its offer document's stated objects and its financials, write one page: what it actually needed, what the listing cost all-in, and whether an alternative would have been cheaper. Conclude honestly — sometimes the answer is 'the IPO was right'.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "What a listing buys",
            detail:
              "Primary capital, an exit path for early investors, paper for acquisitions and ESOPs, and the credibility that comes with disclosure. Each has a private-market substitute at a price — the comparison is the analysis.",
          },
          {
            title: "What it costs",
            detail:
              "Merchant banker and intermediary fees, ongoing compliance and disclosure, quarterly scrutiny, and a founder-year of attention. All-in costs on small raises can be a material slice of the proceeds.",
          },
          {
            title: "The wrong reasons",
            detail:
              "Prestige, a peer listed, 'the market is hot'. Each produces listed companies that should not be — thinly traded, compliance-burdened, and worse off than before. The adviser hears all three weekly.",
          },
          {
            title: "The SME platform's actual promise",
            detail:
              "A listing venue sized for companies the main board would reject — lower thresholds, lighter ongoing burden, and a migration path when scale arrives. Day 47 walks the staircase.",
          },
        ],
        checks: [
          {
            question: "What is the honest starting question for a listing decision?",
            answer:
              "What does the company actually need — capital, liquidity, currency, credibility — and is a listing the cheapest way to get it?",
          },
          {
            question: "Name three wrong reasons to list.",
            answer:
              "Prestige, a competitor listed, and a hot market — none is a financing rationale.",
          },
          {
            question: "What does an SME platform offer that the main board does not?",
            answer:
              "Entry thresholds and ongoing burden sized for smaller companies, with a migration path to the main board later.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Zerodha Varsity — the IPO markets, part 1",
            url: "https://zerodha.com/varsity/chapter/the-ipo-markets-part-1/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The why and the who of going public, in plain Indian-market language, free with no signup. Read it today; part 2 carries the process on day 46.",
          },
          {
            type: "video",
            title: "BSE SME Platform Explained — Capital Market Masterclass",
            url: "https://www.youtube.com/watch?v=Ux8JVB_cqgg",
            sourceName: "The Hindu (YouTube)",
            youtubeVideoId: "Ux8JVB_cqgg",
            durationSec: 1388,
            estSizeMb: 176,
            editorNote:
              "Twenty-three minutes on what the platform is for, with BSE's own leadership explaining it — the closest thing to exchange-published video that verifies. Note the date; criteria quoted in any video need re-checking against the exchange page.",
          },
          {
            type: "read",
            title: "Why and how do companies list — what is an IPO",
            url: "https://zerodha.com/varsity/chapter/why-and-how-do-companies-list-and-what-is-an-ipo/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The foundational chapter under part 1 — angel-to-IPO in one arc, with the embedded video. If the funding ladder from module 1 is fresh, skim; if not, this is the recap.",
          },
        ],
        concepts: [
          "sme-ipo-framework",
        ],
      },
      {
        title: "NSE Emerge and BSE SME — eligibility",
        summary: "The criteria that decide the timeline before any banker is hired.",
        learningObjectives: [
          "Work through the SME platform eligibility heads: net worth, track record, profitability",
          "Map a real company against the criteria and find its binding constraint",
          "Explain why eligibility drives timeline more than ambition does",
        ],
        whyToday:
          "Eligibility is the gate everything else queues behind: a company two years from qualifying has a two-year advisory plan, not an IPO plan. The criteria themselves are checkable facts — and they change by circular, which is why this day teaches the checking, not just the current numbers.",
        principle:
          "The eligibility criteria decide the timeline more than anything the company does.",
        commonMistake:
          "Quoting eligibility numbers from memory or from a blog. The criteria are exchange rules amended by circular — the adviser's habit is pulling the current criteria pages at every engagement, because advice built on last year's thresholds is malpractice with citations.",
        challenge:
          "Pull the current BSE SME eligibility criteria from the exchange itself. Map one real private company against every head — net worth, track record, profitability, the rest — and write the gap analysis: which criterion binds, what closes the gap, and the earliest honest filing date.",
        challengeMinutes: 50,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The heads of eligibility",
            detail:
              "Post-issue capital bounds, net worth, tangible assets, track record and profitability history, plus governance basics. Each platform publishes its own current list — the list is the law here.",
          },
          {
            title: "The binding constraint",
            detail:
              "Most companies fail one head, not all of them. Finding the binding constraint converts 'can we list?' into a dated plan: what must be true, by when, evidenced how.",
          },
          {
            title: "Two exchanges, one framework",
            detail:
              "BSE SME and NSE Emerge implement the same SEBI framework with their own criteria and processes. Advisers compare both for each client; this roadmap cites BSE's pages because NSE's site blocks automated verification — the framework knowledge transfers wholly.",
          },
          {
            title: "Criteria drift",
            detail:
              "Thresholds move by circular — sometimes materially. The skill being taught is the verification habit: current page, current circular, dated note in the file.",
          },
        ],
        checks: [
          {
            question: "Why does eligibility drive the timeline?",
            answer:
              "A company short of a criterion cannot file until it cures the gap — the cure time, not the ambition, sets the earliest date.",
          },
          {
            question: "What is the binding-constraint method?",
            answer:
              "Map the company against every head, find the one it fails, and plan against that — it converts eligibility into a dated to-do.",
          },
          {
            question: "Why must criteria be pulled fresh each engagement?",
            answer:
              "They are amended by circular; advice on stale thresholds is wrong with confidence.",
          },
          {
            question:
              "A promoter wants to file for an SME listing in six months. What do you check first, and why?",
            answer:
              "Current eligibility, head by head, from the exchange's own page — because a single failed criterion makes every other workstream irrelevant until cured. Then the track-record and profitability heads specifically, since they are the ones time alone can fix and therefore the ones that set real timelines. The six-month ambition is an output of that gap analysis, not an input to it — and telling the promoter so is the first piece of advice.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "BSE SME platform",
            url: "https://www.bsesme.com/",
            sourceName: "BSE",
            editorNote:
              "The exchange's own SME site — eligibility, process and the list of companies on the platform. This is the primary source the challenge pulls from; blogs summarising it go stale.",
          },
          {
            type: "doc",
            title: "BSE — about the SME platform",
            url: "https://www.bseindia.com/static/about/bsesme.html",
            sourceName: "BSE",
            editorNote: "The main-site companion page — framework context around the platform.",
          },
          {
            type: "doc",
            title: "BSE SME — the listing procedure",
            url: "https://www.bsesme.com/static/getlisted/listingprocedure.aspx",
            sourceName: "BSE",
            editorNote:
              "The get-listed pages carry the current criteria and steps — this is where the challenge's numbers come from, dated by the exchange itself. The equivalent NSE Emerge pages exist; their site blocks automated checks, so open them by hand and compare, as day 43's challenge asks.",
          },
        ],
        concepts: [
          "sme-ipo-framework",
        ],
      },
      {
        title: "The DRHP, section by section",
        summary: "The anatomy of the offer document — and where its truth density varies.",
        learningObjectives: [
          "Map the DRHP's sections and each one's job",
          "Know who writes each part and for whom — which sections sell, which confess",
          "Read risk factors first, and know why",
        ],
        whyToday:
          "The DRHP is the genre's central document — for issuers, the disclosure burden; for analysts, the richest free company document India produces. Learning its anatomy today makes tomorrow's critical read possible.",
        principle:
          "The risk factors are the only part written by lawyers protecting themselves. Read them first.",
        commonMistake:
          "Reading front to back. The front is written to sell; the truth density lives in risk factors, related-party disclosures, litigation, and the financial statements' notes. Analysts read confession first, marketing last — the order is the method.",
        challenge:
          "Open any filed DRHP (SEBI and the exchanges publish them). Do not read it — map it: every major section, one line each on its job and its author's incentive. Mark the four highest-truth-density sections. Tomorrow you read; today you learn where.",
        challengeMinutes: 55,
        estMinutes: 75,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The anatomy",
            detail:
              "Summary and industry overview, business, risk factors, objects of the issue, financial statements with restatements, management and promoters, legal and other information. Each section has a defined job under the regulations.",
          },
          {
            title: "Authors and incentives",
            detail:
              "The business section is management's story via bankers; risk factors are counsel's shield; financials are the auditors' restated numbers. Reading a section without knowing its author reads advertising as testimony.",
          },
          {
            title: "Risk factors as confession",
            detail:
              "Liability drives completeness: what is disclosed cannot later be called concealed. The specific, quantified risks matter; the boilerplate is chaff — telling them apart is tomorrow's skill.",
          },
          {
            title: "Objects of the issue",
            detail:
              "What the money is for, with monitoring obligations attached. Vague objects — 'general corporate purposes' at the cap — are themselves a disclosure about planning.",
          },
        ],
        checks: [
          {
            question: "Why are risk factors the honest section?",
            answer:
              "Liability — counsel discloses exhaustively because anything disclosed cannot later be called concealed. Confession, not marketing.",
          },
          {
            question: "What is the analyst's reading order and why?",
            answer:
              "Truth-dense sections first — risks, related parties, litigation, financial notes — then the business narrative, read against them.",
          },
          {
            question: "What does a vague objects-of-the-issue section disclose?",
            answer:
              "The state of planning — money raised without specific priced uses is itself a finding.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "The regulator's own archive of filed offer documents — every DRHP, free. Pick tomorrow's document from here today: an SME issue in a business you can understand.",
          },
          {
            type: "doc",
            title: "BSE — live public issues",
            url: "https://www.bseindia.com/publicissue.html",
            sourceName: "BSE",
            editorNote:
              "The exchange side of the same paperwork — issues currently open or recently closed, with offer documents attached. Cross-reading a filing here against its SEBI copy shows you which document is which.",
          },
        ],
        concepts: [
          "drhp-structure",
        ],
      },
      {
        title: "Reading a real DRHP critically",
        summary: "The full critical read — the day the document becomes evidence.",
        learningObjectives: [
          "Execute the truth-density reading order on a real filing",
          "Cross-examine sections against each other for contradictions",
          "Extract the three questions the document cannot answer",
        ],
        whyToday:
          "Yesterday's map, today's territory. A filed DRHP is the most detailed free document about any company you will ever get — and the module deliverable's raw material. This is also diligence practice with public evidence: every module-6 skill runs here without an NDA.",
        principle:
          "A filed DRHP is the most detailed free document about any company you will ever get.",
        commonMistake:
          "Reading sections in isolation. The findings live in the joins: growth narrative versus receivables trend; 'diversified customers' versus the concentration table; promoter salary versus company profit; objects of the issue versus the balance sheet's actual needs. Contradiction between sections is the highest-value read.",
        challenge:
          "Read your chosen DRHP end to end in the truth-density order. Produce working notes: five specific risks that matter (not boilerplate), three cross-section contradictions or tensions, and the three questions you would put to management. Tomorrow's process day and day 48's deliverable both build on these notes.",
        challengeMinutes: 75,
        estMinutes: 90,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The specific-risk filter",
            detail:
              "Boilerplate risks appear in every filing; the risks that matter name numbers, customers, dependencies and dates. A risk factor with a quantity in it was fought over — that is the tell.",
          },
          {
            title: "Cross-examination",
            detail:
              "Restated financials versus the narrative; related-party schedules versus the business description; litigation versus 'no material proceedings'. The document is long enough to disagree with itself, and where it does is where to dig.",
          },
          {
            title: "The promoter read",
            detail:
              "Salary history, related-party dealings, share pledges, past ventures. The DRHP discloses more about promoters than any private-round data room volunteers — use it.",
          },
          {
            title: "Questions as output",
            detail:
              "The critical read ends in questions the document raises but cannot answer — the management-meeting agenda. Writing them precisely is the skill the deliverable grades.",
          },
        ],
        checks: [
          {
            question: "What distinguishes a risk factor that matters from boilerplate?",
            answer:
              "Specificity — named customers, quantities, dates. Quantified risks were negotiated into the document; generic ones came with the template.",
          },
          {
            question: "Where do the highest-value DRHP findings live?",
            answer:
              "In contradictions between sections — narrative versus financials, claims versus schedules.",
          },
          {
            question: "What is the proper output of a critical read?",
            answer:
              "Precise questions the document cannot answer — the agenda for management, and the spine of the summary.",
          },
          {
            question:
              "You have two hours with a DRHP before a call. What do you read, in what order?",
            answer:
              "Risk factors first, filtering for the specific ones — numbers, named customers, dates — because those were fought over. Then related-party transactions and litigation, then the restated financials' notes, and only then the business section, read against what the honest sections already told me. In the margins I keep two lists: contradictions between sections, and questions the document raises but cannot answer. Those lists are the call agenda — the summary can wait, the questions cannot.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "Your document lives here. If the one you picked turns out unreadable — scanned badly, or a business you cannot judge — swap it now rather than push through; the skill needs a real read.",
          },
          {
            type: "video",
            title: "Hyundai Motor India IPO Review — a worked example",
            url: "https://www.youtube.com/watch?v=gwpcgnb0EiE",
            sourceName: "CA Rachana Ranade (YouTube)",
            youtubeVideoId: "gwpcgnb0EiE",
            durationSec: 877,
            estSizeMb: 111,
            editorNote:
              "Fifteen minutes of someone actually reading an offer document — business, financials, risks — in the Indian context. It is a mainboard IPO, not SME, and a specific deal rather than a method; watch it for the reading habit, then apply the same moves to your DRHP.",
          },
        ],
        concepts: [
          "drhp-structure",
          "due-diligence-financial",
        ],
      },
      {
        title: "The process — merchant banker to listing",
        summary: "The pipeline, the parties, and the incentive map that explains the behaviour.",
        learningObjectives: [
          "Walk the process: appointment, diligence, filing, review, issue, listing",
          "Map every party to what they are paid for and when",
          "Predict the standard frictions from the incentive map",
        ],
        whyToday:
          "The client will ask 'what happens and how long?' — and the honest answer is a pipeline with parties attached. The incentive map matters more than the Gantt chart: who is paid at which milestone explains nearly every behaviour the client will find confusing.",
        principle:
          "Every party in an IPO is paid at a different milestone. That explains most of the behaviour.",
        commonMistake:
          "Explaining the process as a schedule rather than a system of incentives. The banker's fee lands at completion — hence pressure to proceed; counsel bills time — hence exhaustive caution; the exchange wants listings that do not embarrass it — hence scrutiny. The client navigates people, not phases.",
        challenge:
          "Draw the process map twice: once as a timeline with phases and rough durations, once as an incentive map — every party, what they do, what they are paid, at which milestone. Write three predictions of where friction will appear, derived from the second map. Those predictions are the adviser's realism.",
        challengeMinutes: 45,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The pipeline",
            detail:
              "Merchant banker appointed; due diligence and restatement; DRHP drafted and filed; exchange and regulator review with query rounds; issue opens and closes; allotment; listing. Months end to end, with the review rounds the least predictable.",
          },
          {
            title: "The parties",
            detail:
              "Merchant banker leads and underwrites the process; auditors restate; counsel papers; registrar handles applications; the exchange reviews and lists; market makers support SME trading after. Each appears exactly when their fee structure predicts.",
          },
          {
            title: "The query rounds",
            detail:
              "The exchange and regulator return questions on the filing; each round costs weeks. Clean first filings are the merchant banker's craft — and the adviser's diligence in module-6 style is what makes filings clean.",
          },
          {
            title: "SME specifics",
            detail:
              "The SME route trades some review burden for underwriting and market-making obligations — the banker carries more risk, which shapes who will take small mandates and at what fee.",
          },
        ],
        checks: [
          {
            question: "Why does the incentive map predict process behaviour?",
            answer:
              "Each party acts around its payment milestone — completion-paid bankers push pace, time-billed counsel exhausts caution, reputation-paid exchanges scrutinise.",
          },
          {
            question: "What makes IPO timelines unpredictable?",
            answer:
              "The query rounds — each regulator or exchange round adds weeks, and the count depends on filing quality.",
          },
          {
            question: "What does the SME route add to the banker's role?",
            answer:
              "Underwriting and market-making obligations — more banker risk, which shapes fees and mandate appetite.",
          },
          {
            question: "Why do IPO timelines slip, structurally?",
            answer:
              "The query rounds. Everything else in the pipeline is schedulable work; the regulator's and exchange's questions on the filing arrive in rounds, each costing weeks, and the number of rounds depends on filing quality — which was determined months earlier by the diligence and drafting. So the honest timeline answer is a range whose width is filing quality, and the honest advice is that money spent making the first filing clean buys back multiples of its time later. Every party's incentive map says the banker will still promise the short end.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Zerodha Varsity — the IPO markets, part 2",
            url: "https://zerodha.com/varsity/chapter/the-ipo-markets-part-2/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The process end of the story — from filing to listing in Indian-market terms. Read alongside your process map and reconcile the two.",
          },
          {
            type: "read",
            title: "Rights issue, OFS and FPO — how listed companies raise",
            url: "https://zerodha.com/varsity/chapter/supplementary-note-ipo-ofs-fpo/",
            sourceName: "Zerodha Varsity",
            editorNote:
              "The supplementary note on what happens after listing — rights issues, offers for sale, FPOs. Ten minutes that stop 'IPO' being the only word you know for a public raise.",
          },
        ],
        concepts: [
          "ipo-process",
        ],
      },
      {
        title: "Migration to the main board",
        summary: "The staircase's second step — and what the SME listing was always for.",
        learningObjectives: [
          "State the migration path and its criteria in outline",
          "Advise on listing venue with the second step in view from the start",
          "Track migration criteria the same way as eligibility — current page, dated note",
        ],
        whyToday:
          "Migration completes the strategic picture: the SME platform is not a destination but a staircase, and clients deciding today's step deserve advice that has already looked at the next one. It is also the day's second lesson in criteria-checking discipline.",
        principle: "The SME platform is a staircase, and the second step has its own criteria.",
        commonMistake:
          "Advising the SME listing without modelling the migration. Company trajectories that will clear main-board criteria in two years have a different optimal path than those that will not — and the difference should shape today's structuring, not be discovered later.",
        challenge:
          "For the company you mapped on day 43: model its trajectory against migration criteria in outline. Write the two-paragraph advice: list where, when, and what today's choices do to the second step. Then pull the current migration requirements from the exchange and date your note.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "Why migration exists",
            detail:
              "The SME platform is sized for entry; the main board offers liquidity, index inclusion and institutional access. Migration is the designed path between them — the staircase, by intent.",
          },
          {
            title: "The criteria in kind",
            detail:
              "Time listed, capital thresholds, and shareholder-approval requirements — the heads are stable, the numbers move by circular. As with day 43: the current page is the source, the blog is not.",
          },
          {
            title: "Advising with the staircase in view",
            detail:
              "Issue sizing, capital structure and governance choices at SME listing all echo at migration. The two-step plan is the adviser's product; the one-step plan is a banker's.",
          },
          {
            title: "The freshness habit, again",
            detail:
              "This module's recurring discipline: pull, cite, date. Migration rules changed before and will again — the roadmap's quarterly review exists for exactly these pages.",
          },
        ],
        checks: [
          {
            question: "What is the SME platform, strategically?",
            answer:
              "A staircase — an entry venue with a designed migration path to the main board, not a destination.",
          },
          {
            question: "Why must migration be modelled at listing time?",
            answer:
              "Sizing and structure choices at the SME step echo at migration — the second step shapes the first.",
          },
          {
            question: "What is the module's recurring source discipline?",
            answer:
              "Pull the current criteria from the exchange, cite the page, date the note — never advise from memory or blogs.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "BSE SME platform",
            url: "https://www.bsesme.com/",
            sourceName: "BSE",
            editorNote:
              "The migration criteria live on the exchange's SME pages alongside eligibility. Pull the current version for the challenge — the habit is the lesson.",
          },
        ],
        concepts: [
          "sme-ipo-framework",
          "ipo-process",
        ],
      },
      {
        title: "SEBI ICDR and the adviser's obligations",
        summary:
          "Where the rules bind you personally — and the roadmap's deliverable, completed.",
        learningObjectives: [
          "Locate the ICDR framework and the disclosure obligations it drives",
          "Know where an adviser's own conduct is regulated — and where the lines are",
          "Complete the module deliverable: the two-page critical DRHP summary",
        ],
        whyToday:
          "The roadmap ends where professional responsibility begins: some of this audience will advise on real transactions within months, and knowing where the rule binds you — not just the client — is part of the advice. The deliverable then closes the module with the analyst's artefact.",
        principle: "Knowing where the rule binds you is part of the advice.",
        commonMistake:
          "Treating regulation as the lawyers' territory entirely. The lawyer interprets; the adviser must know the landscape — which activities require registration, what disclosure obligations attach, where 'helping with the pitch' ends and regulated activity begins. Ignorance of the boundary is itself the compliance failure.",
        challenge:
          "Complete the deliverable: the two-page critical summary of your DRHP — the business in plain language, the five risks that matter, the cross-section findings, and the three management questions. Then the final page of the roadmap: your own one-paragraph note on which activities in this course's skillset touch regulated territory, with the ICDR listing bookmarked and dated. Not investment advice; educational material about method — and now you know why that sentence is on every page.",
        challengeMinutes: 75,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The ICDR framework",
            detail:
              "SEBI's Issue of Capital and Disclosure Requirements regulations govern what can be issued, to whom, with what disclosures — the DRHP's skeleton is this regulation made visible. The current consolidated text lives on SEBI's regulations pages, amended continually.",
          },
          {
            title: "Where the adviser is regulated",
            detail:
              "Merchant banking, research analysis and investment advice are registered activities with conduct rules. The unregistered adviser's safe ground is corporate finance work for the company — and knowing exactly where that boundary runs is professional survival.",
          },
          {
            title: "The disclaimer, understood",
            detail:
              "This roadmap teaches method, not recommendations — and the distinction is the same line the regulations draw. The disclaimer on these pages is the curriculum's own compliance, modelled.",
          },
          {
            title: "The habit that outlasts the course",
            detail:
              "Every regulatory claim in this module ends the same way: current page, cited, dated. Rules move by circular; the professional's edge is not memorising them but never trusting a memory of them.",
          },
        ],
        checks: [
          {
            question: "What do the ICDR regulations govern?",
            answer:
              "Public issues — what can be offered, to whom, with what disclosures. The DRHP's structure is this regulation applied.",
          },
          {
            question: "Which neighbouring activities are registered, and why does it matter?",
            answer:
              "Merchant banking, research and investment advice — an adviser must know where corporate-finance help ends and registered activity begins, because the boundary binds them personally.",
          },
          {
            question: "What is the module's closing discipline?",
            answer:
              "Never advise from memory of a rule — pull the current text, cite it, date the note, and review quarterly.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "SEBI — legal framework and regulations",
            url:
              "https://www.sebi.gov.in/sebiweb/home/HomeAction.do?doListing=yes&sid=1&ssid=3&smid=0",
            sourceName: "SEBI",
            editorNote:
              "The regulations index — ICDR lives here in its current consolidated form. The bookmark, with today's date, is the deliverable's final line.",
          },
        ],
        concepts: [
          "regulatory-sebi",
          "drhp-structure",
        ],
      },
    ],
  },
];
