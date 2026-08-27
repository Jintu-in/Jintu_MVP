/**
 * Thinking under uncertainty — modules 4–5, days 15–24.
 *
 * Reading data honestly, then forecasting in public and scoring yourself.
 * Titles, summaries, objectives and links are the original spec's.
 */
export default [
  {
    title: "Quantitative data literacy & calling bullshit",
    weekRange: "Week 4",
    objective:
      "Read charts, metrics and studies the way a hostile reviewer would: Goodhart, survivorship, Simpson's, truncated axes, confounders.",
    deliverable:
      "A 500-word audit of one widely-shared chart-backed claim: selection biases, missing base rates, axis games, and the alternative explanations it ignored.",
    estHours: 5.5,
    nodes: [
      {
        title: "Goodhart's law and metric gaming",
        summary:
          "When a measure becomes a target, it stops measuring — in orgs, policy and your own dashboards.",
        learningObjectives: [
          "Goodhart's and Campbell's laws with live examples",
          "Spotting the gamed metric behind a proud number",
          "Designing metrics that resist their own success",
        ],
        whyToday:
          "Day 1 said a metric is a map. This is what happens once people know you are steering by it — the map is edited to look like the territory you wanted.",
        principle:
          "When a measure becomes a target, it ceases to be a good measure. Not because people cheat, but because they optimise, and optimising a proxy diverges from the thing.",
        commonMistake:
          "Treating gaming as a discipline problem. It is a design problem — a metric that can be hit without achieving the goal will be, by competent people acting reasonably.",
        challenge:
          "Take one metric your team reports. Write down three ways to move it substantially without improving the underlying thing. Then check how many are already happening.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The mechanism",
            detail:
              "A metric correlates with the goal in the world where nobody is aiming at it. Aiming at it breaks the correlation, because the cheapest route to the number is rarely the route to the goal.",
          },
          {
            title: "Campbell's law",
            detail:
              "The same finding from social science, stated more sharply: the more a quantitative indicator is used for decisions, the more it distorts what it monitors.",
          },
          {
            title: "It is not cheating",
            detail:
              "Most gaming is people responding sensibly to what they are measured on. Blaming individuals leaves the design untouched and the behaviour intact.",
          },
          {
            title: "Metrics that resist",
            detail:
              "Pair a volume metric with a quality one, rotate what is measured, and keep some measures unincentivised. None of this is a full defence.",
          },
        ],
        checks: [
          {
            question: "Why does a metric stop working once it becomes a target?",
            answer:
              "The cheapest way to move the number is usually not the way to achieve the goal, so optimising the proxy diverges from the thing it proxied.",
          },
          {
            question: "Is gaming primarily a discipline problem?",
            answer:
              "No — a design problem. Competent people acting reasonably will hit a metric by the cheapest available route.",
          },
          {
            question: "Name one structural defence.",
            answer:
              "Pairing a volume metric with a quality one, so the cheap route to the first degrades the second. Partial, not complete.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Goodhart's law",
            url: "https://en.wikipedia.org/wiki/Goodhart%27s_law",
            sourceName: "Wikipedia",
            editorNote:
              "Short. Read the generalisations section — Campbell's law is the more useful statement of the two.",
          },
          {
            type: "doc",
            title: "Calling Bullshit — the course",
            url: "https://callingbullshit.org/",
            sourceName: "University of Washington (Bergstrom & West)",
            editorNote:
              "The full free course this module anchors on; the syllabus page maps lecture videos to these nodes.",
          },
        ],
      },

      {
        title: "Selection and survivorship bias",
        summary:
          "The data you see was filtered before you saw it. Wald's bombers are the eternal example.",
        learningObjectives: [
          "Non-random sampling and where it hides",
          "Survivorship: the missing planes, funds, and founders",
          "Asking 'what data never made it into this dataset?' by default",
        ],
        whyToday:
          "Every technique so far assumes the data in front of you is a fair sample. It usually is not, and the filtering happened before anybody wrote the analysis.",
        principle:
          "Ask what never made it into the dataset. The absent cases are usually the informative ones, and they are absent for a reason connected to the question.",
        commonMistake:
          "Studying successes to find what causes success. Without the failures that did the same things, every shared trait is uninterpretable — and the resulting advice sells extremely well.",
        challenge:
          "Take one 'what successful X do' claim you have encountered. Write down what you would need to know about the unsuccessful X to evaluate it. Then check whether anybody collected that.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Wald's bombers",
            detail:
              "Returning aircraft showed damage patterns; the armour belonged where the returning ones were unhit, because planes hit there did not return. The data was filtered by survival.",
          },
          {
            title: "Where it hides",
            detail:
              "Fund performance tables that drop closed funds, customer surveys answered only by people still customers, and reviews written by the two tails of the distribution.",
          },
          {
            title: "The founder version",
            detail:
              "Traits common to successful founders are only evidence if uncommon among failed ones. Almost nobody checks the second half.",
          },
          {
            title: "The default question",
            detail:
              "'What would be missing from this dataset, and would its absence correlate with the outcome?' Ask it before reading the analysis.",
          },
        ],
        checks: [
          {
            question: "What made Wald's bombers a survivorship problem?",
            answer:
              "Only surviving aircraft were observed, so the undamaged regions on them were exactly the regions that were fatal when hit.",
          },
          {
            question: "Why is 'what successful people do' usually uninterpretable?",
            answer:
              "Without the failures, a trait shared by successes could be equally common among failures — and typically nobody collected that data.",
          },
          {
            question: "What is the default question to ask of any dataset?",
            answer:
              "What never made it in, and does its absence correlate with the outcome being studied?",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Survivorship bias",
            url: "https://en.wikipedia.org/wiki/Survivorship_bias",
            sourceName: "Wikipedia",
            editorNote:
              "The finance and military sections are the two clearest cases. Five minutes.",
          },
        ],
      },

      {
        title: "Simpson's paradox",
        summary:
          "Aggregate trends that reverse when disaggregated — the sharpest knife in the data-literacy drawer.",
        learningObjectives: [
          "How aggregation flips conclusions",
          "The Berkeley admissions case, worked",
          "When to trust the aggregate vs the subgroups",
        ],
        whyToday:
          "This is the one that survives everything else. A dataset can be complete, fairly sampled and honestly reported, and still support the opposite of the truth depending on how it is grouped.",
        principle:
          "The aggregate and the subgroups can disagree, and neither is automatically right. Which one answers your question depends on the causal structure, not the arithmetic.",
        commonMistake:
          "Assuming the disaggregated view is always the truer one. It is not — splitting on something caused by the treatment introduces a different error. The grouping has to be justified causally.",
        challenge:
          "Work the Berkeley admissions numbers by hand until you can state in one sentence why the aggregate showed bias and every department did not. If the sentence takes two, keep going.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "The reversal",
            detail:
              "A trend present in every subgroup can reverse when the groups are combined, if group sizes and base rates differ. Pure arithmetic, no error anywhere.",
          },
          {
            title: "Berkeley, 1973",
            detail:
              "Aggregate admission rates favoured men; almost every individual department favoured women. Women applied disproportionately to departments with low admission rates overall.",
          },
          {
            title: "Which view is right",
            detail:
              "Depends on the causal question. If the grouping variable is a confounder, disaggregate. If it sits on the causal path from the treatment, disaggregating creates the bias.",
          },
          {
            title: "Practical defence",
            detail:
              "Look at the subgroups before believing an aggregate, and justify any split you make before you make it.",
          },
        ],
        checks: [
          {
            question: "What produces the Berkeley reversal?",
            answer:
              "Women applied disproportionately to departments with low overall admission rates, so the aggregate reflected department choice rather than per-department treatment.",
          },
          {
            question: "Is the disaggregated view always truer?",
            answer:
              "No. Splitting on a variable that lies on the causal path from the treatment introduces bias rather than removing it.",
          },
          {
            question: "What decides which view answers your question?",
            answer:
              "The causal structure — whether the grouping variable is a confounder or a consequence. The arithmetic alone cannot tell you.",
          },
          {
            question:
              "A conversion rate improved in every customer segment last quarter but fell overall. Is the report wrong?",
            answer:
              "Not necessarily — this is Simpson's paradox. The segment mix shifted toward segments with structurally lower conversion, so a weighted total can fall while every component rises. Check whether segment shares changed, then decide which number answers the actual question: per-segment performance improved, and if the mix shift was caused by something you did, the aggregate is the one that matters.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Simpson's paradox",
            url: "https://en.wikipedia.org/wiki/Simpson%27s_paradox",
            sourceName: "Wikipedia",
            editorNote:
              "Work the Berkeley table yourself. Reading it is not the same as being able to reproduce the reversal.",
          },
        ],
      },

      {
        title: "Chart deception and confounders",
        summary:
          "Truncated axes, dual-axis games, cherry-picked windows — and the confounding variable behind every 'X causes Y' headline.",
        learningObjectives: [
          "The visual-deception checklist: axes, scales, intervals",
          "Correlation vs causation: spurious, reversed, confounded",
          "Drawing the confounder diagram before accepting a causal claim",
        ],
        whyToday:
          "The last three days were about what the data is. This is about how it is presented, which is where most public claims are actually won — the chart persuades before the numbers are read.",
        principle:
          "Read the axes before the shape. The shape is designed; the axes are where the design shows.",
        commonMistake:
          "Checking for causation and skipping reverse causation. When two things correlate, the arrow pointing the other way is usually as plausible as the one being claimed, and it is rarely addressed.",
        challenge:
          "Take one causal headline. Draw the diagram: the claimed arrow, the reversed arrow, and at least two variables that could cause both. Then read the study and see which it ruled out.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The axis checklist",
            detail:
              "Does the y-axis start at zero, and should it? Are intervals even? Is the time window chosen or given? Is a second axis scaled to manufacture a crossing?",
          },
          {
            title: "Four explanations for a correlation",
            detail:
              "X causes Y, Y causes X, something causes both, or chance. A causal claim has to argue against three, and usually argues against none.",
          },
          {
            title: "Confounders",
            detail:
              "A variable causing both sides. Drawing it explicitly, before evaluating the claim, is faster and more reliable than looking for one afterwards.",
          },
          {
            title: "Truncation is not always dishonest",
            detail:
              "Zeroing every axis hides real variation in some series. The question is whether the choice serves the reader or the argument.",
          },
        ],
        checks: [
          {
            question: "What are the four explanations for a correlation?",
            answer:
              "X causes Y, Y causes X, a third variable causes both, or coincidence. A causal claim must rule out the other three.",
          },
          {
            question: "Is a truncated y-axis always deceptive?",
            answer:
              "No. Zeroing an axis can hide real variation. The test is whether the choice serves the reader or the argument.",
          },
          {
            question: "Why draw the confounder diagram before reading the study?",
            answer:
              "It commits you to candidate explanations before the paper frames them, so you can check which were actually ruled out.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "Calling Bullshit — lecture videos",
            url: "https://callingbullshit.org/videos.html",
            sourceName: "University of Washington (Bergstrom & West)",
            editorNote:
              "The data-visualization and causality lectures are this node.",
          },
          {
            type: "video",
            title: "More or Less: Behind the Stats",
            url: "https://www.bbc.co.uk/programmes/b006qshd",
            sourceName: "BBC Radio 4 (Tim Harford)",
            editorNote:
              "Audio, small data cost. One episode per commute: watch Harford run this module's checklist on live public claims.",
          },
        ],
      },

      {
        title: "Assignment — the data BS audit",
        summary:
          "One widely-shared chart-backed claim, taken apart in 500 words: selection, base rates, axes, and the explanations it did not consider.",
        learningObjectives: [
          "Running the full checklist on a real artefact",
          "Steelmanning the claim before attacking it",
          "Writing critique a defender would concede is fair",
        ],
        whyToday:
          "Four days of individual failure modes, applied at once to something real. The constraint that makes it hard is fairness — the audit has to be one the claim's author would recognise as accurate.",
        principle:
          "State the strongest version of the claim first. A critique of a weak version is worthless to everybody including you.",
        commonMistake:
          "Auditing something you already disbelieved. The checklist finds problems in anything, so a claim you disliked going in produces a confident and uninformative result — pick one you were inclined to accept.",
        challenge:
          "500 words on one real chart-backed claim you were inclined to believe. Steelman it in the first paragraph, then run selection, base rates, axes, and the four explanations. End with what evidence would settle it.",
        challengeMinutes: 70,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Steelman first",
            detail:
              "One paragraph stating the claim at its strongest, which the author would sign. Everything after is judged against that version.",
          },
          {
            title: "Run the checklist in order",
            detail:
              "Selection, base rate, axes, then the four explanations. Order matters — a selection problem makes the rest moot.",
          },
          {
            title: "Pick something you believed",
            detail:
              "A claim you already rejected produces an audit that confirms you. The exercise only tests anything on one you accepted.",
          },
          {
            title: "End with the settling evidence",
            detail:
              "Name what would resolve it. An audit that only lists doubts is a mood, not an analysis.",
          },
        ],
        checks: [
          {
            question: "Why steelman before critiquing?",
            answer:
              "A critique of a weak version tells you nothing, and the claim's defenders will not concede it. The strong version is the only one worth testing.",
          },
          {
            question: "Why pick a claim you were inclined to believe?",
            answer:
              "The checklist finds problems in anything. Applied to something you already rejected, it confirms you and teaches nothing.",
          },
          {
            question: "What must the audit end with?",
            answer:
              "The evidence that would settle the question. Listing doubts without that is a mood rather than an analysis.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Calling Bullshit — syllabus",
            url: "https://callingbullshit.org/syllabus.html",
            sourceName: "University of Washington (Bergstrom & West)",
            editorNote:
              "The case-study sections model exactly this audit. Read one before writing yours.",
          },
        ],
      },
    ],
  },

  {
    title: "Superforecasting, calibration & the capstone",
    weekRange: "Week 5",
    objective:
      "Forecast like it is a skill: Fermi decomposition, outside-then-inside view, granular updates — and a Brier score that tells you the truth about yourself.",
    deliverable:
      "The personal calibration engine: 50 time-bound numeric predictions, an auto-updating Brier tracker, a calibration curve, and post-mortems on five resolved journal decisions.",
    estHours: 6.5,
    nodes: [
      {
        title: "The superforecaster toolkit",
        summary:
          "Tetlock's findings, operationalized: decompose, start outside, adjust inside, update in small steps.",
        learningObjectives: [
          "Fermi decomposition of vague questions into estimable parts",
          "Outside view (base rate) before inside view (case details)",
          "Granular, frequent updates over binary flips",
        ],
        whyToday:
          "Everything in the first four modules appears here as a step in a procedure that measurably outperformed intelligence analysts. This is the assembly.",
        principle:
          "The findings are about process, not talent. The forecasters who won were not smarter — they decomposed, started outside, and updated more often in smaller steps.",
        commonMistake:
          "Reading the toolkit as a personality description. It is a set of behaviours, and the study's result is that the behaviours are trainable — which is the only reason this roadmap exists.",
        challenge:
          "Take a vague question about your next quarter. Decompose it into three estimable parts, find a base rate for each, and produce a number. Write the number down where you will find it again.",
        challengeMinutes: 45,
        estMinutes: 75,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Decompose",
            detail:
              "Break the question into parts you can estimate separately. Errors in independent parts partly cancel; error in one global guess does not.",
          },
          {
            title: "Outside then inside",
            detail:
              "Base rate first, then adjust for what is specific. The order is the finding — doing it the other way anchors on the case.",
          },
          {
            title: "Small frequent updates",
            detail:
              "Winners updated more often and moved less each time. Both halves matter; frequent large moves scored badly.",
          },
          {
            title: "It is trainable",
            detail:
              "A short training module produced a measurable improvement in the tournament. That result is what makes the rest of this week worth doing.",
          },
        ],
        checks: [
          {
            question: "Why decompose before estimating?",
            answer:
              "Independent errors in the parts partly cancel, while a single global guess carries its full error.",
          },
          {
            question: "Why does outside-then-inside order matter?",
            answer:
              "Starting from the case anchors you on its specifics, and later base-rate adjustment is too small. Starting outside avoids the anchor.",
          },
          {
            question: "What characterised the winning updating behaviour?",
            answer:
              "More frequent updates, each smaller. Frequent large swings scored badly — both halves are needed.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Good Judgment",
            url: "https://goodjudgment.com/",
            sourceName: "Good Judgment Inc (Tetlock)",
            editorNote:
              "The commercial arm of the research project. The free public material is the part to read.",
          },
        ],
      },

      {
        title: "Fermi estimation",
        summary:
          "Order-of-magnitude answers to unanswerable-looking questions, from structured bounds.",
        learningObjectives: [
          "The decomposition pattern: population → fraction → rate",
          "Bounding above and below; geometric-mean point estimates",
          "Five drills: engineers in Singapore, and four of your own",
        ],
        whyToday:
          "Yesterday said decompose. This is the technique for doing it when you have no data at all, which is the normal condition for the questions that matter.",
        principle:
          "An order of magnitude beats no answer, and it is usually enough to make the decision. Precision you cannot justify is worse than a range you can.",
        commonMistake:
          "Refusing to estimate because you lack data. The alternative is not a better number — it is an implicit number, chosen by whoever speaks with most confidence.",
        challenge:
          "Do five. Engineers in Singapore, then four questions from your own field. For each: bound above, bound below, take the geometric mean, and write the decomposition so you can audit the error later.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The standard chain",
            detail:
              "Population, then the fraction that qualifies, then the rate per unit. Most quantity questions fit it with small modifications.",
          },
          {
            title: "Bound both sides",
            detail:
              "Name a number that is clearly too high and one clearly too low. Both are easier than the answer and they constrain it.",
          },
          {
            title: "Geometric mean",
            detail:
              "For bounds spanning orders of magnitude, the geometric mean is the sensible midpoint. The arithmetic mean sits far too near the upper bound.",
          },
          {
            title: "Errors cancel",
            detail:
              "Independent over- and under-estimates in a multi-step chain partly offset, which is why a five-step Fermi often lands within a factor of three.",
          },
        ],
        checks: [
          {
            question: "Why the geometric mean rather than the arithmetic one?",
            answer:
              "When bounds span orders of magnitude the arithmetic mean sits close to the upper bound. The geometric mean is the true midpoint on a log scale.",
          },
          {
            question: "Why does a multi-step estimate often beat a single guess?",
            answer:
              "Independent errors in the steps partly cancel, so the chain lands closer than any one confident guess.",
          },
          {
            question: "What is the cost of refusing to estimate?",
            answer:
              "The number gets chosen anyway — implicitly, by whoever is most confident. Refusing does not produce a better one.",
          },
          {
            question:
              "Estimate how many customer support agents a company with 200,000 monthly active users needs. You have no data.",
            answer:
              "Decompose: contact rate per user per month (1–5% is a common band, take 2% → 4,000 tickets), tickets an agent handles per day (15–25, take 20), working days per month (22) → 440 tickets per agent per month → about 9 agents. Then state the bounds: at 1% and 25/day it is 4, at 5% and 15/day it is 30. The range is the answer; the point estimate is where to start, and naming which assumption moves it most is the actual skill.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Fermi problem",
            url: "https://en.wikipedia.org/wiki/Fermi_problem",
            sourceName: "Wikipedia",
            editorNote:
              "The piano-tuners worked example is the template. Do it yourself before reading the solution.",
          },
        ],
      },

      {
        title: "Calibration and the Brier score",
        summary:
          "When you say 80%, you should be right 80% of the time — and there is a number that checks.",
        learningObjectives: [
          "Calibration vs resolution vs accuracy",
          "Brier score: mean squared error of probabilistic forecasts",
          "Reading a calibration curve for over/underconfidence",
        ],
        whyToday:
          "This is the day the roadmap becomes falsifiable about itself. Everything before it is a claim about better thinking; the Brier score is a measurement.",
        principle:
          "Calibration and resolution are different virtues. Saying 50% to everything is perfectly calibrated and completely useless.",
        commonMistake:
          "Optimising for calibration alone by hedging toward 50%. It scores respectably and carries no information — a good forecaster is calibrated and decisive, and the Brier score penalises hedging correctly.",
        challenge:
          "Take twenty past predictions where you know the outcome. Assign each the confidence you actually held, compute the Brier score, and plot stated confidence against hit rate in five buckets. Then say whether you are over- or underconfident.",
        challengeMinutes: 50,
        estMinutes: 75,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Calibration",
            detail:
              "Of everything you called 70%, about 70% should happen. It is a property of a set of forecasts, never of one.",
          },
          {
            title: "Resolution",
            detail:
              "How far your forecasts move away from the base rate. A forecaster who always says the base rate is calibrated and has no resolution.",
          },
          {
            title: "The Brier score",
            detail:
              "Mean squared error between stated probability and outcome coded 0 or 1. Lower is better; it decomposes into calibration and resolution terms.",
          },
          {
            title: "Reading the curve",
            detail:
              "Points below the diagonal mean overconfidence — you said 90% and hit 65%. Above means the opposite, which is much rarer.",
          },
        ],
        checks: [
          {
            question: "Why is perfect calibration not enough?",
            answer:
              "Saying the base rate every time is perfectly calibrated and carries no information. Resolution — moving away from the base rate correctly — is the other half.",
          },
          {
            question: "What is the Brier score?",
            answer:
              "The mean squared error between the stated probability and the outcome coded as 0 or 1. Lower is better.",
          },
          {
            question: "What does a calibration curve below the diagonal mean?",
            answer:
              "Overconfidence — your stated probabilities exceed your hit rates. It is the far more common direction.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Brier score",
            url: "https://en.wikipedia.org/wiki/Brier_score",
            sourceName: "Wikipedia",
            editorNote:
              "Read the decomposition section; the split into calibration, resolution and uncertainty is what makes the number diagnostic.",
          },
        ],
      },

      {
        title: "Forecasting practice, in public",
        summary: "Real questions, real resolution dates, real scores — the gym for everything above.",
        learningObjectives: [
          "Registering forecasts on live platforms",
          "Writing the rationale at forecast time, not resolution time",
          "Updating on news without over-trading your beliefs",
        ],
        whyToday:
          "Private forecasts are unfalsifiable in practice, because memory edits them. A public platform with a resolution date removes that option, and it is the only place in this roadmap where something else marks your work.",
        principle:
          "A forecast without a resolution date and a written rationale is an opinion. The date and the rationale are what make it scoreable.",
        commonMistake:
          "Over-trading. Every news item feels like it demands a move, and most contain almost no information about the question. Frequent updates should still be small ones.",
        challenge:
          "Register and enter five real forecasts with written rationales. Then set a weekly slot to review them. The capstone's fifty predictions can live here.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Stay on one platform",
            detail:
              "Spreading forecasts across several fragments your track record and halves the feedback. One scored history is worth more than three partial ones.",
          },
          {
            title: "Rationale at forecast time",
            detail:
              "Written before you know. At resolution you will remember reasoning you did not do, and the record is the only defence.",
          },
          {
            title: "News is mostly noise",
            detail:
              "Most coverage restates what is already priced in. Ask what the item changes about the probability before touching the slider.",
          },
          {
            title: "Weekly cadence",
            detail:
              "Frequent enough to update on real changes, infrequent enough to resist reacting to headlines.",
          },
        ],
        checks: [
          {
            question: "What turns an opinion into a forecast?",
            answer: "A resolution date and a rationale written before the outcome is known.",
          },
          {
            question: "What is over-trading?",
            answer:
              "Moving a forecast on every news item. Most coverage restates what is already accounted for and should change the number very little.",
          },
          {
            question: "Why keep one track record rather than several?",
            answer:
              "A fragmented record halves the feedback, and the feedback is the point of forecasting in public.",
          },
        ],
        resources: [
          {
            type: "tool",
            title: "Good Judgment Open",
            url: "https://www.gjopen.com/",
            sourceName: "Good Judgment Inc",
            editorNote:
              "Free, scored, and it marks your work — the only resource in this roadmap that does. Register today and forecast weekly; the capstone's 50 predictions can live here.",
          },
        ],
      },

      {
        title: "Capstone — the personal calibration engine",
        summary:
          "Fifty explicit predictions with confidence levels, an auto-updating Brier tracker, the calibration curve, and five decision post-mortems from your journal.",
        learningObjectives: [
          "50 time-bound, verifiable predictions at explicit confidence levels",
          "A spreadsheet or script recomputing your aggregate Brier score as outcomes resolve",
          "The confidence-vs-accuracy curve, and what it says about you",
          "Five post-mortems judging process, base-rate use, and outcome decoupling",
        ],
        whyToday:
          "The roadmap ends with an instrument rather than an essay, because the skill it teaches decays without measurement. What you build today keeps working after the last day.",
        principle: "Build the thing that keeps scoring you. A course ends; a ledger does not.",
        commonMistake:
          "Writing fifty predictions that are safe. A set where you are right forty-eight times produces a flat curve and no information — you need spread across confidence levels, including calls you might lose.",
        challenge:
          "Fifty time-bound verifiable predictions with explicit confidence levels, spread across the range. A tracker that recomputes the Brier score as outcomes land. The curve. And five post-mortems from your journal judging process rather than result.",
        challengeMinutes: 90,
        estMinutes: 120,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Fifty, spread",
            detail:
              "Across confidence levels from 55 to 95, and across time horizons. A set clustered at 90% cannot show you anything about the rest of the curve.",
          },
          {
            title: "Verifiable and time-bound",
            detail:
              "Each needs a date and an unambiguous resolution criterion. 'Things will improve' is not scoreable and will be quietly dropped.",
          },
          {
            title: "The tracker",
            detail:
              "A spreadsheet is enough. Stated probability, outcome, squared error, running mean — four columns and it recomputes itself.",
          },
          {
            title: "Five post-mortems",
            detail:
              "From the day-10 journal. Judge the process, the base-rate use, and whether you decoupled the decision from the outcome.",
          },
          {
            title: "It continues",
            detail:
              "The value arrives over the following year as outcomes resolve. Today only builds the instrument.",
          },
        ],
        checks: [
          {
            question: "Why must the fifty predictions span confidence levels?",
            answer:
              "A calibration curve needs points across the range. Predictions clustered at one confidence level say nothing about the rest.",
          },
          {
            question: "What makes a prediction scoreable?",
            answer:
              "A date and an unambiguous resolution criterion. Anything vaguer gets quietly dropped rather than scored.",
          },
          {
            question: "Why does the capstone produce an instrument rather than an essay?",
            answer:
              "The skill decays without measurement. The tracker keeps scoring you after the roadmap ends, which the essay would not.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "The decision journal",
            url: "https://fs.blog/decision-journal/",
            sourceName: "Farnam Street",
            editorNote:
              "Guardrail, one last time: reading about calibration produces a false sense of it. The ledger is the curriculum.",
          },
        ],
      },
    ],
  },
];
