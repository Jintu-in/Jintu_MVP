/**
 * Amazon Ads — modules 1–4, days 1–13.
 *
 * Retail readiness, Sponsored Products execution, the profit arithmetic, and
 * the formats beyond SP. Split from the index for the same reason
 * data-analyst is: one file per few modules stays readable.
 *
 * Every title, summary, objective and link here was already in the original
 * spec and is preserved exactly. What is new is the day-page model — why
 * today, the principle, the mistake, a challenge with an artefact, topics
 * with detail lines, and three checks — which was never authored for any of
 * the four original roadmaps.
 */
export default [
  {
    title: "Retail context first — the pre-ad readiness audit",
    weekRange: "Week 1",
    objective: "Decide whether this listing is allowed to be advertised at all.",
    deliverable: "A readiness audit of one live listing, with a go or no-go on it.",
    estHours: 4,
    nodes: [
      {
        title: "Buy Box mechanics and losing factors",
        summary:
          "Price, fulfilment method, seller metrics and stock placement decide ownership — and below 95% ownership, ads should stop.",
        learningObjectives: [
          "How FBA vs MFN, price and metrics dictate the featured offer",
          "The golden rule: Buy Box below 95% → pause advertising",
          "Why ads on a lost Buy Box fund your competitor's sale",
        ],
        whyToday:
          "Every other day in this roadmap is about spending money well. This one is about the condition under which spending anything is rational. An ad on a listing you do not own sends a paying customer to a competitor's offer on your own product page, and no amount of bid tuning fixes that.",
        principle:
          "The ad does not sell the product. The featured offer does. If you do not own it, you are buying traffic for whoever does.",
        commonMistake:
          "Reading Buy Box ownership as a yes or no. It is a percentage of page views over a period, and 80% looks fine on a dashboard while one view in five is being handed to a reseller. The number to act on is the percentage, not whether you saw the button today.",
        challenge:
          "Open Business Reports for one ASIN and find its Buy Box percentage over the last 30 days. If it is under 95%, list the specific reason — price, fulfilment, stock, or metrics — and write the one change that would fix it.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What the featured offer actually is",
            detail:
              "The offer that Add to Cart buys. Several sellers can list the same ASIN; Amazon picks one per page view, and the rest are behind a link most buyers never open.",
          },
          {
            title: "The four levers",
            detail:
              "Landed price, fulfilment method, seller performance metrics, and stock availability. FBA weights heavily enough that an MFN seller often cannot win on price alone.",
          },
          {
            title: "Buy Box percentage, not presence",
            detail:
              "Business Reports gives it as a percentage of page views. It varies by hour and by region, which is why a spot check tells you nothing.",
          },
          {
            title: "The 95% rule",
            detail:
              "Below it, pause. The threshold is a convention rather than an Amazon rule, and it exists because the arithmetic below 95% stops working before it feels like it should.",
          },
        ],
        checks: [
          {
            question: "Why is Buy Box ownership a percentage rather than a state?",
            answer:
              "Amazon re-decides the featured offer per page view, so ownership varies through the day and across regions. Business Reports reports it as a share of views over the period.",
          },
          {
            question: "What happens to an ad click on a listing where you have lost the Buy Box?",
            answer:
              "You paid for the click and the Add to Cart button buys the other seller's offer. You have funded a competitor's sale on your own product page.",
          },
          {
            question: "Name the four things that decide the featured offer.",
            answer:
              "Landed price, fulfilment method, seller performance metrics and stock availability.",
          },
          {
            question:
              "A client's ACoS doubled last month with no campaign changes. Where do you look before touching a bid?",
            answer:
              "Buy Box percentage first — a drop means clicks are converting for somebody else. Then stock status, then whether a competitor changed price. Bid changes cannot fix a retail problem and will usually make the spend worse.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Seller University — learn to sell",
            url: "https://sell.amazon.com/learn",
            sourceName: "Amazon Seller Central",
            editorNote:
              "The featured-offer and account-health lessons; sellers on Amazon.in use sell.amazon.in/learn.",
          },
          {
            type: "doc",
            title: "Seller University India",
            url: "https://sell.amazon.in/learn",
            sourceName: "Amazon Seller Central (India)",
            editorNote:
              "The same curriculum with Indian fee structures and marketplace rules. Use this one if you sell on Amazon.in.",
          },
        ],
      },

      {
        title: "Glance views and Unit Session Percentage",
        summary:
          "Traffic × conversion is the whole business. Diagnose which one is broken before spending on either.",
        learningObjectives: [
          "Glance views = sessions; Unit Session % = units ÷ sessions",
          "Baselines: 10–15% standard products, 5–8% high-ticket",
          "The 2×2: high traffic + low conversion = fix the page; low traffic + high conversion = ready for ads",
        ],
        whyToday:
          "Advertising is a traffic instrument. Pointed at a page that does not convert, it magnifies the failure and bills you for it — so the diagnosis has to come first, and it is a two-number diagnosis.",
        principle:
          "Ads fix a traffic problem. They cannot fix a conversion problem, and money spent trying is money spent proving it.",
        commonMistake:
          "Treating a low conversion rate as a reason to bid harder. More traffic through a page that converts at 3% buys more of the same result at a higher cost — the page is the problem and the page is where the fix is.",
        challenge:
          "Pull sessions and Unit Session Percentage for one ASIN over 30 days. Place it on the 2×2 and write one sentence saying whether it needs traffic, needs page work, or is ready to advertise. Commit to that sentence before looking at any campaign.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Sessions, not page views",
            detail:
              "A session is one visitor's visit; page views counts refreshes and returns. Unit Session Percentage divides by sessions, which is why it is the honest conversion number.",
          },
          {
            title: "What good looks like",
            detail:
              "10–15% for a standard consumer product, 5–8% where the price is high enough to make people think. Below the band for your category is a page problem, not a traffic one.",
          },
          {
            title: "The 2×2",
            detail:
              "High traffic and low conversion means fix the page. Low traffic and high conversion means advertise now. Low and low means the product is wrong. High and high means scale.",
          },
          {
            title: "Why the order matters",
            detail:
              "Conversion improvements compound with every future ad rupee. Traffic bought against a broken page is spent once and teaches you nothing.",
          },
        ],
        checks: [
          {
            question: "What is Unit Session Percentage dividing?",
            answer:
              "Units ordered by sessions — visits, not page views. Page views double-count refreshes and returns, so a conversion rate built on them flatters the page.",
          },
          {
            question: "Traffic is high and conversion is 3%. What should you do?",
            answer:
              "Fix the page. More traffic multiplies a 3% result at full cost; the constraint is the listing, not the impressions.",
          },
          {
            question: "Which quadrant is the signal to start advertising?",
            answer:
              "Low traffic, high conversion. The page converts what reaches it, so the missing input is genuinely traffic.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Seller University — business reports lessons",
            url: "https://sell.amazon.com/learn",
            sourceName: "Amazon Seller Central",
            editorNote:
              "Search the catalog for the business-reports masterclass; read your own reports alongside.",
          },
        ],
      },

      {
        title: "Inventory health and the out-of-stock penalty",
        summary: "Stockouts collapse organic rank, and ads cannot buy it back afterwards.",
        learningObjectives: [
          "IPI score components and restock limits",
          "What a stockout does to BSR and why the damage outlasts it",
          "In-stock pipeline planning before any launch campaign",
        ],
        whyToday:
          "The most expensive advertising mistake is not a bad bid. It is spending eight weeks building organic rank and then running out for ten days, because rank decays fast and rebuilds slowly.",
        principle:
          "Rank is earned over months and lost over days. Never start a campaign you cannot keep stocked through.",
        commonMistake:
          "Letting a campaign run while stock falls. The ads keep spending, the listing goes unavailable, and you have paid for clicks on a page that cannot sell — then paid again to rebuild the rank you lost.",
        challenge:
          "For one ASIN, work out days of cover from current stock and 30-day velocity. Then work backwards from your supplier's lead time and write down the stock level at which a campaign must be paused. That number is a decision made in advance, which is the only kind that gets made.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "IPI and restock limits",
            detail:
              "Amazon's Inventory Performance Index scores excess, sell-through, stranded inventory and in-stock rate. A low score caps how much you may send in, which turns a stock problem into a compounding one.",
          },
          {
            title: "Why rank does not come back",
            detail:
              "Sales velocity drives Best Seller Rank, and BSR drives organic placement. A stockout stops velocity, rank drops, and the listing restarts from a worse position than it left.",
          },
          {
            title: "Days of cover",
            detail:
              "Units on hand divided by daily velocity. Compare it against supplier lead time plus inbound transit — if cover is shorter, a stockout is already scheduled.",
          },
          {
            title: "Pausing is cheaper than continuing",
            detail:
              "Ad spend against low stock buys clicks you cannot fulfil and accelerates the stockout. Pausing costs nothing you were going to keep.",
          },
        ],
        checks: [
          {
            question: "Why does a stockout hurt after the stock returns?",
            answer:
              "Velocity drives BSR and BSR drives organic placement. The rank lost during the outage has to be re-earned by sales the listing is no longer positioned to make.",
          },
          {
            question: "What does days of cover need comparing against?",
            answer:
              "Supplier lead time plus inbound transit and check-in. Cover shorter than that means the stockout is already determined.",
          },
          {
            question: "Should ads run while stock is nearly gone?",
            answer:
              "No. They buy clicks that cannot convert and pull the outage forward.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Fulfilment by Amazon",
            url: "https://sell.amazon.com/fulfillment-by-amazon",
            sourceName: "Amazon Seller Central",
            editorNote:
              "Read the inventory-performance and restock-limit sections; the rest is a sales page.",
          },
        ],
      },

      {
        title: "The retail readiness checklist",
        summary:
          "Title, images, bullets, reviews, A+ — the bar a listing clears before its first impression is bought.",
        learningObjectives: [
          "Main image on pure white, 1600×1600+ for zoom",
          "Five+ bullets; 15–20+ reviews at 4.2+ average",
          "A+ Content and Brand Story enabled",
          "Audit one live listing against every item",
        ],
        whyToday:
          "Days 1 to 3 diagnosed. Today produces the artefact: a written go or no-go on a real listing, which is the first thing an agency would ask you for and the last thing most sellers have.",
        principle:
          "A checklist run before the money is spent is an audit. Run afterwards it is an excuse.",
        commonMistake:
          "Passing a listing because it looks fine. Fine is not the bar — the bar is each item, checked, with the failures written down. A listing with four bullets and eleven reviews looks fine and converts like it does not.",
        challenge:
          "Audit one live listing item by item and write the result as a table: item, pass or fail, and the specific fix. Then write the go or no-go sentence at the top. That table is the first slide of the capstone deck on day 27.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Images",
            detail:
              "Main image on pure white with the product filling the frame, at least 1600px on the longest side so zoom works. Zoom correlates with conversion more than almost any other single element.",
          },
          {
            title: "Title and bullets",
            detail:
              "The title carries the search terms a buyer would type; the bullets answer the objections that stop a purchase. Five is the floor, and each should say something a competitor's cannot.",
          },
          {
            title: "Social proof",
            detail:
              "15–20 reviews at 4.2 or above is roughly where conversion stops being suppressed by doubt. Below it, traffic is being bought into hesitation.",
          },
          {
            title: "A+ Content",
            detail:
              "Free for brand-registered sellers and it replaces the plain description with modules. It also gives you somewhere to answer the questions the bullets could not fit.",
          },
          {
            title: "The audit as an artefact",
            detail:
              "Written down, dated, with the failures named. An audit you did in your head cannot be handed to a client or checked next month.",
          },
        ],
        checks: [
          {
            question: "Why does image resolution matter beyond looking good?",
            answer:
              "Below about 1600px the zoom function does not engage, and zoom is one of the strongest correlates of conversion on a detail page.",
          },
          {
            question: "What is the review threshold and what is it a proxy for?",
            answer:
              "Roughly 15–20 reviews at 4.2 or above. It is a proxy for the point at which doubt stops suppressing conversion.",
          },
          {
            question: "What makes an audit an audit rather than a look?",
            answer:
              "It is written, item by item, with each failure named and a fix attached, and it is dated so it can be re-run.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon Ads — ad specs and requirements",
            url: "https://advertising.amazon.com/resources/ad-specs",
            sourceName: "Amazon Ads",
            editorNote:
              "The creative requirements are the floor, not the target. Read them once so a rejected ad is never a surprise.",
          },
        ],
      },
    ],
  },

  {
    title: "Sponsored Products — execution and bidding",
    weekRange: "Weeks 1–2",
    objective: "Build campaigns whose results can be read, and bid them deliberately.",
    deliverable: "One auto and one manual campaign, structured so their data is comparable.",
    estHours: 3.5,
    nodes: [
      {
        title: "Auto targeting and the four match groups",
        summary: "Close match, loose match, substitutes, complements — Amazon's own read of your listing.",
        learningObjectives: [
          "What each auto group targets and what its performance tells you",
          "Auto campaigns as discovery engines, not end states",
          "Reading auto results as listing-indexing feedback",
        ],
        whyToday:
          "An auto campaign is the cheapest research Amazon sells. It tells you which terms Amazon thinks your listing is about — which is not the same as what you think it is about, and the gap is the most useful thing you will learn this week.",
        principle:
          "An auto campaign is a question, not a strategy. What it returns is Amazon's opinion of your listing, and that opinion is worth more than your own.",
        commonMistake:
          "Leaving auto running for months as the main campaign. It is a discovery instrument; once it has told you what converts, that spend belongs in exact-match campaigns where you control it.",
        challenge:
          "Create one auto campaign with all four groups enabled at separate bids. Write down, before it runs, which terms you expect Amazon to match you on. In a week, compare — the difference is your listing's indexing problem.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Close match",
            detail:
              "Shoppers searching terms closely related to your product. The highest-intent auto group, and usually the first to justify harvesting.",
          },
          {
            title: "Loose match",
            detail:
              "Loosely related searches. Broad discovery, usually the worst ACoS, and occasionally the source of a term nobody would have guessed.",
          },
          {
            title: "Substitutes and complements",
            detail:
              "Substitutes places you on similar products' pages; complements on products bought alongside yours. Different intents, so bidding them at one price wastes one of them.",
          },
          {
            title: "Separate bids per group",
            detail:
              "The four groups have their own bid fields. Set them separately or the data comes back as one blur and you have learned nothing about which intent works.",
          },
          {
            title: "Auto as an indexing test",
            detail:
              "If Amazon does not match you on a term you consider core, your listing is not indexed for it — a title and backend-keyword problem, not a bid one.",
          },
        ],
        checks: [
          {
            question: "What is the difference between substitutes and complements?",
            answer:
              "Substitutes shows your ad on similar products' detail pages; complements shows it on products bought alongside yours. The shopper's intent differs, so they deserve different bids.",
          },
          {
            question: "Why set the four auto bids separately?",
            answer:
              "One bid across all four returns blended data you cannot act on. Separate bids let each group's performance be read on its own.",
          },
          {
            question: "What does it mean if auto never matches you on a core term?",
            answer:
              "Your listing is not indexed for it. That is a title, bullet or backend-keyword fix — raising bids will not make Amazon match a term it does not associate with you.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Sponsored Products",
            url: "https://advertising.amazon.com/solutions/products/sponsored-products",
            sourceName: "Amazon Ads",
            editorNote:
              "The official description of the format and its targeting types. Skim; the Academy course below is the substance.",
          },
          {
            type: "doc",
            title: "Amazon Ads Academy",
            url: "https://advertising.amazon.com/academy",
            sourceName: "Amazon Ads",
            editorNote:
              "Register free and start the Sponsored Ads certification track now — module 11 expects all four certs done.",
          },
        ],
      },

      {
        title: "Manual match types and product targeting",
        summary: "Exact, phrase, broad — and PAT: aiming at competitor ASINs and category nodes.",
        learningObjectives: [
          "Exact vs phrase vs broad matching behaviour, precisely",
          "Product targeting by ASIN and by category filtered on price/rating",
          "Match-type isolation as the basis of clean data",
        ],
        whyToday:
          "Match type is the control surface. Everything later in this roadmap — harvesting, negation, structure, reporting — assumes each term appears in exactly one place, and that discipline starts here.",
        principle:
          "One term, one match type, one campaign. The moment the same keyword competes with itself, every report about it becomes a guess.",
        commonMistake:
          "Putting exact, phrase and broad for the same keyword in one ad group. They bid against each other, Amazon serves whichever it prefers, and the report cannot tell you which match type earned the sale.",
        challenge:
          "Take five keywords and build a manual campaign with exact and phrase isolated into separate ad groups. Add one product-targeting group aimed at three competitor ASINs you have actually looked at. Write down why each of those three.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Exact",
            detail:
              "The search term matches the keyword, allowing plurals and close misspellings. Highest intent, tightest control, and the destination for anything harvested.",
          },
          {
            title: "Phrase",
            detail:
              "The keyword appears as a phrase within a longer search. Useful for finding the modifiers buyers actually add.",
          },
          {
            title: "Broad",
            detail:
              "Related searches including synonyms and word order changes. Discovery, and it needs negatives more than the other two combined.",
          },
          {
            title: "Product targeting",
            detail:
              "Aim at specific ASINs or at a category filtered by price and rating. Targeting a competitor whose reviews are worse than yours at a similar price is the version of this that works.",
          },
          {
            title: "Isolation",
            detail:
              "Separate campaigns per match type, with harvested exacts negated in their source. Without it the same term runs in three places and the data is unattributable.",
          },
        ],
        checks: [
          {
            question: "What does exact match still allow?",
            answer:
              "Plurals, minor misspellings and close variants. It is exact in intent rather than in characters.",
          },
          {
            question: "Why isolate match types into separate campaigns?",
            answer:
              "So each term appears once and its performance is attributable. Sharing an ad group makes them compete and blends the reporting.",
          },
          {
            question: "What makes a good product-targeting choice?",
            answer:
              "A competitor at a comparable price whose ratings or review count are worse than yours — a shopper on that page has a reason to prefer you.",
          },
          {
            question: "Explain match types to somebody who has never run a campaign.",
            answer:
              "Exact serves on that search and its close variants; phrase serves when the keyword appears inside a longer search; broad serves on related searches including synonyms. Control and intent fall as reach rises, which is why discovery runs broad and scaling runs exact.",
            kind: "interview",
            difficulty: "easy",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon Ads Academy",
            url: "https://advertising.amazon.com/academy",
            sourceName: "Amazon Ads",
            editorNote: "The Sponsored Ads course's targeting lessons cover this node exactly.",
          },
          {
            type: "doc",
            title: "Keyword targeting",
            url: "https://advertising.amazon.com/library/guides/keyword-targeting",
            sourceName: "Amazon Ads",
            editorNote:
              "The official definitions of the three match types, with examples. Two pages, and worth reading before the Academy lesson rather than after.",
          },
        ],
      },

      {
        title: "Bidding strategies and placement modifiers",
        summary: "Down-only, up-and-down, fixed — and the 0–900% placement levers on top of them.",
        learningObjectives: [
          "Dynamic down-only as the safe default; when up-and-down earns its risk",
          "Placement modifiers for top-of-search and product pages",
          "How the +100%/+50% dynamic multipliers stack on placement boosts",
        ],
        whyToday:
          "This is the day the two multipliers meet. People set a placement modifier and a bidding strategy independently, discover a cost per click four times their base bid, and conclude the platform is broken.",
        principle:
          "Placement modifiers and dynamic bidding multiply. Set one without knowing the other and your real maximum bid is a number you never chose.",
        commonMistake:
          "A 300% top-of-search modifier with up-and-down bidding. The placement lever takes the base bid to 4×, then dynamic can add another 100% on top — a ₹20 bid becoming ₹160 on a placement you thought you were nudging.",
        challenge:
          "Take a ₹20 base bid and compute the worst-case cost per click under three combinations: down-only with no modifier, up-and-down with a 100% top-of-search modifier, and up-and-down with 300%. Write the three numbers down before you set anything.",
        challengeMinutes: 30,
        estMinutes: 75,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Dynamic down-only",
            detail:
              "Amazon lowers the bid when a conversion looks unlikely and never raises it. The safe default, and the right setting for anything whose economics you have not proven.",
          },
          {
            title: "Dynamic up-and-down",
            detail:
              "Can raise the bid by up to 100% for placements likely to convert. It earns its risk only once you know the campaign converts and the break-even has room in it.",
          },
          {
            title: "Fixed",
            detail:
              "Your bid, unchanged. Useful for a clean experiment where you need the variable held still.",
          },
          {
            title: "Placement modifiers",
            detail:
              "0–900% uplift for top-of-search or product pages. Top-of-search converts best and costs most; the modifier is how you buy that deliberately rather than by raising every bid.",
          },
          {
            title: "They multiply",
            detail:
              "Placement applies first, then dynamic on top. Base × placement × dynamic is the real ceiling, and it is worth computing before it appears on an invoice.",
          },
        ],
        checks: [
          {
            question: "What is the worst-case cost per click on a ₹20 bid with a 100% top-of-search modifier and up-and-down bidding?",
            answer:
              "₹80. The modifier doubles it to ₹40, then dynamic up-and-down can add up to another 100%.",
          },
          {
            question: "When is down-only the right choice?",
            answer:
              "Whenever the campaign's economics are unproven. It can only reduce spend, so the downside of being wrong is bounded.",
          },
          {
            question: "Why use a placement modifier rather than just raising the bid?",
            answer:
              "It raises the bid only where you want the extra reach — top of search — instead of paying more for every placement including the ones that convert badly.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon Ads Academy",
            url: "https://advertising.amazon.com/academy",
            sourceName: "Amazon Ads",
            editorNote:
              "The bidding lessons of the Sponsored Ads track. Do the worked examples rather than reading them.",
          },
        ],
      },
    ],
  },

  {
    title: "Profitability mathematics",
    weekRange: "Week 2",
    objective: "Know the ACoS at which this product stops making money, for this product.",
    deliverable: "A break-even sheet for one real product, built from its own fee schedule.",
    estHours: 3.5,
    nodes: [
      {
        title: "ACoS, TACoS and RoAS",
        summary: "Three lenses on the same spend — and TACoS is the one that catches organic decay.",
        learningObjectives: [
          "ACoS = spend ÷ ad revenue; RoAS = 100 ÷ ACoS",
          "TACoS = spend ÷ total revenue, and why it is the health metric",
          "Reading rising TACoS with flat ACoS as organic erosion",
        ],
        whyToday:
          "ACoS is the number every dashboard shows and the one that hides the failure that matters. A brand can hold ACoS steady for a year while its organic sales quietly die, and only TACoS says so.",
        principle:
          "ACoS measures the ads. TACoS measures the business. A brand improving one while the other worsens is buying its own customers back.",
        commonMistake:
          "Optimising ACoS in isolation. Cutting spend to the highest-intent branded terms drops ACoS beautifully and often means you have stopped acquiring anyone new — which shows up in TACoS months before it shows up anywhere else.",
        challenge:
          "For one ASIN over three months, compute ACoS and TACoS per month. If ACoS is flat and TACoS is rising, write down what that means in one sentence. If both are falling, write down why that is the good case.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "ACoS",
            detail:
              "Ad spend divided by revenue attributed to those ads. It says how efficient the advertising was and nothing about the business it sits in.",
          },
          {
            title: "RoAS",
            detail:
              "The same fact inverted — revenue over spend, so 100 ÷ ACoS as a percentage. Agencies serving US brands tend to say RoAS; the arithmetic is identical.",
          },
          {
            title: "TACoS",
            detail:
              "Ad spend divided by TOTAL revenue, organic included. Falling TACoS with growing sales means organic is carrying more of the load, which is the outcome worth wanting.",
          },
          {
            title: "The diagnostic pair",
            detail:
              "Flat ACoS with rising TACoS means ads are holding up an eroding organic base. That combination is invisible to anyone watching one number.",
          },
        ],
        checks: [
          {
            question: "What does rising TACoS with flat ACoS tell you?",
            answer:
              "Organic sales are shrinking. The ads are as efficient as they were, but they now account for a larger share of a total that is falling.",
          },
          {
            question: "Convert a 25% ACoS to RoAS.",
            answer: "4× — 100 divided by 25. Same fact, inverted.",
          },
          {
            question: "Which of the three is the health metric, and why?",
            answer:
              "TACoS, because it includes organic revenue. ACoS can be made to look good by narrowing to the easiest traffic.",
          },
          {
            question: "A client says their ACoS improved from 30% to 18% last quarter. What do you ask?",
            answer:
              "What TACoS did, and what total revenue did. An ACoS improvement produced by cutting discovery spend and keeping only branded terms usually shows up as flat or falling total revenue — the efficiency is real and the business is smaller.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Seller Central — pricing and fees",
            url: "https://sell.amazon.com/pricing",
            sourceName: "Amazon Seller Central",
            editorNote:
              "You need the fee schedule for tomorrow's break-even sheet. Find your category's referral rate today.",
          },
        ],
      },

      {
        title: "Break-even ACoS from first principles",
        summary:
          "Price minus COGS minus referral minus FBA = the margin ads are allowed to eat. Work the $50 example, then your own.",
        learningObjectives: [
          "The worked example: $50 price, $12 COGS, 15% referral, $6.50 pick-and-pack → 48% break-even",
          "Building the same sheet for a real product",
          "Target ACoS as break-even minus required profit",
        ],
        whyToday:
          "Every bid decision for the rest of this roadmap references one number, and it is different for every product. Today you derive it rather than borrow an industry average that was never about your margins.",
        principle:
          "Break-even ACoS is the margin, expressed as a percentage of price. Every target below it is a profit decision; every number above it is a loss you should be choosing on purpose.",
        commonMistake:
          "Using a category rule of thumb. A 25% target ACoS is disastrous on a product with a 20% margin and leaves money unspent on one with 60%. The number is arithmetic, and the arithmetic is per product.",
        challenge:
          "Build the sheet for one real product: price, COGS, referral fee at your actual category rate, FBA fulfilment, storage. Break-even ACoS is margin ÷ price. Then set a target ACoS by subtracting the profit you require. Keep the sheet — day 27 needs it.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The worked example",
            detail:
              "$50 price, $12 COGS, 15% referral ($7.50), $6.50 pick-and-pack. Margin is $24, so break-even ACoS is 24 ÷ 50 = 48%. Spend more than 48 cents per dollar of ad revenue and the sale loses money.",
          },
          {
            title: "Referral fees are per category",
            detail:
              "15% is common and far from universal. Pull your own category's rate — using the wrong one moves break-even by several points, which is the difference between profit and not.",
          },
          {
            title: "Fees the sheet forgets",
            detail:
              "Monthly storage, long-term storage, returns processing, and the return rate itself. A 10% return rate on a category with a returns fee changes the answer materially.",
          },
          {
            title: "Target versus break-even",
            detail:
              "Break-even is where profit is zero. Target ACoS is break-even minus the margin you intend to keep, and it is the number that goes into bid decisions.",
          },
        ],
        checks: [
          {
            question: "Price $50, COGS $12, referral 15%, FBA $6.50. What is break-even ACoS?",
            answer:
              "48%. Referral is $7.50, so margin is 50 − 12 − 7.50 − 6.50 = $24, and 24 ÷ 50 = 48%.",
          },
          {
            question: "Why is a category rule of thumb dangerous?",
            answer:
              "Break-even is a function of this product's price and costs. A borrowed number is either leaving money unspent or losing it on every sale, and neither is visible in ACoS alone.",
          },
          {
            question: "What is target ACoS?",
            answer:
              "Break-even minus the profit margin you intend to keep. Break-even is where you stop losing; target is where you start earning.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Seller Central — pricing and fees",
            url: "https://sell.amazon.com/pricing",
            sourceName: "Amazon Seller Central",
            editorNote:
              "Pull the actual fee schedule for your category; the example's 15% is not universal.",
          },
        ],
      },

      {
        title: "When high ACoS is mathematically correct",
        summary: "Launch velocity, brand defence, and LTV consumables — the three legitimate exceptions.",
        learningObjectives: [
          "Launch phase: 20–30% TACoS targets to buy organic indexing",
          "Defensive branded campaigns priced as insurance, not ROI",
          "Subscribe & Save LTV justifying first-order losses",
        ],
        whyToday:
          "Yesterday produced a ceiling. Today establishes when exceeding it is the right call — because a rule you cannot knowingly break is a rule you will break by accident and then defend badly.",
        principle:
          "Spending above break-even is a decision to buy something other than this sale. Name the thing you are buying, or you are just losing money slowly.",
        commonMistake:
          "Calling any overspend a launch investment. A launch has an end date and a rank target. Without both, 'launch phase' is a phrase that has been covering an unprofitable campaign for eight months.",
        challenge:
          "Write the three exceptions as three sentences, each with the specific condition that ends it: the rank you are buying and by when, the competitor you are blocking and at what monthly cost, the repeat rate that makes a first-order loss repay. If you cannot fill in the number, the exception does not apply to you.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Launch",
            detail:
              "Sales velocity buys organic rank, and rank is the asset. A 20–30% TACoS target during launch is buying position, but only if there is a date on which it stops.",
          },
          {
            title: "Defence",
            detail:
              "Branded terms are cheap and mostly cannibalise your own organic traffic. Bidding on them is insurance against a competitor appearing above you, and it should be priced as a monthly premium, not judged on RoAS.",
          },
          {
            title: "Lifetime value",
            detail:
              "A consumable bought on Subscribe & Save repays a first-order loss over subsequent orders. This only works with an actual repeat rate — measured, not assumed.",
          },
          {
            title: "What makes an exception legitimate",
            detail:
              "A named thing being bought, a number attached, and a condition that ends it. Two out of three is a story.",
          },
        ],
        checks: [
          {
            question: "What makes launch spend different from overspending?",
            answer:
              "A rank target and an end date. Without both it is just an unprofitable campaign with a sympathetic name.",
          },
          {
            question: "How should a defensive branded campaign be judged?",
            answer:
              "As insurance with a monthly premium, not on RoAS. Most of its clicks would have been organic, so its return looks excellent and means little.",
          },
          {
            question: "What does an LTV justification require that a guess does not?",
            answer:
              "A measured repeat rate. Without it, the second order that repays the first is hypothetical.",
          },
        ],
        resources: [],
      },
    ],
  },

  {
    title: "Sponsored Brands, Sponsored Display and impression share",
    weekRange: "Weeks 2–3",
    objective: "Use the formats beyond Sponsored Products, and read where you are losing.",
    deliverable: "A diagnosis of one campaign's lost impression share, split by cause.",
    estHours: 3,
    nodes: [
      {
        title: "Sponsored Brands and new-to-brand",
        summary: "Collection, Store Spotlight and video — judged by NTB%, not just ACoS.",
        learningObjectives: [
          "The three SB formats and where each fits",
          "New-to-brand: 12-month lookback, and why brands buy it",
          "SBV as the cheapest video real estate on the search page",
        ],
        whyToday:
          "Sponsored Brands is the first format whose job is not primarily this sale, so judging it on ACoS misreads it. New-to-brand is the metric that says what it actually bought.",
        principle:
          "Sponsored Brands buys customers, not orders. The metric that matches that job is the share of them who had not bought from you in a year.",
        commonMistake:
          "Comparing SB's ACoS with SP's and concluding SB is worse. SP harvests demand that already exists; SB reaches people who did not know the brand. Same denominator, different jobs.",
        challenge:
          "Look at any Sponsored Brands campaign and find its new-to-brand order percentage. Then compute what you paid per new-to-brand order — spend ÷ NTB orders. That number, not ACoS, is what the campaign cost you.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Product Collection",
            detail:
              "Logo, headline and three products, above the search results. The workhorse format and the one that carries a brand message.",
          },
          {
            title: "Store Spotlight",
            detail:
              "Sends to Store subpages rather than product pages. It works when the Store is genuinely built out and wastes the click when it is not.",
          },
          {
            title: "Sponsored Brands Video",
            detail:
              "An autoplaying muted clip in the results. Consistently the cheapest video placement on the page, and it does not need a production budget to work.",
          },
          {
            title: "New-to-brand",
            detail:
              "Orders from shoppers who have not bought this brand on Amazon in twelve months. It is the only standard Amazon metric that separates acquisition from harvesting.",
          },
          {
            title: "Cost per new customer",
            detail:
              "Spend divided by NTB orders. Compare it against what a customer is worth over a year rather than against SP's ACoS.",
          },
        ],
        checks: [
          {
            question: "What does new-to-brand count?",
            answer:
              "Orders from shoppers who have not purchased from this brand on Amazon in the previous twelve months.",
          },
          {
            question: "Why is comparing SB's ACoS with SP's misleading?",
            answer:
              "They do different jobs. SP captures existing demand at high intent; SB reaches people who did not know the brand, so its cost per order is naturally higher and its value is a customer rather than a sale.",
          },
          {
            question: "When does Store Spotlight beat Product Collection?",
            answer:
              "When the Store has real, differentiated subpages worth landing on. Sending traffic to a thin Store wastes the click.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Sponsored Brands",
            url: "https://advertising.amazon.com/solutions/products/sponsored-brands",
            sourceName: "Amazon Ads",
            editorNote:
              "The three formats and their placements. The new-to-brand definition is the part to note.",
          },
        ],
      },

      {
        title: "Sponsored Display: contextual and audience targeting",
        summary: "Retargeting detail-page viewers on and off Amazon — the 30-day window that closes loops.",
        learningObjectives: [
          "Contextual (similar/complementary products) vs audience targeting",
          "Views remarketing: 30-day detail-page viewers who did not buy",
          "SD as the poor man's DSP, and where it stops being enough",
        ],
        whyToday:
          "Everything so far has been search. Sponsored Display is the first format that follows a shopper away from the search page, which is a different mechanism and a different set of mistakes.",
        principle:
          "Search advertising meets demand that already exists. Display creates the second occasion — which only works if there was a first.",
        commonMistake:
          "Running views remarketing on a listing with almost no traffic. The audience is people who viewed the page; if few did, the campaign has nobody to reach and spends its budget on the contextual fallback instead.",
        challenge:
          "Set up one views-remarketing campaign against an ASIN with real traffic, and one contextual campaign targeting three competitor ASINs. After a week, compare cost per order. Write down which mechanism suited this product and why.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Contextual targeting",
            detail:
              "Places your ad on product pages by similarity or complement. The shopper is on a competitor's page right now, which is the highest-intent display moment there is.",
          },
          {
            title: "Views remarketing",
            detail:
              "Reaches people who viewed your detail page in the last 30 days and did not buy. It needs an audience, so it needs the page to have had traffic.",
          },
          {
            title: "Purchases remarketing",
            detail:
              "Reaches past buyers, which is for consumables and genuine cross-sells. Aimed at a durable good it advertises a product the person already owns.",
          },
          {
            title: "On and off Amazon",
            detail:
              "SD serves on Amazon and across third-party sites. The off-Amazon inventory is where it starts to resemble DSP and where measurement gets harder.",
          },
          {
            title: "Where SD stops",
            detail:
              "No control over inventory, limited audience building, no clean-room measurement. Past a certain spend those limits are what DSP exists to remove.",
          },
        ],
        checks: [
          {
            question: "What does views remarketing require to work at all?",
            answer:
              "Detail-page traffic in the last 30 days. No viewers means no audience, and the spend leaks to contextual placements instead.",
          },
          {
            question: "When is purchases remarketing wrong?",
            answer:
              "On a durable good. You are advertising to somebody who already owns it — it suits consumables and genuine cross-sells.",
          },
          {
            question: "Name one thing DSP gives you that Sponsored Display does not.",
            answer:
              "Control over inventory and audience construction, and clean-room measurement through AMC.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Sponsored Display",
            url: "https://advertising.amazon.com/solutions/products/sponsored-display",
            sourceName: "Amazon Ads",
            editorNote:
              "The targeting types and where the ads appear. Note the audience definitions — they are the part that decides whether a campaign has anybody to reach.",
          },
        ],
      },

      {
        title: "Search impression share diagnostics",
        summary:
          "Lost to rank means bid/relevance; lost to budget means the day ended early. Different problems, different fixes.",
        learningObjectives: [
          "Reading the SIS report",
          "Lost-to-rank → bids, listing relevance, match types",
          "Lost-to-budget → budgets, dayparting, or deliberate scarcity",
        ],
        whyToday:
          "Everything so far measured what happened. Impression share measures what did not — the auctions you were absent from — and the two causes of absence need opposite responses.",
        principle:
          "Lost to rank and lost to budget look identical in a sales report and mean opposite things. One says bid more; the other says you already did.",
        commonMistake:
          "Raising bids because impressions are low. If the loss is to budget, a higher bid spends the same daily cap faster and buys fewer impressions than before — the exact opposite of the intent.",
        challenge:
          "Pull impression share for one campaign and split the loss into rank and budget. For each, write the one action it implies. If the loss is to budget, check the hour the campaign runs out — that hour is the whole diagnosis.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "What impression share is",
            detail:
              "The share of eligible auctions where your ad appeared. Below 100%, the remainder is split into lost-to-rank and lost-to-budget, and that split is the diagnosis.",
          },
          {
            title: "Lost to rank",
            detail:
              "You entered and lost. The causes are bid, relevance and match type — and relevance is a listing problem no bid will fix.",
          },
          {
            title: "Lost to budget",
            detail:
              "You stopped entering because the daily budget was gone. Raising the bid here makes it worse: the same money buys fewer, more expensive clicks.",
          },
          {
            title: "When running out early is correct",
            detail:
              "A campaign that exhausts its budget at 2pm every day is not necessarily broken. If the morning traffic converts and the evening does not, that is dayparting happening by accident — worth making deliberate.",
          },
        ],
        checks: [
          {
            question: "Impression share is 40% and the loss is mostly to budget. What do you do?",
            answer:
              "Raise the budget or narrow the targeting. Raising the bid spends the same cap faster and buys fewer impressions.",
          },
          {
            question: "What causes lost-to-rank besides a low bid?",
            answer:
              "Listing relevance and match type. If Amazon does not consider you relevant to the term, the bid is not the binding constraint.",
          },
          {
            question: "Is a campaign that exhausts its budget by 2pm necessarily wrong?",
            answer:
              "No. If the morning traffic converts better, that is dayparting arriving by accident — worth checking and then making deliberate.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon Ads help",
            url: "https://advertising.amazon.com/help",
            sourceName: "Amazon Ads",
            editorNote:
              "Search it for 'impression share' — the metric definitions live here rather than in the Academy course, and the rank-versus-budget split is defined precisely.",
          },
        ],
      },
    ],
  },
];
