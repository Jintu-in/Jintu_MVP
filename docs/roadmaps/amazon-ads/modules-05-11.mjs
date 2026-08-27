/**
 * Amazon Ads — modules 5–11, days 14–27.
 *
 * Search term mining, structure, DSP, the clean room, automation,
 * incrementality and the capstone. Same rule as the first half: titles,
 * summaries, objectives and links are the original spec's; the day-page
 * model is new.
 */
export default [
  {
    title: "Search term mining — harvesting and negation",
    weekRange: "Week 3",
    objective: "Turn the search term report into a repeatable daily decision.",
    deliverable: "Seven consecutive days of logged harvest and negation actions.",
    estHours: 2,
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
        whyToday:
          "This is the job. Most of what an account manager is paid for is this decision, made consistently, on a report nobody enjoys reading — and consistency is only possible with numeric thresholds written down.",
        principle:
          "A rule with a number in it can be applied on a bad day. A rule that says 'if it looks like it is working' cannot, which is why accounts drift.",
        commonMistake:
          "Harvesting a term into exact and leaving it live in the broad campaign that found it. Now two of your own campaigns bid against each other on the same search, and you pay the higher price to win against yourself.",
        challenge:
          "Write the four-row table out by hand: the condition, the action, and why. Then apply it to one week of search term data and produce a list of harvests and negations with the numbers that triggered each.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Harvest",
            detail:
              "Three or more orders at or below target ACoS. Move the term into its own exact-match keyword where you can bid it deliberately.",
          },
          {
            title: "Negate at source",
            detail:
              "The moment a term is harvested, add it as a negative in the campaign it came from. Otherwise the discovery campaign keeps bidding on it and competes with the exact you just built.",
          },
          {
            title: "Negate outright",
            detail:
              "Twelve or more clicks with no orders. The threshold is a compromise: low enough to stop bleeding, high enough not to kill a term on noise.",
          },
          {
            title: "Watch",
            detail:
              "Everything between — some orders but above target, or too few clicks to say. It gets a bid adjustment, not a decision, and comes back next week.",
          },
          {
            title: "Negative exact versus negative phrase",
            detail:
              "Negative exact blocks that term only. Negative phrase blocks anything containing it, which is powerful and occasionally blocks a converting long-tail you never see again.",
          },
        ],
        checks: [
          {
            question: "Why negate a term in the campaign you harvested it from?",
            answer:
              "Otherwise the discovery campaign and the new exact campaign bid against each other on the same search, raising your own cost per click.",
          },
          {
            question: "Why twelve clicks rather than five for the negation threshold?",
            answer:
              "Five clicks with no order is well within noise for most conversion rates. Twelve is enough to be a signal and few enough to stop the bleeding early.",
          },
          {
            question: "What is the risk of a negative phrase?",
            answer:
              "It blocks every search containing that phrase, including long-tail variants that were converting. The block is invisible afterwards, because those searches simply stop appearing.",
          },
          {
            question: "How would you set up search term management for an account with 200 campaigns?",
            answer:
              "Numeric rules applied to a bulk export rather than a per-campaign review: a harvest threshold and a negation threshold in orders and clicks, filtered in a sheet or through the Ads API, producing an upload rather than manual edits. The rules stay constant; only the thresholds change per product economics.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
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
          "Seven days of STR, two filters, one logged action. Five minutes a day from now until the end — this habit IS enterprise account management.",
        learningObjectives: [
          "Download last 7 days' STR; filter ≥12 clicks / 0 conversions → negate exact",
          "Filter ≥3 orders at target ACoS in auto/broad/phrase → harvest to exact",
          "Log the exact numeric rule applied, daily, without exception",
        ],
        whyToday:
          "Yesterday was the framework. Today makes it a habit, and the habit is the deliverable — an account manager who does this daily beats one who does it brilliantly once a month, every time.",
        principle:
          "Five minutes daily beats two hours monthly, because the waste you catch on day three did not get to spend for another twenty-seven.",
        commonMistake:
          "Batching it. A monthly review finds the same waste a daily one would have — after a month of paying for it — and it takes longer because the report is thirty times the size.",
        challenge:
          "Do the five minutes today and log it: date, filter applied, terms harvested, terms negated. Then do it tomorrow. The artefact is the log, and a log with one entry is not one.",
        challengeMinutes: 15,
        estMinutes: 30,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "The two filters",
            detail:
              "Clicks ≥ 12 with zero orders, and orders ≥ 3 at or below target ACoS. Two sorts on one export; everything else is next week's problem.",
          },
          {
            title: "Seven days, not thirty",
            detail:
              "A rolling week is recent enough to act on and long enough to have signal. Thirty days mixes a change you made last Tuesday with the behaviour before it.",
          },
          {
            title: "The log",
            detail:
              "Date, rule, term, action. It is what lets you answer 'why is this term negative' in three months, and what an agency asks for in an interview.",
          },
          {
            title: "Why it is the job",
            detail:
              "Structure and strategy are set a few times a year. This is what account management is on the other three hundred days.",
          },
        ],
        checks: [
          {
            question: "Why a rolling seven days rather than thirty?",
            answer:
              "Recent enough that the data reflects the account as it is now, long enough to carry signal. Thirty days blends periods before and after your own changes.",
          },
          {
            question: "What does the log need to contain?",
            answer:
              "Date, the rule applied, the term, and the action. Enough to reconstruct why a negative exists months later.",
          },
          {
            question: "Why is daily better than monthly for the same total effort?",
            answer:
              "Waste caught on day three stops spending on day three. The same finding a month later has funded twenty-seven more days of it.",
          },
        ],
        resources: [],
      },
    ],
  },

  {
    title: "Campaign architecture and portfolio structure",
    weekRange: "Week 3",
    objective: "Name and group campaigns so the reports mean something.",
    deliverable: "A naming convention applied to a real account, written down.",
    estHours: 2,
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
        whyToday:
          "Naming looks like housekeeping and is actually the reporting layer. Every filter, pivot and bulk edit for the rest of the account's life runs on these strings.",
        principle:
          "A campaign name is a query you will run a thousand times. Design it for the filter, not for the eye.",
        commonMistake:
          "Mixing price points in one ad group. A ₹300 and a ₹3,000 product share a bid and a break-even that cannot both be right, so one is starved and the other loses money — and the ad group's average hides both.",
        challenge:
          "Rename one real campaign set to the six-field convention. Then try three filters you would actually want — all Sponsored Display, all exact-match, all defensive — and confirm each is a single text match. If one is not, the convention is wrong.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The six fields",
            detail:
              "Marketplace, brand, product, ad type, targeting, strategy. Each exists because you will one day want to filter on it, and a field you cannot filter on is decoration.",
          },
          {
            title: "Order matters",
            detail:
              "Fields sort left to right, so the leftmost is the coarsest grouping. Marketplace first keeps an India account from interleaving with a US one in every export.",
          },
          {
            title: "One margin per ad group",
            detail:
              "Bids are set at keyword level but budget and structure are managed at group level. Mixed margins mean no single target ACoS is correct for the group.",
          },
          {
            title: "One conversion profile",
            detail:
              "A product that converts at 12% and one that converts at 3% need different bids for the same term. Together, the good one subsidises the bad one invisibly.",
          },
          {
            title: "What sloppiness costs later",
            detail:
              "Bulk edits hit the wrong rows, harvesting cannot tell which campaign a term came from, and every report needs a manual cleanup before anyone can read it.",
          },
        ],
        checks: [
          {
            question: "Why does field order in the convention matter?",
            answer:
              "Names sort left to right, so the leftmost field is the coarsest grouping in every export and filter.",
          },
          {
            question: "What goes wrong with two price points in one ad group?",
            answer:
              "They have different break-even ACoS, so no single target is correct. One is starved of budget and the other loses money, and the group's average conceals both.",
          },
          {
            question: "Name one thing that breaks downstream from bad naming.",
            answer:
              "Bulk edits — a filter that matches more or fewer campaigns than intended changes bids on the wrong ones, quietly.",
          },
        ],
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
        whyToday:
          "Four intents, four different definitions of success. Judged by one metric, three of them look like failures and get cut — usually the three that were working.",
        principle:
          "Every campaign has a job. Judge it against its job, and decide the job before you build it.",
        commonMistake:
          "One target ACoS across the account. Discovery should run above break-even because it is buying information; defensive should be judged as a monthly premium. A single target quietly kills both.",
        challenge:
          "Classify every campaign in one account into the four intents. Give each intent its own success metric and its own target. Any campaign you cannot classify is a campaign nobody decided to build.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Discovery",
            detail:
              "Auto and broad, deliberately above target ACoS, buying search terms. Its output is not orders but the harvest list, and it should be budgeted as research.",
          },
          {
            title: "Scaling",
            detail:
              "Manual exact on harvested terms. This is where efficiency is expected and where target ACoS actually applies.",
          },
          {
            title: "Defensive",
            detail:
              "Your own brand terms. Cheap, high converting, and mostly cannibalising organic — priced as insurance against a competitor appearing above you.",
          },
          {
            title: "Conquesting",
            detail:
              "Competitor ASINs and brand terms. Expensive, low converting, and worth it only where your listing genuinely beats theirs on something a shopper can see.",
          },
          {
            title: "The feed",
            detail:
              "Discovery produces terms; scaling consumes them. If nothing is moving between them, one of the two is not doing its job.",
          },
        ],
        checks: [
          {
            question: "Should a discovery campaign hit target ACoS?",
            answer:
              "No. It is buying search terms rather than efficient orders, and its output is the harvest list. Judging it on ACoS gets it cut.",
          },
          {
            question: "Why does a defensive branded campaign look so efficient?",
            answer:
              "Because most of those clicks would have found you organically. The ACoS is flattering and the incremental value is much smaller — which is module 10's subject.",
          },
          {
            question: "When is conquesting worth the cost?",
            answer:
              "When your listing beats the target's on something visible at a comparable price — better rating, more reviews, a real feature difference.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon Ads Academy",
            url: "https://advertising.amazon.com/academy",
            sourceName: "Amazon Ads",
            editorNote:
              "The campaign-structure lessons. Read them after doing today's classification, not before — the exercise is more useful cold.",
          },
        ],
      },
    ],
  },

  {
    title: "Amazon DSP and programmatic",
    weekRange: "Week 4",
    objective: "Understand what DSP buys that Sponsored ads cannot.",
    deliverable: "A written case for or against DSP on one real account.",
    estHours: 2.5,
    nodes: [
      {
        title: "DSP inventory and creative formats",
        summary: "Display, online video, Streaming TV, and responsive e-commerce creatives.",
        learningObjectives: [
          "Where DSP inventory runs on and off Amazon",
          "STV/Prime Video placements and their real costs",
          "REC: creatives assembled from the listing itself",
        ],
        whyToday:
          "Everything so far has been demand capture. DSP is demand generation, which means a different buying model, a different measurement problem, and a minimum spend that makes the decision consequential.",
        principle:
          "Sponsored ads meet people who are already looking. DSP reaches people who are not — which is worth more and is much harder to prove.",
        commonMistake:
          "Judging DSP on last-click ACoS. Its job happens before the search that Sponsored Products then wins, so last-click attribution credits SP with work DSP did.",
        challenge:
          "For one real account, write half a page arguing for or against DSP. Include the minimum spend, what it would reach that SP cannot, and how you would know whether it worked. If the last part is hard, that is the honest finding.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Where it runs",
            detail:
              "Amazon-owned sites and apps, plus third-party exchanges. The off-Amazon inventory is the reach argument and the measurement problem in the same sentence.",
          },
          {
            title: "Streaming TV",
            detail:
              "Prime Video and Fire TV placements. Genuine broadcast-style reach at a CPM that reflects it, and effectively unmeasurable by clicks.",
          },
          {
            title: "Responsive e-commerce creatives",
            detail:
              "Assembled automatically from the listing — image, price, Prime badge, rating. No design work, and they usually outperform something bespoke.",
          },
          {
            title: "The buying model",
            detail:
              "CPM, not CPC. You are buying impressions rather than clicks, which is why a click-based metric misreads it from the start.",
          },
          {
            title: "Minimum spend",
            detail:
              "Managed service carries a floor that puts DSP out of reach for small accounts. The self-service console has lowered it, and it is still a real threshold.",
          },
        ],
        checks: [
          {
            question: "Why does last-click ACoS misread DSP?",
            answer:
              "DSP typically acts before the search that Sponsored Products then converts. Last-click gives SP the credit for a decision DSP influenced.",
          },
          {
            question: "What are responsive e-commerce creatives assembled from?",
            answer:
              "The listing itself — image, price, Prime badge and rating — with no design work required.",
          },
          {
            question: "What is the buying unit, and why does it matter?",
            answer:
              "CPM. You buy impressions, so a cost-per-click framing is the wrong instrument before you start.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon DSP",
            url: "https://advertising.amazon.com/solutions/products/amazon-dsp",
            sourceName: "Amazon Ads",
            editorNote:
              "Inventory, formats and the self-service versus managed distinction. Marketing copy, but accurate on the mechanics.",
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
        whyToday:
          "View-through attribution is where most DSP reporting stops being trustworthy, and it does so quietly. Understanding it today is what makes module 10's incrementality work make sense rather than seem paranoid.",
        principle:
          "A view-through conversion says an ad was served and a purchase followed. It does not say the ad caused it, and the gap between those is the whole of module 10.",
        commonMistake:
          "Adding view-through conversions to click-through and reporting the total as results. Some of those people would have bought anyway; served enough impressions, any campaign can claim credit for a brand's organic demand.",
        challenge:
          "Take any DSP report and split conversions into click-through and view-through. Compute the campaign's return twice — clicks only, then both. The distance between those numbers is the size of the question module 10 answers.",
        challengeMinutes: 35,
        estMinutes: 75,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "In-market and lifestyle",
            detail:
              "Amazon's own signals — people shopping this category now, or whose behaviour fits a lifestyle segment. The reach play, and the least precise.",
          },
          {
            title: "Views remarketing",
            detail:
              "People who viewed your detail page. Higher intent, smaller audience, and the same dependency on the page having had traffic as Sponsored Display.",
          },
          {
            title: "Purchaser retargeting",
            detail:
              "Past buyers, for replenishment and genuine cross-sell. Aimed at a durable good it advertises something the person owns.",
          },
          {
            title: "The 14-day window",
            detail:
              "Conversions are attributed within fourteen days of the ad event. Long enough to capture considered purchases, long enough to capture coincidences.",
          },
          {
            title: "View-through attribution",
            detail:
              "Credits a conversion when an impression was served and no click occurred. It is the largest single source of overstated DSP performance.",
          },
        ],
        checks: [
          {
            question: "What does a view-through conversion establish?",
            answer:
              "That an impression was served and a purchase followed within the window. Not that the impression caused it.",
          },
          {
            question: "Why is the 14-day window a double-edged setting?",
            answer:
              "It is long enough to capture a considered purchase and long enough to capture purchases that would have happened regardless.",
          },
          {
            question: "Which audience type needs existing detail-page traffic?",
            answer:
              "Views remarketing. Without viewers there is no audience to reach.",
          },
        ],
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
    title: "Amazon Marketing Cloud and clean-room SQL",
    weekRange: "Week 4",
    objective: "Query event-level ad data without seeing a single user.",
    deliverable: "One path-to-purchase query, written and explained.",
    estHours: 2.5,
    nodes: [
      {
        title: "Clean-room architecture and privacy thresholds",
        summary: "Event-level logs without user identity, and the 50-user floor every query must clear.",
        learningObjectives: [
          "What a clean room is and is not",
          "The 50-user aggregation floor and how it shapes query design",
          "The core tables: sponsored_products_clicks, dsp_impressions, amazon_attributed_events_by_conversion_time",
        ],
        whyToday:
          "Every attribution question so far has had an unsatisfying answer because the data to answer it properly was not available. AMC is where it becomes available, under constraints that shape how you can ask.",
        principle:
          "The clean room gives you every event and no identity. Design the question around the aggregation floor, or the answer comes back empty and you learn nothing about why.",
        commonMistake:
          "Writing a query that segments until each group has a handful of users. It returns nothing — not an error, nothing — because the result fell below the privacy threshold, and it looks exactly like having no data.",
        challenge:
          "Write, on paper, one question you cannot answer with standard reports. Then work out which tables it needs and whether the smallest group in the answer would clear fifty users. Most first attempts do not.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What a clean room is",
            detail:
              "A query environment holding event-level records with identity removed. You can join and aggregate; you cannot retrieve a person.",
          },
          {
            title: "The 50-user floor",
            detail:
              "Any output row representing fewer than about fifty distinct users is suppressed. Suppression is silent, so an empty result is ambiguous between no data and too little.",
          },
          {
            title: "The tables you will use",
            detail:
              "sponsored_products_clicks, dsp_impressions and amazon_attributed_events_by_conversion_time. Almost every useful query is a join across those three.",
          },
          {
            title: "Conversion time versus traffic time",
            detail:
              "Attributed-events tables come in both. By conversion time answers 'what drove sales this week'; by traffic time answers 'what did last week's spend produce'. Choosing the wrong one silently shifts every number.",
          },
        ],
        checks: [
          {
            question: "What happens to a query result below the user threshold?",
            answer:
              "It is suppressed silently. You get nothing back, and nothing looks the same as having no matching data.",
          },
          {
            question: "What can a clean room not do?",
            answer:
              "Return or identify an individual. It is built for aggregate joins over event data, with identity removed.",
          },
          {
            question: "Why does conversion time versus traffic time matter?",
            answer:
              "They answer different questions — what drove sales in a period, versus what a period's spend produced. Picking the wrong one changes every number without any error.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon Marketing Cloud",
            url: "https://advertising.amazon.com/solutions/products/amazon-marketing-cloud",
            sourceName: "Amazon Ads",
            editorNote:
              "The architecture and the privacy model. Read the aggregation-threshold section twice — it is the constraint every query is designed around.",
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
        whyToday:
          "This is the query that answers the question day 18 raised: does DSP do anything Sponsored Products was not already going to do. It is also the most portable thing in this roadmap — the SQL is ordinary, the tables are not.",
        principle:
          "A purchaser who saw both is not evidence that both were needed. The query tells you the paths exist; only an experiment tells you which mattered.",
        commonMistake:
          "Reading a higher conversion rate among people who saw both channels as proof that the combination works. People who see more ads are people who shop the category more — the correlation is real and the causal claim is not.",
        challenge:
          "Write the query: LEFT JOIN clicks and impressions to conversions, CASE the path into DSP-only, SP-only and both, then COUNT(DISTINCT user) and sum attributed sales per path. Then write one sentence about what it does NOT prove.",
        challengeMinutes: 60,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The shape of the query",
            detail:
              "Conversions on the left, ad events LEFT JOINed on user, a CASE classifying which channels appear, then aggregate. Ordinary SQL — the difficulty is the data model, not the syntax.",
          },
          {
            title: "COUNT(DISTINCT user)",
            detail:
              "Rows are events, so counting them counts impressions. Almost every question here is about people, which means distinct users nearly every time.",
          },
          {
            title: "Path classification",
            detail:
              "A CASE over which joins matched: DSP only, SP only, both, neither. 'Neither' is organic and is often the most interesting row.",
          },
          {
            title: "What it cannot tell you",
            detail:
              "Whether the combination caused anything. Heavier category shoppers see more ads and buy more; the path data shows that pattern and cannot separate it from an effect.",
          },
        ],
        checks: [
          {
            question: "Why COUNT(DISTINCT user) rather than COUNT(*)?",
            answer:
              "Rows are events. Counting rows counts impressions and clicks; the questions are almost always about how many people.",
          },
          {
            question: "What does the 'neither' path represent?",
            answer:
              "Purchasers who saw no ads — organic demand. Often the largest group and the baseline everything else should be compared against.",
          },
          {
            question: "Why is a higher conversion rate on the 'both' path weak evidence?",
            answer:
              "People who see more ads are more active in the category. The correlation exists without the combination causing anything.",
          },
        ],
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
    title: "Bulk operations and the Ads API",
    weekRange: "Week 4",
    objective: "Change a thousand things at once, and stop doing it by hand.",
    deliverable: "A validated bulk upload, and an authenticated API call that returns a report.",
    estHours: 3,
    nodes: [
      {
        title: "Bulk sheets",
        summary: "The 60-day bulk file: mass bid updates, status toggles and negative injections in one upload.",
        learningObjectives: [
          "Downloading and reading the bulk file's sheet structure",
          "Safe mass edits: bids, ENABLED/PAUSED, negatives",
          "Validating before upload — one bad row fails quietly",
        ],
        whyToday:
          "The daily rep from day 15 does not scale past a handful of campaigns by hand. Bulk sheets are how the same rules get applied to a thousand rows in one action.",
        principle:
          "A bulk upload is a migration. Take a copy first, change one class of thing at a time, and read the result file — because the failures are in the result file and nowhere else.",
        commonMistake:
          "Uploading and assuming it worked. Amazon returns a result file marking rows that failed, and it is easy to miss — so half the bids change, half do not, and the account is in a state nobody designed.",
        challenge:
          "Download a bulk file, change bids on ten keywords, upload it, then open the result file and confirm ten rows succeeded. Finding where the result file lives is most of today's lesson.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "What the file contains",
            detail:
              "Up to 60 days of campaigns, ad groups, keywords, product targets and negatives, one row per entity, with an Operation column that drives the change.",
          },
          {
            title: "The Operation column",
            detail:
              "Create, update or archive. Leave it blank and the row is ignored, which is how a carefully edited sheet can change nothing at all.",
          },
          {
            title: "One class of change per upload",
            detail:
              "Bids in one file, negatives in another. When something goes wrong you want to know what it was, and a mixed upload makes that a search.",
          },
          {
            title: "The result file",
            detail:
              "Returned after processing, with a status per row. Partial failure is normal and silent — the result file is the only place it is visible.",
          },
        ],
        checks: [
          {
            question: "What does the Operation column do?",
            answer:
              "Tells Amazon whether to create, update or archive that row. Blank means the row is ignored entirely.",
          },
          {
            question: "How do you find out that half your upload failed?",
            answer:
              "The result file, which carries a per-row status. Nothing else reports it.",
          },
          {
            question: "Why upload one class of change at a time?",
            answer:
              "So a failure is attributable. A mixed file that partly failed leaves you diagnosing which of several changes went wrong.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon Ads Academy",
            url: "https://advertising.amazon.com/academy",
            sourceName: "Amazon Ads",
            editorNote:
              "The bulk-operations lessons. Do them with a real file open — the sheet structure does not survive being read about.",
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
        whyToday:
          "This is the day the roadmap stops being about the console. Every agency that manages accounts at scale runs on this, and it is the skill that separates an account manager from someone an agency builds a team around.",
        principle:
          "Reports are asynchronous. You request, you poll, you download — and a script that expects data in the response is a script that works once by luck.",
        commonMistake:
          "Treating the report endpoint as synchronous. The request returns an ID, not a report. Code that reads the response body gets a status and reports zero rows for weeks before anyone notices.",
        challenge:
          "Get an access token through Login with Amazon, request one campaign report, poll until it is ready, and download it. Load it into pandas and print the row count. The number matters less than the fact you got it without opening the console.",
        challengeMinutes: 90,
        estMinutes: 120,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The token dance",
            detail:
              "Login with Amazon issues a refresh token once; you exchange it for a short-lived access token on every run. The refresh token is the credential to protect — treat it the way day 12 of the Git roadmap treats a key.",
          },
          {
            title: "Profiles",
            detail:
              "Every request needs a profile ID identifying the marketplace and account. Getting it wrong returns an empty report rather than an error, which is the same failure shape as everything else here.",
          },
          {
            title: "Asynchronous reports",
            detail:
              "POST a report request, receive an ID, poll status until SUCCESS, then download from the URL returned. Three calls, and the middle one is a loop with a backoff.",
          },
          {
            title: "Into a warehouse",
            detail:
              "pandas reads the download, and a scheduled job appends to Postgres. At that point every question in this roadmap becomes a query instead of an export.",
          },
          {
            title: "Rate limits and retries",
            detail:
              "The API throttles. Anything scheduled needs exponential backoff, or the daily job fails on the one busy morning it mattered.",
          },
        ],
        checks: [
          {
            question: "What does the report request endpoint return?",
            answer:
              "A report ID, not the report. You poll for status and download when it succeeds.",
          },
          {
            question: "Which token do you protect, and why?",
            answer:
              "The refresh token. Access tokens expire in about an hour; the refresh token mints new ones indefinitely.",
          },
          {
            question: "What happens with a wrong profile ID?",
            answer:
              "An empty report rather than an error — the same silent-failure shape as most of this API.",
          },
          {
            question: "How would you build a daily reporting pipeline that does not need watching?",
            answer:
              "Refresh the token per run, request per profile, poll with exponential backoff, download, load into a warehouse table keyed so a re-run is idempotent, and alert on zero rows as well as on errors — because zero rows is what a wrong profile or a throttled poll actually produces.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Amazon Ads API documentation",
            url: "https://advertising.amazon.com/API/docs/en-us",
            sourceName: "Amazon Ads",
            editorNote:
              "Start at Getting Started, then the reporting guides. The reference is enormous; you need two sections of it.",
          },
          {
            type: "doc",
            title: "Reporting v3 overview",
            url: "https://advertising.amazon.com/API/docs/en-us/guides/reporting/v3/overview",
            sourceName: "Amazon Ads",
            editorNote:
              "The asynchronous request-poll-download flow, precisely. This is the page today's challenge is built on.",
          },
          {
            type: "doc",
            title: "Login with Amazon documentation",
            url: "https://developer.amazon.com/docs/login-with-amazon/documentation-overview.html",
            sourceName: "Amazon Developer",
            editorNote:
              "For the OAuth half. You need the authorisation-code grant and the refresh-token exchange; skip the rest.",
          },
          {
            type: "doc",
            title: "Requests — HTTP for humans",
            url: "https://requests.readthedocs.io/",
            sourceName: "Requests documentation",
            editorNote:
              "The Python library the challenge uses. Read the Quickstart only.",
          },
        ],
      },
    ],
  },

  {
    title: "Incrementality and true lift",
    weekRange: "Week 5",
    objective: "Find out what the advertising actually caused.",
    deliverable: "A designed geo experiment, with its uncertainty stated.",
    estHours: 2.5,
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
        whyToday:
          "Every metric in this roadmap so far has measured attributed sales. This module asks a harder question — how many of those sales would have happened anyway — and the answer reorders the account.",
        principle:
          "Attributed is not incremental. The gap between them is largest exactly where the reported performance looks best.",
        commonMistake:
          "Scaling the campaign with the best RoAS. Branded search reports beautifully because it captures people who were already coming; scaling it buys more of the traffic you already had.",
        challenge:
          "Rank your campaign types from most to least incremental and write one sentence of reasoning for each. Then look at which has the best RoAS. If the two orderings are roughly inverted, you have understood today.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Cannibalization",
            detail:
              "A branded ad click from someone who would have scrolled to your organic listing. The sale happens either way; the ad spend does not.",
          },
          {
            title: "iROAS",
            detail:
              "Incremental sales divided by spend. It needs a counterfactual — what would have happened without the ads — which is why it needs an experiment rather than a report.",
          },
          {
            title: "The usual ordering",
            detail:
              "Conquesting and non-branded discovery are typically most incremental; branded defence least. The reported RoAS ordering tends to be the reverse.",
          },
          {
            title: "Why this is not an argument against branded ads",
            answer: null,
            detail:
              "Defence has a real job — keeping a competitor out of your own search result. The error is judging it on RoAS and then scaling it as though the return were incremental.",
          },
        ],
        checks: [
          {
            question: "What is cannibalization in this context?",
            answer:
              "Paying for a click from a shopper who would have reached your listing organically. The sale is not incremental; the cost is.",
          },
          {
            question: "Why can iROAS not be read off a report?",
            answer:
              "It needs a counterfactual — sales without the advertising — which no report contains. It requires an experiment.",
          },
          {
            question: "Which campaigns are usually least incremental?",
            answer:
              "Branded defensive campaigns, which are typically the ones with the best reported RoAS.",
          },
          {
            question: "A client wants to double spend on their best-RoAS campaign. What do you say?",
            answer:
              "Ask what that campaign is. If it is branded search, the high RoAS reflects capture of existing demand, and doubling it mostly buys traffic that was already arriving. Propose a holdout — pause it in one region for two weeks and compare total category sales — before moving the budget.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
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
        whyToday:
          "Yesterday established that attributed and incremental differ. Today measures the difference, which requires deliberately not advertising somewhere — the one experiment nobody wants to run and the only one that answers the question.",
        principle:
          "The only way to know what advertising caused is to stop it somewhere comparable and watch. Everything else is a model of that experiment.",
        commonMistake:
          "Running the blackout for a week and reading the difference as the effect. Weekly noise in regional sales is usually larger than the effect being measured, so a short test returns a confident number that means nothing.",
        challenge:
          "Design the experiment on paper: two regions and why they match, the blackout length, the metric, and the size of difference you could actually detect given normal variation. If you cannot state the last one, the test cannot conclude anything.",
        challengeMinutes: 45,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Matching regions",
            detail:
              "Similar baseline sales, similar seasonality, similar competitive presence. Compare their histories before the test — regions that already diverge will diverge during it.",
          },
          {
            title: "Contamination",
            detail:
              "National promotions, a competitor's regional launch, a delivery-speed difference. Anything affecting one region and not the other is confounded with the effect.",
          },
          {
            title: "Three weeks, not one",
            detail:
              "Long enough for weekly noise to average out and for the organic effect to appear. Ad effects on rank are not instantaneous in either direction.",
          },
          {
            title: "Stating the uncertainty",
            detail:
              "An effect estimate without an interval is not a result. If the interval crosses zero, the honest finding is that the test could not detect an effect this size.",
          },
          {
            title: "Powering the test",
            detail:
              "Work out beforehand the smallest effect the test could detect. A test that cannot detect the effect you expect is three weeks of lost revenue for nothing.",
          },
        ],
        checks: [
          {
            question: "Why three weeks rather than one?",
            answer:
              "Weekly variation in regional sales usually exceeds the effect. Three weeks lets the noise average and lets rank effects appear.",
          },
          {
            question: "What is contamination?",
            answer:
              "Anything affecting one region and not the other during the test — a promotion, a competitor's launch, a logistics difference — which is then confounded with the ads.",
          },
          {
            question: "What makes an effect estimate reportable?",
            answer:
              "An interval alongside it. An estimate whose interval crosses zero means the test could not detect an effect of that size, which is a finding rather than a failure.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "statsmodels",
            url: "https://www.statsmodels.org/stable/index.html",
            sourceName: "statsmodels documentation",
            editorNote:
              "For the analysis. You need means, differences and confidence intervals — the introduction covers it.",
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
    title: "Certifications and the account audit",
    weekRange: "Week 5",
    objective: "Close the free certifications and produce the portfolio piece.",
    deliverable: "Four certifications, and an audit deck on a real account.",
    estHours: 4,
    nodes: [
      {
        title: "The four certifications",
        summary: "Sponsored Ads, DSP, AMC, Retail — free, official, and screened for in agency hiring.",
        learningObjectives: [
          "Sponsored Ads and Retail certifications: close them out",
          "DSP and AMC certifications: the differentiators",
          "Adding verifiable credentials to your profile the honest way",
        ],
        whyToday:
          "You have been told since day 5 to work through the Academy alongside this roadmap. Today closes it, and the four certificates are the one credential in this field that costs nothing and is checked.",
        principle:
          "A certificate proves you passed an exam. It is worth listing and it is not worth claiming more for — the audit deck tomorrow is the thing that shows you can do the work.",
        commonMistake:
          "Listing a certification as though it were experience. Agencies screen for these and then ask what you have actually run; a certificate that arrives without an account story reads as a course completed rather than a job done.",
        challenge:
          "Sit the exams you have not yet passed. Then write one line per certification saying what you can now do that you could not before — if any line is hard to write, that is the module to revisit.",
        challengeMinutes: 90,
        estMinutes: 120,
        points: 40,
        difficulty: "core",
        topics: [
          {
            title: "Sponsored Ads",
            detail:
              "The foundation, covering everything in modules 2 through 6. Most candidates have it, so its absence is noticed and its presence is not.",
          },
          {
            title: "Retail",
            detail:
              "The listing and readiness side — module 1. Less commonly held, and it pairs with the audit deck you build tomorrow.",
          },
          {
            title: "DSP",
            detail:
              "Programmatic. A genuine differentiator, because most sellers never touch DSP and most agency roles above entry level expect it.",
          },
          {
            title: "AMC",
            detail:
              "The clean room. The rarest of the four and the one that separates an analyst from an operator.",
          },
          {
            title: "What they are worth",
            detail:
              "Free, retakeable, and screened for. That is the whole claim — a certificate gets a CV read, and the deck gets the interview.",
          },
        ],
        checks: [
          {
            question: "Which two certifications are the differentiators, and why?",
            answer:
              "DSP and AMC. Most candidates hold Sponsored Ads; far fewer have touched programmatic or a clean room.",
          },
          {
            question: "What does a certification not demonstrate?",
            answer:
              "That you have run an account. It shows you passed an exam, which is why the audit deck exists alongside it.",
          },
          {
            question: "What do the exams cost?",
            answer:
              "Nothing. They are free through the Amazon Ads learning console and can be retaken.",
          },
        ],
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
            editorNote:
              "Where the exams actually sit. Sign in with the same account as the Academy or your progress will not carry.",
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
        whyToday:
          "Last day. Everything before this produced a fragment — an audit table, a break-even sheet, a harvest log, a query, an experiment design. Today assembles them into the one artefact somebody hiring you will actually read.",
        principle:
          "An audit is a recommendation with the evidence attached. Findings with no number are opinions, and numbers with no recommendation are a report nobody acts on.",
        commonMistake:
          "Listing everything wrong with the account. Twenty findings with equal weight is a document that gets skimmed; three findings with rupee figures and a sequence is one that gets acted on.",
        challenge:
          "Build the four-section deck on a real account, reusing the artefacts from days 4, 9, 15 and 25. Every finding carries a number and a recommendation, and the top of the deck names the three that matter most. That deck is the portfolio piece.",
        challengeMinutes: 120,
        estMinutes: 120,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Section one — readiness",
            detail:
              "Day 4's checklist against the current listings, with Buy Box percentage and Unit Session Percentage. Anything failing here outranks every campaign finding.",
          },
          {
            title: "Section two — waste",
            detail:
              "Zero-conversion spend over 60 days, terms above break-even, and the TACoS trend. This is the section that pays for the engagement, so it goes second.",
          },
          {
            title: "Section three — structure",
            detail:
              "Naming, match-type isolation, mixed margins in ad groups, missing negatives. Findings here explain why the waste in section two exists.",
          },
          {
            title: "Section four — the roadmap",
            detail:
              "What to do, in order, with expected effect and how it will be measured. Include one AMC question worth answering — it is what distinguishes this deck from a checklist.",
          },
          {
            title: "The three at the top",
            detail:
              "Rank the findings and put the top three on the first slide with their rupee value. Everything else is appendix, and treating it as such is the skill.",
          },
        ],
        checks: [
          {
            question: "Why does readiness come before campaign findings?",
            answer:
              "A conversion or Buy Box problem makes every campaign recommendation moot. Fixing bids on a listing that cannot convert is optimising the wrong layer.",
          },
          {
            question: "What makes a finding actionable?",
            answer:
              "A number and a recommendation. Without the number it is an opinion; without the recommendation it is a report.",
          },
          {
            question: "Why rank the findings rather than list them?",
            answer:
              "Twenty equal findings get skimmed. Three with rupee values and a sequence get acted on, and the ranking is itself the judgement being demonstrated.",
          },
          {
            question: "Walk me through how you would audit an account you have never seen.",
            answer:
              "Retail readiness first — Buy Box, conversion, stock — because nothing downstream matters if those fail. Then waste: zero-conversion spend and terms above break-even, quantified in currency. Then structure, which explains the waste. Then a sequenced plan with expected effect and a measurement method. Present the top three findings with their value; everything else is appendix.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [],
      },
    ],
  },
];
