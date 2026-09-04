/**
 * Startup finance & fundraising — modules 1–4, days 1–27.
 *
 * Built from the owner's brief in assets/Finance/roadmap-startup-finance.md.
 * Every module title, day title, principle and deliverable is the brief's,
 * verbatim; the rest of the day model is authored here. Modules 1, 2 and 3
 * follow the owner's fully-authored references (assets/Finance/
 * module-1-reference.md, module-2-reference.md, module-3-reference.md):
 * their challenges, checks, topics and named sources are those documents',
 * verified before use — the first pass's interview checks (four in module
 * 2, three in module 3) are kept on top of the references' checks. Module
 * 2's dated asks (Indian ESOP taxation, a law-firm CCPS explainer) are
 * deliberately linkless: the challenges teach the check-the-date habit
 * instead of citing pages that go stale. Two of its source asks stay linkless
 * by rule 2: MCA (403s the checker — day 5's challenge sends the learner to
 * the portal instead) and "a current angel-tax article" (deliberately
 * undated-proof: day 2 teaches the check-the-date habit rather than linking
 * an article that will rot).
 *
 * Each day also carries a `concepts` array tagging it against
 * assets/Finance/finance-concepts.json. The importer ignores the field —
 * there is no per-day concept column yet — but the tagging costs nothing
 * while authoring and is the raw material for skip-what-you-know when the
 * schema grows one.
 */
export default [
  {
    title: "The funding ladder",
    weekRange: "Week 1",
    objective: "Where money comes from at each stage, and what the instruments actually do.",
    deliverable:
      "A one-page comparison of five instruments — dilution, control, downside, and when each is the right answer.",
    estHours: 7.5,
    nodes: [
      {
        title: "Who invests, and at what stage",
        summary:
          "Bootstrapped to Series A and beyond: who writes the cheque at each stage, what they are underwriting, and why fund economics explain the behaviour.",
        learningObjectives: [
          "Map the ladder: bootstrapped, friends and family, angel, pre-seed, seed, Series A onward",
          "Name what each investor type is underwriting — founder, wedge, or repeatable motion",
          "Explain how fund economics and portfolio construction shape investor behaviour",
        ],
        whyToday:
          "You can value a company with a history. Startups have none, and the first thing to understand is not a technique — it is who is putting money in, what they are afraid of, and what return they need. Everything in modules 2 and 3 is downstream of that.",
        principle: "Every stage of capital is priced for a different kind of ignorance.",
        commonMistake:
          "Treating 'raising a round' as one thing. A pre-seed and a Series A are different transactions with different documents, different diligence and different buyers — and advice about one is often actively wrong for the other.",
        challenge:
          "Pick one Indian startup that has raised publicly. Reconstruct its funding history from press coverage and filings: stage, amount, lead investor, and approximate date. Then write two sentences on what changed about the company between two consecutive rounds that justified the second one.",
        challengeMinutes: 25,
        estMinutes: 50,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "The ladder",
            detail:
              "Bootstrapped, friends and family, angel, pre-seed, seed, Series A onward. Each has a different cheque size, a different diligence depth and a different question being asked.",
          },
          {
            title: "What each investor is underwriting",
            detail:
              "An angel backs a founder, a seed fund backs a wedge, a Series A fund backs a repeatable motion. The same company is a different risk at each point.",
          },
          {
            title: "Fund economics and why they shape behaviour",
            detail:
              "A fund returning capital in ten years cannot be patient in year eight. Portfolio construction explains most investor behaviour that looks irrational.",
          },
          {
            title: "The Indian landscape",
            detail:
              "Domestic funds, global funds with India teams, angel networks, accelerators — and how the stages map differently here. Micro-VCs and family offices appear earlier than the Silicon Valley template suggests.",
          },
        ],
        checks: [
          {
            question:
              "Why do an angel and a Series A fund value the same company differently?",
            answer:
              "They are underwriting different risks. An angel is buying conviction in a founder with almost no evidence; a Series A investor is buying a repeatable motion with evidence. Different risk, different required return, different price.",
          },
          {
            question: "Why does a fund's age affect its behaviour toward your company?",
            answer:
              "A fund near the end of its life needs realisations and cannot support a long build. The same fund is a different investor in year two and year eight.",
          },
          {
            question: "What is a lead investor actually providing beyond money?",
            answer:
              "Price discovery, terms, diligence others rely on, and usually a board seat. Rounds frequently stall because nobody will lead, not because nobody will participate.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "How to Get Meetings with Investors and Raise Money",
            url: "https://www.youtube.com/watch?v=Jzz4AEIddzY",
            sourceName: "Y Combinator (YouTube)",
            youtubeVideoId: "Jzz4AEIddzY",
            durationSec: 2864,
            estSizeMb: 364,
            editorNote:
              "A practitioner talk, not a lecture — Aaron Harris states plainly what investors are deciding at each stage. Skip the Q&A at the end.",
          },
          {
            type: "read",
            title: "Y Combinator Startup Library — fundraising essays",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "Read two, not ten. The essays on what to do before raising are more useful than the ones on the raise itself.",
          },
          {
            type: "read",
            title: "Valuing Young, Start-up and Growth Companies — sections 1–2 only",
            url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/younggrowth.pdf",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "The opening sections frame why conventional valuation breaks down for companies without a history. The rest of the paper is for day 15; do not read it yet.",
          },
        ],
        concepts: [
          "funding-ladder",
        ],
      },
      {
        title: "Angels, syndicates and pre-seed in India",
        summary:
          "The bottom rung: what an angel is actually deciding, how syndicates pool cheques, what accelerators cost, and the angel-tax history that shaped Indian practice.",
        learningObjectives: [
          "State what an angel assesses when there is nothing to analyse",
          "Explain what syndicates and accelerators do to a cap table and why",
          "Summarise the Indian angel-tax history and how to check the current position",
        ],
        whyToday:
          "Day 1 mapped the ladder. Today is the bottom rung — the stage where most Indian startups actually raise, and the one where a finance graduate's instincts are least useful, because there is nothing to analyse.",
        principle: "An angel is buying the founder. A Series A investor is buying the numbers.",
        commonMistake:
          "Applying valuation technique to a pre-seed company. A finance graduate's instinct is to build a model; the correct instinct is to assess the founder and the market and treat the price as a negotiation anchor.",
        challenge:
          "Write the one-paragraph case for a startup you know, addressed to an angel. Then rewrite the same paragraph addressed to a Series A investor. The difference between them is the entire lesson. Before you finish, search for a current article on angel-tax treatment in India and note its publication date — this rule has changed repeatedly, and checking the date is the habit.",
        challengeMinutes: 20,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What an angel is deciding",
            detail:
              "With no revenue and no product, the assessment is founder, market and wedge. Financial analysis contributes almost nothing at this stage, and pretending otherwise wastes everyone's time.",
          },
          {
            title: "Syndicates and angel networks",
            detail:
              "How a lead angel aggregates cheques, and what that means for the cap table later. Many small holders complicate later rounds unless they are pooled into a single vehicle.",
          },
          {
            title: "Accelerators",
            detail:
              "What they take, what they give, and the honest calculation on whether the equity is worth it — priced for extremely high failure rates and for the value of the programme and network.",
          },
          {
            title: "The Indian angel tax history",
            detail:
              "Why the regulatory treatment of premium valuations mattered so much here, and what the current position is. Do not rely on anything older than the last budget; check the date on whatever you read.",
          },
          {
            title: "What a pre-seed round looks like on paper",
            detail:
              "Often a SAFE-style instrument or a small priced round with light documentation. The mechanics come on day 3; today is the shape.",
          },
        ],
        checks: [
          {
            question: "Why is financial modelling almost irrelevant at pre-seed?",
            answer:
              "There is nothing to model. A five-year projection for a pre-revenue company is a statement of ambition, and both sides know it. The assessment is founder and market.",
          },
          {
            question: "What does a syndicate do to a cap table?",
            answer:
              "It can add many small holders, which complicates later rounds unless they are pooled into a single vehicle. Structure matters more than it appears at the time.",
          },
          {
            question: "Why do accelerators take equity at a low valuation?",
            answer:
              "They are pricing for extremely high failure rates across a portfolio and for the value of the programme and network. Whether that trade is good depends entirely on what the founder lacks.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "A guide to seed fundraising",
            url: "https://www.ycombinator.com/library/4A-a-guide-to-seed-fundraising",
            sourceName: "Y Combinator",
            editorNote:
              "The clearest plain-English explanation of what actually happens in an early round. Read it for investor psychology today; the instrument mechanics come on day 3.",
          },
          {
            type: "read",
            title: "Stripe Atlas guides",
            url: "https://stripe.com/atlas/guides",
            sourceName: "Stripe Atlas",
            editorNote:
              "Written for founders rather than lawyers, and unusually practical. Skim the equity and fundraising guides — they are the calm counterweight to fundraising folklore.",
          },
          {
            type: "read",
            title: "Indian Angel Network",
            url: "https://iangroup.vc/",
            sourceName: "IAN Group",
            editorNote:
              "An Indian angel network's public face. Find the screening and funding process pages — seeing the actual process is more instructive than a description of it.",
          },
        ],
        concepts: [
          "funding-ladder",
        ],
      },
      {
        title: "SAFEs and convertible notes",
        summary:
          "The instruments that defer the valuation argument: caps, discounts, pre- versus post-money SAFEs, and why India usually implements the economics differently.",
        learningObjectives: [
          "Explain a SAFE's cap and discount, and compute which one applies at conversion",
          "Distinguish a SAFE from a convertible note — interest, maturity, and what each implies",
          "Tell a pre-money SAFE from a post-money SAFE and state who each dilutes",
        ],
        whyToday:
          "This is the most common early-stage instrument and the one most misunderstood by people with a finance background — because it is neither debt nor equity while it is outstanding, and its effect only appears at conversion.",
        principle:
          "A convertible instrument defers the valuation argument. It does not remove it.",
        commonMistake:
          "Modelling a SAFE as debt because it looks like an instrument. It is not repaid and carries no interest — it is a future equity claim, and its only real effect appears on the cap table at conversion, which is exactly what module 2 is about.",
        challenge:
          "A founder raises ₹2 crore on a SAFE with a ₹20 crore post-money cap and a 20% discount. The next round prices at ₹40 crore pre-money. Calculate the SAFE holder's ownership at conversion under both the cap and the discount, and state which applies. Then redo it with a pre-money cap and note what changed.",
        challengeMinutes: 30,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "What a SAFE is",
            detail:
              "A right to future equity, not a loan. No interest, no maturity, no repayment — money now, shares later, priced by the next round subject to a cap and/or discount.",
          },
          {
            title: "Convertible notes",
            detail:
              "Debt that converts. Interest, a maturity date, and a legal obligation if it matures without a round — the note's mechanics matter most when things go badly.",
          },
          {
            title: "The cap and the discount",
            detail:
              "The cap rewards early risk and is the single most negotiated term; the discount guarantees a better price than the next round. The investor takes whichever of the two is better.",
          },
          {
            title: "Pre-money versus post-money SAFEs",
            detail:
              "A change that shifted dilution meaningfully toward the founders' cost, and which many people still get wrong. A post-money SAFE fixes the investor's percentage; under pre-money SAFEs the holders diluted each other.",
          },
          {
            title: "Why India often uses CCPS or CCD instead",
            detail:
              "The economics translate; the instrument does not. Day 5 is entirely about what changes when the same deal is papered under Indian law.",
          },
        ],
        checks: [
          {
            question:
              "A SAFE has a ₹20 crore cap and a 20% discount, and the round prices at ₹22 crore. Which applies?",
            answer:
              "Compare both and take the more favourable to the investor. At ₹22 crore, the 20% discount gives an effective ₹17.6 crore, which beats the ₹20 crore cap. The discount applies.",
          },
          {
            question: "What happens to a convertible note that reaches maturity with no round?",
            answer:
              "It becomes due. In practice it is usually extended or converted by negotiation, but the legal position is that the company owes money — which is why notes carry risk a SAFE does not.",
          },
          {
            question: "Why did post-money SAFEs change the dilution picture?",
            answer:
              "A post-money SAFE fixes the investor's percentage regardless of how many other SAFEs are issued, so subsequent SAFEs dilute the founder rather than the earlier investor. Under pre-money SAFEs, the SAFE holders diluted each other.",
          },
          {
            question:
              "A founder tells you they raised at a forty crore valuation on a SAFE. What do you say?",
            answer:
              "That they raised with a forty crore cap, which is not a valuation — it is the ceiling on the price early investors will pay at conversion. The company gets valued at the priced round, and if that round prices below the cap the founders will discover the dilution they actually agreed to today. The correction matters because every later decision they make on the wrong number compounds it.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Y Combinator Safe financing documents",
            url: "https://www.ycombinator.com/documents",
            sourceName: "Y Combinator",
            editorNote:
              "Read the actual document. It is short, and reading the instrument rather than a description of it is the point of today. The post-money Safe user guide is the piece to start with.",
          },
          {
            type: "video",
            title: "Understanding SAFEs and Priced Equity Rounds",
            url: "https://www.youtube.com/watch?v=Dk6JNTDec9I",
            sourceName: "Y Combinator (YouTube)",
            youtubeVideoId: "Dk6JNTDec9I",
            durationSec: 2703,
            estSizeMb: 343,
            editorNote:
              "Kirsty Nathoo works through the arithmetic on screen — the single most useful free video on this subject. Watch the SAFE half today; the priced-round half is day 4's.",
          },
          {
            type: "read",
            title: "Pre-money vs. post-money SAFEs",
            url: "https://carta.com/learn/startups/fundraising/convertible-securities/pre-money-vs-post-money-safes/",
            sourceName: "Carta",
            editorNote:
              "Understand which one you are looking at before you calculate anything. The difference is not cosmetic — it decides who dilutes whom.",
          },
        ],
        concepts: [
          "funding-instruments",
        ],
      },
      {
        title: "Priced equity rounds",
        summary:
          "The first time somebody has to be specific: a valuation, a share price, a new share class, the full document set — and the option pool timing that quietly moves the price.",
        learningObjectives: [
          "Walk the arithmetic: pre-money, post-money, price per share, investor percentage",
          "Quantify what the option pool's timing does to the effective price",
          "Name the document set — term sheet, subscription agreement, shareholders' agreement — and what each governs",
        ],
        whyToday:
          "Convertibles defer the valuation. A priced round forces it, along with a full set of terms, real diligence and legal documentation. This is where your existing valuation training starts to matter again.",
        principle: "A priced round is the first time somebody has to be specific.",
        commonMistake:
          "Negotiating hard on valuation and accepting the option pool and preference terms as standard. The pool shift and the preference structure frequently move more economics than the headline number does.",
        challenge:
          "A company raises ₹10 crore at ₹40 crore pre-money. Calculate post-money, the investor's percentage, and the founder's dilution. Then redo it requiring a 10% post-money option pool created before the round, and quantify who paid for the pool.",
        challengeMinutes: 25,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What a priced round involves",
            detail:
              "A valuation, a share price, a new class of shares, and a substantial document set. Post-money equals pre-money plus the raise; the investor's percentage is the raise divided by post-money.",
          },
          {
            title: "The share price mechanic and the pool",
            detail:
              "Price per share is pre-money divided by fully-diluted shares — and the option pool's timing changes the denominator. A pool created pre-money comes out of existing shareholders and lowers the effective price the investor pays.",
          },
          {
            title: "Preferred versus ordinary shares",
            detail:
              "What preference actually buys: the money back first in a modest exit, plus the protective terms that ride along. With a 1x preference and an exit near the last valuation, preferred can take most of the proceeds.",
          },
          {
            title: "The document set",
            detail:
              "Term sheet, share subscription agreement, shareholders' agreement — and what each governs. The term sheet is short and mostly non-binding; the agreements are where the terms acquire teeth.",
          },
          {
            title: "Diligence at this stage",
            detail:
              "Corporate records, financials, contracts, IP, compliance — and why it takes longer than founders expect. Module 6 teaches you to run this from the investor's side.",
          },
        ],
        checks: [
          {
            question: "₹10 crore raised at ₹40 crore pre-money. What percentage does the investor own?",
            answer: "Post-money is ₹50 crore, so the investor owns 20%.",
          },
          {
            question: "Why does the timing of the option pool matter?",
            answer:
              "A pool created pre-money comes out of the existing shareholders' stake and lowers the effective price the investor pays. Created post-money, everyone including the new investor is diluted. It is a real economic term disguised as an administrative one.",
          },
          {
            question: "What does a liquidation preference actually do in a modest exit?",
            answer:
              "It determines who gets paid first. With a 1x preference and an exit near the last valuation, preferred holders can take most or all of the proceeds before ordinary shareholders see anything.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Term Sheet series — wrap-up and index",
            url: "https://feld.com/archives/2005/08/term-sheet-series-wrap-up/",
            sourceName: "Brad Feld",
            editorNote:
              "He wrote a post per term, free, and it remains the clearest walkthrough available. The book Venture Deals covers the same ground and is paid; the blog series is not.",
          },
          {
            type: "video",
            title: "Understanding SAFEs and Priced Equity Rounds — the priced-round half",
            url: "https://www.youtube.com/watch?v=Dk6JNTDec9I",
            sourceName: "Y Combinator (YouTube)",
            youtubeVideoId: "Dk6JNTDec9I",
            durationSec: 2703,
            estSizeMb: 343,
            editorNote:
              "Continues from day 3 — Kirsty Nathoo shows the arithmetic for a priced round on screen, including the pool shuffle you just calculated by hand.",
          },
          {
            type: "read",
            title: "Term sheets — Carta's guide",
            url: "https://carta.com/learn/startups/fundraising/term-sheets/",
            sourceName: "Carta",
            editorNote:
              "Plain-language walkthrough of the terms that ride with the price. Read actual clause language wherever it quotes any — the clause teaches more than the summary.",
          },
          {
            type: "read",
            title: "Damodaran's data page — industry multiples",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "You will need a reference for what sectors trade at. His data is free, annual and used across the industry. Bookmark it now; you will use it properly in module 3.",
          },
        ],
        concepts: [
          "funding-instruments",
          "term-sheets",
        ],
      },
      {
        title: "Indian instruments — CCPS and CCD",
        summary:
          "What Indian venture rounds actually use, the FEMA layer that explains why, and the valuation certificate nobody mentions until it blocks a closing.",
        learningObjectives: [
          "Explain why CCPS dominates Indian rounds and when a CCD is used instead",
          "Name the FEMA constraints a foreign investor brings — pricing, sectoral caps, reporting",
          "State what a valuation certificate is for and who can give one",
        ],
        whyToday:
          "Almost every free resource on startup fundraising is American. If you are advising Indian companies, the instruments, the regulator and the constraints are different — and this is the day that gap gets closed.",
        principle:
          "The Indian structure differs from the Silicon Valley template, and the template is what everyone reads.",
        commonMistake:
          "Reading American fundraising material and assuming it applies. The economics translate; the instruments, the regulator and the timeline do not.",
        challenge:
          "Find one funded Indian startup's MCA filings. Identify the instrument used, the number of shares, and the price. Then write three sentences on why that instrument was chosen over ordinary equity.",
        challengeMinutes: 25,
        estMinutes: 45,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Why CCPS is the standard Indian instrument",
            detail:
              "Compulsorily convertible preference shares: preference economics now, mandatory conversion later — and the regulatory reasons they dominate here. Optionally convertible instruments are treated as debt under FEMA.",
          },
          {
            title: "CCDs",
            detail:
              "Compulsorily convertible debentures — debt-shaped on paper, mandatory conversion in law, used where note-like staging is wanted while keeping foreign-investment rules satisfied.",
          },
          {
            title: "FEMA and foreign investment",
            detail:
              "Pricing guidelines, sectoral caps, and the reporting obligations that follow a foreign round. A round that would be simple domestically acquires a compliance layer and a calendar.",
          },
          {
            title: "Why plain SAFEs are less common in India",
            detail:
              "The template instrument does not fit the regulatory frame, so SAFE-like economics get papered as CCPS or CCD — with compulsory conversion, statutory pricing and filing requirements the template never mentions.",
          },
          {
            title: "Valuation certificates",
            detail:
              "In certain transactions a merchant banker or registered valuer must support the price at which shares are issued. The valuation must be defensible to someone other than the parties.",
          },
        ],
        checks: [
          {
            question: "Why 'compulsorily' convertible?",
            answer:
              "Optionally convertible instruments are treated as debt under FEMA and attract external commercial borrowing rules. Compulsory conversion makes it equity for regulatory purposes.",
          },
          {
            question: "What does a valuation certificate do?",
            answer:
              "It supports the price at which shares are issued, which regulators require in certain transactions. The valuation must be defensible to someone other than the parties.",
          },
          {
            question: "Why does a foreign investor's presence change the process?",
            answer:
              "FEMA pricing guidelines, sectoral caps and reporting obligations apply. A round that would be simple domestically acquires a compliance layer.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "FEMA — notifications and provisions",
            url: "https://www.rbi.org.in/Scripts/Fema.aspx",
            sourceName: "Reserve Bank of India",
            editorNote:
              "The primary source. Dense, but the pricing guidelines for foreign investment are the part that binds a real transaction — find them, and note the notification date. Today's challenge sends you to the MCA portal yourself; its site blocks automated checks, so no direct link here.",
          },
        ],
        concepts: [
          "funding-instruments",
        ],
      },
      {
        title: "Debt, venture debt and revenue-based finance",
        summary:
          "The non-dilutive layer: what venture debt costs including the warrants, what RBF really charges, and the covenant that matters more than the rate.",
        learningObjectives: [
          "Explain what venture debt lenders underwrite and why warrants ride along",
          "Compute the effective annualised cost of a revenue-based financing offer",
          "State when debt is the right answer, when it is not, and complete the module's comparison page",
        ],
        whyToday:
          "Equity is not the only option, and knowing when debt is appropriate is part of advising well. It also closes the ladder: you now know every instrument a startup might use.",
        principle: "Debt is cheaper until the month it is not available.",
        commonMistake:
          "Comparing debt and equity on cost alone. Debt is cheaper on every spreadsheet and carries a repayment obligation that equity does not — and the relevant question is what happens in the bad case, not the base case.",
        challenge:
          "A startup with ₹4 crore ARR is offered ₹3 crore of venture debt at 14% over 24 months with 1% warrants, or an equity round of ₹3 crore at ₹30 crore pre-money. Model both. Calculate the founder's ownership under each and state the conditions under which each is the better choice. Then finish the module deliverable: all five instruments on one page — dilution, control, downside, and when each is the right answer.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Venture debt",
            detail:
              "What it is, who provides it in India, and what it costs including warrants. Lenders underwrite the equity investors' willingness to fund again more than the company's cash flows.",
          },
          {
            title: "When debt makes sense — and when it does not",
            detail:
              "Extending runway between rounds, financing working capital, avoiding dilution at a low valuation. Not pre-revenue, not on unpredictable cash flows, and never as a substitute for a round that will not happen.",
          },
          {
            title: "Revenue-based financing",
            detail:
              "Repayment as a share of revenue until a cap is reached — self-adjusting to good and bad months, and frequently more expensive in effective terms than it looks. Calculate it; do not read it off the brochure.",
          },
          {
            title: "Working capital facilities and invoice discounting",
            detail:
              "The unglamorous instruments that solve real problems — often the right answer for a company whose problem is timing, not capital.",
          },
          {
            title: "The covenant risk",
            detail:
              "Breaching a covenant can trigger acceleration at exactly the moment the company cannot repay. The covenant matters more than the rate, and it belongs on the comparison page's downside column.",
          },
        ],
        checks: [
          {
            question: "Why do venture debt providers take warrants?",
            answer:
              "The interest rate alone does not compensate for the risk of lending to an unprofitable company. Warrants give upside exposure if the company succeeds.",
          },
          {
            question:
              "Why is venture debt usually raised alongside or just after equity, rather than instead of it?",
            answer:
              "Lenders underwrite the equity investors' willingness to fund again. A company with no recent round and no clear next one is a much harder credit.",
          },
          {
            question: "What is the real risk of a covenant in a startup facility?",
            answer:
              "Breaching one can trigger acceleration at exactly the moment the company cannot repay. The covenant matters more than the rate.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Trifecta Capital",
            url: "https://www.trifectacapital.in/",
            sourceName: "Trifecta Capital",
            editorNote:
              "An Indian venture debt provider explaining its own product. Read what they say they underwrite, then compare it with Alteria below — where the two differ is where the terms actually vary.",
          },
          {
            type: "read",
            title: "Alteria Capital",
            url: "https://alteriacapital.com/",
            sourceName: "Alteria Capital",
            editorNote:
              "The second provider — reading two of them shows you where the terms actually vary. Between the two sites you can reconstruct a realistic term sheet for today's challenge.",
          },
          {
            type: "read",
            title: "First Round Review",
            url: "https://review.firstround.com/",
            sourceName: "First Round Review",
            editorNote:
              "Search the Review for its financing and venture debt pieces — the investor's perspective on when debt helps and when it accelerates a failure. Deep links rot here; the hub is one search away from each.",
          },
          {
            type: "read",
            title: "Damodaran's data page — cost of capital by sector",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "You know cost of capital from your degree. Revisit it specifically for a company with no stable cash flows, where the standard framework strains — his sector data shows what the market charges for that risk.",
          },
        ],
        concepts: [
          "funding-instruments",
          "cost-of-capital",
        ],
      },
    ],
  },
  {
    title: "Cap tables and dilution",
    weekRange: "Week 2",
    objective: "The mechanical skill most finance graduates lack entirely.",
    deliverable:
      "A working cap table model that takes a SAFE, converts it at a priced round, creates a 10% ESOP pool, and produces an exit waterfall — all from formulas, no hardcoded percentages.",
    estHours: 9.5,
    nodes: [
      {
        title: "What a cap table actually is",
        summary:
          "What the document represents, where its authority comes from — and why the spreadsheet loses every argument with the filings.",
        learningObjectives: [
          "Read a cap table: holders, share classes, issued versus fully diluted",
          "Explain authorised versus issued capital and why it can delay an Indian round",
          "Say where the truth lives when the spreadsheet and the documents disagree",
        ],
        whyToday:
          "Before any arithmetic, understand what the document represents and where its authority comes from. A cap table is a summary of legal instruments, and when the spreadsheet and the documents disagree, the documents win.",
        principle:
          "If you cannot rebuild the cap table from the documents, you do not understand the deal.",
        commonMistake:
          "Treating the spreadsheet as the source of truth. Cap tables drift from reality through undocumented promises and unissued options, and the drift is discovered during diligence at the worst possible moment.",
        challenge:
          "Find one funded Indian startup on MCA. From the filings, list the share classes issued, the number of shares in each, and the dates. Then write two sentences on what you can and cannot determine about ownership from the public record alone.",
        challengeMinutes: 20,
        estMinutes: 50,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "What it records",
            detail:
              "Every share issued, to whom, of what class, at what price, on what date. Ordinary, preference, and in India CCPS — different rights, different economics, same table.",
          },
          {
            title: "Issued versus fully diluted",
            detail:
              "The distinction that causes most cap table arguments. Options, warrants and convertibles are not issued shares but count in fully diluted — and an investor negotiating for 20% almost always means fully diluted.",
          },
          {
            title: "Authorised versus issued capital",
            detail:
              "An Indian company must authorise before it issues, and running out of authorised capital delays a round — a shareholder resolution and a filing that nobody budgeted time for.",
          },
          {
            title: "Where the truth lives",
            detail:
              "MCA filings, the register of members, share certificates, the SHA. The spreadsheet is a derivative, and rebuilding it from documents is how an adviser verifies the history rather than inheriting its errors.",
          },
          {
            title: "Why cap tables go wrong",
            detail:
              "Informal promises, unissued options, a co-founder who left without documentation. Early companies keep the table in a spreadsheet maintained by whoever raised last — assume errors, and find them politely.",
          },
        ],
        checks: [
          {
            question: "Issued versus fully diluted — why does it matter?",
            answer:
              "Fully diluted includes options and convertibles that have not converted. An investor negotiating for 20% almost always means fully diluted, and agreeing on issued instead gives them materially less than they think.",
          },
          {
            question: "What is authorised capital and why does it delay rounds?",
            answer:
              "The maximum shares a company may issue under its constitution. Issuing beyond it requires a shareholder resolution and a filing, which takes time nobody budgeted for.",
          },
          {
            question: "If the spreadsheet and the share register disagree, which is correct?",
            answer:
              "The register and the filings. The spreadsheet is a convenience; the legal record is the company.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "What is a cap table?",
            url: "https://carta.com/learn/startups/equity-management/cap-table/",
            sourceName: "Carta",
            editorNote:
              "They explain the mechanics clearly and free, because they sell the software. Read the education pages, ignore the product pitch.",
          },
          {
            type: "read",
            title: "Stripe Atlas guides — the equity guide",
            url: "https://stripe.com/atlas/guides",
            sourceName: "Stripe Atlas",
            editorNote:
              "The clearest plain-English explanation of classes and dilution written for people who are not lawyers. The CCPS layer is Indian and comes from day 5 — the class logic here transfers.",
          },
          {
            type: "video",
            title: "Startup Mechanics — Kirsty Nathoo (Stanford CS183F)",
            url: "https://www.youtube.com/watch?v=2_IpVq6vKR0",
            sourceName: "Stanford Online (YouTube)",
            youtubeVideoId: "2_IpVq6vKR0",
            durationSec: 3507,
            estSizeMb: 445,
            editorNote:
              "YC's CFO on the machinery under every round — shares, ownership, dilution, options — in one lecture. The middle third is this module in miniature; the US-specific filings talk maps to MCA equivalents here.",
          },
        ],
        concepts: [
          "cap-table-dilution",
        ],
      },
      {
        title: "Pre-money, post-money and the arithmetic",
        summary:
          "Trivial arithmetic, constant confusion — get it precisely right today and the rest of the module follows.",
        learningObjectives: [
          "Derive everything from the identity: post-money equals pre-money plus the investment",
          "Compute price per share on pre-round fully diluted shares, and say why",
          "Explain why a falling percentage can mean a rising value, with numbers",
        ],
        whyToday:
          "The arithmetic is trivial and the confusion is constant. Get this precisely right today and every calculation for the rest of the module follows.",
        principle:
          "Pre-money and post-money differ by exactly the amount everyone argues about.",
        commonMistake:
          "Dividing the investment by pre-money to get ownership. It overstates the investor's stake and produces a cap table that does not sum to 100%.",
        challenge:
          "A company has 10,00,000 shares outstanding and raises ₹5 crore at ₹20 crore pre-money. Calculate: post-money, price per share, new shares issued, investor percentage, and the founders' percentage before and after. Do all of it by formula. Then change the raise to ₹8 crore and confirm every figure updates.",
        challengeMinutes: 25,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The identity",
            detail:
              "Post-money equals pre-money plus the investment. Investor ownership is investment divided by post-money — not by pre-money, which is the standard error. Everything else derives from these lines.",
          },
          {
            title: "Price per share",
            detail:
              "Pre-money divided by pre-round fully diluted shares. This is the number that governs everything else, and new shares issued is simply investment divided by it.",
          },
          {
            title: "Dilution, honestly framed",
            detail:
              "What each existing holder's percentage becomes — and why percentage falling does not mean value falling. Your percentage falls while your value rises, and both are true; day 10 makes this the founder conversation.",
          },
          {
            title: "Where the confusion originates",
            detail:
              "Founders quote pre-money, investors think post-money, and neither says which. The same headline number is a sixth of the company or a fifth depending on the word before it.",
          },
        ],
        checks: [
          {
            question: "₹5 crore at ₹20 crore pre-money. What does the investor own?",
            answer: "Post-money is ₹25 crore, so 5/25 = 20%.",
          },
          {
            question: "Why is price per share calculated on pre-money shares?",
            answer:
              "The price is what the investor pays for shares that exist before their money arrives. Using post-money shares would be circular.",
          },
          {
            question:
              "A founder goes from 60% to 48% and the company is worth more. Better or worse off?",
            answer:
              "Better, if the valuation rose enough. 60% of ₹20 crore is ₹12 crore; 48% of ₹25 crore is ₹12 crore — flat here, and positive in any round where value rises more than the dilution.",
          },
          {
            question:
              "A term sheet says ₹50 crore valuation with a 10% ESOP pool. What do you ask before anything else?",
            answer:
              "Pre-money or post-money — for the valuation and for the pool separately. Fifty pre with a pool created pre-money means founders absorb the pool's dilution before the investor's money lands; fifty post with the pool inside moves several percentage points of the company between founders and investor on identical headline words. The four combinations are four different deals.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "video",
            title: "Understanding SAFEs and Priced Equity Rounds — the arithmetic",
            url: "https://www.youtube.com/watch?v=Dk6JNTDec9I",
            sourceName: "Y Combinator (YouTube)",
            youtubeVideoId: "Dk6JNTDec9I",
            durationSec: 2703,
            estSizeMb: 343,
            editorNote:
              "She does the arithmetic on screen, slowly, with real numbers — the single most useful free video on this topic. You watched it in module 1 for the instruments; rewatch the priced-round arithmetic with a spreadsheet open.",
          },
          {
            type: "read",
            title: "Share dilution — what causes it and how to prepare",
            url: "https://carta.com/learn/startups/equity-management/share-dilution/",
            sourceName: "Carta",
            editorNote:
              "Good diagrams showing the same round from both sides. Read it after doing today's challenge by hand — as the answer key, not the method.",
          },
        ],
        concepts: [
          "cap-table-dilution",
        ],
      },
      {
        title: "Building a cap table from scratch in Excel",
        summary:
          "The build day: structure it around shares with derived percentages, because everything after this adds to the file created now.",
        learningObjectives: [
          "Structure the model on shares, with events as columns and every percentage derived",
          "Keep inputs in one named block and add a check row that must sum to 100%",
          "Make the model extend to a new round without restructuring",
        ],
        whyToday:
          "This is the build day. Everything after this adds to the file you create now, so the structure matters more than the numbers.",
        principle:
          "A cap table with a hardcoded ownership percentage is a cap table that will be wrong next round.",
        commonMistake:
          "Building it as a static picture of today rather than a model. A cap table's purpose is answering 'what happens if', and a table of typed percentages cannot answer anything.",
        challenge:
          "Build a cap table for a company with three founders (50/30/20) holding 10,00,000 shares. Every percentage must be a formula referencing share counts. Add a check row summing to 100%. Deliberately change one founder's shares and confirm every percentage updates and the check still holds. Before you start, open one free template — Carta's or a VC firm's — study its structure, close it, and build your own.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Shares, not percentages",
            detail:
              "Percentages are outputs. A model built on percentages breaks at the first round — shares are the legal reality, and they are additive.",
          },
          {
            title: "One row per holder, one column per event",
            detail:
              "Founders, angels, each round, options. The table reads left to right as the company's history, and a new round is a new column, not a new file.",
          },
          {
            title: "The summary block and the check row",
            detail:
              "Issued, fully diluted, and each holder's percentage of both, all derived — plus a row where percentages must sum to exactly 100%. It should be impossible for the model to be wrong without you seeing it.",
          },
          {
            title: "Named inputs in one place",
            detail:
              "Every assumption in a single input block, never buried in a formula — so someone else can change one, and so you can audit them all at once.",
          },
          {
            title: "Readable by someone else",
            detail:
              "Inputs, calculations and outputs visually distinct. The lookup layer — XLOOKUP or INDEX/MATCH over a holder reference range — is what keeps it maintainable when day 12 lands the SAFEs.",
          },
        ],
        checks: [
          {
            question: "Why build on shares rather than percentages?",
            answer:
              "Shares are the legal reality and they are additive. Percentages are derived and must be recalculated at every event — hardcoding them guarantees a wrong answer after the first round.",
          },
          {
            question: "What does the check row protect against?",
            answer:
              "Any error that breaks the total. If percentages sum to 99.7%, something is missing or double-counted, and you see it immediately rather than in a meeting.",
          },
          {
            question: "Why keep inputs in one block?",
            answer:
              "So someone else can change an assumption without hunting through formulas — and so you can see every assumption at once when auditing your own work.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "XLOOKUP function",
            url: "https://exceljet.net/functions/xlookup-function",
            sourceName: "ExcelJet",
            editorNote:
              "The lookup layer that makes a cap table maintainable — you need it before day 10. If this reads as revision, good; if not, the excel-at-work roadmap's week 2 is the honest prerequisite.",
          },
          {
            type: "read",
            title: "INDEX and MATCH",
            url: "https://exceljet.net/articles/index-and-match",
            sourceName: "ExcelJet",
            editorNote:
              "The older, more flexible half of the lookup layer. Know both patterns — templates you inherit will use whichever their author learned first.",
          },
          {
            type: "read",
            title: "Overview of Excel tables",
            url: "https://support.microsoft.com/en-us/office/overview-of-excel-tables-7ab0bb7d-3a9e-4b56-a3c9-6c94334e492c",
            sourceName: "Microsoft Support",
            editorNote:
              "Converting ranges to tables is what stops formulas breaking when rows are added — which they will be, on every one of the next four days.",
          },
        ],
        concepts: [
          "cap-table-dilution",
          "excel-lookup",
        ],
      },
      {
        title: "Modelling a round and its dilution",
        summary:
          "Yesterday's table becomes a model that answers the only question anyone actually asks: what does this round do to me?",
        learningObjectives: [
          "Add a priced round as an event column with every percentage recalculating",
          "Model dilution in percentage and in value across multiple rounds",
          "Build a two-way sensitivity of ownership across valuations and raise sizes",
        ],
        whyToday:
          "Yesterday's table shows a moment. Today it becomes a model that can answer the only question anyone actually asks: what does this round do to me?",
        principle: "Founders track their percentage. They should track their value.",
        commonMistake:
          "Presenting dilution as a percentage loss. Framed that way every round looks like a defeat. Value alongside percentage turns it into the trade it actually is.",
        challenge:
          "Extend yesterday's model with a seed round: ₹3 crore at ₹12 crore pre-money. Then a Series A: ₹15 crore at ₹60 crore pre-money. Show each founder's percentage and value after each. Then build a two-way table showing founder ownership across three Series A valuations and three raise sizes.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The round as a column",
            detail:
              "New shares issued, price per share, and every percentage recalculating. The day-9 model should absorb this with no restructuring — that was the point of building it right.",
          },
          {
            title: "Dilution across multiple rounds",
            detail:
              "How a founder reaches single digits without any single round looking severe. The cumulative table is the honest one, and single-round explanations miss it entirely.",
          },
          {
            title: "Value versus percentage",
            detail:
              "Model both, so the conversation can be about the right one. A founder's value can rise sharply while their percentage falls — and in flat rounds, heavy pools and stacked preferences, both fall, which is what the model exists to catch.",
          },
          {
            title: "Rounds that have not happened yet",
            detail:
              "Scenario columns with different raise amounts and valuations. 'What do I own after Series B' requires modelling two rounds forward with assumptions stated — the terms of this round shape the next.",
          },
          {
            title: "Presenting dilution to a founder",
            detail:
              "The framing that makes it a decision rather than a shock: both columns, two or three pre-money levels, and the sentence about what the next round must clear.",
          },
        ],
        checks: [
          {
            question:
              "A founder holds 30% and the round is ₹15 crore at ₹60 crore pre-money. What do they hold after?",
            answer:
              "Post-money is ₹75 crore, the investor takes 20%, so the founder retains 30% × 80% = 24%.",
          },
          {
            question: "Why can a founder's value rise while their percentage falls sharply?",
            answer:
              "Because the valuation rose by more than the dilution. 24% of ₹75 crore exceeds 30% of ₹15 crore by a wide margin.",
          },
          {
            question: "Why model two rounds forward rather than one?",
            answer:
              "Because the terms of this round affect the next. A high valuation now can force a down round later, and the founder should see that before signing.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Stripe Atlas guides — dilution over multiple rounds",
            url: "https://stripe.com/atlas/guides",
            sourceName: "Stripe Atlas",
            editorNote:
              "The equity guide shows the cumulative effect across a full funding history, which single-round explanations miss entirely.",
          },
          {
            type: "read",
            title: "Calculate multiple results by using a data table",
            url: "https://support.microsoft.com/en-us/office/calculate-multiple-results-by-using-a-data-table-e95e2487-6ca6-4413-ad12-77542a5ea50b",
            sourceName: "Microsoft Support",
            editorNote:
              "The two-way data table is today's sensitivity tool — three valuations by three raise sizes, one formula. Module 5 uses the same machinery on a full operating model.",
          },
        ],
        concepts: [
          "cap-table-dilution",
          "excel-scenario-analysis",
        ],
      },
      {
        title: "ESOP pools — sizing, timing and who pays",
        summary:
          "The most economically significant term founders accept without understanding — and the Indian layer the US explainers skip.",
        learningObjectives: [
          "Model a pool created pre-money versus post-money and show who it dilutes, in rupees",
          "Size a pool from a hiring plan rather than a convention",
          "Track the four option states and say which count in fully diluted",
        ],
        whyToday:
          "The pool shuffle is the most economically significant term that founders routinely accept without understanding. It frequently moves more value than the valuation negotiation does.",
        principle:
          "Who the pool dilutes depends entirely on whether it sits pre-money or post-money.",
        commonMistake:
          "Treating the pool as a housekeeping item and negotiating only the valuation. A 10% pre-money pool on a ₹40 crore pre-money round moves roughly ₹4 crore of value, which usually exceeds anything won in the valuation discussion.",
        challenge:
          "Add a 10% ESOP pool to your model twice: once created pre-money, once post-money, with the same round. Calculate the founders' final ownership under each, and the difference in rupees at the post-money valuation. Write one sentence stating who paid for the pool in each case. Then find one dated Indian explainer on ESOP taxation and note when it was published — the treatment has changed, and checking the date is the habit.",
        challengeMinutes: 35,
        estMinutes: 45,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "What a pool is, and sizing it",
            detail:
              "Shares reserved for future employees, unallocated at creation — typically 10–15% early, but driven by the hiring plan to the next round rather than convention. Oversized pools are pre-paid dilution for hires that never happen.",
          },
          {
            title: "The pre-money shuffle",
            detail:
              "A pool created pre-money dilutes existing shareholders only, and lowers the effective price the investor pays. It is a price adjustment expressed as an administrative requirement.",
          },
          {
            title: "Post-money creation",
            detail:
              "Dilutes everyone including the new investor. Modelling both and showing the difference in rupees is the only way founders understand it.",
          },
          {
            title: "Granted, vested, exercised, unallocated",
            detail:
              "Four states, and only some count in fully diluted — granted shares are committed under vesting; unallocated are reserved but unassigned. Both dilute from creation, which is why the pool lands on the table before a single grant is made.",
          },
          {
            title: "Indian specifics",
            detail:
              "SEBI and Companies Act requirements, trust versus direct routes, and exercise taxation that employees discover too late. The Indian regime differs meaningfully from the US template — and it changes, so date-check anything you read.",
          },
        ],
        checks: [
          {
            question: "A 10% pool created pre-money — who is diluted?",
            answer:
              "Only the existing shareholders. The new investor's percentage is protected, so they effectively buy at a lower price than the headline valuation implies.",
          },
          {
            question: "Why do investors ask for the pool pre-money?",
            answer:
              "It increases their effective ownership without changing the valuation they can quote. It is a price adjustment expressed as an administrative requirement.",
          },
          {
            question: "What is the difference between granted and unallocated pool shares?",
            answer:
              "Granted shares are committed to named employees under a vesting schedule; unallocated are reserved but unassigned. Both count in fully diluted, which is why the pool dilutes on creation rather than on grant.",
          },
          {
            question:
              "An investor's term sheet asks for a 15% option pool, created pre-money. What is really being negotiated?",
            answer:
              "Price. The pre-money carve-out lowers the price per share the investor pays while leaving the headline valuation intact — the founders absorb the whole pool's dilution before the money lands. The response is not to refuse a pool but to size it from the actual hiring plan and to negotiate where it sits, because moving it post-money or trimming it to plan moves real percentage points back to the people the headline told they were keeping them.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "video",
            title: "Understanding SAFEs and Priced Equity Rounds — the option pool section",
            url: "https://www.youtube.com/watch?v=Dk6JNTDec9I",
            sourceName: "Y Combinator (YouTube)",
            youtubeVideoId: "Dk6JNTDec9I",
            durationSec: 2703,
            estSizeMb: 343,
            editorNote:
              "The pool shuffle is the specific term YC's finance talks cover best. Watch the pool section twice — once before modelling, once after, when you will hear what you missed.",
          },
          {
            type: "read",
            title: "Stock options — vesting, cliffs and exercise",
            url: "https://carta.com/learn/equity/stock-options/",
            sourceName: "Carta",
            editorNote:
              "Vesting, cliffs, exercise and the four option states explained plainly. The Indian trust-route and taxation layer is dated material — today's challenge sends you to find a current explainer and check its date.",
          },
        ],
        concepts: [
          "esop-pools",
          "cap-table-dilution",
        ],
      },
      {
        title: "Convertible conversion at the next round",
        summary:
          "Day 3's instruments land on the cap table — individually, at their own prices, all at once.",
        learningObjectives: [
          "Convert a capped, discounted SAFE at a priced round inside the model",
          "Handle pre-money versus post-money SAFE conversion and say which the document is",
          "Model multiple SAFEs converting together at different caps",
        ],
        whyToday:
          "Day 3 covered what a SAFE is. Today is what it does to the cap table when it converts — which is the only moment it has any effect at all.",
        principle:
          "A SAFE's discount and cap interact, and the interaction surprises people at conversion.",
        commonMistake:
          "Modelling SAFEs as a single blended line. They convert individually at individual prices, and blending them produces a wrong share count that then propagates through everything downstream.",
        challenge:
          "Add two SAFEs to your model: ₹1 crore at a ₹10 crore post-money cap with a 20% discount, and ₹50 lakh at a ₹15 crore post-money cap with no discount. Convert both at a Series A of ₹15 crore at ₹50 crore pre-money. Show the shares issued to each, the price applied, and every holder's final ownership. State for each SAFE whether the cap or the discount governed.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The conversion event",
            detail:
              "A priced round triggers it, and the SAFE becomes shares at a price determined by cap or discount — calculate both, and the investor receives the more favourable.",
          },
          {
            title: "Pre-money versus post-money SAFE conversion",
            detail:
              "A materially different calculation, and the source of most conversion disputes. The post-money SAFE fixes the holder's ownership before the round, pushing all dilution onto founders; the older pre-money form shares it.",
          },
          {
            title: "Multiple SAFEs at different caps",
            detail:
              "Each converts on its own terms, and modelling them together is where errors appear. The same round produces different conversion prices for different holders.",
          },
          {
            title: "The dilution surprise",
            detail:
              "Founders often do not model SAFE conversion, then discover their ownership after a round is well below expectation. Nothing appeared on the table until it all appeared at once.",
          },
          {
            title: "The interaction with the pool",
            detail:
              "A pool created at the same round compounds the effect. Day 11's shuffle and today's conversions land in the same denominator — which is why the model, not the documents, is where the founder sees the total.",
          },
        ],
        checks: [
          {
            question:
              "A SAFE with a ₹10 crore cap converting at a ₹50 crore pre-money round — what price applies?",
            answer:
              "The cap, and by a wide margin. The investor converts as though the valuation were ₹10 crore, which is the entire purpose of the cap.",
          },
          {
            question: "Why do founders underestimate SAFE dilution?",
            answer:
              "Because nothing appears on the cap table until conversion. Money arrived, ownership looked unchanged, and the dilution lands all at once at the next round.",
          },
          {
            question: "Two SAFEs at different caps convert together. Same price?",
            answer:
              "No. Each converts on its own terms, so the same round produces two different conversion prices — which is why modelling them individually matters.",
          },
          {
            question:
              "A company raised three SAFEs at caps of 20, 35 and 60 crore, and is now pricing a round at 50 crore pre. Walk me through what happens.",
            answer:
              "Each SAFE converts on its own terms in the same round. The 20 and 35 crore caps are below the round's implied price, so those holders convert at their cap prices and get materially more shares per rupee than the new investor; the 60 crore cap is above, so that holder converts at the discount if there is one, or the round price if not. The founders' dilution is the sum of all three conversions plus the new money — a total no single document states, which is why the model has to exist before the term sheet is signed.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Y Combinator Safe financing documents — the conversion examples",
            url: "https://www.ycombinator.com/documents",
            sourceName: "Y Combinator",
            editorNote:
              "YC publishes worked conversion examples alongside the documents. Work through them with a spreadsheet open — if your model disagrees with their example, your model is wrong.",
          },
          {
            type: "read",
            title: "Pre-money vs. post-money SAFEs",
            url: "https://carta.com/learn/startups/fundraising/convertible-securities/pre-money-vs-post-money-safes/",
            sourceName: "Carta",
            editorNote:
              "Day 3's read, now operational: before converting anything, establish which form each SAFE is. The two forms are different formulas, not different flavours.",
          },
        ],
        concepts: [
          "funding-instruments",
          "cap-table-dilution",
        ],
      },
      {
        title: "Waterfall and exit distribution",
        summary:
          "Where the money actually gets divided — and where day 4's abstract preference terms become the number that decides whether a founder receives anything.",
        learningObjectives: [
          "Build the waterfall: preferences first, then conversion decisions, then ordinary shares",
          "Find each preferred holder's conversion crossover and show the kink it makes",
          "Complete and test the full module deliverable end to end",
        ],
        whyToday:
          "The module ends where the money actually gets divided. This is also where preference terms — abstract on day 4 — become the number that determines whether a founder receives anything.",
        principle:
          "Liquidation preference decides who gets paid first, and in a modest exit that is everyone's answer.",
        commonMistake:
          "Assuming an exit above the last valuation is good for everyone. With a preference stack, a founder can hold 30% of a company that sells for ₹50 crore and receive nothing at all.",
        challenge:
          "Complete the model. Add a waterfall showing distribution across exit values from ₹10 crore to ₹200 crore in ₹10 crore steps, for: two founders, an ESOP pool, two converted SAFE holders, and a Series A investor with 1x non-participating preference. Identify the exit value at which the Series A investor is indifferent between preference and conversion. Then change to participating and record how the crossover moves.",
        challengeMinutes: 45,
        estMinutes: 45,
        points: 45,
        difficulty: "stretch",
        topics: [
          {
            title: "What a waterfall is",
            detail:
              "The order in which exit proceeds are distributed: debt, then preferences by seniority, then ordinary and converted holders share the rest. The model executes this order at each exit value.",
          },
          {
            title: "Non-participating, participating, and multiples",
            detail:
              "1x non-participating — the greater of money back or pro-rata — is the standard. Participating takes both and is much more aggressive; multiples above 1x appear in desperate rounds and signal exactly that.",
          },
          {
            title: "The conversion decision",
            detail:
              "A preferred holder converts to ordinary when pro-rata beats preference, and the crossover point is calculable per holder. The crossovers are where the waterfall kinks — chart founder proceeds against exit value and the kinks are the fortnight's lesson in one picture.",
          },
          {
            title: "Why founders can receive nothing",
            detail:
              "A ₹50 crore exit against ₹60 crore of preference pays ordinary shareholders zero. The headline sounds like success; the waterfall says otherwise, and showing this in advance is the adviser's job.",
          },
          {
            title: "Testing the deliverable",
            detail:
              "Extremes as sanity checks: at a huge exit everyone converts and shares pro rata; below total preference, ordinary gets zero. If either end misbehaves, a formula is wrong.",
          },
        ],
        checks: [
          {
            question:
              "1x non-participating on ₹15 crore invested for 25%. At a ₹40 crore exit, what do they take?",
            answer:
              "The greater of ₹15 crore (preference) or ₹10 crore (25% of ₹40 crore). They take the preference — ₹15 crore.",
          },
          {
            question: "At what exit value do they convert?",
            answer:
              "Where 25% of the exit exceeds ₹15 crore, so above ₹60 crore. Below that, preference; above, conversion.",
          },
          {
            question: "Why can founders receive nothing in a profitable-looking exit?",
            answer:
              "If total preference exceeds the exit value, preferred holders take everything before ordinary shareholders are paid. A ₹50 crore sale against ₹60 crore of preference leaves ordinary at zero.",
          },
          {
            question:
              "A company with ₹80 crore of 1x preferences sells for ₹90 crore. The founders own 40%. What do they get, roughly?",
            answer:
              "Roughly 40% of ten crore, not of ninety — about four crore. Preferences take the first eighty; investors holding them will not convert, because their preference beats their converted share at this price. This is the modest-exit case: a sale that sounds like success while common shares split only what clears the preference stack. Whether investors participate after their preference — and any caps on that — is exactly what the term sheet decided years earlier.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Term Sheet series — the liquidation preference posts",
            url: "https://feld.com/archives/2005/08/term-sheet-series-wrap-up/",
            sourceName: "Brad Feld",
            editorNote:
              "The clearest explanation of participating versus non-participating anywhere, free. Read the liquidation preference posts from the index before building.",
          },
          {
            type: "read",
            title: "Waterfall analysis — how to model exit waterfalls",
            url: "https://carta.com/learn/startups/exit-strategies/waterfall-analysis/",
            sourceName: "Carta",
            editorNote:
              "Diagrams showing the payout at different exit values — which is exactly what you are building. Compare their chart's shape with yours; the kinks should match.",
          },
          {
            type: "read",
            title: "First Round Review",
            url: "https://review.firstround.com/",
            sourceName: "First Round Review",
            editorNote:
              "Search the Review for a founder's account of a modest exit — the human consequence of the preference stack, discovered after the sale. Deep links rot here; the hub is one search away.",
          },
        ],
        concepts: [
          "cap-table-dilution",
          "term-sheets",
          "excel-scenario-analysis",
        ],
      },
    ],
  },
  {
    title: "Valuing a company with no cash flows",
    weekRange: "Weeks 3–4",
    objective: "Where their existing DCF knowledge gets extended rather than replaced.",
    deliverable:
      "Value one real Indian startup three ways — a scenario DCF, a revenue multiple, and the VC method — and write one page on why the numbers differ and which you would defend.",
    estHours: 9,
    nodes: [
      {
        title: "Why textbook DCF fails on a startup",
        summary:
          "Your best-trained tool, applied where its inputs do not exist — and what remains of it that is still useful.",
        learningObjectives: [
          "Name where each DCF input breaks on a young company — history, beta, terminal value",
          "State what survival probability does to early-stage value and why standard DCF has no place for it",
          "Say what a DCF is still good for at seed stage, and say it to a founder who built one",
        ],
        whyToday:
          "You can build a DCF. Today is about knowing when it produces a number that means nothing — and being able to say so to a founder who has built one and believes it.",
        principle: "A DCF on a pre-revenue company is a spreadsheet-shaped opinion.",
        commonMistake:
          "Producing a DCF because it is expected, and defending the output rather than the assumptions. The value of the exercise is the list of things that must be true — that is what you should present.",
        challenge:
          "Take any DCF you built during your PGDM. Recalculate what percentage of the total value sits in the terminal value. Then change the terminal growth rate by half a percentage point and record the change in enterprise value. Write two sentences on what that tells you about the reliability of the original number.",
        challengeMinutes: 25,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What a DCF requires",
            detail:
              "A forecastable cash flow, a discount rate that reflects the risk, and a terminal value that is not most of the answer. A startup usually fails all three.",
          },
          {
            title: "Where each input breaks",
            detail:
              "No history to forecast from, no beta to derive a discount rate from, and a terminal value that can be 90% or more of the total — computed from the least certain year of an uncertain forecast.",
          },
          {
            title: "Survival probability",
            detail:
              "The input a standard DCF has no place for, and the one that dominates early-stage value. Tomorrow makes it an explicit line; today, notice that your trained method buries it.",
          },
          {
            title: "What a DCF is still good for",
            detail:
              "Forcing explicit assumptions, testing whether a business could ever be worth the price, and structuring an argument. As a reverse-engineering tool it survives; as a price-setting tool it does not.",
          },
          {
            title: "The false precision problem",
            detail:
              "A number to two decimal places built on a growth assumption someone invented. Precision and reliability are different properties, and the spreadsheet only displays one of them.",
          },
        ],
        checks: [
          {
            question: "Why is a beta unavailable for a startup?",
            answer:
              "Beta is derived from a share price history against a market. A private company with no traded shares has none, so you must borrow one from comparables and adjust — which imports assumptions rather than removing them.",
          },
          {
            question: "If terminal value is 85% of your DCF, what have you actually valued?",
            answer:
              "Your assumption about a state ten years away, not the forecast you spent a week building. This is the standard failure mode of startup DCFs.",
          },
          {
            question: "What does a DCF still contribute at seed stage?",
            answer:
              "It forces you to state what must be true for the price to make sense. As a reverse-engineering tool it is genuinely useful; as a price-setting tool it is not.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Valuing Young, Start-up and Growth Companies — sections 1–3",
            url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/younggrowth.pdf",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "The definitive treatment of exactly this problem, by the person everyone else cites. You skimmed sections 1–2 on day 1 for framing; read them again properly now, and continue to 3. The rest is tomorrow's.",
          },
          {
            type: "video",
            title: "Valuing and Pricing Start-ups and Young High Growth Firms",
            url: "https://www.youtube.com/watch?v=i80avS70k8E",
            sourceName: "Aswath Damodaran (YouTube)",
            youtubeVideoId: "i80avS70k8E",
            durationSec: 1731,
            estSizeMb: 220,
            editorNote:
              "He works through the estimation problems on screen rather than asserting them — twenty-nine minutes, from his own channel, where the full course also lives free.",
          },
          {
            type: "read",
            title: "Musings on Markets — Damodaran's blog",
            url: "https://aswathdamodaran.blogspot.com/",
            sourceName: "Aswath Damodaran",
            editorNote:
              "Find a recent post where he values a specific company. Watching him do it on a real one, publicly, with his assumptions stated, is worth more than the theory — and locate the single assumption carrying his answer. There always is one.",
          },
        ],
        concepts: [
          "dcf-valuation",
          "startup-valuation",
        ],
      },
      {
        title: "Damodaran on young companies",
        summary:
          "The most rigorous available answer to what replaces the broken DCF — and it is not 'give up and use a multiple'.",
        learningObjectives: [
          "Forecast revenue from market size down, not growth rates up",
          "Set target margins and sales-to-capital from mature comparables and his sector data",
          "Make survival probability an explicit, arguable line in the valuation",
        ],
        whyToday:
          "Yesterday established that the standard approach breaks. Today is the most rigorous available answer to what replaces it — the whole paper, the working spreadsheet, and the data that feeds both.",
        principle: "You cannot avoid the uncertainty. You can only make it explicit.",
        commonMistake:
          "Burying failure risk inside an inflated discount rate. A 40% discount rate is a survival assumption in disguise, and disguised assumptions cannot be argued with — which is precisely why people prefer them.",
        challenge:
          "Value one Indian startup using Damodaran's structure: market size, target share, target margin from a mature comparable, sales-to-capital, and a survival probability you can justify. State each assumption on a separate line. Then find his valuation of a recently-listed company on the blog you bookmarked yesterday and compare your assumption list with his. The number matters less than whether someone could argue with each input individually.",
        challengeMinutes: 35,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Revenue from market size down",
            detail:
              "Start with the addressable market and a defensible share, rather than growing last year's revenue by a rate you chose. A share is a claim someone can contest — that is the point.",
          },
          {
            title: "Target margins from a mature comparable",
            detail:
              "What does this business look like when it works, and who already looks like that? The target margin comes from his sector data, not from a dated report or a hope.",
          },
          {
            title: "Reinvestment and sales-to-capital",
            detail:
              "How much capital is required to produce the revenue you forecast. Growth is not free, and the sales-to-capital ratio is where that honesty enters the model.",
          },
          {
            title: "A discount rate that changes over time",
            detail:
              "High early, converging toward a sector cost of capital as the company matures. Holding it constant either overvalues the early years or undervalues the later ones.",
          },
          {
            title: "Survival probability, explicit",
            detail:
              "Value the going concern, then weight it by the chance it survives to get there, adding liquidation value in the failure case. Separate and visible — the opposite of a cranked WACC.",
          },
          {
            title: "Scenario valuation",
            detail:
              "Three futures with probabilities, rather than one with false confidence. The scenarios force the question a point estimate hides: what has to happen for each number to be real?",
          },
        ],
        checks: [
          {
            question: "Why forecast revenue from market size down rather than growth up?",
            answer:
              "Growth rates compound into absurdity. Working down from a market forces you to state a share, which is a claim someone can contest — and that is the point.",
          },
          {
            question: "Why should the discount rate change over the forecast period?",
            answer:
              "A five-year-old company with revenue is less risky than a pre-revenue one. Holding the rate constant either overvalues the early years or undervalues the later ones.",
          },
          {
            question: "How does survival probability enter the calculation?",
            answer:
              "Value the company assuming it succeeds, then multiply by the probability it survives to that point, adding any liquidation value in the failure case. Keeping it separate makes the assumption visible instead of burying it in the discount rate.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Valuing Young, Start-up and Growth Companies — complete",
            url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/younggrowth.pdf",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "The whole paper today. It is the single most useful free document in this roadmap — slow reading, and it repays it more than anything else here.",
          },
          {
            type: "tool",
            title: "Damodaran's valuation spreadsheets — the young-company model",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/spreadsh.htm",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Open it and take it apart before using it. Understanding how he structures the estimation is the lesson; the formulas are secondary.",
          },
          {
            type: "tool",
            title: "Damodaran's data page — margins and sales-to-capital by sector",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "This is where your target margin comes from. Borrowing a number from a dated report is what you are learning to stop doing. The sets update annually, early in the year — check the date stamp.",
          },
        ],
        concepts: [
          "startup-valuation",
          "market-sizing",
        ],
      },
      {
        title: "Revenue and EBITDA multiples",
        summary:
          "How startup valuations are actually discussed in a room — and what the one number is concealing.",
        learningObjectives: [
          "Unpack what a multiple embeds — growth, margin, risk and reinvestment, compressed",
          "Read ARR multiples correctly across different growth and retention profiles",
          "Rank the sources of a multiple by reliability, with reported rounds last",
        ],
        whyToday:
          "Multiples are how startup valuations are actually discussed in a room. You know how to calculate them; today is about knowing what they are concealing and when they mislead.",
        principle: "A multiple is a DCF with the assumptions hidden inside it.",
        commonMistake:
          "Treating a multiple as an objective market fact rather than an assumption set. Someone chose the peer group, the period and the metric — and each choice moved the answer.",
        challenge:
          "Take three publicly reported Indian startup rounds in one sector. Calculate the implied revenue multiple for each. Then write two sentences per company explaining why they differ — and one sentence on which of the three numbers you trust least, and why.",
        challengeMinutes: 25,
        estMinutes: 45,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What a multiple embeds",
            detail:
              "Growth, margin, risk and reinvestment, compressed into one number. It is not a shortcut past the analysis; it is the analysis, assumed.",
          },
          {
            title: "Revenue and ARR multiples",
            detail:
              "Why they dominate early-stage discussion for unprofitable companies, and why the same ARR multiple means different things at different growth rates and retention levels.",
          },
          {
            title: "EBITDA multiples",
            detail:
              "Where they apply and why they are largely irrelevant pre-profitability. A multiple of a number near zero is arithmetic, not valuation.",
          },
          {
            title: "Where the number comes from",
            detail:
              "Public comparables, transaction comparables, and reported rounds — each with its own bias, and each demanding you say which one you used.",
          },
          {
            title: "Why reported round multiples are the least reliable",
            detail:
              "Headline valuations often reflect structure and preference rather than economics. Module 2's preference stack is exactly why the announced number and the economic number diverge.",
          },
        ],
        checks: [
          {
            question: "Two SaaS companies both at 10x ARR. What might justify it?",
            answer:
              "Growth rate, net revenue retention, gross margin, market size and capital efficiency. Identical multiples on different fundamentals mean at least one is mispriced.",
          },
          {
            question: "Why is a headline round valuation unreliable as a comparable?",
            answer:
              "It may reflect liquidation preferences, ratchets or structure that make the economic valuation materially lower than the number announced.",
          },
          {
            question: "When is an EBITDA multiple meaningless?",
            answer:
              "When EBITDA is negative or trivially small. A multiple of a number near zero is arithmetic, not valuation.",
          },
          {
            question: "Why can you not put an EV multiple on an equity base?",
            answer:
              "Enterprise value belongs to all capital providers, so it pairs with pre-debt metrics — revenue, EBITDA. Equity value belongs to shareholders alone, so it pairs with post-debt metrics like earnings. Crossing them double-counts or ignores debt: EV/earnings flatters leveraged companies, and equity-value/EBITDA punishes them. It is the most common silent error in amateur comps, and checking the numerator-denominator pairing is the thirty-second audit of any multiples page.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "tool",
            title: "Damodaran's data page — revenue and EBITDA multiples by industry",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Free, annual, and defensible. When someone asks where your multiple came from, this is a better answer than a news article.",
          },
          {
            type: "read",
            title: "Valuation course webcasts — the relative valuation sessions",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/webcasteqspr25.htm",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "His full semester, session by session, free. Jump to the relative valuation and pricing sessions — he covers what a multiple implies about growth and risk, which is the part most people skip.",
          },
          {
            type: "read",
            title: "The SaaS Capital Index",
            url: "https://www.saas-capital.com/the-saas-capital-index/",
            sourceName: "SaaS Capital",
            editorNote:
              "A public multiples tracker with history. See how much the same companies' multiples move with market conditions — a multiple from eighteen months ago is not a comparable.",
          },
        ],
        concepts: [
          "comparable-company-analysis",
          "enterprise-vs-equity-value",
        ],
      },
      {
        title: "Choosing a defensible comparable set",
        summary:
          "The most consequential and least examined step in comparable analysis — and what to do when no clean comparable exists.",
        learningObjectives: [
          "Establish comparability on drivers — model, growth, margin, capital intensity — not sector labels",
          "Adjust explicitly for stage when comparing a startup to mature businesses",
          "Detect a manipulated peer set, including your own",
        ],
        whyToday:
          "You learned comparable company analysis. What a PGDM does not usually teach is that the selection of comparables is the most consequential and least examined step — and in startup work there frequently is no clean comparable at all.",
        principle: "The peer set is where the valuation is really decided.",
        commonMistake:
          "Selecting comparables, computing a median, and presenting it as market-derived. Every choice in that process was yours, and an experienced reader will test the ones you did not disclose.",
        challenge:
          "Pick one Indian listed company. Build two defensible peer sets of five companies each — one that makes it look expensive, one that makes it look cheap. Calculate the median multiple for each. Then write one paragraph on which set you would actually defend and why. If you can, pull one free brokerage report on the same company and compare its peer set with both of yours.",
        challengeMinutes: 25,
        estMinutes: 45,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What makes a company comparable",
            detail:
              "Business model, growth, margin, capital intensity and risk. Not sector label — two 'fintech' companies can have nothing economically in common.",
          },
          {
            title: "The startup problem",
            detail:
              "No listed company exists at the same stage, so you compare to mature businesses and adjust, or to reported private rounds and accept bad data. Either is workable; hiding which you did is not.",
          },
          {
            title: "Adjusting for stage and growth",
            detail:
              "The adjustment is a stated assumption, not a silent haircut. Being explicit that you adjusted, and by how much, is what separates analysis from advocacy.",
          },
          {
            title: "Transaction comparables",
            detail:
              "What an acquirer paid includes a control premium and expected synergies. Using transaction comparables to value a minority stake overstates it.",
          },
          {
            title: "How the peer set gets manipulated",
            detail:
              "Including or excluding two companies can move the median substantially, and nobody checks. A DRHP's peer comparison section is an education in motivated selection — companies choose their own comparables there.",
          },
        ],
        checks: [
          {
            question: "Why is sector a poor basis for comparability?",
            answer:
              "Economics differ within a sector. A payments processor and a lending business are both fintech and have entirely different margin structures, capital needs and risks.",
          },
          {
            question: "What does a transaction multiple include that a trading multiple does not?",
            answer:
              "A control premium and expected synergies. Using transaction comparables to value a minority stake overstates it.",
          },
          {
            question: "How do you defend a peer set?",
            answer:
              "State the selection criteria before showing the result, and show what happens if the two most contestable names are removed. A peer set defended after the fact is not defended.",
          },
          {
            question:
              "A banker's deck values a company at 8x revenue off a five-name peer set. What do you check before arguing with the 8?",
            answer:
              "The five names. Who is in the set that should not be, who is missing that should be, and what the median does when you correct both — the multiple is an output of the peer list, so the list is where the argument is won. Then check which revenue the 8 multiplies: trailing or forward, and whose definition. Most contested valuations are settled at the peer set and the base, not at the multiple itself.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Valuation course webcasts — comparable selection",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/webcasteqspr25.htm",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "The relative valuation sessions again, this time for the selection and adjustment problem — he is specific about it, which most treatments skip entirely.",
          },
          {
            type: "tool",
            title: "Damodaran's data page — sector groupings",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "See how a rigorous source groups companies — and how often the grouping is contestable. Your peer set's drivers should straddle the target's; his sector data is the sanity check.",
          },
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "Open any recent DRHP and find its 'comparison with listed industry peers' section. Companies choose their own comparables there — reading one critically is an education in motivated peer selection.",
          },
        ],
        concepts: [
          "comparable-company-analysis",
          "startup-valuation",
        ],
      },
      {
        title: "Scorecard, Berkus and the VC method",
        summary:
          "The pre-revenue toolkit used constantly in real rounds and taught in no finance curriculum — negotiation anchors, honestly labelled.",
        learningObjectives: [
          "Run the VC method with explicit exit, return and dilution assumptions",
          "Apply the scorecard and Berkus methods and state what each actually anchors on",
          "Present any of them without overstating its rigour",
        ],
        whyToday:
          "These methods are used constantly in early-stage rounds and appear nowhere in a finance curriculum. They are not rigorous, and understanding why is more useful than the methods themselves.",
        principle: "These are negotiation anchors, not valuations. Know which one you are doing.",
        commonMistake:
          "Presenting a scorecard output with the confidence of a DCF. These methods produce a starting point for a negotiation, and describing them accurately is part of advising well.",
        challenge:
          "Value one pre-revenue startup three ways: the VC method with a stated exit assumption and required return, the scorecard method, and the Berkus method. Then write a paragraph on which you would present to a founder, which to an investment committee, and why they differ.",
        challengeMinutes: 25,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The VC method",
            detail:
              "Work back from an expected exit value and a required return, subtracting for dilution. The most defensible of the group because the logic is explicit — four assumptions, all visible.",
          },
          {
            title: "Scorecard method",
            detail:
              "Adjust a regional average pre-money by weighted factors — team, market, product, competition. It anchors on what other people in the region paid, which is its honesty: it prices the round, not the company.",
          },
          {
            title: "Berkus method",
            detail:
              "Assign value to qualitative milestones for pre-revenue companies. A structured conversation about which risks have been retired, and presenting it as more than that is dishonest.",
          },
          {
            title: "Risk factor summation",
            detail:
              "Adjust a baseline up or down across a list of risk categories. The list forces breadth; the baseline still comes from the market.",
          },
          {
            title: "What they share, and when each applies",
            detail:
              "They anchor a negotiation and structure a conversation; none derives value from cash flows. Three crude methods agreeing loosely beats one crude method quoted precisely — the convergence zone is a negotiating range.",
          },
        ],
        checks: [
          {
            question: "What does the VC method actually require you to assume?",
            answer:
              "An exit value, an exit timing, a required return, and expected dilution before exit. Four assumptions, all explicit — which is its main virtue.",
          },
          {
            question: "Why is the scorecard method not really a valuation?",
            answer:
              "It adjusts a regional average, so the answer is anchored to what other people in that region paid. It transmits market conditions rather than deriving value.",
          },
          {
            question: "When would you use Berkus?",
            answer:
              "Pre-revenue, where nothing else has inputs. It is a structured conversation about milestones, and presenting it as more than that is dishonest.",
          },
          {
            question:
              "Use the VC method to tell me what an investor paying 40 crore post for 20% of a pre-revenue company must believe.",
            answer:
              "Work backwards: 20% of post at 40 crore, and suppose the fund needs roughly 10x on early bets with heavy dilution expected before exit — their stake might halve, so 10% at exit must return 10x of 8 crore, implying an exit around 800 crore. The method's honest output is that sentence: 'you must believe this company can exit near 800 crore and survive to do it.' Whether that belief is reasonable is the actual conversation — the method just forces it into the open.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Valuing pre-revenue companies — the scorecard, Berkus and VC methods",
            url: "https://angelcapitalassociation.org/data/Documents/Resources/AngelCapitalEducation/ACEF_-_Valuing_Pre-revenue_Companies.pdf",
            sourceName: "Angel Capital Association",
            editorNote:
              "An angel federation's own published guidance, with worked arithmetic for every method on today's list. This is what a real investor group actually uses — one careful read covers the mechanics of all of them.",
          },
          {
            type: "read",
            title: "Valuing Young, Start-up and Growth Companies — the venture capital section",
            url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/younggrowth.pdf",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Return to the paper's treatment of venture capital valuation approaches — he treats these methods critically rather than as received wisdom, which is the framing you need.",
          },
          {
            type: "read",
            title: "How to raise money",
            url: "https://www.ycombinator.com/library/6m-how-to-raise-money",
            sourceName: "Y Combinator",
            editorNote:
              "The investor-side view of early pricing — read it to see how little formal valuation happens at this stage, which is the context these methods live in.",
          },
        ],
        concepts: [
          "startup-valuation",
        ],
      },
      {
        title: "Valuation in a negotiation",
        summary:
          "Where the analysis meets the room — leverage, fund construction, signalling, and the price that none of the models set.",
        learningObjectives: [
          "Name the leverage factors that move a price off its analysis",
          "Explain how fund construction and ownership targets drive investor pricing",
          "Present a valuation as a range with drivers, and survive being challenged on it",
        ],
        whyToday:
          "Every method so far assumes valuation is analytical. In practice a startup's price is negotiated, and the analysis is one input among several. This is the day the finance training meets the room.",
        principle: "The number is an output of leverage as much as of analysis.",
        commonMistake:
          "Bringing a model to a negotiation and expecting it to settle the question. The model earns you credibility and frames the discussion. It does not decide the price.",
        challenge:
          "Write a one-page valuation recommendation for a founder raising a seed round. Include a range rather than a point, the three assumptions that drive it, what would change your view, and one paragraph on what a valuation 40% above your range would cost them at the next round.",
        challengeMinutes: 25,
        estMinutes: 45,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What actually moves the number",
            detail:
              "Competing term sheets, runway remaining, sector heat, the investor's fund cycle, and how badly each side needs the deal. These are checkable facts; list them before the meeting the way you would list comps.",
          },
          {
            title: "The investor's position",
            detail:
              "Ownership targets, fund construction, and reserve strategy. Many funds need a minimum percentage, which drives the price more than the model does — price is not always adversarial.",
          },
          {
            title: "The founder's position",
            detail:
              "Dilution, control, and the signalling cost of a valuation too high for the next round to clear. The best deal is the one the next round can build on.",
          },
          {
            title: "Structure versus price",
            detail:
              "Preferences, ratchets and pool timing move economics without changing the headline. Day 4's lesson returns with force: conceding price and winning clean terms often beats the reverse.",
          },
          {
            title: "Why an inflated valuation damages a company",
            detail:
              "The down round that follows reprices employee options, triggers anti-dilution, and damages confidence. The adviser's paragraph on this is the most valuable one in the recommendation.",
          },
          {
            title: "Presenting a valuation you will be challenged on",
            detail:
              "Lead with assumptions, show the sensitivity, name the weakest input yourself. Damodaran's value-versus-price distinction is the frame: the model estimates value; the room sets a price.",
          },
        ],
        checks: [
          {
            question: "Why might an investor push a valuation up rather than down?",
            answer:
              "To win a competitive round, or because their fund needs to deploy a certain cheque size at a certain ownership. Price is not always adversarial.",
          },
          {
            question: "What is the cost of a valuation set too high?",
            answer:
              "The next round must clear it. If it cannot, a down round follows — repricing employee options, triggering anti-dilution, and damaging confidence in the company.",
          },
          {
            question: "Why present a range rather than a number?",
            answer:
              "A point estimate invites a debate about precision you do not have. A range with stated drivers moves the conversation to the assumptions, which is where it belongs.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Term Sheet series — the economics posts",
            url: "https://feld.com/archives/2005/08/term-sheet-series-wrap-up/",
            sourceName: "Brad Feld",
            editorNote:
              "From day 4's index, read the valuation and economics posts specifically — written from the investor side about what is actually negotiated.",
          },
          {
            type: "read",
            title: "How to raise money",
            url: "https://www.ycombinator.com/library/6m-how-to-raise-money",
            sourceName: "Y Combinator",
            editorNote:
              "Re-read with this module's methods in mind, watching for one thing: how much of the essay is about process and leverage rather than valuation. That proportion is the honest answer to how prices get set.",
          },
          {
            type: "read",
            title: "Musings on Markets — value versus price",
            url: "https://aswathdamodaran.blogspot.com/",
            sourceName: "Aswath Damodaran",
            editorNote:
              "Search the blog for his price-and-value posts — the distinction between what a model estimates and what a market pays is the intellectual frame for this entire day.",
          },
        ],
        concepts: [
          "startup-valuation",
          "term-sheets",
        ],
      },
      {
        title: "Sanity-checking someone else's valuation",
        summary:
          "The module ends where the job actually is: taking a valuation apart in twenty minutes and finding the assumption carrying it.",
        learningObjectives: [
          "Run the checking order: terminal value share, growth, margins, rate, share count",
          "Reverse-engineer a price into its implied assumptions and test their plausibility",
          "Complete the module deliverable — three methods on one company, reconciled on one page",
        ],
        whyToday:
          "The module ends where the job actually is. In advisory work you will assess far more valuations than you build, and the skill of taking one apart quickly is what makes you useful in a meeting.",
        principle: "Find the one assumption carrying the whole answer. There always is one.",
        commonMistake:
          "Rebuilding the model instead of interrogating it. Your value in a meeting is finding the assumption everything rests on in twenty minutes — not producing your own version by Friday.",
        challenge:
          "Take a startup valuation you can find — a reported round, a pitch deck, or one you built earlier in this module. Produce a one-page critique: the implied assumptions, the load-bearing input, two things you would want to verify, and the single question you would ask in a meeting. Then complete the module deliverable: your three-method valuation of one real Indian startup, with one page on why the numbers differ and which you would defend.",
        challengeMinutes: 45,
        estMinutes: 45,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The order to check things in",
            detail:
              "Terminal value share, revenue growth, margin trajectory, discount rate, share count. Most errors are in the first two, so start there and often stop there.",
          },
          {
            title: "Reverse-engineering a price",
            detail:
              "What growth and margin does this valuation require, and is that plausible for anyone in this sector? Working backward from a price to its implied assumptions is the single most useful technique in this module.",
          },
          {
            title: "Finding the load-bearing assumption",
            detail:
              "Change each input by 10% and see which one moves the answer most. That is the assumption to interrogate — and in a scenario DCF it is usually the survival probability; in a multiple, the peer set; in the VC method, the exit value.",
          },
          {
            title: "Common manipulations",
            detail:
              "A peer set with the two cheapest names removed, a terminal growth rate above the discount rate, revenue recognised aggressively, adjusted EBITDA with too many adjustments. Each is visible if you look for it specifically.",
          },
          {
            title: "Arithmetic before logic",
            detail:
              "Hardcodes, broken sum ranges, sign errors and circular references. Errors are more often mechanical than conceptual — and one hardcode means the model has not been audited, so there are probably more.",
          },
          {
            title: "How to raise a problem",
            detail:
              "Ask what the assumption is based on, rather than announcing that it is wrong. The question does the same work and leaves the room intact.",
          },
        ],
        checks: [
          {
            question: "A model shows 60% revenue growth for five straight years. What do you ask?",
            answer:
              "What in the market or the business supports that, and who else has ever done it in this sector? Sustained growth at that rate is rare and the burden of proof sits with the model.",
          },
          {
            question: "Terminal growth is 6% and the discount rate is 9%. Is that acceptable?",
            answer:
              "Terminal growth cannot exceed long-run economic growth — the company would eventually exceed the economy. 6% is almost certainly too high, and it inflates terminal value substantially.",
          },
          {
            question:
              "You find a hardcoded number in a formula range. Why does it matter beyond the error itself?",
            answer:
              "It tells you the model has not been audited, so there are probably more. One hardcode is a reason to check everything.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Musings on Markets — reverse DCFs",
            url: "https://aswathdamodaran.blogspot.com/",
            sourceName: "Aswath Damodaran",
            editorNote:
              "His company posts routinely work backward from a market price to the growth and margin it implies. Find one and study the move — it is today's method, demonstrated on a real ticker.",
          },
          {
            type: "read",
            title: "Hindenburg Research — the report archive",
            url: "https://hindenburgresearch.com/",
            sourceName: "Hindenburg Research",
            editorNote:
              "The firm wound down in 2025 but its reports remain published. Whatever you think of the conclusions, read one for method — they are a masterclass in taking apart someone else's numbers, section by section.",
          },
          {
            type: "read",
            title: "The FAST Standard",
            url: "https://fast-standard.org/",
            sourceName: "FAST Standard Organisation",
            editorNote:
              "Free modelling standard. Knowing what a well-built model looks like tells you where to look in a badly built one — read the structure rules, not the whole document.",
          },
          {
            type: "doc",
            title: "SEBI — public issue filings",
            url: "https://www.sebi.gov.in/filings/public-issues.html",
            sourceName: "SEBI",
            editorNote:
              "A filed DRHP's financial section is real numbers, real disclosures, and real adjustments to interrogate — free practice material for exactly this drill, and module 7 returns here.",
          },
        ],
        concepts: [
          "startup-valuation",
          "model-audit",
        ],
      },
    ],
  },
  {
    title: "Unit economics and traction",
    weekRange: "Weeks 4–5",
    objective: "The layer between the pitch narrative and the financial model.",
    deliverable:
      "Take a real startup's public numbers, build the unit economics, and identify the two metrics you would want before investing.",
    estHours: 7.5,
    nodes: [
      {
        title: "CAC, LTV and the ratio everyone quotes wrongly",
        summary: "The most-quoted numbers in startup finance, and the honest versions of each.",
        learningObjectives: [
          "Compute CAC fully loaded and LTV on contribution margin, not revenue",
          "Explain why LTV:CAC without payback period is half a sentence",
          "Catch the standard inflations of both numbers",
        ],
        whyToday:
          "Unit economics are the bridge between the deck's story and the model's rows, and this pair is where every conversation starts. An adviser fluent in the honest versions can read a pitch in minutes; one who accepts the quoted versions cannot read it at all.",
        principle: "An LTV:CAC of 3 means nothing without the payback period beside it.",
        commonMistake:
          "Accepting LTV built on revenue and CAC built on ad spend alone. LTV must be contribution margin over the retention curve actually observed; CAC must carry salaries, tools and content — the inflations run in opposite directions and multiply.",
        challenge:
          "Take one startup's quoted LTV:CAC and rebuild both numbers honestly from whatever is public or assumable. Write the quoted ratio, your ratio, and the two adjustments that moved it most. Tomorrow adds payback; keep the file.",
        challengeMinutes: 45,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Honest CAC",
            detail:
              "All acquisition spend — media, salaries, tools, agency, content — over new customers from that spend. Blended versus paid CAC differ, and which one a founder quotes is itself information.",
          },
          {
            title: "Honest LTV",
            detail:
              "Contribution margin per period times observed retention, discounted if the horizon is long. Revenue-based LTV overstates by the whole cost of serving — for a thin-margin business, several-fold.",
          },
          {
            title: "Why payback is the missing half",
            detail:
              "A 3:1 ratio repaid over four years is a cash furnace; over four months, a machine. The ratio states profitability eventually; payback states survivability meanwhile — and startups die of meanwhile.",
          },
          {
            title: "The denominator games",
            detail:
              "Counting signups as customers, blending organic into paid, annualising a good month. Each inflates the ratio; day 27 catalogues the full set.",
          },
        ],
        checks: [
          {
            question: "What must LTV be built on, and why not revenue?",
            answer:
              "Contribution margin over observed retention — revenue-based LTV ignores the cost of serving and overstates accordingly.",
          },
          {
            question: "Why does LTV:CAC need payback period beside it?",
            answer:
              "The ratio says whether customers are eventually profitable; payback says how long cash is trapped — and cash, not eventual profit, is what startups run out of.",
          },
          {
            question: "Name two standard CAC understatements.",
            answer:
              "Excluding salaries and tools from acquisition cost, and blending organic customers into the paid denominator.",
          },
          {
            question:
              "A founder claims LTV:CAC of 4. What three questions establish whether the number means anything?",
            answer:
              "What is in LTV — contribution margin over observed retention, or revenue over an assumed lifetime? What is in CAC — fully loaded with salaries and tools, or media spend only? And what is the payback period — because 4:1 recovered over three years is a financing problem wearing a good ratio. The pattern of answers usually matters more than the ratio: a founder who knows these distinctions has real unit economics; one who does not has a slide.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "The library's growth and metrics essays define these terms the way investors actually use them. Read one on unit economics today — and notice it agrees with the honest versions, not the quoted ones.",
          },
          {
            type: "video",
            title: "Startup Pricing 101 — Kevin Hale",
            url: "https://www.youtube.com/watch?v=jwXlo9gy_k4",
            sourceName: "Y Combinator (YouTube)",
            youtubeVideoId: "jwXlo9gy_k4",
            durationSec: 1172,
            estSizeMb: 149,
            editorNote:
              "Twenty minutes on how price drives CAC, LTV and everything downstream of them. The four pricing mistakes he lists are the same four you will find inside gamed unit economics on day 27.",
          },
        ],
        concepts: [
          "unit-economics",
        ],
      },
      {
        title: "Contribution margin and payback",
        summary: "The layer where a business model is either real or not.",
        learningObjectives: [
          "Build contribution margin per unit from first principles for a real company",
          "Compute CAC payback in months from contribution, not revenue",
          "Read a business's viability from these two numbers before any growth story",
        ],
        whyToday:
          "Everything yesterday leaned on contribution margin; today builds it properly. This is the single number that separates businesses that scale into profits from businesses that scale into larger losses — growth multiplies whatever the unit is.",
        principle: "Contribution margin is where a business model is either real or not.",
        commonMistake:
          "Computing contribution with gross margin and calling it done. Contribution must carry everything that scales with the unit — payment fees, delivery, support, returns, incentives. The gap between gross and contribution is precisely where weak models hide.",
        challenge:
          "Build the per-unit P&L for one transaction of a real Indian startup — price down through every variable cost to contribution. Then compute CAC payback in months. Two numbers on one page; write one sentence on what growth does to this company.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The per-unit P&L",
            detail:
              "One order, one user-month, one ride: price, minus COGS, payment fees, fulfilment, support, incentives, returns. What remains funds fixed costs and CAC — or does not.",
          },
          {
            title: "Gross versus contribution",
            detail:
              "Gross margin stops at COGS; contribution carries all variable costs. Companies quote gross because it is bigger; analysis runs on contribution because it is true.",
          },
          {
            title: "Payback in months",
            detail:
              "CAC divided by contribution per month. It is the cash-cycle number: how long each customer's acquisition cost stays on the balance sheet before the customer has earned it back.",
          },
          {
            title: "Negative contribution",
            detail:
              "Some models lose money on every unit by design-for-now — the question is what specifically changes the sign, at what scale, and whether that change is priced or wished.",
          },
        ],
        checks: [
          {
            question: "What belongs in contribution margin that gross margin excludes?",
            answer:
              "Every cost that scales with the unit — payment fees, delivery, support, returns, incentives.",
          },
          {
            question: "How is CAC payback computed?",
            answer:
              "CAC divided by monthly contribution margin per customer — months to recover.",
          },
          {
            question: "What does growth do to a negative-contribution business?",
            answer:
              "Multiplies the loss. Scale amplifies the unit; it does not repair it unless something specific changes the unit's sign.",
          },
          {
            question:
              "A D2C brand has 55% gross margin and is scaling fast. What do you check before believing the story?",
            answer:
              "The path from gross to contribution: shipping, payment fees, returns and marketing incentives per order. D2C returns alone can take ten points; fulfilment another ten or more. If contribution after all variable costs is thin or negative, the 55% is decoration and scaling is accelerating a loss. Then payback — how many orders before a customer covers their own acquisition, and how many customers ever place that many.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "tool",
            title: "Damodaran's current data page",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "The sector margin tables are today's reality check — a modelled contribution margin should be arguable against what whole industries actually achieve.",
          },
        ],
        concepts: [
          "unit-economics",
        ],
      },
      {
        title: "Cohort retention and what a growth chart hides",
        summary: "The difference between a company acquiring users and a company keeping them.",
        learningObjectives: [
          "Build a cohort retention table from raw signup and activity data",
          "Read flattening versus decaying curves and what each implies for LTV",
          "Explain what cumulative charts conceal and why founders prefer them",
        ],
        whyToday:
          "Retention is the truth serum of unit economics — LTV is a bet on the retention curve, and the curve cannot be faked the way a growth chart can. This day also pays forward: the diligence module reads these tables as evidence.",
        principle: "Cumulative charts always go up. That is why founders use them.",
        commonMistake:
          "Reading blended retention across all users. A blend mixes old cohorts with new ones, so a company whose product is getting worse can show stable blended numbers while every recent cohort decays faster than the last. Only the cohort view shows direction.",
        challenge:
          "Take any cohort data you can get — public, a friend's product, or synthesised honestly — and build the triangle: cohorts down, months across. Then draw the same data as a cumulative user chart and put the two side by side. That pairing is the day's lesson in one image.",
        challengeMinutes: 50,
        estMinutes: 70,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The cohort table",
            detail:
              "Each row a signup month, each column months-since, each cell the share still active. The data-analyst roadmap builds this in SQL; here the skill is reading it.",
          },
          {
            title: "Flattening versus decaying",
            detail:
              "A curve that flattens at any level means a retained core exists and LTV is computable. A curve that decays to zero means every LTV is a guess about when the bleeding stops.",
          },
          {
            title: "Cohort-over-cohort direction",
            detail:
              "Are newer cohorts retaining better or worse than older ones at the same age? That trend is the product improving or degrading — and it is invisible in every blended number.",
          },
          {
            title: "What cumulative hides",
            detail:
              "Total registered users rises even as active users collapse. Any chart that cannot go down is not evidence; the adviser's reflex is to ask for the same data by cohort.",
          },
        ],
        checks: [
          {
            question: "Why is blended retention misleading?",
            answer:
              "It mixes cohort ages, so worsening recent cohorts hide behind the accumulated base — direction is invisible.",
          },
          {
            question: "What does a flattening retention curve license you to do?",
            answer:
              "Compute LTV on the retained core — a stable fraction persists, so lifetime value has a floor.",
          },
          {
            question: "What is the reflex response to a cumulative chart?",
            answer:
              "Ask for the same data as a cohort table — any chart that cannot go down is not evidence.",
          },
          {
            question:
              "A deck shows monthly active users doubling over a year. What single view of the same data do you ask for, and what are you looking for?",
            answer:
              "The cohort retention table — signups by month down the side, months-since-signup across, share still active in each cell. Two reads: do curves flatten at some level, meaning a retained core exists and LTV is computable; and are newer cohorts retaining better or worse than older ones at the same age, which is the product genuinely improving or degrading. MAU doubling is consistent with both a compounding business and a leaky bucket refilled by ad spend — only the cohort view says which.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "The library's essays on retention and growth accounting are the investor-side reading of exactly these tables — find one and note the vocabulary: it is what partner meetings speak.",
          },
        ],
        concepts: [
          "traction-metrics",
          "unit-economics",
        ],
      },
      {
        title: "SaaS metrics — MRR, ARR, NRR, churn",
        summary: "The metric system of the most-funded business model.",
        learningObjectives: [
          "Define MRR, ARR, gross and net revenue retention, and logo churn precisely",
          "Decompose MRR movement: new, expansion, contraction, churn",
          "Explain why NRR above 100% changes what a company is worth",
        ],
        whyToday:
          "SaaS has the most standardised metrics of any model, which makes it the easiest place to be precisely wrong. Indian SaaS is also a hiring market this roadmap's audience advises into — fluency here is table stakes.",
        principle: "Net revenue retention above 100% is the single strongest signal in SaaS.",
        commonMistake:
          "Multiplying a good month by twelve and calling it ARR. Annualising a spike — or counting one-time services, or pilots not yet converted — turns ARR from a run-rate into a hope. The decomposition exists precisely to catch this.",
        challenge:
          "Build the MRR bridge for a company (real or given): opening MRR, plus new, plus expansion, minus contraction, minus churn, closing MRR. From it compute gross and net retention. Then write which single line of the bridge you would interrogate first, and why.",
        challengeMinutes: 45,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The bridge",
            detail:
              "MRR movement decomposed: new business, expansion from existing customers, contraction, and churn. Every SaaS conversation is really about the relative size of these four flows.",
          },
          {
            title: "Gross versus net retention",
            detail:
              "Gross retention caps at 100% — it measures only what was kept. Net adds expansion and can exceed 100%, meaning the base grows with zero new sales. That is the compounding investors pay up for.",
          },
          {
            title: "Logo versus revenue churn",
            detail:
              "Losing many small customers and few large ones look identical in revenue churn and opposite in logo churn. Both numbers, always — their divergence is a finding.",
          },
          {
            title: "ARR hygiene",
            detail:
              "Contracted, recurring, live revenue times twelve — not services, not pilots, not the best month annualised. What a company includes in ARR is a diligence question with a fast answer.",
          },
        ],
        checks: [
          {
            question: "What does NRR above 100% mean mechanically?",
            answer:
              "Expansion from existing customers exceeds contraction plus churn — revenue compounds with no new logos at all.",
          },
          {
            question: "Why report both logo and revenue churn?",
            answer:
              "They diverge when customer sizes differ — many small losses versus one large loss — and the divergence locates the problem.",
          },
          {
            question: "Name two things that do not belong in ARR.",
            answer:
              "One-time services revenue, and annualised spikes or unconverted pilots — ARR is contracted recurring run-rate.",
          },
          {
            question:
              "Two SaaS companies both grew revenue 60% last year. One has NRR of 130%, the other 85%. What is the difference worth?",
            answer:
              "Almost everything. The 130% company compounds from its base — its growth is cheap, durable and gets cheaper as the base grows. The 85% company refills a leaking bucket: it bought all 60 points with new sales and starts every year 15 points behind. Same headline, opposite machines — and the multiple gap between them in any sane market is large. NRR is the first number I would ask for, before growth.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "The SaaS metrics essays here are the canonical definitions this day uses. Pick the key-metrics piece for SaaS and check your bridge's vocabulary against it.",
          },
        ],
        concepts: [
          "saas-metrics",
          "unit-economics",
        ],
      },
      {
        title: "Marketplace and D2C metrics",
        summary: "Two models where the headline number and the business are furthest apart.",
        learningObjectives: [
          "Work from GMV to net revenue via take rate — and know why the order matters",
          "Read marketplace health: liquidity, repeat rate, concentration",
          "Apply the D2C set: AOV, repeat, returns, contribution after logistics",
        ],
        whyToday:
          "India's largest startups are marketplaces and D2C brands, and both models are quoted in the metrics most distant from economic reality. The adviser's job is the translation — GMV to net revenue, orders to contribution.",
        principle: "GMV is a vanity metric until you know the take rate.",
        commonMistake:
          "Comparing a marketplace's GMV multiple to a SaaS company's revenue multiple. A marketplace books only its take of GMV as revenue — comparing gross flow to net revenue across models is a category error that flatters every marketplace by the inverse of its take rate.",
        challenge:
          "Take one Indian marketplace or D2C company with public numbers. Build the cascade: GMV (or gross sales) → net revenue → contribution. Write the two percentages — take rate and contribution margin — and one sentence on what the headline number concealed.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The GMV cascade",
            detail:
              "Gross merchandise value is everything transacted; the platform's revenue is its take rate slice; its economics are contribution after incentives and logistics. Each step down is where a different weakness hides.",
          },
          {
            title: "Marketplace liquidity",
            detail:
              "Fill rate, time-to-match, repeat usage on both sides. A marketplace's moat is liquidity, and these are its gauges — GMV can grow while liquidity decays, briefly.",
          },
          {
            title: "Incentives as negative revenue",
            detail:
              "Discounts and cashbacks funded by the platform are contra-revenue, not marketing, whatever the P&L classification. Reclassifying them is a standard diligence adjustment.",
          },
          {
            title: "The D2C set",
            detail:
              "AOV, repeat purchase rate, return rate, contribution after logistics. Returns are the model-breaker in Indian D2C — a 30% return rate quietly destroys a 55% gross margin.",
          },
        ],
        checks: [
          {
            question: "Why can't GMV multiples be compared with revenue multiples?",
            answer:
              "GMV is gross flow; revenue is the platform's take of it. The comparison flatters marketplaces by the inverse of their take rate.",
          },
          {
            question: "How should platform-funded discounts be treated?",
            answer:
              "As contra-revenue — they reduce the real take, regardless of where the P&L classifies them.",
          },
          {
            question: "What is the model-breaking metric in Indian D2C?",
            answer:
              "Return rate — returns carry two-way logistics and refurbishment, and can erase an apparently healthy gross margin.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "The marketplace and consumer essays define liquidity and take-rate the way investors use them — find the marketplace-metrics piece and check today's cascade against its vocabulary.",
          },
        ],
        concepts: [
          "unit-economics",
          "traction-metrics",
        ],
      },
      {
        title: "Burn, runway and the calculation that matters most",
        summary:
          "The one number a founder must never be wrong about — and advisers get to check.",
        learningObjectives: [
          "Compute gross burn, net burn and runway from actuals, not projections",
          "Adjust runway for the receipts that will not arrive on time",
          "State the raise-timing arithmetic: runway minus process time equals the real deadline",
        ],
        whyToday:
          "Runway is the deadline every other number lives inside. The startup-CFO's defining task and the diligence analyst's first check are the same calculation, and it is taught here — before the deck module — because decks are written against runway pressure.",
        principle: "Runway is the only number a founder must never be wrong about.",
        commonMistake:
          "Computing runway from projected collections and planned cost cuts. Honest runway uses trailing actual net burn and stress-tests receipts — the version built from the plan is exactly as reliable as the plan, which is what the runway was supposed to protect against.",
        challenge:
          "From any company's last three months of actuals (real or supplied): gross burn, net burn, months of runway — then the stressed version at 70% collections. Finally the deadline: runway minus five months of fundraise process. Write the date. That date is the advice.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Gross and net",
            detail:
              "Gross burn is total cash out per month; net burn subtracts cash actually collected. The gap between revenue booked and cash collected is where optimistic runways are manufactured.",
          },
          {
            title: "Trailing actuals",
            detail:
              "Three-month trailing average of net burn, from bank movements rather than the P&L. Accrual accounting is for accuracy; runway is for survival, and survival runs on cash.",
          },
          {
            title: "The stress case",
            detail:
              "Receivables late, one customer lost, the cost cut that never quite happens. Stressed runway is usually the true number; the founder's version is the ceiling.",
          },
          {
            title: "The real deadline",
            detail:
              "A fundraise takes months, and terms degrade as runway shortens — the worst time to raise is when you must. Deadline = runway − process time − buffer, and it is earlier than anyone wants.",
          },
        ],
        checks: [
          {
            question: "What separates gross from net burn?",
            answer:
              "Cash collected — net burn is gross cash out minus actual receipts, and it is the runway number.",
          },
          {
            question: "Why compute burn from bank actuals rather than the P&L?",
            answer:
              "Accrual timing differs from cash timing, and runway is a cash-survival number — booked revenue does not pay salaries.",
          },
          {
            question: "State the real fundraise deadline formula.",
            answer:
              "Runway minus expected process time minus buffer — because terms degrade as the runway visibly shortens.",
          },
          {
            question:
              "A founder says fourteen months of runway. What do you check before repeating that number to anyone?",
            answer:
              "Whether it is built on trailing actual net burn or on the plan. Check the last three months of bank movements, the collections assumption behind 'net', any planned-but-unexecuted cost cuts, and one-off receipts flattering the average. Then subtract a realistic fundraise process and a buffer. Fourteen planned months is commonly nine honest ones — and the founder who must not be wrong about this number is usually the most optimistic person in the room about it.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Y Combinator Startup Library",
            url: "https://www.ycombinator.com/library",
            sourceName: "Y Combinator",
            editorNote:
              "The library's pieces on burn and default-alive are the sharpest short reading on this exact arithmetic — search 'default alive' and read what comes back.",
          },
        ],
        concepts: [
          "unit-economics",
        ],
      },
      {
        title: "How each of these gets gamed",
        summary:
          "The module capstone: every metric's standard manipulation, and the module deliverable completed.",
        learningObjectives: [
          "Catalogue the standard inflation for every metric in this module",
          "Detect each from the outside — what to ask for, what to recompute",
          "Complete the deliverable: real company, honest unit economics, the two metrics you would demand",
        ],
        whyToday:
          "The module ends by weaponising it. Every number from the last six days has a standard manipulation, and diligence is largely knowing the catalogue — this day writes it down and applies it to a real company.",
        principle: "Every metric in this module has a standard manipulation. Learn all of them.",
        commonMistake:
          "Treating manipulations as lies. Most are choices — a flattering definition, a favourable window, an undisclosed blend — each defensible alone. The skill is noticing that every choice in the deck happens to point the same direction, which is not chance.",
        challenge:
          "Complete the deliverable: one real startup's public numbers, unit economics rebuilt honestly, and the two metrics you would want before investing — with one line each on why those two. Append your manipulation catalogue: metric, standard game, detection question. Keep both; module 6 reuses them.",
        challengeMinutes: 60,
        estMinutes: 75,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The catalogue, by metric",
            detail:
              "CAC: exclude salaries, blend organic. LTV: revenue base, assumed lifetime. Retention: blended not cohort. ARR: annualised spike, services inside. GMV: incentives uncounted. Runway: planned cuts. One line each — the list fits a page and reads like an audit programme.",
          },
          {
            title: "Detection is recomputation",
            detail:
              "Every game is caught the same way: ask for the raw inputs and rebuild the metric under the standard definition. The refusal to share inputs is itself the strongest finding.",
          },
          {
            title: "Direction as evidence",
            detail:
              "Each individual choice may be defensible; twelve choices all flattering is a posture. Diligence reports the pattern, not just the items.",
          },
          {
            title: "The two-metric discipline",
            detail:
              "For any company there are one or two numbers that, honestly computed, decide the thesis. Naming them in advance — before the data room — is what separates targeted diligence from a checklist crawl.",
          },
        ],
        checks: [
          {
            question: "What is the universal detection method for gamed metrics?",
            answer:
              "Recomputation — obtain the raw inputs and rebuild the metric under its standard definition.",
          },
          {
            question: "Why does the direction of definitional choices matter?",
            answer:
              "Any single choice may be defensible; all choices flattering the same way is a pattern, and the pattern is the finding.",
          },
          {
            question: "What makes 'the two metrics you would want' a discipline?",
            answer:
              "Naming them before seeing the data room forces the thesis to be explicit and makes diligence targeted rather than ritual.",
          },
        ],
        resources: [],
        concepts: [
          "unit-economics",
          "traction-metrics",
          "saas-metrics",
        ],
      },
    ],
  },
];
