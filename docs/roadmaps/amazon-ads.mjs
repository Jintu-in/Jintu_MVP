/**
 * Amazon Ads & retail media — 13 weeks (owner curriculum, 2026-08-13).
 * One of the two reference curricula the pivot brief named.
 *
 * The organizing idea, kept front and centre: Amazon Ads is entirely
 * downstream from retail operations — ads on a listing with a broken Buy
 * Box or bad conversion rate are burning money. Retail readiness comes
 * first, then mechanics, then the profitability math, then the
 * clean-room/API/incrementality layers agencies pay for.
 *
 * The owner's daily 5-minute Search Term Audit ships as its own node in
 * module 5 with the standing-habit note — the schema has no daily-rep
 * entity, and a habit stated where it starts beats a table nobody reads.
 *
 * Sourcing: Amazon URLs rot faster than most — two of the owner's anchor
 * paths already 404'd at authoring (sell.amazon.in/seller-university,
 * advertising.amazon.com/library/guides) and were replaced with live
 * equivalents. Every URL here resolved on 2026-08-13; --check re-verifies.
 */
export default {
  slug: "amazon-ads",
  title: "Amazon Ads & retail media",
  summary:
    "Thirteen weeks from retail readiness to clean-room SQL and incrementality: Buy Box health, Sponsored Products mechanics, profitability math, DSP, AMC and the Ads API — for sellers on Amazon.in and agency account managers alike.",
  subjectTags: ["marketing", "amazon-ads", "ecommerce", "retail-media", "advertising"],
  category: "business",
  difficulty: "intermediate",
  estimatedWeeks: 13,
  licenseNote: null,
  modules: [
    {
      title: "Retail context first — the pre-ad readiness audit",
      weekRange: "Weeks 1–2",
      objective:
        "Prove a listing deserves traffic before buying any: Buy Box health, conversion baselines, inventory stability, retail readiness.",
      deliverable:
        "A written readiness audit of one live listing: Buy Box %, Unit Session %, IPI status, and every item of the retail checklist marked pass/fail.",
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
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Seller University — learn to sell",
              url: "https://sell.amazon.com/learn",
              sourceName: "Amazon Seller Central",
              editorNote: "The featured-offer and account-health lessons; sellers on Amazon.in use sell.amazon.in/learn.",
            },
            {
              type: "doc",
              title: "Seller University India",
              url: "https://sell.amazon.in/learn",
              sourceName: "Amazon Seller Central (India)",
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
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Seller University — business reports lessons",
              url: "https://sell.amazon.com/learn",
              sourceName: "Amazon Seller Central",
              editorNote: "Search the catalog for the business-reports masterclass; read your own reports alongside.",
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
          estMinutes: 45,
          points: 25,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Fulfilment by Amazon",
              url: "https://sell.amazon.com/fulfillment-by-amazon",
              sourceName: "Amazon Seller Central",
            },
          ],
        },
        {
          title: "The retail readiness checklist",
          summary: "Title, images, bullets, reviews, A+ — the bar a listing clears before its first impression is bought.",
          learningObjectives: [
            "Main image on pure white, 1600×1600+ for zoom",
            "Five+ bullets; 15–20+ reviews at 4.2+ average",
            "A+ Content and Brand Story enabled",
            "Audit one live listing against every item",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads — ad specs and requirements",
              url: "https://advertising.amazon.com/resources/ad-specs",
              sourceName: "Amazon Ads",
            },
          ],
        },
      ],
    },
    {
      title: "Sponsored Products — execution and bidding",
      weekRange: "Weeks 3–4",
      objective:
        "Run the workhorse ad type properly: targeting types, match logic, bidding strategies and placement modifiers.",
      deliverable:
        "A live (or sandbox) SP structure: one auto campaign, one manual with exact/phrase/broad split, one product-targeting campaign — named to the convention.",
      nodes: [
        {
          title: "Auto targeting and the four match groups",
          summary: "Close match, loose match, substitutes, complements — Amazon's own read of your listing.",
          learningObjectives: [
            "What each auto group targets and what its performance tells you",
            "Auto campaigns as discovery engines, not end states",
            "Reading auto results as listing-indexing feedback",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Sponsored Products",
              url: "https://advertising.amazon.com/solutions/products/sponsored-products",
              sourceName: "Amazon Ads",
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
          estMinutes: 75,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads Academy",
              url: "https://advertising.amazon.com/academy",
              sourceName: "Amazon Ads",
              editorNote: "The Sponsored Ads course's targeting lessons cover this node exactly.",
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
          estMinutes: 75,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads Academy",
              url: "https://advertising.amazon.com/academy",
              sourceName: "Amazon Ads",
            },
          ],
        },
      ],
    },
    {
      title: "Profitability mathematics",
      weekRange: "Week 5",
      objective:
        "Know your break-even ACoS to the percentage point, and know the three cases where a high ACoS is the correct choice.",
      deliverable:
        "A margin worksheet for one real product: COGS, referral fee, FBA fees → pre-ad margin → break-even ACoS → target ACoS by objective.",
      nodes: [
        {
          title: "ACoS, TACoS and RoAS",
          summary: "Three lenses on the same spend — and TACoS is the one that catches organic decay.",
          learningObjectives: [
            "ACoS = spend ÷ ad revenue; RoAS = 100 ÷ ACoS",
            "TACoS = spend ÷ total revenue, and why it is the health metric",
            "Reading rising TACoS with flat ACoS as organic erosion",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Seller Central — pricing and fees",
              url: "https://sell.amazon.com/pricing",
              sourceName: "Amazon Seller Central",
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
          estMinutes: 75,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Seller Central — pricing and fees",
              url: "https://sell.amazon.com/pricing",
              sourceName: "Amazon Seller Central",
              editorNote: "Pull the actual fee schedule for your category; the example's 15% is not universal.",
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
          estMinutes: 60,
          points: 30,
          difficulty: "stretch",
          resources: [],
        },
      ],
    },
    {
      title: "Sponsored Brands, Sponsored Display & impression share",
      weekRange: "Week 6",
      objective:
        "The upper funnel on Amazon: SB formats and NTB, SD retargeting, and the two impression-share diagnoses.",
      deliverable:
        "One SB collection or video campaign plus one SD retargeting audience, with an SIS read-out saying what is lost to rank vs budget.",
      nodes: [
        {
          title: "Sponsored Brands and new-to-brand",
          summary: "Collection, Store Spotlight and video — judged by NTB%, not just ACoS.",
          learningObjectives: [
            "The three SB formats and where each fits",
            "New-to-brand: 12-month lookback, and why brands buy it",
            "SBV as the cheapest video real estate on the search page",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Sponsored Brands",
              url: "https://advertising.amazon.com/solutions/products/sponsored-brands",
              sourceName: "Amazon Ads",
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
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Sponsored Display",
              url: "https://advertising.amazon.com/solutions/products/sponsored-display",
              sourceName: "Amazon Ads",
            },
          ],
        },
        {
          title: "Search impression share diagnostics",
          summary: "Lost to rank means bid/relevance; lost to budget means the day ended early. Different problems, different fixes.",
          learningObjectives: [
            "Reading the SIS report",
            "Lost-to-rank → bids, listing relevance, match types",
            "Lost-to-budget → budgets, dayparting, or deliberate scarcity",
          ],
          estMinutes: 45,
          points: 25,
          difficulty: "core",
          resources: [],
        },
      ],
    },
    {
      title: "Search term mining — harvesting and negation",
      weekRange: "Week 7",
      objective:
        "Turn the Search Term Report into a weekly engine: harvest winners to exact, negate losers, and never pay twice for the same click.",
      deliverable:
        "One full STR cycle executed and logged: harvested terms moved to exact, negatives placed at source, every rule numeric.",
      nodes: [
        {
          title: "The harvesting and negation framework",
          summary:
            "≥3 orders at target ACoS → harvest to exact AND negate at source; ≥12 clicks at zero orders → negate. Rules, not vibes.",
          learningObjectives: [
            "The four-row decision table, memorized",
            "Why harvested terms get negated at source (internal competition)",
            "Negative exact vs negative phrase placement",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads Academy",
              url: "https://advertising.amazon.com/academy",
              sourceName: "Amazon Ads",
              editorNote: "The reporting-and-optimization lessons of the Sponsored Ads track.",
            },
          ],
        },
        {
          title: "The daily 5-minute rep: search term audit",
          summary:
            "Seven days of STR, two filters, one logged action. Five minutes a day from now until week 13 — this habit IS enterprise account management.",
          learningObjectives: [
            "Download last 7 days' STR; filter ≥12 clicks / 0 conversions → negate exact",
            "Filter ≥3 orders at target ACoS in auto/broad/phrase → harvest to exact",
            "Log the exact numeric rule applied, daily, without exception",
          ],
          estMinutes: 30,
          points: 25,
          difficulty: "core",
          resources: [],
        },
      ],
    },
    {
      title: "Campaign architecture & portfolio structure",
      weekRange: "Week 8",
      objective:
        "Structure that scales: naming conventions a stranger can parse, single-intent ad groups, and the four campaign roles.",
      deliverable:
        "Your account (or a model account) restructured: convention-named campaigns split into discovery, scaling, defensive and conquesting.",
      nodes: [
        {
          title: "Naming conventions and ad-group discipline",
          summary:
            "[Marketplace]_[Brand]_[Product]_[AdType]_[Targeting]_[Strategy] — and never mixed margins in one ad group.",
          learningObjectives: [
            "The six-field convention and why every field earns its place",
            "One price point, one margin, one conversion profile per ad group",
            "What breaks downstream when structure is sloppy: reporting, bids, harvesting",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [],
        },
        {
          title: "The four campaign intents",
          summary: "Discovery, scaling, defensive, conquesting — each with its own budget logic and success metric.",
          learningObjectives: [
            "Discovery (auto/broad) feeding scaling (manual exact)",
            "Defensive branded: insurance economics",
            "Conquesting competitor ASINs: when it pays and when it bleeds",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads Academy",
              url: "https://advertising.amazon.com/academy",
              sourceName: "Amazon Ads",
            },
          ],
        },
      ],
    },
    {
      title: "Amazon DSP & programmatic",
      weekRange: "Week 9",
      objective:
        "The programmatic layer: DSP inventory and creatives, first-party audiences, and the attribution window that changes every number.",
      deliverable:
        "A one-page DSP media plan: audience segments, creative formats, budget split, and the attribution caveats stated up front.",
      nodes: [
        {
          title: "DSP inventory and creative formats",
          summary: "Display, online video, Streaming TV, and responsive e-commerce creatives.",
          learningObjectives: [
            "Where DSP inventory runs on and off Amazon",
            "STV/Prime Video placements and their real costs",
            "REC: creatives assembled from the listing itself",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Amazon DSP",
              url: "https://advertising.amazon.com/solutions/products/amazon-dsp",
              sourceName: "Amazon Ads",
            },
          ],
        },
        {
          title: "First-party audiences and attribution",
          summary:
            "In-market, remarketing, purchaser cross-sell — under a 14-day window counting views as well as clicks.",
          learningObjectives: [
            "In-market/lifestyle vs views-remarketing vs purchaser retargeting",
            "The 14-day lookback; click-through vs view-through attribution",
            "Why VTA inflates naive read-outs — the setup for module 10",
          ],
          estMinutes: 75,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads Academy — DSP track",
              url: "https://advertising.amazon.com/academy",
              sourceName: "Amazon Ads",
              editorNote: "The Programmatic (DSP) certification course is this module's spine.",
            },
          ],
        },
      ],
    },
    {
      title: "Amazon Marketing Cloud & clean-room SQL",
      weekRange: "Week 10",
      objective:
        "Event-level truth under privacy floors: AMC's tables, the 50-user aggregation rule, and the path-to-purchase query.",
      deliverable:
        "A working multi-touch query comparing SP-only vs DSP+SP conversion paths, with the privacy constraints annotated.",
      nodes: [
        {
          title: "Clean-room architecture and privacy thresholds",
          summary: "Event-level logs without user identity, and the 50-user floor every query must clear.",
          learningObjectives: [
            "What a clean room is and is not",
            "The 50-user aggregation floor and how it shapes query design",
            "The core tables: sponsored_products_clicks, dsp_impressions, amazon_attributed_events_by_conversion_time",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Amazon Marketing Cloud",
              url: "https://advertising.amazon.com/solutions/products/amazon-marketing-cloud",
              sourceName: "Amazon Ads",
            },
          ],
        },
        {
          title: "The path-to-purchase query",
          summary:
            "LEFT JOINs across clicks, impressions and conversions → 'DSP+SP' vs 'SP only' purchaser counts. SQL from the Data analyst roadmap, applied.",
          learningObjectives: [
            "CASE-driven path classification across joined event tables",
            "COUNT(DISTINCT user) and attributed-sales aggregation",
            "Reading combined-touch vs single-touch conversion honestly",
          ],
          estMinutes: 90,
          points: 40,
          difficulty: "stretch",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads Academy — AMC track",
              url: "https://advertising.amazon.com/academy",
              sourceName: "Amazon Ads",
              editorNote:
                "The AMC certification course includes a query sandbox. If SQL joins feel shaky, the Data analyst roadmap's module 7 is the prerequisite.",
            },
          ],
        },
      ],
    },
    {
      title: "Bulk operations & the Ads API",
      weekRange: "Week 11",
      objective:
        "Operate at scale: thousand-row bulk edits in one upload, and a Python pipeline pulling daily reports into a warehouse.",
      deliverable:
        "A bulk file executing a multi-campaign bid change, plus a Python script that authenticates via LWA and lands one day's SP report in PostgreSQL.",
      nodes: [
        {
          title: "Bulk sheets",
          summary: "The 60-day bulk file: mass bid updates, status toggles and negative injections in one upload.",
          learningObjectives: [
            "Downloading and reading the bulk file's sheet structure",
            "Safe mass edits: bids, ENABLED/PAUSED, negatives",
            "Validating before upload — one bad row fails quietly",
          ],
          estMinutes: 60,
          points: 30,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads Academy",
              url: "https://advertising.amazon.com/academy",
              sourceName: "Amazon Ads",
            },
          ],
        },
        {
          title: "The Ads API: OAuth and report automation",
          summary:
            "LWA tokens, async report requests, and a pandas pipeline into PostgreSQL — the agency's nervous system.",
          learningObjectives: [
            "OAuth 2.0 with Login with Amazon: the token dance",
            "Requesting SP/SB/SD reports asynchronously and polling",
            "requests + pandas → warehouse; scheduling it daily",
          ],
          estMinutes: 120,
          points: 40,
          difficulty: "stretch",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads API documentation",
              url: "https://advertising.amazon.com/API/docs/en-us",
              sourceName: "Amazon Ads",
            },
            {
              type: "doc",
              title: "Login with Amazon documentation",
              url: "https://developer.amazon.com/docs/login-with-amazon/documentation-overview.html",
              sourceName: "Amazon Developer",
            },
            {
              type: "doc",
              title: "Requests — HTTP for humans",
              url: "https://requests.readthedocs.io/",
              sourceName: "Requests documentation",
            },
          ],
        },
      ],
    },
    {
      title: "Incrementality & true lift",
      weekRange: "Week 12",
      objective:
        "Separate sales the ads caused from sales they merely claimed: cannibalization, iROAS, and geo blackout tests.",
      deliverable:
        "A designed (and if possible, launched) geo experiment: matched regions, a 3-week blackout arm, and the iROAS calculation sheet ready for results.",
      nodes: [
        {
          title: "Cannibalization and iROAS",
          summary:
            "The 5% ACoS brand campaign whose buyers would have clicked your organic listing anyway — the most expensive cheap metric in the industry.",
          learningObjectives: [
            "Organic cannibalization: the branded-keyword trap",
            "iROAS = incremental sales ÷ spend, and why it diverges from RoAS",
            "Which campaign types are most and least incremental, typically",
          ],
          estMinutes: 60,
          points: 35,
          difficulty: "stretch",
          resources: [
            {
              type: "read",
              title: "Marketing mix modeling",
              url: "https://en.wikipedia.org/wiki/Marketing_mix_modeling",
              sourceName: "Wikipedia",
              editorNote: "The wider family of methods this module's experiments belong to.",
            },
          ],
        },
        {
          title: "Geo tests and blackout experiments",
          summary: "Two matched regions, one deprived of ads for three weeks — the honest way to find baseline demand.",
          learningObjectives: [
            "Selecting comparable regions; contamination risks",
            "Running the 3-week blackout and sizing the effect",
            "Analyzing lift with statsmodels/SciPy; stating the uncertainty",
          ],
          estMinutes: 90,
          points: 40,
          difficulty: "stretch",
          resources: [
            {
              type: "doc",
              title: "statsmodels",
              url: "https://www.statsmodels.org/stable/index.html",
              sourceName: "statsmodels documentation",
            },
            {
              type: "doc",
              title: "Statistics (scipy.stats) tutorial",
              url: "https://docs.scipy.org/doc/scipy/tutorial/stats.html",
              sourceName: "SciPy documentation",
              editorNote:
                "The thinking-under-uncertainty roadmap's modules 3 and 5 are the statistical backbone for this week.",
            },
          ],
        },
      ],
    },
    {
      title: "Certifications & the account audit",
      weekRange: "Week 13",
      objective:
        "Convert thirteen weeks into proof: the four official certifications and an audit deck an agency would pay for.",
      deliverable:
        "All four Amazon certifications passed, plus the audit deck: retail readiness gaps, waste breakdown, structure review, and a scaling roadmap with AMC strategy.",
      nodes: [
        {
          title: "The four certifications",
          summary: "Sponsored Ads, DSP, AMC, Retail — free, official, and screened for in agency hiring.",
          learningObjectives: [
            "Sponsored Ads and Retail certifications: close them out",
            "DSP and AMC certifications: the differentiators",
            "Adding verifiable credentials to your profile the honest way",
          ],
          estMinutes: 120,
          points: 40,
          difficulty: "core",
          resources: [
            {
              type: "doc",
              title: "Amazon Ads Academy — certifications",
              url: "https://advertising.amazon.com/academy",
              sourceName: "Amazon Ads",
              editorNote: "Free via the learning console; each exam is retakeable.",
            },
            {
              type: "tool",
              title: "Amazon Ads learning console",
              url: "https://learningconsole.amazonadvertising.com/",
              sourceName: "Amazon Ads",
            },
          ],
        },
        {
          title: "Capstone — the account audit deck",
          summary:
            "Four sections on a real account: readiness gaps, waste breakdown, structure review, scaling roadmap. This deck is the portfolio.",
          learningObjectives: [
            "Retail readiness and conversion gaps: Buy Box, USP%, content",
            "Waste: zero-conversion spend, TACoS vs ACoS health",
            "Structure and match-type isolation review",
            "The scaling roadmap with an AMC custom-query strategy",
          ],
          estMinutes: 120,
          points: 40,
          difficulty: "stretch",
          resources: [],
        },
      ],
    },
  ],
};
