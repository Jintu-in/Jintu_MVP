/**
 * Data analyst, modules 17–20 (weeks 11–13, days 75–91): statistics,
 * experiments, BI dashboards, portfolio and interview.
 */
export default [
  {
    title: "Statistics that matter at work",
    weekRange: "Week 11",
    objective:
      "Describe honestly, quantify uncertainty, test hypotheses without fooling yourself.",
    nodes: [
      {
        title: "Descriptive statistics",
        summary:
          "Report the median when the mean would flatter you. Report both when it matters.",
        learningObjectives: [
          "Mean, median, mode; when the mean lies",
          "Variance, standard deviation, IQR",
          "Skewness and kurtosis, intuitively",
          "Percentiles: why p50/p90/p99 beat an average for latency and spend",
        ],
        whyToday:
          "Every number an analyst reports is a summary, and the choice of summary is a choice about what to hide. Today is about making that choice deliberately.",
        principle:
          "Report the median when the mean would flatter you. Report both when the difference between them is itself the finding.",
        commonMistake:
          "Reporting an average response time or an average order value. Both distributions are right-skewed, so the mean describes an experience almost nobody has, and p90 is the number that matters.",
        challenge:
          "For three numeric columns in your data, compute mean, median, p90 and p99. Find the column where mean and median differ most and write one sentence explaining what that gap tells you about the distribution.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "When the mean lies",
            detail:
              "Any skewed distribution — income, order value, latency, session length. The mean is pulled toward the tail and sits where no typical observation is.",
          },
          {
            title: "Spread",
            detail:
              "Standard deviation assumes roughly symmetric data; IQR does not. On skewed data report the IQR or the percentiles.",
          },
          {
            title: "Percentiles beat averages",
            detail:
              "p50, p90, p99. For latency the p99 is the experience of your most-affected users, and an average hides it completely.",
          },
          {
            title: "Skew and kurtosis, intuitively",
            detail:
              "Skew is which side the tail is on. Kurtosis is how heavy the tails are. You rarely report them and they tell you which summary to use.",
          },
        ],
        checks: [
          {
            question: "When does the mean mislead?",
            answer:
              "On skewed distributions, where it is pulled toward the tail and describes no typical observation.",
          },
          {
            question: "Why report p90 or p99 for latency?",
            answer:
              "They describe the experience of the worst-affected users, which an average hides entirely.",
          },
          {
            question: "Which spread measure suits skewed data?",
            answer:
              "The IQR or explicit percentiles. Standard deviation assumes rough symmetry.",
          },
          {
            question:
              "A stakeholder reports average order value is up. What do you check before agreeing?",
            answer:
              "Whether the median moved too. Order value is right-skewed, so a handful of large orders can lift the mean while the typical customer's basket is unchanged or smaller. Look at the median and the percentile spread, and check whether the order count changed — a mean rising because small orders disappeared is a different story from one rising because baskets grew.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "video",
            title: "Calculating the Mean, Variance and Standard Deviation, Clearly Explained!!!",
            url: "https://www.youtube.com/watch?v=SzZ6GpcfoQY",
            sourceName: "StatQuest with Josh Starmer (YouTube)",
            youtubeVideoId: "SzZ6GpcfoQY",
            durationSec: 862,
            estSizeMb: 109,
            editorNote:
              "Fourteen minutes, and it derives the formulas rather than stating them — which is why the population-versus-sample distinction sticks.",
          },
          {
            type: "doc",
            title: "Khan Academy — statistics and probability",
            url: "https://www.khanacademy.org/math/statistics-probability",
            sourceName: "Khan Academy",
          },
        ],
      },
      {
        title: "Distributions",
        summary: "The central limit theorem is why everything else works.",
        learningObjectives: [
          "Normal, uniform, binomial, Poisson — what each describes in the real world",
          "The empirical rule; z-scores",
          "What the CLT actually says",
          "Plot your data against a normal curve and judge the fit",
        ],
        whyToday:
          "The central limit theorem is why confidence intervals, t-tests and A/B testing all work. Understanding it once makes the next six days follow rather than be memorised.",
        principle:
          "The central limit theorem is about the distribution of sample means, not about your data. Your data does not have to be normal for it to apply.",
        commonMistake:
          "Believing the CLT says data becomes normal with enough observations. It says the sampling distribution of the mean approaches normal — a different claim, and the confusion causes people to test their raw data for normality unnecessarily.",
        challenge:
          "Take a clearly non-normal column from your data. Repeatedly sample thirty rows and record the mean, a thousand times. Plot the thousand means. That histogram is the central limit theorem, and it is more convincing than any explanation.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Four distributions",
            detail:
              "Normal for measurement error and sums. Uniform for equal likelihood. Binomial for counts of successes. Poisson for events in an interval.",
          },
          {
            title: "What the CLT says",
            detail:
              "The distribution of the sample mean approaches normal as sample size grows, whatever the underlying distribution — given finite variance.",
          },
          {
            title: "The empirical rule",
            detail:
              "About 68, 95 and 99.7 percent within one, two and three standard deviations. Only for roughly normal data, and worth knowing as a sanity check.",
          },
          {
            title: "Judging fit",
            detail:
              "Plot the data against a normal curve, or use a Q-Q plot. Eyeballing beats a normality test, which rejects everything at large n.",
          },
        ],
        checks: [
          {
            question: "What exactly does the central limit theorem say?",
            answer:
              "The sampling distribution of the mean approaches normal as sample size grows, regardless of the population distribution, given finite variance.",
          },
          {
            question: "Does your data need to be normal for a t-test?",
            answer:
              "Not with a reasonable sample size — the CLT applies to the mean, which is what the test uses.",
          },
          {
            question: "Why is eyeballing a Q-Q plot better than a normality test?",
            answer:
              "Normality tests reject almost any real dataset at large sample sizes, so they answer a question nobody asked.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "The Normal Distribution, Clearly Explained!!!",
            url: "https://www.youtube.com/watch?v=rzFX5NWojp0",
            sourceName: "StatQuest with Josh Starmer",
            youtubeVideoId: "rzFX5NWojp0",
            durationSec: 313,
            estSizeMb: 40,
          },
          {
            type: "video",
            title: "The Central Limit Theorem, Clearly Explained!!!",
            url: "https://www.youtube.com/watch?v=YAlJCEDH2uY",
            sourceName: "StatQuest with Josh Starmer",
            youtubeVideoId: "YAlJCEDH2uY",
            durationSec: 465,
            estSizeMb: 60,
          },
          {
            type: "tool",
            title: "Seeing Theory",
            url: "https://seeing-theory.brown.edu/",
            sourceName: "Brown University",
            editorNote: "The probability-distributions chapters — interactive, free.",
          },
        ],
      },
      {
        title: "Sampling and uncertainty",
        summary: "A number without an interval is a guess wearing a suit.",
        learningObjectives: [
          "Population vs sample; sampling bias",
          "Standard error; what \"95%\" means and does not",
          "Margin of error and sample size intuition",
          "Compute a confidence interval and write it in plain English",
        ],
        whyToday:
          "Reporting a number without an interval is the most common way analysts overstate what they know. One extra clause in the sentence fixes it permanently.",
        principle:
          "A number without an interval is a guess wearing a suit. Say the range, and say what the range means.",
        commonMistake:
          "Saying a 95% confidence interval means there is a 95% chance the true value is inside it. It means 95% of intervals built this way would contain it — a statement about the method, not about this interval.",
        challenge:
          "Compute a confidence interval for one metric from your data and write it in plain English, without the words 'probability' or 'chance'. If you cannot, you have not got the interpretation yet.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Sample versus population",
            detail:
              "You almost always have a sample. The question is whether it is representative, and no amount of data fixes a biased sampling process.",
          },
          {
            title: "Standard error",
            detail:
              "The standard deviation of the sampling distribution. It shrinks with the square root of n — so quadrupling the sample halves the error.",
          },
          {
            title: "What 95% means",
            detail:
              "95% of intervals constructed this way contain the true value. This interval either does or does not; the confidence is in the procedure.",
          },
          {
            title: "Sample size intuition",
            detail:
              "Precision improves with the square root of n. Going from 100 to 400 halves the margin; 400 to 1600 halves it again. Diminishing returns are steep.",
          },
        ],
        checks: [
          {
            question: "What does a 95% confidence interval actually mean?",
            answer:
              "That 95% of intervals built by this procedure would contain the true value. It is a statement about the method, not about this particular interval.",
          },
          {
            question: "How does precision scale with sample size?",
            answer:
              "With the square root of n — quadrupling the sample halves the margin of error.",
          },
          {
            question: "Can more data fix a biased sample?",
            answer:
              "No. More data from a biased process gives a more precise estimate of the wrong number.",
          },
          {
            question: "What does a 95% confidence interval mean?",
            answer:
              "That if you repeated the sampling and built an interval this way many times, 95% of those intervals would contain the true value. It is a statement about the procedure. This particular interval either contains the true value or does not — saying there is a 95% chance the value is inside it is the standard misstatement.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "video",
            title: "Confidence Intervals, Clearly Explained!!!",
            url: "https://www.youtube.com/watch?v=TqOeMYtOc1w",
            sourceName: "StatQuest with Josh Starmer",
            youtubeVideoId: "TqOeMYtOc1w",
            durationSec: 372,
            estSizeMb: 47,
          },
        ],
      },
      {
        title: "Correlation",
        summary: "The first question after a correlation is: what else could explain this?",
        learningObjectives: [
          "Pearson vs Spearman; when each",
          "Correlation matrices and heatmaps",
          "Correlation is not causation — with a real spurious example",
          "Confounders and Simpson's paradox",
        ],
        whyToday:
          "Correlations are the easiest thing to compute and the easiest to over-interpret. The habit of immediately looking for the confounder is what makes an analyst trustworthy.",
        principle:
          "The first question after a correlation is: what else could explain this? Not 'is it significant' — that comes later, if at all.",
        commonMistake:
          "Running a correlation matrix over every pair and reporting the strongest. With twenty variables there are 190 pairs, so a strong one appears by chance and it will be the one you report.",
        challenge:
          "Find your strongest correlation and argue against it: name a plausible confounder, and check whether the relationship survives when you split the data by that variable. Sometimes it reverses, which is Simpson's paradox in your own data.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Pearson versus Spearman",
            detail:
              "Pearson measures linear relationship and is sensitive to outliers. Spearman measures monotonic relationship on ranks and is not. Use Spearman when in doubt.",
          },
          {
            title: "Four explanations",
            detail:
              "X causes Y, Y causes X, something causes both, or chance. A correlation is evidence for none of them over the others.",
          },
          {
            title: "Confounders",
            detail:
              "Ice cream sales and drowning correlate because both rise with temperature. The pattern is real and the causal reading is not.",
          },
          {
            title: "Simpson's paradox",
            detail:
              "A relationship present in every subgroup can reverse in aggregate. Always check whether a correlation survives disaggregation.",
          },
          {
            title: "Many pairs, many accidents",
            detail:
              "Twenty variables make 190 pairs. Some will correlate strongly by chance, and hunting for the strongest guarantees you find one.",
          },
        ],
        checks: [
          {
            question: "When is Spearman preferable to Pearson?",
            answer:
              "When the relationship is monotonic but not linear, or when outliers would distort Pearson. It works on ranks.",
          },
          {
            question: "What are the four explanations for a correlation?",
            answer: "X causes Y, Y causes X, a confounder causes both, or coincidence.",
          },
          {
            question: "Why is scanning a correlation matrix for the strongest pair risky?",
            answer:
              "Many pairs mean some correlate strongly by chance, and searching for the maximum selects exactly those.",
          },
          {
            question:
              "You find users who use feature X retain 40% better. What do you tell the product team?",
            answer:
              "That it is a correlation and probably self-selected: engaged users are more likely both to find the feature and to retain, so the feature may be a marker rather than a cause. I would check whether it survives controlling for overall engagement, look for the reverse direction, and say plainly that the only way to know is an experiment. Reporting it as 'feature X drives retention' would be the mistake, and it is the one that gets a roadmap built on nothing.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Simpson's paradox",
            url: "https://en.wikipedia.org/wiki/Simpson%27s_paradox",
            sourceName: "Wikipedia",
            editorNote:
              "Then find your strongest correlation and argue against it: name a plausible confounder.",
          },
        ],
      },
      {
        title: "Hypothesis testing",
        summary:
          "A p-value is not the probability your hypothesis is true. Almost every misuse starts there.",
        learningObjectives: [
          "Null and alternative; one- vs two-tailed",
          "p-values and the four things people wrongly think they mean",
          "Type I and II errors; significance level",
          "Statistical vs practical significance",
        ],
        whyToday:
          "p-values are the most misused number in business analysis, and being the person in the room who states one correctly is a genuine professional advantage.",
        principle:
          "A p-value is the probability of data this extreme if the null were true. It is not the probability that the null is true, and the difference is not pedantic.",
        commonMistake:
          "Reading a non-significant result as evidence of no effect. Absence of evidence is not evidence of absence, particularly with a small sample where the test could not have detected a real effect anyway.",
        challenge:
          "Write down, in your own words, four things a p-value is not. Then find a business claim quoting one and decide whether the person quoting it made any of the four errors.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "What a p-value is",
            detail:
              "The probability of observing data at least this extreme, assuming the null hypothesis is true. Everything else people say about it is wrong.",
          },
          {
            title: "The four misreadings",
            detail:
              "It is not the probability the null is true, not the probability of a fluke, not the size of the effect, and not the probability of replication.",
          },
          {
            title: "Type I and Type II",
            detail:
              "Type I is a false positive, controlled by your significance level. Type II is a false negative, controlled by power and sample size.",
          },
          {
            title: "Statistical versus practical",
            detail:
              "With enough data a 0.01% improvement is significant. Whether it is worth anything is a business question the test cannot answer.",
          },
        ],
        checks: [
          {
            question: "Define a p-value precisely.",
            answer:
              "The probability of observing data at least as extreme as this, assuming the null hypothesis is true.",
          },
          {
            question: "What does a non-significant result mean?",
            answer:
              "That this test did not detect an effect — which may mean there is none, or that the sample was too small to find one.",
          },
          {
            question: "How can something be statistically significant and worthless?",
            answer:
              "With a large enough sample, a tiny effect reaches significance. Significance says the effect is probably real, not that it matters.",
          },
          {
            question: "What is a p-value?",
            answer:
              "The probability of observing data at least as extreme as this, assuming the null hypothesis is true. It is not the probability the null is true, not the probability the result is a fluke, and it says nothing about effect size. A large sample makes a trivial difference significant, so significance and importance are separate questions.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
          {
            question: "Your test is not significant. Does that mean there is no effect?",
            answer:
              "No — it means this test did not detect one. With a small sample the test may have had little chance of detecting a real effect, so absence of evidence is not evidence of absence. The useful thing to report is the upper bound: what size of effect the test could have detected and therefore rules out.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "video",
            title: "p-values: What they are and how to interpret them",
            url: "https://www.youtube.com/watch?v=vemZtEM63GY",
            sourceName: "StatQuest with Josh Starmer",
            youtubeVideoId: "vemZtEM63GY",
            durationSec: 686,
            estSizeMb: 86,
          },
        ],
      },
      {
        title: "Choosing and running a test",
        summary: "Three tests on your data, one sentence of conclusion each.",
        learningObjectives: [
          "One-sample, two-sample, paired t-tests",
          "ANOVA; chi-square for categorical independence",
          "Non-parametric alternatives: Mann-Whitney, Kruskal-Wallis",
          "Running them with scipy.stats",
        ],
        whyToday:
          "Knowing which test to run is a short decision tree, and being able to run it in scipy is ten lines. Both are worth having before the experiments module needs them tomorrow.",
        principle:
          "Choose the test from the data's shape and the question, before looking at the result. Choosing after is how you find the test that gives the answer you wanted.",
        commonMistake:
          "Defaulting to a t-test on badly skewed data with a small sample. The assumptions do not hold, Mann-Whitney answers the same question without them, and nobody checks.",
        challenge:
          "Run three tests on your own data — a two-sample comparison, a chi-square on two categorical columns, and one non-parametric alternative — and write one sentence of conclusion for each in plain English, with the effect size not just the p-value.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "The decision tree",
            detail:
              "Comparing two group means: t-test. More than two: ANOVA. Two categorical variables: chi-square. Same subjects twice: paired t-test.",
          },
          {
            title: "Non-parametric alternatives",
            detail:
              "Mann-Whitney for two groups, Kruskal-Wallis for several. They work on ranks, so skew and outliers do not break them.",
          },
          {
            title: "Assumptions",
            detail:
              "Independence, and for the parametric tests roughly normal sampling distributions and comparable variances. Independence is the one that is genuinely fatal.",
          },
          {
            title: "Report the effect size",
            detail:
              "The p-value says whether; the effect size says how much. A conclusion with only a p-value has not answered the business question.",
          },
        ],
        checks: [
          {
            question: "Which test compares two categorical variables?",
            answer: "Chi-square, for independence between them.",
          },
          {
            question: "When would you use Mann-Whitney over a t-test?",
            answer:
              "When the data is badly skewed or the sample small, so the t-test's assumptions are doubtful. It works on ranks.",
          },
          {
            question: "Why report an effect size alongside a p-value?",
            answer:
              "The p-value says whether an effect is detectable; only the effect size says whether it matters.",
          },
          {
            question:
              "You want to know whether two groups differ on a heavily skewed metric with 40 observations each. Which test?",
            answer:
              "Mann-Whitney rather than a t-test. With that sample size and that skew the t-test's assumptions are doubtful, and Mann-Whitney compares distributions via ranks without them. I would also report the difference in medians as the effect size, because the p-value alone does not say whether the difference matters.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Statistics (scipy.stats) tutorial",
            url: "https://docs.scipy.org/doc/scipy/tutorial/stats.html",
            sourceName: "SciPy documentation",
            editorNote: "t-tests, ANOVA and chi-square with runnable examples.",
          },
        ],
      },
    ],
  },
  {
    title: "Experiments & A/B testing",
    weekRange: "Weeks 11–12",
    objective:
      "Design an experiment before running it, read one without fooling yourself, and report a null result well.",
    nodes: [
      {
        title: "Experiment design",
        summary:
          "Decide the sample size before you start, or you will stop the test when you like the number.",
        learningObjectives: [
          "Randomisation is the whole ballgame; the unit of randomisation",
          "Control and treatment",
          "Minimum detectable effect, power, and the sample size that follows",
        ],
        whyToday:
          "Every decision that makes an experiment trustworthy is made before it starts. Once it is running, the choices left are all ways to fool yourself.",
        principle:
          "Decide the sample size before you start, or you will stop the test when you like the number.",
        commonMistake:
          "Randomising the wrong unit. Randomising by session when the same user returns means one user appears in both arms, contaminating the comparison and the independence assumption with it.",
        challenge:
          "Design an experiment for a real product question: state the unit of randomisation, the primary metric, the minimum effect worth detecting, and the resulting sample size. Then compute how long it will take to collect — that number usually changes the design.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Randomisation is the whole ballgame",
            detail:
              "It is what makes the two groups comparable in every respect you did not measure. Without it you have a comparison, not an experiment.",
          },
          {
            title: "The unit",
            detail:
              "User, session, or device. It must be the unit the effect acts on, and the same unit must never appear in both arms.",
          },
          {
            title: "Minimum detectable effect",
            detail:
              "The smallest change worth acting on. Choosing it is a business decision, and it drives the sample size more than anything else.",
          },
          {
            title: "Power",
            detail:
              "The probability of detecting a real effect of that size. 80% is conventional, which means one real effect in five is missed.",
          },
          {
            title: "Compute the duration",
            detail:
              "Sample size divided by traffic per day. A test needing eleven weeks is a design problem to solve now, not a surprise in week three.",
          },
        ],
        checks: [
          {
            question: "Why must the sample size be fixed in advance?",
            answer:
              "Otherwise you stop when the result looks good, which inflates false positives — the test no longer means what it claims.",
          },
          {
            question: "What determines the unit of randomisation?",
            answer:
              "The unit the effect acts on. Critically, the same unit must never fall into both arms.",
          },
          {
            question: "What is minimum detectable effect?",
            answer:
              "The smallest change worth acting on — a business judgement that drives the required sample size.",
          },
          {
            question: "How do you decide how long to run an A/B test?",
            answer:
              "Work backwards from the sample size. Pick the primary metric, decide the minimum effect worth acting on, choose power and significance, and compute the sample needed. Divide by daily traffic in the experiment, then round up to whole weeks so weekday and weekend behaviour are both covered. Fix that duration before starting — deciding as you go is how peeking creeps in.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
          {
            question:
              "Why does the unit of randomisation matter, and what happens if you get it wrong?",
            answer:
              "It must be the unit the effect acts on, and no unit may appear in both arms. Randomising by session when users return means the same person sees both variants — the groups are contaminated, the independence assumption breaks, and the measured difference is diluted toward zero. You would conclude no effect from an experiment that could not have found one.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "tool",
            title: "Sample size calculator",
            url: "https://www.evanmiller.org/ab-testing/sample-size.html",
            sourceName: "Evan Miller",
            editorNote:
              "Design an experiment for a real product question and compute its sample size.",
          },
        ],
      },
      {
        title: "Running and reading a test",
        summary: "Sample ratio mismatch is the first check, always.",
        learningObjectives: [
          "SRM; peeking and why it inflates false positives",
          "Novelty and primacy effects; seasonality",
          "Segmenting without p-hacking your way to a story",
          "Analyse a public A/B dataset end to end",
        ],
        whyToday:
          "Most bad A/B decisions come from two things: peeking, and not checking that randomisation worked. Both are cheap to prevent and both are routinely skipped.",
        principle:
          "Sample ratio mismatch is the first check, always. If the split is not what you configured, nothing downstream is interpretable.",
        commonMistake:
          "Checking the results daily and stopping at the first significant reading. With repeated looks the false-positive rate is far above 5%, and a null test will eventually look significant if you keep watching.",
        challenge:
          "Analyse a public A/B dataset end to end: check SRM first, then the primary metric, then segments. Then plot the p-value day by day across the test and see how often it crossed 0.05 before settling.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "SRM first",
            detail:
              "A 50/50 split should produce close to 50/50. A significant deviation means the assignment or logging is broken, and no result can be trusted.",
          },
          {
            title: "Peeking",
            detail:
              "Each look is another chance to cross the threshold. Repeated testing without correction pushes the false-positive rate well past the nominal level.",
          },
          {
            title: "Novelty and primacy",
            detail:
              "Users react to change itself. An early lift can decay to nothing; an early drop can recover. Run long enough for the reaction to settle.",
          },
          {
            title: "Segmenting honestly",
            detail:
              "Segments are for generating hypotheses, not for rescuing a null result. A segment found after the fact needs its own test.",
          },
          {
            title: "Seasonality",
            detail:
              "Cover whole weeks. A test running Tuesday to Friday measures a different population from one covering a weekend.",
          },
        ],
        checks: [
          {
            question: "What is sample ratio mismatch and why check it first?",
            answer:
              "The observed split differing significantly from the configured one. It indicates broken assignment or logging, which invalidates everything downstream.",
          },
          {
            question: "Why does peeking inflate false positives?",
            answer:
              "Every look is another opportunity to cross the significance threshold by chance, so repeated looks raise the effective error rate.",
          },
          {
            question: "What is the honest use of a post-hoc segment finding?",
            answer: "As a hypothesis for a new test, never as the conclusion of this one.",
          },
          {
            question:
              "Your A/B test hits significance on day three of a planned two weeks. Do you ship?",
            answer:
              "No. Stopping at the first significant reading is peeking, and with repeated looks the false-positive rate is far above the nominal 5% — a null test will cross the line eventually if you keep watching. Day-three results also carry novelty effects. Run to the planned sample size. If stopping early is a real business need, use a sequential testing method designed for it rather than doing it informally.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
          {
            question: "What is the first thing you check when an A/B test's results come in?",
            answer:
              "Sample ratio mismatch — whether the observed split matches the configured one. A significant deviation means assignment or logging is broken, and nothing downstream is interpretable regardless of how good the result looks.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "How not to run an A/B test",
            url: "https://www.evanmiller.org/how-not-to-run-an-ab-test.html",
            sourceName: "Evan Miller",
            editorNote:
              "The peeking problem, by the person whose calculator you used yesterday.",
          },
        ],
      },
      {
        title: "Multiple comparisons and honest reporting",
        summary:
          "An experiment that finds nothing has still bought you information. Report it that way.",
        learningObjectives: [
          "Why testing twenty metrics finds one \"significant\" result by chance",
          "Bonferroni and false discovery rate, plainly",
          "Pre-registering the primary metric",
          "Rewrite yesterday's conclusion assuming a null result — make it useful anyway",
        ],
        whyToday:
          "Reporting a null result well is a professional skill almost nobody teaches, and it is the difference between an analyst who is trusted and one whose results are always positive.",
        principle:
          "An experiment that finds nothing has still bought you information. Report it that way — you now know the effect is smaller than your minimum detectable effect.",
        commonMistake:
          "Testing twenty metrics and reporting the one that reached significance. At a 5% threshold one in twenty comes up by chance, so that result is exactly what you would expect from nothing.",
        challenge:
          "Rewrite yesterday's conclusion assuming a null result, and make it useful anyway: state the upper bound on the effect, what that rules out, and what you would do next. That paragraph is the skill.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Why twenty metrics find one",
            detail:
              "At a 5% threshold, one in twenty independent tests is significant under a true null. Testing many metrics guarantees a finding.",
          },
          {
            title: "Bonferroni",
            detail:
              "Divide the threshold by the number of tests. Simple, conservative, and it costs power — but it is defensible and easy to explain.",
          },
          {
            title: "False discovery rate",
            detail:
              "Controls the proportion of your significant findings that are false, rather than the chance of any false positive. Less conservative and usually more useful.",
          },
          {
            title: "Pre-register the primary metric",
            detail:
              "Name one metric before the test. Everything else is secondary and reported as exploratory, which is honest and costs nothing.",
          },
          {
            title: "Reporting a null well",
            detail:
              "'We can rule out an effect larger than 2%' is a finding. 'No significant difference' on its own is not.",
          },
        ],
        checks: [
          {
            question: "Why does testing twenty metrics produce a false positive?",
            answer:
              "At a 5% threshold, one in twenty tests reaches significance under a true null. Twenty tests make one expected by chance.",
          },
          {
            question: "What does a false discovery rate control that Bonferroni does not?",
            answer:
              "The proportion of your significant results that are false, rather than the chance of any false positive at all — less conservative.",
          },
          {
            question: "How should a null result be reported?",
            answer:
              "With the upper bound on the effect it rules out, so the reader learns what the test established rather than only what it failed to find.",
          },
          {
            question:
              "A colleague tested twenty metrics and one came back significant at p < 0.05. What do you say?",
            answer:
              "That this is exactly what you would expect from no effect at all — at a 5% threshold, one in twenty tests is significant by chance. Ask which metric was pre-registered as primary; if none was, the result is exploratory and needs a fresh test to confirm. Bonferroni or a false discovery rate correction would be the formal response, but the real fix is naming the primary metric before the test.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "Multiple comparisons problem",
            url: "https://en.wikipedia.org/wiki/Multiple_comparisons_problem",
            sourceName: "Wikipedia",
            editorNote: "Read for the jelly-bean intuition; skim the corrections table.",
          },
        ],
      },
      {
        title: "Metrics that businesses actually track",
        summary:
          "Define five metrics for a business you know — including how each could be gamed.",
        learningObjectives: [
          "SaaS: MRR, ARR, churn, LTV, CAC, NRR",
          "E-commerce: GMV, AOV, conversion, repeat rate, ROAS",
          "Product: DAU/MAU, stickiness, retention curves, funnels",
          "Metric design: what makes a metric gameable",
        ],
        whyToday:
          "Interviews ask you to define a metric far more often than to compute one, and this is also the vocabulary that lets you talk to a business without translation.",
        principle:
          "A metric that can be hit without achieving the goal will be. Design for that from the start rather than discovering it later.",
        commonMistake:
          "Defining a metric without a denominator or a window. 'Churn' means nothing until you say churn of what, measured over how long, and counting whom.",
        challenge:
          "Define five metrics for a business you know — precise numerator, denominator and window for each — and for every one, name a way somebody could move it without improving the underlying thing.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "SaaS",
            detail:
              "MRR and ARR for recurring revenue, churn for loss, LTV against CAC for unit economics, NRR for expansion net of churn.",
          },
          {
            title: "E-commerce",
            detail:
              "GMV for volume, AOV for basket size, conversion for funnel health, repeat rate for retention, ROAS for advertising efficiency.",
          },
          {
            title: "Product",
            detail:
              "DAU over MAU as stickiness, retention curves for decay, funnels for drop-off. Each needs its active definition stated.",
          },
          {
            title: "Definitions are the work",
            detail:
              "Numerator, denominator, time window, population. Two teams reporting different numbers almost always differ on one of these four.",
          },
          {
            title: "Gameability",
            detail:
              "For each metric, ask how you would move it dishonestly. If the answer is easy, pair it with a counter-metric.",
          },
        ],
        checks: [
          {
            question: "What four things must a metric definition state?",
            answer: "Numerator, denominator, time window and population.",
          },
          {
            question: "What is NRR measuring that churn does not?",
            answer:
              "Expansion revenue from existing customers net of churn, so it can exceed 100%.",
          },
          {
            question: "What should you do with an easily gamed metric?",
            answer: "Pair it with a counter-metric that degrades when it is gamed.",
          },
          {
            question: "Design a metric for the success of a new onboarding flow.",
            answer:
              "State numerator, denominator, window and population: proportion of users signing up in a given week who complete a defined activation action within seven days. Then say how it could be gamed — making activation trivially easy would move it without improving anything — so pair it with a counter-metric like week-four retention of those activated users. Naming the gaming route unprompted is the part being tested.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
          {
            question: "What is the difference between churn and net revenue retention?",
            answer:
              "Churn measures customers or revenue lost. NRR measures revenue from an existing cohort at the end of a period against the start, including expansion — so it nets upgrades against downgrades and churn, and can exceed 100%. A business can have meaningful churn and NRR above 100% if remaining customers expand.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Performance indicator",
            url: "https://en.wikipedia.org/wiki/Performance_indicator",
            sourceName: "Wikipedia",
            editorNote: "A sober taxonomy to steal vocabulary from before defining your five.",
          },
        ],
      },
    ],
  },
  {
    title: "BI tools & dashboards",
    weekRange: "Week 12",
    objective:
      "One BI tool learned properly: data model, measures, an honest one-page dashboard, published.",
    deliverable: "A published, publicly viewable dashboard with a three-line handover note.",
    nodes: [
      {
        title: "Getting into Power BI or Tableau",
        summary: "Pick one. Power BI if you are Microsoft-adjacent, Tableau otherwise.",
        learningObjectives: [
          "Connecting data; import vs live",
          "Relationships, cardinality, cross-filter direction",
          "Star schema in a BI tool; the Dim_Date table you always need",
        ],
        whyToday:
          "One BI tool learned properly beats two learned partially, and the data model you build on day one determines whether every measure afterwards is easy or impossible.",
        principle:
          "The data model is the product. A star schema with a proper date table makes every later measure simple; a flat table makes several of them unwritable.",
        commonMistake:
          "Loading one wide flat table because it works for the first chart. Time intelligence then has nothing to work with, and every fix later means rebuilding the model under existing reports.",
        challenge:
          "Build a star schema in your chosen tool with a real Dim_Date table covering the full range, marked as the date table. Then check the relationship cardinalities are what you intended rather than what was auto-detected.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Pick one",
            detail:
              "Power BI if the organisation is Microsoft-adjacent, Tableau otherwise. Both are employable; splitting your attention is what is not.",
          },
          {
            title: "Import versus live",
            detail:
              "Import copies data in and is fast with scheduled refresh. Live queries the source each time and is current at the cost of speed and load.",
          },
          {
            title: "Cardinality and direction",
            detail:
              "One-to-many from dimension to fact, filtering one way. Bidirectional filtering causes ambiguity that produces wrong numbers rather than errors.",
          },
          {
            title: "The date table",
            detail:
              "A contiguous row per date across the full range, marked as the date table. Every time-intelligence function depends on it existing.",
          },
        ],
        checks: [
          {
            question: "Why does a BI model need a dedicated date table?",
            answer:
              "Time intelligence functions require a contiguous marked date dimension; they cannot work from dates scattered in a fact table.",
          },
          {
            question: "What is the risk of bidirectional filtering?",
            answer: "Ambiguous filter paths, which produce wrong numbers rather than errors.",
          },
          {
            question: "When is live connection preferable to import?",
            answer:
              "When the data must be current to the minute and the source can carry the query load.",
          },
        ],
        resources: [
          {
            type: "video",
            title: "Power BI Tutorial for Beginners (Step-by-Step in 30 Minutes)",
            url: "https://www.youtube.com/watch?v=OmW9YvxSl1E",
            sourceName: "Guy in a Cube (YouTube)",
            youtubeVideoId: "OmW9YvxSl1E",
            durationSec: 1841,
            estSizeMb: 233,
            editorNote:
              "Thirty minutes end to end. If you chose Tableau, use their own free training instead — do not split across both tools.",
          },
          {
            type: "tool",
            title: "Tableau Public",
            url: "https://public.tableau.com/",
            sourceName: "Tableau",
          },
        ],
      },
      {
        title: "Calculations",
        summary:
          "In DAX, understanding filter context is the whole language. Everything else is syntax.",
        learningObjectives: [
          "Power BI: calculated columns vs measures; row vs filter context; CALCULATE, ALL, SUMX",
          "Time intelligence: TOTALYTD, SAMEPERIODLASTYEAR, DATEADD",
          "Tableau: calculated fields and LOD expressions",
          "Eight measures including one year-on-year comparison",
        ],
        whyToday:
          "DAX looks like Excel and does not behave like it, and filter context is the reason. One day understanding that concept prevents months of measures that return the wrong number confidently.",
        principle:
          "In DAX, understanding filter context is the whole language. Everything else is syntax.",
        commonMistake:
          "Writing a calculated column where a measure belongs. A column is computed once at refresh with no knowledge of the filters a user applies, so it silently ignores every slicer on the page.",
        challenge:
          "Write eight measures, including one year-on-year comparison and one percent-of-total. Then put a slicer on the page and check each measure responds to it — the percent-of-total is the one that usually does not.",
        challengeMinutes: 45,
        estMinutes: 60,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Column versus measure",
            detail:
              "A calculated column is evaluated per row at refresh and stored. A measure is evaluated at query time within the current filter context. Almost always you want a measure.",
          },
          {
            title: "Filter context",
            detail:
              "Every visual, slicer and row header applies filters. A measure computes within whatever survives. This is why the same measure gives different numbers in different visuals — correctly.",
          },
          {
            title: "CALCULATE and ALL",
            detail:
              "CALCULATE modifies the filter context. ALL removes filters — which is how percent-of-total works, by computing the denominator outside the current filter.",
          },
          {
            title: "Time intelligence",
            detail:
              "TOTALYTD, SAMEPERIODLASTYEAR, DATEADD. All require the marked date table from yesterday.",
          },
          {
            title: "Tableau's equivalent",
            detail:
              "Calculated fields and LOD expressions — FIXED, INCLUDE, EXCLUDE — solve the same problem of computing at a different grain from the visual.",
          },
        ],
        checks: [
          {
            question: "When is a calculated column wrong?",
            answer:
              "When the result should respond to user filters. Columns are computed at refresh and ignore slicers entirely.",
          },
          {
            question: "What does ALL do inside CALCULATE?",
            answer:
              "Removes filters from the specified table or column — how a percent-of-total denominator escapes the current filter context.",
          },
          {
            question: "What is Tableau's equivalent of controlling grain?",
            answer:
              "LOD expressions — FIXED, INCLUDE and EXCLUDE — which compute at a specified level regardless of the visual's grain.",
          },
          {
            question: "In DAX, when do you use a measure rather than a calculated column?",
            answer:
              "Almost always. A calculated column is evaluated per row at refresh and stored, so it cannot respond to slicers. A measure is evaluated at query time inside the current filter context, which is why the same measure correctly shows different numbers in different visuals. Columns are for values that genuinely belong to the row regardless of any filter.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "DAX overview",
            url: "https://learn.microsoft.com/en-us/dax/dax-overview",
            sourceName: "Microsoft Learn",
          },
        ],
      },
      {
        title: "Dashboard design",
        summary:
          "Build a one-page dashboard; then delete a third of it and check nothing was lost.",
        learningObjectives: [
          "Top-left is the most valuable space on the page",
          "KPI cards → trend → breakdown: the standard reading order",
          "Filters, drill-through, tooltips",
          "Colour with restraint; accessible contrast",
        ],
        whyToday:
          "A dashboard is read in about eight seconds before somebody decides whether to keep looking. Everything about its design is downstream of that fact.",
        principle:
          "Build a one-page dashboard, then delete a third of it and check nothing was lost. Almost nothing ever is.",
        commonMistake:
          "Adding every chart somebody asked for. The result answers no question quickly, so it gets opened twice and abandoned, and the failure is blamed on the tool.",
        challenge:
          "Build one page: KPI cards, then trend, then breakdown. Then delete a third of it and show it to somebody. If they cannot state the main message in eight seconds, delete more.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Top-left first",
            detail:
              "Readers start there. The single most important number belongs in that corner, not a filter panel or a logo.",
          },
          {
            title: "The standard order",
            detail:
              "KPI cards for the headline, a trend for direction, a breakdown for cause. Three bands, top to bottom, matching how somebody asks questions.",
          },
          {
            title: "Interaction",
            detail:
              "Filters for what people genuinely vary, drill-through for detail, tooltips for the extra column that would otherwise become a chart.",
          },
          {
            title: "Colour with restraint",
            detail:
              "One accent for the thing that matters, neutral for everything else. Colour used everywhere carries no information.",
          },
          {
            title: "Accessible contrast",
            detail:
              "Check text against its background, and never encode meaning in colour alone — pair it with position, a label or a shape.",
          },
        ],
        checks: [
          {
            question: "What belongs in the top-left of a dashboard?",
            answer: "The single most important number. It is where readers start.",
          },
          {
            question: "What is the standard reading order?",
            answer: "KPI cards, then trend, then breakdown.",
          },
          {
            question: "Why should meaning never be carried by colour alone?",
            answer:
              "Colour-blind readers lose it entirely. Pair colour with position, label or shape.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Storytelling with Data — blog",
            url: "https://www.storytellingwithdata.com/blog",
            sourceName: "Storytelling with Data",
            editorNote: "Two posts on decluttering, before you build.",
          },
        ],
      },
      {
        title: "Publishing and the handover",
        summary:
          "The handover note: who it is for, what decision it supports, what it deliberately does not show.",
        learningObjectives: [
          "Publishing to Power BI Service or Tableau Public",
          "Refresh schedules; row-level security, briefly",
          "The three-line handover note",
        ],
        whyToday:
          "An unpublished dashboard is a file. The handover note is what makes it a thing somebody else can rely on without asking you questions every week.",
        principle:
          "Say what the dashboard deliberately does not show. That sentence prevents more misreadings than any amount of chart design.",
        commonMistake:
          "Publishing without stating the refresh schedule. Somebody reads Monday's numbers on Thursday, makes a decision on stale data, and the dashboard is blamed for being wrong.",
        challenge:
          "Publish it publicly and write the three-line handover: who it is for, what decision it supports, and what it deliberately does not show. Add the refresh cadence and the data's as-of date on the page itself.",
        challengeMinutes: 40,
        estMinutes: 50,
        points: 40,
        difficulty: "core",
        topics: [
          {
            title: "Publishing",
            detail:
              "Power BI Service or Tableau Public. Tableau Public is genuinely public — never put real business data on it.",
          },
          {
            title: "Refresh",
            detail:
              "Schedule it and show the last-refreshed timestamp on the page. A number with no as-of date is unusable for a decision.",
          },
          {
            title: "Row-level security",
            detail:
              "Filters data by who is viewing. Necessary the moment a dashboard covers several teams and they should not see each other's numbers.",
          },
          {
            title: "The three-line note",
            detail:
              "Who it is for, what decision it supports, what it deliberately excludes. The third line is the one that does the work.",
          },
          {
            title: "Fourth portfolio artefact",
            detail:
              "A published dashboard with a real link is the most immediately legible thing in a portfolio, because a recruiter can open it.",
          },
        ],
        checks: [
          {
            question: "What are the three lines of a handover note?",
            answer:
              "Who it is for, what decision it supports, and what it deliberately does not show.",
          },
          {
            question: "Why show a last-refreshed timestamp?",
            answer:
              "Without an as-of date a reader cannot tell whether the number is current, and stale data drives wrong decisions.",
          },
          {
            question: "What must you never publish to Tableau Public?",
            answer: "Real business data — it is publicly viewable by anyone.",
          },
        ],
        resources: [],
      },
    ],
  },
  {
    title: "Portfolio, capstone & interview",
    weekRange: "Week 13",
    objective:
      "One complete project a stranger can follow, three project descriptions written around outcomes, and interview patterns rehearsed aloud.",
    deliverable:
      "A complete capstone project on GitHub: question, data, method, finding, caveats.",
    nodes: [
      {
        title: "The capstone",
        summary:
          "Full pipeline on one real dataset and one real question: SQL extraction → Python cleaning → analysis → visualisation → written finding.",
        learningObjectives: [
          "Repo structure: data/, sql/, notebooks/, outputs/, README.md",
          "The README a stranger can follow: question, data, method, finding, caveats",
        ],
        whyToday:
          "Thirteen weeks assemble into one artefact. What makes it a capstone rather than an exercise is that it goes from a real question to a stated finding with its caveats named.",
        principle:
          "The README is half the value. A stranger should understand the question, the method and the finding without opening a notebook.",
        commonMistake:
          "Choosing a famous Kaggle dataset everybody has used. The analysis is compared against a thousand others and the question was answered in the dataset's own description.",
        challenge:
          "One real dataset, one real question, full pipeline: SQL extraction, Python cleaning, analysis, visualisation, written finding. Structure the repo as data, sql, notebooks, outputs and a README, and write the README first.",
        challengeMinutes: 110,
        estMinutes: 120,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Pick an unfashionable dataset",
            detail:
              "Government open data, a niche public API, something local. Less competition and the question is genuinely yours.",
          },
          {
            title: "Repo structure",
            detail:
              "data/, sql/, notebooks/, outputs/, README.md. Predictable structure means a reviewer finds things without asking.",
          },
          {
            title: "The README's five parts",
            detail:
              "Question, data, method, finding, caveats. In that order, and the caveats are the part that signals seriousness.",
          },
          {
            title: "Name the caveats",
            detail:
              "What the data cannot tell you, what you assumed, what you would check with more time. Every real analysis has these; only good ones say so.",
          },
          {
            title: "Use the whole pipeline",
            detail:
              "SQL to extract, Python to clean and analyse, a chart to show it. The point is that the stages connect, not that each is impressive.",
          },
        ],
        checks: [
          {
            question: "What are the five parts of the capstone README?",
            answer: "Question, data, method, finding, caveats.",
          },
          {
            question: "Why avoid the most popular Kaggle datasets?",
            answer:
              "The analysis is compared against thousands of others and the interesting questions are already in the dataset description.",
          },
          {
            question: "Why do caveats strengthen rather than weaken the work?",
            answer:
              "Every real analysis has limitations. Naming them shows you know what your evidence does and does not support.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "About READMEs",
            url:
              "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
            sourceName: "GitHub Docs",
            editorNote: "The README is half the capstone's value; structure it before the code.",
          },
          {
            type: "tool",
            title: "Kaggle Datasets",
            url: "https://www.kaggle.com/datasets",
            sourceName: "Kaggle",
          },
        ],
      },
      {
        title: "Portfolio and profile",
        summary: "Nobody is impressed that you used pandas. They are impressed by what changed.",
        learningObjectives: [
          "Three projects, not ten: a dashboard, a SQL analysis, a Python EDA",
          "Descriptions written around outcomes, not tools",
          "Quantify: \"cut query runtime 40%\", \"monitors ₹2 crore of monthly spend\"",
          "LinkedIn and resume: same discipline, shorter",
        ],
        whyToday:
          "The work is done; this is about whether anybody reads it. Three projects described by outcome get further than ten described by tool.",
        principle:
          "Nobody is impressed that you used pandas. They are impressed by what changed.",
        commonMistake:
          "Listing tools in every project description. 'Used Python, pandas, matplotlib and SQL' says only that you did the work the way everybody does; it displaces the sentence about what you found.",
        challenge:
          "Write three project descriptions around outcomes, with a number in each — runtime cut, spend monitored, error found. Then delete every tool name and check the description still says something. Put the tools back afterwards, once, at the end.",
        challengeMinutes: 60,
        estMinutes: 70,
        points: 40,
        difficulty: "core",
        topics: [
          {
            title: "Three, not ten",
            detail:
              "A dashboard, a SQL analysis, a Python EDA. Three finished things beat ten half-finished, and nobody opens the fourth.",
          },
          {
            title: "Outcome, not tool",
            detail:
              "What changed because the work existed. The tool list belongs at the end of the description, in one line.",
          },
          {
            title: "Quantify",
            detail:
              "'Cut query runtime 40%', 'monitors two crore of monthly spend'. Numbers make a claim checkable, which is why they are believed.",
          },
          {
            title: "Never overstate",
            detail:
              "A number you cannot substantiate is worse than none — it collapses in the interview where it would have helped most.",
          },
          {
            title: "Same discipline, shorter",
            detail:
              "LinkedIn and the resume carry the same sentences, compressed. Rewriting them differently is how the versions drift.",
          },
        ],
        checks: [
          {
            question: "How many portfolio projects, and which?",
            answer: "Three finished ones — a dashboard, a SQL analysis and a Python EDA.",
          },
          {
            question: "What should a project description lead with?",
            answer:
              "The outcome — what changed — with a number where possible. Tools go at the end in one line.",
          },
          {
            question: "Why is an unsubstantiated number worse than none?",
            answer:
              "It fails under questioning in the interview, taking the rest of the description's credibility with it.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "About READMEs",
            url:
              "https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes",
            sourceName: "GitHub Docs",
            editorNote: "Apply the same discipline to all three project pages.",
          },
        ],
      },
      {
        title: "Interview preparation",
        summary: "The strongest answer names its own limitation before the interviewer does.",
        learningObjectives: [
          "SQL live-coding patterns: top-N per group, running totals, cohort retention, gaps and islands, dedup",
          "Case questions: metric drop root-cause, metric design, trade-offs",
          "Behavioural: proudest project, a time you were wrong, data vs stakeholder",
          "Record a five-minute capstone walkthrough ending with its weakest assumption",
        ],
        whyToday:
          "The last day, and the one that converts thirteen weeks into an offer. The habit it builds — naming your own limitation first — is also what makes you good at the job.",
        principle:
          "The strongest answer names its own limitation before the interviewer does. It signals you know where the analysis is weak, which is what they are actually testing.",
        commonMistake:
          "Rehearsing answers silently. Reasoning aloud is a separate skill from reasoning, and the first time you discover the gap should not be in the interview.",
        challenge:
          "Record a five-minute walkthrough of your capstone that ends with its weakest assumption. Watch it back. Then do fifteen SQL problems under time pressure, out loud, narrating as you would to an interviewer.",
        challengeMinutes: 75,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The five SQL patterns",
            detail:
              "Top-N per group, running totals, cohort retention, gaps and islands, deduplication. Nearly every live-coding round is one of these five.",
          },
          {
            title: "The metric-drop case",
            detail:
              "Segment before theorising: time, geography, platform, user type, and check for an instrumentation change. A structured search beats a clever guess.",
          },
          {
            title: "Metric design questions",
            detail:
              "State numerator, denominator, window and population, then name how it could be gamed. Day 84's discipline, out loud.",
          },
          {
            title: "Behavioural",
            detail:
              "Proudest project, a time you were wrong, a time data and a stakeholder disagreed. Have a real example for each — invented ones collapse under a follow-up.",
          },
          {
            title: "Narrate while you code",
            detail:
              "Say what you are doing and why. Interviewers assess reasoning, and silence gives them nothing to assess.",
          },
        ],
        checks: [
          {
            question: "Name the five SQL live-coding patterns.",
            answer:
              "Top-N per group, running totals, cohort retention, gaps and islands, and deduplication.",
          },
          {
            question: "How do you approach a metric-drop question?",
            answer:
              "Segment systematically — time, geography, platform, user type — and check for instrumentation changes before proposing causes.",
          },
          {
            question: "Why end a walkthrough with the weakest assumption?",
            answer:
              "It shows you know where the analysis is fragile, which is what the interviewer is assessing.",
          },
          {
            question: "Daily active users dropped 15% yesterday. How do you investigate?",
            answer:
              "Rule out instrumentation first — a tracking change or a failed pipeline explains more sudden drops than user behaviour does, and checking it costs minutes. Then segment systematically rather than theorising: by platform, app version, geography, new versus returning, and acquisition channel. A drop concentrated in one segment points at a release or an outage; a drop spread evenly points at something external or at the metric definition. Compare against the same weekday last week rather than the previous day, and state what you would need to confirm the cause.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
          {
            question: "Tell me about a time your analysis was wrong.",
            answer:
              "A real example, stated plainly: what you concluded, how the error was found, what it cost, and what you changed about your process. The answer that works names a specific process change — a row-count check after every join, a quality query set run before analysis — rather than a promise to be more careful. Candidates who claim never to have been wrong do worse than those who describe a real mistake well.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "tool",
            title: "DataLemur — timed practice",
            url: "https://datalemur.com/questions",
            sourceName: "DataLemur",
            editorNote: "Fifteen problems under time pressure.",
          },
        ],
      },
    ],
  },
];
