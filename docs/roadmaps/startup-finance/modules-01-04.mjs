/**
 * Startup finance & fundraising — modules 1–4, days 1–27.
 *
 * Built from the owner's brief in assets/Finance/roadmap-startup-finance.md.
 * Every module title, day title, principle and deliverable is the brief's,
 * verbatim; the rest of the day model is authored here. Module 1 follows the
 * owner's fully-authored reference (assets/Finance/module-1-reference.md,
 * received 2026-09-04): its challenges, checks, topics and named sources are
 * that document's, verified before use. Two of its source asks stay linkless
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
    estHours: 8.5,
    nodes: [
      {
        title: "What a cap table actually is",
        summary:
          "The single document that records who owns what — and the discipline of rebuilding it from the deal documents.",
        learningObjectives: [
          "Read a cap table: holders, share classes, fully-diluted versus issued",
          "Explain why fully-diluted is the denominator that matters",
          "Rebuild a simple table from a set of deal documents",
        ],
        whyToday:
          "This module is the skill a PGDM does not teach and startup advisory runs on. Everything later — dilution, ESOP, conversion, waterfall — is an operation on this one table, so today establishes what the table is and what counts as knowing it.",
        principle:
          "If you cannot rebuild the cap table from the documents, you do not understand the deal.",
        commonMistake:
          "Trusting the summary percentages a founder sends over. Summary tables omit the option pool, the un-converted SAFEs, or a forgotten angel — and every valuation and dilution number computed on the wrong denominator is wrong in the founder's favour.",
        challenge:
          "Take a company with three documented events — incorporation, an angel cheque, an ESOP grant — and rebuild the cap table from the documents alone. Then compare against the summary you were 'given' and find what it omitted.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The rows and the classes",
            detail:
              "Founders' equity, investors' preference shares, the ESOP pool, and anything convertible waiting to land. Each class carries different rights; the table records ownership and the rights ride the class.",
          },
          {
            title: "Issued versus fully diluted",
            detail:
              "Issued counts shares that exist; fully diluted adds everything that will exist — options granted and reserved, convertibles at expected conversion. Fully diluted is the denominator for every honest percentage.",
          },
          {
            title: "The table as history",
            detail:
              "A cap table is the cumulative record of every deal the company ever did. Rebuilding it from documents is how an adviser verifies the history rather than inheriting its errors.",
          },
          {
            title: "Who maintains it, and badly",
            detail:
              "Early companies keep it in a spreadsheet maintained by whoever raised last. Assume errors; finding them politely is part of the job.",
          },
        ],
        checks: [
          {
            question: "What does fully diluted include that issued does not?",
            answer:
              "Everything that will become shares — granted and reserved options, and convertibles at their expected conversion.",
          },
          {
            question: "Why rebuild a cap table from documents rather than accept the summary?",
            answer:
              "Summaries omit pools, un-converted instruments and forgotten holders, and every percentage computed on the wrong denominator is wrong.",
          },
          {
            question: "What travels with a share class besides ownership?",
            answer:
              "Rights — preference, anti-dilution, votes, vetoes. The class defines what the shares can do, not just how many there are.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "What is a cap table?",
            url: "https://carta.com/learn/startups/equity-management/cap-table/",
            sourceName: "Carta",
            editorNote:
              "The cleanest plain-language explainer from the company whose product is cap tables. Read it before the challenge, then do the challenge without it open.",
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
        summary: "Four quantities, one identity — and the ambiguity that moves crores.",
        learningObjectives: [
          "Compute price per share, new shares and ownership from pre-money and cheque size",
          "Convert fluently between pre-money and post-money statements",
          "Spot when 'valuation' is being quoted ambiguously, and what the ambiguity is worth",
        ],
        whyToday:
          "This is the arithmetic every negotiation quotes and a surprising share of practitioners fumble. It has to be reflexive before day 9 builds it into a model — the model is only trustworthy if you can predict its outputs by hand.",
        principle:
          "Pre-money and post-money differ by exactly the amount everyone argues about.",
        commonMistake:
          "Hearing 'we raised at 50 crores' and not asking which. Pre versus post on the same headline number changes the investor's ownership — and whether the ESOP pool sits inside or outside changes it again. The ambiguity is not pedantry; it is the negotiation.",
        challenge:
          "A company raises ₹10 crore at '₹50 crore valuation'. Compute investor ownership under: pre-money 50; post-money 50; pre-money 50 with a fresh 10% post-round pool. Three answers, one headline — write the sentence you would use to pin a term sheet down.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The identity",
            detail:
              "Post-money = pre-money + new cash. Investor ownership = cash ÷ post-money. Everything else in round arithmetic is derived from these two lines.",
          },
          {
            title: "Price per share",
            detail:
              "Pre-money ÷ fully-diluted pre-round shares. New shares issued = investment ÷ price. The share count makes the percentages concrete and catches errors percentages hide.",
          },
          {
            title: "Where the ambiguity hides",
            detail:
              "Headlines quote one number; term sheets specify which. The same '50 crore' is a sixth of the company or a fifth depending on the word before it.",
          },
          {
            title: "The pool complication",
            detail:
              "A pool created pre-money dilutes founders before the investor buys in — same headline, different founder outcome. Day 11 makes this precise.",
          },
        ],
        checks: [
          {
            question: "State the pre/post identity and the ownership formula.",
            answer:
              "Post-money equals pre-money plus new cash; investor ownership equals cash divided by post-money.",
          },
          {
            question: "₹10 crore in at ₹40 crore pre-money — what does the investor own?",
            answer: "10 ÷ (40 + 10) = 20%.",
          },
          {
            question: "Why insist on share counts rather than working in percentages?",
            answer:
              "Percentages hide denominator errors. Shares and price make every step checkable and force the fully-diluted question into the open.",
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
            type: "read",
            title: "What is a cap table?",
            url: "https://carta.com/learn/startups/equity-management/cap-table/",
            sourceName: "Carta",
            editorNote:
              "Re-open yesterday's explainer at its dilution worked example — read it after doing today's challenge by hand, as the answer key rather than the method.",
          },
        ],
        concepts: [
          "cap-table-dilution",
        ],
      },
      {
        title: "Building a cap table from scratch in Excel",
        summary:
          "The model itself: share counts in, everything else derived, nothing hardcoded.",
        learningObjectives: [
          "Structure the model: events as columns, holders as rows, shares as the atoms",
          "Derive every percentage from share counts — never type one",
          "Make the model extend to a new round without restructuring",
        ],
        whyToday:
          "Today the arithmetic becomes an artefact. The module deliverable is this file, grown over the next four days — and the habits set now (shares as atoms, no hardcodes) decide whether day 13's waterfall is an afternoon or a rebuild.",
        principle:
          "A cap table with a hardcoded ownership percentage is a cap table that will be wrong next round.",
        commonMistake:
          "Building in percentages because they are what everyone asks about. Percentages are outputs. A model whose inputs are percentages cannot absorb a new round — every cell is wrong the moment the denominator moves, which is what denominators do.",
        challenge:
          "Build the base model: incorporation, an angel round, holder rows, event columns, fully-diluted total, and derived percentages. Test: add a fictional new investor by inserting shares only, and confirm every percentage updates with no other edit. If anything else needed touching, find the hardcode.",
        challengeMinutes: 60,
        estMinutes: 90,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Shares are the atoms",
            detail:
              "Every input is a share count from a document; every percentage is a formula over the fully-diluted sum. The model's discipline is that no ownership number is ever typed.",
          },
          {
            title: "Events as columns",
            detail:
              "Each financing event is a column adding shares to holders. The table reads left to right as the company's history, and a new round is a new column, not a new file.",
          },
          {
            title: "The fully-diluted row",
            detail:
              "One sum, referenced by every percentage. When the pool and the convertibles land in later days, they land here — the denominator has one home.",
          },
          {
            title: "Lookups over copy-paste",
            detail:
              "Holder attributes — class, preference, dates — live in one reference range and are looked up where needed. XLOOKUP or INDEX/MATCH; the excel-at-work roadmap's lookup week is exactly this.",
          },
        ],
        checks: [
          {
            question: "What is the one thing this model must never contain?",
            answer:
              "A typed ownership percentage. Percentages are derived from share counts, or the model breaks silently next round.",
          },
          {
            question: "What is the test that the model has no hardcodes?",
            answer:
              "Add a new investor's shares and confirm every percentage updates with no other edit.",
          },
          {
            question: "Why are events columns rather than separate sheets?",
            answer:
              "The table stays one readable history, and a new round extends it instead of forking it.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "XLOOKUP function",
            url: "https://exceljet.net/functions/xlookup-function",
            sourceName: "ExcelJet",
            editorNote:
              "The reference for the lookup layer this model runs on. If this page reads as revision, good; if not, the excel-at-work roadmap's week 2 is the honest prerequisite.",
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
          "Add a priced round to the model and watch what it does to everyone — in value, not just percentage.",
        learningObjectives: [
          "Extend the model with a priced round from term-sheet inputs",
          "Show each holder's dilution in percentage and in value",
          "Explain why a diluted founder can still be better off — and when they are not",
        ],
        whyToday:
          "Yesterday's model meets its first real event. Dilution is the number founders fixate on and the one advisers must reframe: the question is never 'how much less do I own' but 'what is my stake now worth'.",
        principle: "Founders track their percentage. They should track their value.",
        commonMistake:
          "Presenting dilution as loss. A founder going from 60% of a 40-crore company to 48% of a 60-crore company got richer — the model should print both columns, because the percentage column alone tells the story that scares clients out of good rounds.",
        challenge:
          "Add a ₹10 crore round at ₹40 crore pre to your model. Produce the before/after table: each holder's percentage, and each holder's value at the new price. Then re-run at ₹25 crore pre and write two sentences on what changed for whom.",
        challengeMinutes: 50,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The round as inputs",
            detail:
              "Pre-money and cheque size in; price, new shares, and the new column out. The model from day 9 should absorb this with no restructuring — that was the point of building it right.",
          },
          {
            title: "The two dilution columns",
            detail:
              "Percentage before and after, and value before and after at the round price. Advisers who show only the first column create fear; only the second, complacency. Show both.",
          },
          {
            title: "When dilution genuinely hurts",
            detail:
              "Flat and down rounds, heavy pools, and stacked preferences — the cases where the value column falls with the percentage column. The model exists to catch these before signing.",
          },
          {
            title: "Sensitivity as habit",
            detail:
              "Every round modelled at two or three pre-money levels, as a habit rather than a request. The client conversation is the difference between the runs.",
          },
        ],
        checks: [
          {
            question: "What two columns should a dilution table always show?",
            answer:
              "Ownership percentage before and after, and stake value before and after at the round price.",
          },
          {
            question: "When does dilution make a founder genuinely worse off?",
            answer:
              "When the value column falls too — flat or down rounds, or terms that transfer value, not merely percentage.",
          },
          {
            question: "What should adding a round require in a well-built model?",
            answer:
              "Entering the term-sheet inputs and nothing else — a new event column, no restructuring.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Carta — startup equity education",
            url: "https://carta.com/learn/",
            sourceName: "Carta",
            editorNote:
              "The dilution articles under 'equity management' walk the same before/after framing today's table produces. The hub is linked because Carta reshuffles deep URLs; the section is one click in.",
          },
        ],
        concepts: [
          "cap-table-dilution",
        ],
      },
      {
        title: "ESOP pools — sizing, timing and who pays",
        summary: "The pool is a negotiation wearing accounting clothes.",
        learningObjectives: [
          "Model a pool created pre-money versus post-money and show who it dilutes",
          "Explain why investors ask for the pool before their money lands",
          "Size a pool from a hiring plan rather than a convention",
        ],
        whyToday:
          "The ESOP pool is the least understood line on the table and a systematic transfer of value when mishandled. It is also the module's clearest example of arithmetic as negotiation — the same 10% pool costs different people depending on one word.",
        principle:
          "Who the pool dilutes depends entirely on whether it sits pre-money or post-money.",
        commonMistake:
          "Treating the investor's requested pre-money pool as neutral housekeeping. A pool carved out pre-money dilutes only the existing holders — the investor buys in after the carve-out at an effectively lower price. It is a price term dressed as an HR provision.",
        challenge:
          "Add a 10% pool to your model both ways — pre-money and post-money — for the same round. Produce the founder-ownership delta between the two, in percentage and value. That delta is what the negotiation is actually about; write it as one sentence a founder would understand.",
        challengeMinutes: 50,
        estMinutes: 70,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "What the pool is",
            detail:
              "Shares reserved for current and future employees, sitting in the fully-diluted count from creation even before grants are made. Reserved but ungranted still dilutes — that is the point of counting fully diluted.",
          },
          {
            title: "Pre-money pool mechanics",
            detail:
              "The pool is created before the price is set, so the pre-money is spread over more shares, the price per share falls, and the existing holders absorb all of it. The investor's effective valuation is lower than the headline.",
          },
          {
            title: "Post-money pool mechanics",
            detail:
              "Created after the round, the pool dilutes everyone including the new investor. Same 10%, different payers — which is why the term sheet always specifies and the founder rarely notices.",
          },
          {
            title: "Sizing honestly",
            detail:
              "The defensible pool comes from the hiring plan to the next round — roles, counts, and market grant sizes — not from 'ten percent is standard'. Oversized pools are pre-paid dilution for hires that never happen.",
          },
        ],
        checks: [
          {
            question: "Who pays for a pool created pre-money?",
            answer:
              "The existing holders only — the carve-out happens before the investor's price is set, lowering it.",
          },
          {
            question: "Why do reserved-but-ungranted options still dilute?",
            answer:
              "They sit in the fully-diluted denominator from creation; every percentage is computed over them.",
          },
          {
            question: "What makes a pool size defensible?",
            answer:
              "A hiring plan to the next round with market grant sizes — evidence, not convention.",
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
            type: "read",
            title: "Carta — startup equity education",
            url: "https://carta.com/learn/",
            sourceName: "Carta",
            editorNote:
              "The employee-equity section covers pool mechanics and grant practice. Read after modelling, not before — the arithmetic should be yours first.",
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
          "The deferred argument arrives: SAFEs landing on the cap table, and the interaction that surprises everyone.",
        learningObjectives: [
          "Convert a capped, discounted SAFE at a priced round inside the model",
          "Show which term binds at different round prices",
          "Model stacked SAFEs converting together and the combined dilution",
        ],
        whyToday:
          "Day 3 taught the instrument; today the model executes it. Conversion is where founders discover what they sold two years ago, and the adviser's job is to have shown them before the term sheet makes it non-negotiable.",
        principle:
          "A SAFE's discount and cap interact, and the interaction surprises people at conversion.",
        commonMistake:
          "Modelling conversion at the cap by default. The investor converts at the better of cap and discount for them — and with several SAFEs at different caps, each converts on its own terms, so the total new shares only emerge from doing each one properly.",
        challenge:
          "Add two SAFEs to your model — different caps, same discount — and convert them in the day-10 round. Produce founder ownership: as the founder assumed (ignoring SAFEs), and as it actually lands. The gap between those numbers is the surprise this day exists to make unsurprising.",
        challengeMinutes: 55,
        estMinutes: 75,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The conversion price",
            detail:
              "Min of (cap ÷ pre-round fully-diluted shares) and (round price × (1 − discount)). Whichever is lower gives the SAFE holder more shares; the model should compute both and take the binding one visibly.",
          },
          {
            title: "Pre-money versus post-money SAFEs",
            detail:
              "The post-money SAFE fixes the holder's ownership before the round, pushing all dilution onto founders; the older pre-money form shares it. Which form the document is changes the answer materially.",
          },
          {
            title: "Stacking",
            detail:
              "Multiple SAFEs at different caps each convert on their own terms in the same round. The combined dilution lands at once, and no one instrument's paperwork shows the total.",
          },
          {
            title: "Showing the founder",
            detail:
              "The adviser's artefact is the before/after with conversions included — produced at signing time, not at the round. Two years early is advice; at the round it is archaeology.",
          },
        ],
        checks: [
          {
            question: "At what price does a capped, discounted SAFE convert?",
            answer:
              "The better of the two for the holder — the cap-implied price or the discounted round price, whichever is lower.",
          },
          {
            question: "What does a post-money SAFE fix that a pre-money one does not?",
            answer:
              "The holder's ownership percentage — the dilution from conversion falls on the founders rather than being shared.",
          },
          {
            question: "Why is stacked-SAFE dilution surprising?",
            answer:
              "Each instrument converts on its own terms and no single document shows the combined effect — only the model does.",
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
            title: "Y Combinator Safe financing documents",
            url: "https://www.ycombinator.com/documents",
            sourceName: "Y Combinator",
            editorNote:
              "Back to the source: the user guide's conversion examples are the test cases for your model. If your spreadsheet disagrees with their worked example, your spreadsheet is wrong.",
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
          "Who actually gets what when the company sells — the module deliverable, completed.",
        learningObjectives: [
          "Build the exit waterfall: preferences first, then conversion decisions, then common",
          "Show holder outcomes across a range of exit values",
          "Complete and test the full module deliverable end to end",
        ],
        whyToday:
          "The waterfall is where every term from the fortnight becomes money. It is also the module deliverable's final piece — a model that runs from SAFE to conversion to pool to exit is the artefact that proves the skill exists.",
        principle:
          "Liquidation preference decides who gets paid first, and in a modest exit that is everyone's answer.",
        commonMistake:
          "Computing exits as ownership percentage times price. That is only true in exits large enough that every preference holder converts — in the modest exits that are most common, preferences bind, and common shares get what remains, which can be startlingly little.",
        challenge:
          "Complete the deliverable: your model takes a SAFE, converts it at a priced round, carves a 10% pool, and produces a waterfall at five exit values from below-preference to clearly-above. Chart founder proceeds against exit value — the kink in that line is the fortnight's lesson in one picture.",
        challengeMinutes: 70,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The order of payment",
            detail:
              "Debt, then preferences by seniority, then common and converted holders share the rest. The waterfall is just this order executed at a given exit value.",
          },
          {
            title: "The conversion decision",
            detail:
              "At each exit value, every preference holder takes the better of preference or converted ownership. The model computes both per holder — the crossover points are where the waterfall kinks.",
          },
          {
            title: "The modest exit",
            detail:
              "At exits near total preferences, common can receive almost nothing while the headline sale price sounds like success. This is the outcome advisers most need to show in advance.",
          },
          {
            title: "Testing the deliverable",
            detail:
              "Extremes as sanity checks: at a huge exit everyone converts and shares pro rata; below total preference, common gets zero. If either end misbehaves, a formula is wrong.",
          },
        ],
        checks: [
          {
            question: "When does 'ownership times exit value' give the right answer?",
            answer:
              "Only when the exit is large enough that every preference holder is better off converting — above the highest crossover.",
          },
          {
            question: "What choice does each preference holder make at exit?",
            answer:
              "Take the preference, or convert and take their ownership share — whichever pays more at that exit value.",
          },
          {
            question: "What sanity checks bound a waterfall model?",
            answer:
              "Huge exits converge to pro-rata sharing; exits below total preferences pay common zero.",
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
            title: "Term sheets — Carta's guide",
            url: "https://carta.com/learn/startups/fundraising/term-sheets/",
            sourceName: "Carta",
            editorNote:
              "Re-read the liquidation preference section now that you have a waterfall to test its claims in. Participation and caps map directly onto model branches.",
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
    estHours: 7.75,
    nodes: [
      {
        title: "Why textbook DCF fails on a startup",
        summary:
          "Your best-trained tool, applied where its inputs do not exist — and what remains of it that is still useful.",
        learningObjectives: [
          "Name where each DCF input breaks on a young company",
          "Distinguish 'DCF fails' from 'discipline fails' — what survives the wreck",
          "Recognise a spreadsheet-shaped opinion when a founder sends one",
        ],
        whyToday:
          "This module extends what a PGDM taught rather than replacing it — but the extension only lands after an honest accounting of why the trained method breaks. Respect for the tool includes knowing its domain.",
        principle: "A DCF on a pre-revenue company is a spreadsheet-shaped opinion.",
        commonMistake:
          "Fixing startup DCFs by raising the discount rate. Cranking WACC to 25% to 'reflect risk' launders massive input uncertainty through one parameter and produces precision theatre — the problem is the cash flow forecast, not the rate applied to it.",
        challenge:
          "Take a young company's five-year projection — a founder's or your own. For each DCF input, write one line: where this number came from, and what evidence would change it. Count the lines that end in 'assumed'. That count is today's finding.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Where each input breaks",
            detail:
              "Revenue has no base to grow from; margins have no history; reinvestment is a guess; beta has no comparable; and the terminal value — most of the answer — compounds all of it.",
          },
          {
            title: "The terminal value problem",
            detail:
              "In a mature DCF the terminal value is a check on the forecast; in a startup DCF it IS the valuation, computed from the least certain year of an uncertain forecast.",
          },
          {
            title: "What survives",
            detail:
              "The discipline: value comes from future cash, growth costs reinvestment, risk demands return. Tomorrow's scenario methods keep the framework and make the ignorance explicit instead of burying it.",
          },
          {
            title: "The adviser's read",
            detail:
              "A founder's DCF is a narrative wearing formulas. Read it as a statement of what they believe, locate the belief doing the work, and price that belief — day 20 makes this a method.",
          },
        ],
        checks: [
          {
            question: "Why is raising the discount rate the wrong fix?",
            answer:
              "It launders input uncertainty through one parameter and keeps the false precision — the forecast is the problem, not the rate.",
          },
          {
            question: "Why is terminal value especially dangerous on startups?",
            answer:
              "It is most of the answer and it compounds the least certain assumptions of the forecast's furthest year.",
          },
          {
            question: "What part of DCF thinking survives for young companies?",
            answer:
              "The discipline — future cash, reinvestment cost, risk-return — applied through explicit scenarios rather than a single forecast.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Valuing young, start-up and growth companies",
            url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/younggrowth.pdf",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "The anchor paper for this whole module. Today read only the problem statement — the first section on why standard approaches fail. The solutions are tomorrow.",
          },
        ],
        concepts: [
          "startup-valuation",
          "dcf-valuation",
        ],
      },
      {
        title: "Damodaran on young companies",
        summary:
          "The serious version: scenario-based value, explicit survival probability, and uncertainty on the page instead of under it.",
        learningObjectives: [
          "Build a small scenario DCF: two or three futures, probability-weighted",
          "Apply a survival probability rather than a padded discount rate",
          "Use Damodaran's templates as scaffolding, not as answers",
        ],
        whyToday:
          "Yesterday diagnosed; today treats. This is the single most valuable free material in the field, from the person the rest of the field cites — and it converts 'startup valuation is guessing' into 'startup valuation is structured, honest guessing'.",
        principle: "You cannot avoid the uncertainty. You can only make it explicit.",
        commonMistake:
          "Building three scenarios that are one scenario at three volumes — base, base±20%. Honest scenarios differ in kind: the company that wins the market, the one that survives as a niche, the one that dies. If the downside scenario still shows growth, it is not a downside scenario.",
        challenge:
          "Value a young company you can get numbers for with a three-scenario DCF: win, survive, fail — cash flows per branch, honest probabilities, weighted value. Then write one line: which probability moves the answer most? That line is the diligence agenda for module 6.",
        challengeMinutes: 55,
        estMinutes: 80,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Scenarios over point estimates",
            detail:
              "Two or three genuinely different futures, each with its own cash flows, weighted by probability. The structure forces the argument to happen about the probabilities — which is where it belongs.",
          },
          {
            title: "Survival as its own number",
            detail:
              "Most young companies fail. Damodaran's move is to price failure as an explicit probability applied to value, not as an invisible bump in the discount rate — visible, arguable, and adjustable as evidence arrives.",
          },
          {
            title: "The templates",
            detail:
              "His spreadsheets implement the machinery so your effort goes into inputs. Use them to check structure, then rebuild the core yourself once — scaffolding teaches; crutches do not.",
          },
          {
            title: "What this buys an adviser",
            detail:
              "A valuation whose disagreements are locatable. 'You believe survival is 60%, the investor prices 30%' is a negotiable sentence; two different DCF outputs are just a standoff.",
          },
        ],
        checks: [
          {
            question: "How does the scenario approach handle failure risk?",
            answer:
              "As an explicit survival probability applied to value — visible and arguable, instead of hidden in the discount rate.",
          },
          {
            question: "What makes scenarios honest rather than cosmetic?",
            answer:
              "They differ in kind — win, survive, fail — not in volume. A downside that still grows is a base case in costume.",
          },
          {
            question: "Where should the argument about a young company's value happen?",
            answer:
              "At the probabilities and the branch assumptions — the structure exists to move the fight there.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Valuing young, start-up and growth companies",
            url: "https://pages.stern.nyu.edu/~adamodar/pdfiles/papers/younggrowth.pdf",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Today, the solution sections — the estimation framework and the worked examples. Slow reading; it repays it more than anything else in this roadmap.",
          },
          {
            type: "tool",
            title: "Damodaran's valuation spreadsheets",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/spreadsh.htm",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Free, unprotected, and authored by the source. Take a young-company template for the challenge — then rebuild its core yourself before trusting your own version.",
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
              "The paper's author teaching the same material — twenty-nine minutes, from his own channel, where his full valuation course also lives free. Watch after the reading; hearing the framework a second time is what makes it stick.",
          },
        ],
        concepts: [
          "startup-valuation",
        ],
      },
      {
        title: "Revenue and EBITDA multiples",
        summary: "The market's shorthand — and the DCF hiding inside every multiple.",
        learningObjectives: [
          "Apply revenue and EBITDA multiples correctly, including which revenue and whose EBITDA",
          "Unpack a multiple into the growth, margin and risk assumptions it encodes",
          "Choose the numerator honestly — EV versus equity value on the right base",
        ],
        whyToday:
          "Multiples are how the market talks and how most Indian deals are actually struck. The extension of PGDM comps knowledge is not mechanics — it is learning to read a multiple as compressed assumptions rather than as a fact.",
        principle: "A multiple is a DCF with the assumptions hidden inside it.",
        commonMistake:
          "Applying a sector-average multiple to a company that differs from the sector on exactly the drivers the multiple encodes. A 6x revenue average from companies growing 40% at 80% gross margin says nothing about a 15%-growth, 45%-margin business — the average is not a price list.",
        challenge:
          "Take one listed Indian company's multiple and reverse-engineer it: what growth, margin and risk roughly justify it? Then apply the same multiple to a startup and write down which of those encoded assumptions the startup fails. That sentence is the whole discipline.",
        challengeMinutes: 45,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Which multiple for which company",
            detail:
              "Revenue multiples for pre-profit growth; EBITDA once operations mature enough to have one worth trusting. Using an EBITDA multiple on adjusted-to-death EBITDA is a category error module 6 returns to.",
          },
          {
            title: "The consistency rule",
            detail:
              "Enterprise value over revenue or EBITDA; equity value over earnings. Mixing the numerators — an EV multiple on an equity base — is the most common silent error in amateur comps.",
          },
          {
            title: "What a multiple encodes",
            detail:
              "Growth, margins, reinvestment and risk, compressed to one number. Two companies at the same multiple with different growth are not priced the same — one is cheap or the other is dear.",
          },
          {
            title: "Forward versus trailing",
            detail:
              "A multiple on next year's revenue is a different (and always lower-looking) number than on last year's. Founders quote forward; check which you are being shown.",
          },
        ],
        checks: [
          {
            question: "What assumptions does a revenue multiple compress?",
            answer:
              "Growth, eventual margins, reinvestment needs and risk — it is a DCF with the reasoning hidden.",
          },
          {
            question: "State the numerator consistency rule.",
            answer:
              "Enterprise value over pre-debt metrics like revenue and EBITDA; equity value over post-debt metrics like earnings.",
          },
          {
            question: "Why is a sector-average multiple not a price list?",
            answer:
              "The average encodes the average company's drivers; applying it to a company with different growth or margins imports assumptions that are false for it.",
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
            title: "Damodaran's current data page",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Sector multiples, margins and growth, updated annually and free. This is where a defensible multiple argument starts — with data, not with the last deal someone remembers.",
          },
        ],
        concepts: [
          "startup-valuation",
          "comparable-company-analysis",
        ],
      },
      {
        title: "Choosing a defensible comparable set",
        summary:
          "The quiet step where the valuation is actually decided — before any arithmetic runs.",
        learningObjectives: [
          "Select comparables on drivers — growth, margin, model — rather than sector labels",
          "Defend inclusions and exclusions in writing",
          "Adjust honestly when the true peers are foreign, listed or ten times the size",
        ],
        whyToday:
          "Everyone checks the arithmetic; almost nobody interrogates the peer list. For Indian startups — where true peers are often unlisted or abroad — the peer-set judgement is most of the multiple's meaning, and it is where a motivated banker does their steering.",
        principle: "The peer set is where the valuation is really decided.",
        commonMistake:
          "Building the set by sector code. A food-delivery startup's honest peers are chosen by unit economics and growth stage, which may make a foreign listed company more comparable than the Indian giant in the same 'sector' — the label is a filing convention, not an argument.",
        challenge:
          "Build a peer set for one real Indian startup: five candidates, each with a one-line reason in terms of drivers, and at least one deliberate exclusion of an obvious-looking name with the reason why. The exclusion line is the skill being practised.",
        challengeMinutes: 50,
        estMinutes: 70,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Drivers, not labels",
            detail:
              "Comparability lives in growth rate, margin structure, capital intensity and business model. Sector codes correlate with these loosely; the argument must run on the drivers themselves.",
          },
          {
            title: "The written reasons",
            detail:
              "One line per inclusion and exclusion, written before the multiples are computed — because the temptation to trim the set toward the desired answer only bites after you have seen the numbers.",
          },
          {
            title: "The Indian problem",
            detail:
              "True peers are frequently unlisted, foreign or vastly larger. The honest response is explicit adjustments — size, liquidity, geography — stated as adjustments, not silently absorbed.",
          },
          {
            title: "Reading someone else's set",
            detail:
              "A banker's comp set is an argument for a price. The fastest audit: which obvious candidates are missing, and what does their absence do to the median?",
          },
        ],
        checks: [
          {
            question: "On what basis is comparability actually established?",
            answer:
              "Shared drivers — growth, margins, capital intensity, model — not shared sector labels.",
          },
          {
            question: "Why write inclusion reasons before computing multiples?",
            answer:
              "To lock the set before the answer is known — the trimming temptation arrives with the numbers.",
          },
          {
            question: "What is the fastest audit of someone else's peer set?",
            answer:
              "Look for the obvious candidates that are missing and ask what their absence does to the median.",
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
            type: "tool",
            title: "Damodaran's current data page",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datacurrent.html",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Yesterday it supplied multiples; today use its sector driver data as the sanity check on your set — a peer group whose drivers straddle the target's is doing its job.",
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
          "The pre-revenue toolkit — useful, crude, and honest only when labelled as what it is.",
        learningObjectives: [
          "Apply the scorecard, Berkus and VC methods to a pre-revenue company",
          "State what each method actually anchors on",
          "Say plainly when you are valuing and when you are negotiating",
        ],
        whyToday:
          "Below the reach of even scenario DCFs sits the pre-revenue deal, and this is the vocabulary those deals are done in. The extension a finance graduate needs is not the methods — they are trivial — but the honesty about their epistemic status.",
        principle: "These are negotiation anchors, not valuations. Know which you are doing.",
        commonMistake:
          "Presenting a VC-method output with DCF gravitas. Backing out today's price from an assumed exit and an assumed return is coherent arithmetic on two assumptions — presenting three decimal places of it as analysis is how advisers lose the trust of anyone numerate in the room.",
        challenge:
          "Value one pre-revenue idea by all three methods. Then write the paragraph you would actually say in a negotiation, using them honestly — as anchors and cross-checks, with their assumptions stated. The paragraph, not the numbers, is the deliverable.",
        challengeMinutes: 45,
        estMinutes: 65,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The scorecard",
            detail:
              "Start from the typical local pre-seed valuation and adjust by weighted factors — team, market, product, competition. It anchors on the local market rate, which is its honesty: it prices the round, not the company.",
          },
          {
            title: "Berkus",
            detail:
              "Assign value chunks to risk-reduction milestones — idea, prototype, team, traction, relationships. Crude by design; its use is forcing a conversation about which risks have actually been retired.",
          },
          {
            title: "The VC method",
            detail:
              "Assume an exit value and a target return, discount back, subtract for dilution. Every input is an assumption; its honest use is revealing what the investor must believe to pay a given price.",
          },
          {
            title: "Using them together",
            detail:
              "Three crude methods agreeing loosely beats one crude method quoted precisely. Their convergence zone is a negotiating range — call it that and credibility survives.",
          },
        ],
        checks: [
          {
            question: "What does the scorecard method actually anchor on?",
            answer:
              "The going rate for local rounds at that stage — it prices the round in its market, not the company's cash flows.",
          },
          {
            question: "What is the honest use of the VC method?",
            answer:
              "Revealing the assumptions — exit value and required return — an investor must hold to justify a price.",
          },
          {
            question: "How should the three methods be presented together?",
            answer:
              "As a convergence range with assumptions stated — anchors for negotiation, never precision.",
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
        summary: "Where the number meets leverage — and what analysis can and cannot do there.",
        learningObjectives: [
          "Separate the defensible range from the negotiated point",
          "Name the leverage factors that move a price off its analysis",
          "Prepare a founder for the conversation rather than just the spreadsheet",
        ],
        whyToday:
          "The week built a range; deals close at a point. The distance between them is leverage — competition, runway, momentum — and an adviser who pretends the point is analytic serves the client worse than one who names the leverage honestly.",
        principle: "The number is an output of leverage as much as of analysis.",
        commonMistake:
          "Defending the model in the room. The model's job was to set the range and the walk-away before the meeting; in the room, the variables are alternatives and time. Advisers who argue spreadsheet cells against a term sheet are fighting on the wrong field.",
        challenge:
          "For a company you have valued this week, write the negotiation brief: the defensible range, the walk-away, the three leverage factors on each side, and the one move that most improves the client's position before talks start. One page.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "Range versus point",
            detail:
              "Analysis produces a range and a walk-away. The point within it is produced by alternatives, urgency and momentum. Confusing the two makes advisers either rigid or decorative.",
          },
          {
            title: "The leverage inventory",
            detail:
              "Competing term sheets, months of runway, growth trajectory, and who needs the deal sooner. These are checkable facts; list them before the meeting the way you would list comps.",
          },
          {
            title: "What moves leverage",
            detail:
              "A second interested investor moves price more than any model refinement. Sometimes the best valuation work is process work — sequencing conversations so alternatives exist simultaneously.",
          },
          {
            title: "Price versus terms, again",
            detail:
              "Day 4's lesson returns with force: conceding price and winning clean terms often beats the reverse. The brief should say which terms are worth more than the last crore of headline.",
          },
        ],
        checks: [
          {
            question: "What does analysis contribute to a negotiation, and what does it not?",
            answer:
              "It sets the defensible range and the walk-away; the point within the range is set by leverage — alternatives and time.",
          },
          {
            question: "What single fact most moves an early-stage price?",
            answer:
              "A credible competing offer — alternatives move price more than model refinements.",
          },
          {
            question: "Why not defend the model in the room?",
            answer:
              "The room runs on leverage, not cells. The model's work was finished when it set the range and walk-away.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "How to raise money",
            url: "https://www.ycombinator.com/library/6m-how-to-raise-money",
            sourceName: "Y Combinator",
            editorNote:
              "Re-read with yesterday's methods in mind, watching for one thing: how much of the essay is about process and leverage rather than valuation. That proportion is the honest answer to how prices get set.",
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
          "The module deliverable: three methods on one real company, and the assumption that carries everything.",
        learningObjectives: [
          "Run the full toolkit on one company: scenario DCF, multiple, VC method",
          "Locate the single assumption doing the most work in each",
          "Write the one-page reconciliation the module deliverable requires",
        ],
        whyToday:
          "Advisers audit more valuations than they originate. The capstone therefore practises the auditing move — finding the load-bearing assumption — across your own three methods, which is both the deliverable and the habit.",
        principle: "Find the one assumption carrying the whole answer. There always is one.",
        commonMistake:
          "Reconciling by averaging. Three methods giving three numbers are three arguments, not three samples — averaging them launders their disagreements instead of explaining them, and the explanation is the entire value of doing three.",
        challenge:
          "Complete the deliverable: one real Indian startup valued by scenario DCF, revenue multiple, and VC method. One page: why the numbers differ, which assumption carries each, and which valuation you would defend. Then the audit drill — for each method, change its load-bearing assumption 20% and report what happens.",
        challengeMinutes: 70,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The load-bearing assumption",
            detail:
              "In a scenario DCF it is usually the success probability; in a multiple, the peer set or the revenue base; in the VC method, the exit value. Sensitivity is how you find it: shake each input and watch which one moves the house.",
          },
          {
            title: "Why the methods disagree",
            detail:
              "They anchor on different things — beliefs about the future, the market's current mood, an investor's required return. Their spread is information about which anchor dominates this company's story.",
          },
          {
            title: "Defending one",
            detail:
              "The deliverable asks which you would defend — meaning: for this company, at this stage, before this audience. The answer is contextual, and stating the context is what makes it defensible.",
          },
          {
            title: "The auditor's move, generalised",
            detail:
              "Applied to a founder's or banker's model, the same drill: find the assumption whose small change breaks the conclusion, and put the diligence effort there. Module 6 does this at full scale.",
          },
        ],
        checks: [
          {
            question: "Why is averaging the three methods wrong?",
            answer:
              "They are arguments from different anchors, not noisy samples of one truth — the spread is the information, and averaging destroys it.",
          },
          {
            question: "How do you find the load-bearing assumption?",
            answer:
              "Sensitivity: perturb each input and watch which single change moves the conclusion disproportionately.",
          },
          {
            question: "What makes 'which would you defend' answerable?",
            answer:
              "Context — the company's stage, the audience, and which method's anchor is most trustworthy for this case. Stating that context is the defence.",
          },
        ],
        resources: [
          {
            type: "tool",
            title: "Damodaran's valuation spreadsheets",
            url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/spreadsh.htm",
            sourceName: "Aswath Damodaran (NYU Stern)",
            editorNote:
              "Cross-check your scenario DCF's structure against his young-company template one last time before writing the page. Structural agreement plus different inputs is fine; structural disagreement means a bug.",
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
