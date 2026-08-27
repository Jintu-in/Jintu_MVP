/**
 * Thinking under uncertainty — modules 1–3, days 1–14.
 *
 * Mental models, the biases that defeat them, and Bayes. Titles, summaries,
 * objectives and links are the original spec's; the day-page model is new.
 */
export default [
  {
    title: "Epistemic foundations & core mental models",
    weekRange: "Week 1",
    objective:
      "Install the handful of load-bearing models — map vs territory, first principles, inversion, second-order effects — deeply enough to catch yourself using their absence.",
    deliverable:
      "A two-page post-mortem of one real failed decision: where the map was confused with the territory, what inversion would have caught, which second-order effects were ignored.",
    estHours: 5.5,
    nodes: [
      {
        title: "Map vs territory, and first-principles thinking",
        summary:
          "Models are compressions of reality, not reality — and problems deconstruct into foundational truths before they resynthesize into solutions.",
        learningObjectives: [
          "Why every metric, model and abstraction is a lossy map",
          "Spotting 'confusing the model with truth' in your own field",
          "First-principles deconstruction vs reasoning by analogy",
        ],
        whyToday:
          "Everything after this depends on being able to say 'that is a model, not the thing'. Without it, every later technique gets applied to the map and reports confidently on a territory nobody looked at.",
        principle:
          "The map is useful because it leaves things out. It fails when you forget which things.",
        commonMistake:
          "Treating a metric as the thing it measures. Revenue is not health, a test score is not understanding, and a five-star average is not quality — but each is what gets optimised once nobody says the difference out loud.",
        challenge:
          "Take one number your work runs on. Write down what it actually measures, what it is used as a proxy for, and three ways those could come apart. Then say which of the three you have already seen happen.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Compression is the point",
            detail:
              "A model that kept everything would be the thing itself and equally hard to reason about. Usefulness comes from what it discards, which is also where it fails.",
          },
          {
            title: "The tell",
            detail:
              "You have confused the two when a surprising result makes you doubt reality rather than the model. That reaction is diagnostic and it is fast enough to catch.",
          },
          {
            title: "First principles",
            detail:
              "Break a problem to things you believe are true independently of the current solution, then rebuild. Slow, and the only route past a local optimum everyone shares.",
          },
          {
            title: "Reasoning by analogy",
            detail:
              "Fast, usually right, and it cannot produce anything the analogy did not already contain. Most work should be analogy; the decisions that matter should not.",
          },
        ],
        checks: [
          {
            question: "What makes a model useful, and what makes it fail?",
            answer:
              "The same thing — what it leaves out. It is tractable because it discards detail, and it misleads exactly where the discarded detail mattered.",
          },
          {
            question: "What is the tell that you have confused a model with reality?",
            answer:
              "A surprising result makes you doubt the world rather than the model. That reflex is the signal.",
          },
          {
            question: "When is reasoning by analogy the wrong tool?",
            answer:
              "When you need an answer the analogy cannot contain — anything requiring you to leave a local optimum the whole field shares.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Mental models: the best way to make intelligent decisions",
            url: "https://fs.blog/mental-models/",
            sourceName: "Farnam Street",
            editorNote:
              "The index for the whole discipline. Guardrail: do not try to memorise the taxonomy — this roadmap operationalizes a few models deeply instead.",
          },
          {
            type: "read",
            title: "First-principles thinking",
            url: "https://fs.blog/first-principles/",
            sourceName: "Farnam Street",
            editorNote:
              "Read for the method rather than the examples. The Musk anecdotes are the least useful part of it.",
          },
        ],
      },

      {
        title: "Circle of competence",
        summary: "The boundary between what you understand and what you merely have opinions about.",
        learningObjectives: [
          "Defining your circle honestly, in writing",
          "The tells that you have crossed the boundary",
          "Operating near the edge: borrowing competence vs pretending it",
        ],
        whyToday:
          "Every technique in this roadmap works better inside your competence and can actively mislead outside it. Knowing the boundary is what stops a well-executed analysis of something you do not understand.",
        principle:
          "The size of the circle does not matter. Knowing where its edge is does.",
        commonMistake:
          "Treating fluency as competence. Being able to talk about something convincingly is a different skill from being able to predict it, and the first grows much faster than the second.",
        challenge:
          "Write three lists: what you could be usefully wrong about in public, what you have opinions on but could not defend against an expert, and what you know you do not know. Being honest about list two is the exercise.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "Competence is predictive",
            detail:
              "You are competent where you can predict outcomes better than a naive baseline. Not where you can explain them afterwards — that is much easier and much less useful.",
          },
          {
            title: "The tells",
            detail:
              "Reaching for analogy from a different domain, arguing from authority you do not hold, feeling certain without being able to say what would change your mind.",
          },
          {
            title: "Borrowing competence",
            detail:
              "Asking somebody inside their circle, and being able to evaluate whether their answer is well-formed even when you cannot evaluate the answer.",
          },
          {
            title: "The circle moves",
            detail:
              "It grows with work and shrinks with time away. A boundary drawn five years ago is a description of somebody else.",
          },
        ],
        checks: [
          {
            question: "What actually defines competence here?",
            answer:
              "Being able to predict outcomes better than a naive baseline — not being able to explain them after the fact, which is far easier.",
          },
          {
            question: "Name a tell that you have crossed the boundary.",
            answer:
              "Feeling certain while unable to say what evidence would change your mind. Also reaching for analogies from unrelated domains.",
          },
          {
            question: "What does borrowing competence require of you?",
            answer:
              "Being able to judge whether an expert's answer is well-formed, even when you cannot judge the answer itself.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Circle of competence",
            url: "https://fs.blog/circle-of-competence/",
            sourceName: "Farnam Street",
            editorNote:
              "Short. The useful part is the section on operating at the edge rather than the Buffett framing.",
          },
        ],
      },

      {
        title: "Inversion",
        summary:
          "Solve 'how do I guarantee failure?' and delete those paths — often easier and safer than optimizing for success.",
        learningObjectives: [
          "Forward vs backward problem framing",
          "Failure-mode enumeration as a design tool",
          "Running a pre-mortem on a live project",
        ],
        whyToday:
          "Forward reasoning about success produces a long list of things that might help. Backward reasoning about failure produces a short list of things that will definitely hurt, and the short list is actionable.",
        principle:
          "Avoiding stupidity is easier than seeking brilliance, and the returns are more reliable.",
        commonMistake:
          "Running a pre-mortem after the plan is agreed. By then it is a ritual — the plan has advocates, and the exercise finds only the failures nobody is attached to.",
        challenge:
          "Take a live project. Write the sentence 'it is six months later and this failed completely', then list every reason, without ranking. Then look at how many are already visible today.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The inversion",
            detail:
              "Instead of 'how do I succeed', ask 'how would I guarantee failure' and then avoid those. It surfaces different answers, not the same ones reversed.",
          },
          {
            title: "The pre-mortem",
            detail:
              "State the failure as already having happened, then explain it. The past tense is what unlocks the answers — 'this might fail' produces politeness, 'this failed' produces reasons.",
          },
          {
            title: "Do it before commitment",
            detail:
              "Once a plan has advocates the exercise becomes theatre. The value is entirely in doing it while the plan can still change.",
          },
          {
            title: "Asymmetry",
            detail:
              "Avoiding a fatal error is worth more than adding a marginal improvement, because one of them ends the game.",
          },
        ],
        checks: [
          {
            question: "Why phrase a pre-mortem in the past tense?",
            answer:
              "'This failed' invites explanations; 'this might fail' invites reassurance. The tense changes what people say.",
          },
          {
            question: "Why does inversion produce different answers rather than reversed ones?",
            answer:
              "Failure modes are not the negation of success factors. Different questions surface different memories and different evidence.",
          },
          {
            question: "When must a pre-mortem happen?",
            answer:
              "Before commitment. After the plan has advocates it finds only failures nobody is invested in.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Inversion",
            url: "https://fs.blog/inversion/",
            sourceName: "Farnam Street",
            editorNote:
              "The pre-mortem section is the operational part. Do the exercise on a real project rather than reading the examples.",
          },
        ],
      },

      {
        title: "Second-order effects and the razors",
        summary: "Trace consequences past T0, and default to incompetence before conspiracy.",
        learningObjectives: [
          "Second- and nth-order consequence tracing",
          "Occam's razor: minimal assumptions win ties",
          "Hanlon's razor: systemic failure before malice",
        ],
        whyToday:
          "Most bad decisions are good first-order decisions. The cost arrives at the second order, where nobody looked, and by then it is attributed to something else.",
        principle:
          "Ask 'and then what?' three times. Almost nobody asks it twice, and the second answer is usually where the decision actually lives.",
        commonMistake:
          "Stopping at the first order because it is the only one with clear evidence. Second-order effects are speculative by nature, which is why they get excluded — and why they are unpriced.",
        challenge:
          "Take a decision your organisation made recently. Write the first-order effect, then 'and then what?' three times. Then say which order the actual outcome landed at.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "And then what?",
            detail:
              "Each answer becomes the next question. Three iterations is usually enough to find the effect nobody planned for.",
          },
          {
            title: "Where second-order effects come from",
            detail:
              "People respond to the change. Any decision that alters incentives has a second order, and the response is usually rational and unwelcome.",
          },
          {
            title: "Occam's razor",
            detail:
              "Where explanations fit equally, prefer the one with fewer assumptions. A tiebreaker, not a truth test — the simpler explanation is sometimes wrong.",
          },
          {
            title: "Hanlon's razor",
            detail:
              "Prefer incompetence, overload or a bad process to malice. Usually right, and it keeps you looking at the system where the fix actually is.",
          },
        ],
        checks: [
          {
            question: "Where do second-order effects usually come from?",
            answer:
              "People responding to the change. Anything that alters incentives produces a rational response nobody planned for.",
          },
          {
            question: "What is Occam's razor actually for?",
            answer:
              "Breaking ties between explanations that fit equally well. It is not evidence that the simpler one is true.",
          },
          {
            question: "Why is Hanlon's razor practically useful, beyond charity?",
            answer:
              "It keeps attention on the system, which is where a fix exists. Malice explanations produce blame and no repair.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Second-order thinking",
            url: "https://fs.blog/second-order-thinking/",
            sourceName: "Farnam Street",
            editorNote:
              "Read the examples with your own decision in mind. The technique is trivial and the discipline of using it is not.",
          },
        ],
      },

      {
        title: "Assignment — the decision post-mortem",
        summary:
          "Pick one real failed decision and write the two-page audit: map/territory confusions, the missing inversion, the ignored second-order effects.",
        learningObjectives: [
          "Post-mortem structure: context, information at the time, models missed",
          "Naming the exact sentence where the map replaced the territory",
          "One process change you will actually adopt",
        ],
        whyToday:
          "Four models in four days is reading. Applying all four to a decision that actually cost you something is the first point at which any of it becomes yours.",
        principle:
          "Judge the decision by what you knew then, not by how it turned out. The whole roadmap is built on that separation.",
        commonMistake:
          "Writing the post-mortem about the outcome. A decision that was correct given the information and lost anyway has nothing to fix — and confusing the two teaches you to avoid good decisions that happened to lose.",
        challenge:
          "Two pages on one real failed decision. What you knew at the time, which of the four models would have helped, the exact sentence where a model became the truth, and one process change. Not what you should have done — what process would have caught it.",
        challengeMinutes: 60,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Reconstruct the information state",
            detail:
              "What you actually knew then, not what you know now. This is the hardest part and the only part that matters.",
          },
          {
            title: "Which model was missing",
            detail:
              "Name it specifically. 'I should have thought harder' is not a finding; 'I never asked and-then-what' is.",
          },
          {
            title: "Process, not resolve",
            detail:
              "The output is a change to how you decide, not a promise to be more careful. Promises do not survive the next deadline.",
          },
          {
            title: "Two pages",
            detail:
              "Long enough to be honest, short enough to finish. A post-mortem nobody completes teaches nothing.",
          },
        ],
        checks: [
          {
            question: "Against what should a decision be judged?",
            answer:
              "The information available when it was made. Judging by outcome punishes good decisions that lost and rewards bad ones that won.",
          },
          {
            question: "What makes a finding actionable?",
            answer:
              "It names a specific missing step. 'Think harder' is not one; 'never asked and-then-what' is.",
          },
          {
            question: "Why is reconstructing the information state the hard part?",
            answer:
              "Hindsight rewrites memory. You now know the outcome, which makes the warning signs feel like they were obvious.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "The Sequences — Map and Territory",
            url: "https://www.readthesequences.com/",
            sourceName: "readthesequences.com (LessWrong mirror)",
            editorNote:
              "Book I is the epistemic backbone of this module. Read a few essays alongside the assignment, not instead of it — passive consumption is this curriculum's named failure mode.",
          },
        ],
      },
    ],
  },

  {
    title: "Cognitive biases & decoupling outcomes",
    weekRange: "Week 2",
    objective:
      "Catch your own System 1 in the act — availability, confirmation, sunk cost — and permanently separate decision quality from outcome quality.",
    deliverable:
      "A standing decision journal with 14 days of entries: information at the time, explicit probabilities, models applied, and what would change your mind.",
    estHours: 5,
    nodes: [
      {
        title: "System 1 and System 2",
        summary: "Fast pattern-matching vs slow deliberate reasoning — and why the fast one answers first.",
        learningObjectives: [
          "The two-system architecture and its energy economics",
          "Which decisions deserve System 2 and which genuinely do not",
          "Cognitive load, fatigue, and error timing",
        ],
        whyToday:
          "The rest of this module is a catalogue of ways fast thinking goes wrong. The architecture is what makes those failures predictable rather than a list to memorise.",
        principle:
          "The fast system answers before you decide to think. Your only real control is noticing that it has, and choosing whether to check.",
        commonMistake:
          "Believing you can switch to slow thinking by intending to. You cannot; you can only build triggers — a checklist, a delay, a second person — that catch the fast answer before you act on it.",
        challenge:
          "For one day, note every decision where you noticed a fast answer arriving before you had reasoned. Count them. Then note which ones you actually checked.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Two systems",
            detail:
              "One fast, automatic and always running; one slow, effortful and lazy. The description is a useful model rather than neuroanatomy, and it earns its place by predicting the errors.",
          },
          {
            title: "Effort is real",
            detail:
              "Deliberate thinking is metabolically expensive, so the default is to accept the fast answer. That is efficient and it is why the errors cluster.",
          },
          {
            title: "Most decisions should be fast",
            detail:
              "Slow-thinking everything is not the goal. The skill is knowing which decisions are worth the cost, which is usually the irreversible ones.",
          },
          {
            title: "Errors have a timetable",
            detail:
              "Late in the day, under load, after a run of similar choices. Knowing when you are unreliable is more useful than trying to be reliable always.",
          },
          {
            title: "What survived replication",
            detail:
              "The two-system frame held up; several specific priming results did not. Take the architecture and be sceptical of the individual studies.",
          },
        ],
        checks: [
          {
            question: "Can you switch to deliberate thinking by deciding to?",
            answer:
              "Not reliably. You can build triggers — checklists, delays, a second reader — that catch the fast answer before it becomes an action.",
          },
          {
            question: "Why do errors cluster at particular times?",
            answer:
              "Deliberate thinking is effortful, so under fatigue or load the fast answer is accepted more often.",
          },
          {
            question: "Should every decision get System 2?",
            answer:
              "No. Most should not — the cost is real. Reserve it for the irreversible and the consequential.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Thinking, Fast and Slow",
            url: "https://en.wikipedia.org/wiki/Thinking,_Fast_and_Slow",
            sourceName: "Wikipedia",
            editorNote:
              "The summary carries the architecture; the book is the optional deep end. Note the replication-crisis section — priming chapters aged badly, the two-system frame did not.",
          },
        ],
      },

      {
        title: "Availability, representativeness and vividness",
        summary: "The mind judges probability by how easily examples come to mind. Easily ≠ often.",
        learningObjectives: [
          "Availability: recency and vividness masquerading as frequency",
          "Representativeness: category resemblance beating base rates",
          "Building the reflex: 'is this vivid, or is it common?'",
        ],
        whyToday:
          "These two produce most everyday probability errors, and they are the ones the news is optimised to trigger. Catching them is the highest-frequency win in the roadmap.",
        principle:
          "How easily you can imagine something is a fact about your memory, not about the world.",
        commonMistake:
          "Correcting for availability only on dramatic topics. It also runs on ordinary ones — the last project that went wrong shapes your estimate of the next far more than the twenty that went fine.",
        challenge:
          "Estimate the frequency of three things in your field from memory, writing the number first. Then find real data. Record the direction and size of each error — the direction is usually the same, and that is the finding.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Availability",
            detail:
              "Frequency judged by ease of recall. Recent, vivid and personally experienced events dominate, which means your estimate tracks coverage rather than incidence.",
          },
          {
            title: "Representativeness",
            detail:
              "Judging membership by resemblance to a stereotype while ignoring how common the category is. The engineer-versus-librarian problem in one line.",
          },
          {
            title: "Why vividness wins",
            detail:
              "Memory stores what was salient. Salience correlates with drama and inversely with frequency, which is exactly backwards for estimation.",
          },
          {
            title: "The reflex",
            detail:
              "Ask 'is this vivid or is this common' before answering. It is one question and it catches most of these.",
          },
        ],
        checks: [
          {
            question: "What does ease of recall actually measure?",
            answer:
              "Your memory's storage priorities — salience, recency, drama. Not how often the thing occurs.",
          },
          {
            question: "What does representativeness ignore?",
            answer:
              "The base rate. Resemblance to a category is treated as evidence of membership regardless of how rare the category is.",
          },
          {
            question: "Why does availability bite on ordinary topics too?",
            answer:
              "The last salient case dominates whatever the topic. One recent failure outweighs twenty quiet successes.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Base rate fallacy",
            url: "https://en.wikipedia.org/wiki/Base_rate_fallacy",
            sourceName: "Wikipedia",
            editorNote:
              "The worked examples are the point. You will return to this page on day 13 with the formula in hand and read it differently.",
          },
          {
            type: "read",
            title: "The Sequences — Predictably Wrong",
            url: "https://www.readthesequences.com/",
            sourceName: "readthesequences.com (LessWrong mirror)",
            editorNote:
              "Guardrail: the goal is catching these in YOUR next decision, not naming them in other people's. The bias blind spot is the trap the whole module walks past.",
          },
        ],
      },

      {
        title: "Confirmation bias and motivated reasoning",
        summary: "The brain as defence lawyer: evidence filtered to protect identity and prior belief.",
        learningObjectives: [
          "Selective search, selective memory, selective interpretation",
          "Identity-protective cognition — why smart people do it more",
          "The one working countermeasure: writing down what would change your mind",
        ],
        whyToday:
          "This is the bias that gets worse with intelligence, because a better reasoner builds better defences. Knowing that changes what countermeasure you reach for.",
        principle:
          "Write down what would change your mind, before the evidence arrives. Afterwards you will find a reason why this particular evidence does not count.",
        commonMistake:
          "Believing that knowing about confirmation bias reduces it. It does not measurably — the bias blind spot means you spot it in others and not in yourself, and reading more about it makes you better at explaining why you are the exception.",
        challenge:
          "Take a belief you hold about your field that others reasonably dispute. Write, in advance, the specific observation that would make you abandon it. If you cannot name one, that is the finding — and it is not a comfortable one.",
        challengeMinutes: 35,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Three mechanisms",
            detail:
              "Selective search finds supporting evidence, selective memory recalls it better, selective interpretation reads ambiguous data favourably. Three independent routes to the same place.",
          },
          {
            title: "Identity-protective cognition",
            detail:
              "When a belief is part of who you are, disconfirming it costs more than being wrong. Reasoning ability then serves the defence rather than the question.",
          },
          {
            title: "Why awareness does not fix it",
            detail:
              "The bias blind spot — you see it in others and not yourself. Awareness mostly improves your ability to explain why you are the exception.",
          },
          {
            title: "The pre-registered mind-changer",
            detail:
              "Naming the disconfirming observation in advance is the only countermeasure that reliably survives contact with the evidence.",
          },
        ],
        checks: [
          {
            question: "Why does intelligence not protect against this bias?",
            answer:
              "A better reasoner builds better defences for the belief. Reasoning ability serves whatever the motivation is.",
          },
          {
            question: "What is the bias blind spot?",
            answer:
              "Recognising a bias in others while not detecting it in yourself. It is why awareness alone changes little.",
          },
          {
            question: "Why must the mind-changer be written in advance?",
            answer:
              "Afterwards you will find a reason this particular evidence does not count. Committing beforehand removes that option.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Confirmation bias",
            url: "https://en.wikipedia.org/wiki/Confirmation_bias",
            sourceName: "Wikipedia",
            editorNote:
              "Read the mechanisms section rather than the examples. The three routes matter more than any single study.",
          },
        ],
      },

      {
        title: "Resulting, sunk costs and scope insensitivity",
        summary:
          "A good decision can lose and a bad one can win — judging by outcome is the error this whole curriculum exists to kill.",
        learningObjectives: [
          "Resulting: process quality vs outcome quality, with expected value as the judge",
          "Sunk cost: when unrecoverable spend dictates future allocation",
          "Scope insensitivity: intuition failing to scale across orders of magnitude",
        ],
        whyToday:
          "Resulting is the single most expensive habit in this list, because it corrupts every lesson you draw from experience. If outcomes teach you, and outcomes are noisy, experience makes you confidently worse.",
        principle:
          "Judge the process. The outcome is one sample from a distribution you cannot see.",
        commonMistake:
          "Learning from results. A team that promotes on outcomes and a person who updates on outcomes both end up rewarding luck, and both feel like they are being rigorous.",
        challenge:
          "Find one decision in your organisation praised for its outcome. Ask what would have happened under the same process with normal bad luck. Then find one criticised for its outcome and do the same.",
        challengeMinutes: 40,
        estMinutes: 75,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Resulting",
            detail:
              "Judging a decision by how it turned out. With any real variance the outcome is a weak signal about the process, and it is the only signal most people use.",
          },
          {
            title: "Sunk cost",
            detail:
              "Unrecoverable spend has no bearing on the best action now, and it dominates anyway — because abandoning is an admission and continuing is not.",
          },
          {
            title: "Scope insensitivity",
            detail:
              "Willingness to act barely changes between two thousand and two hundred thousand affected. Intuition encodes the presence of a problem, not its size.",
          },
          {
            title: "What to do instead",
            detail:
              "Record the process at decision time. Then the outcome can be compared against what you expected, which is the only way to learn from a noisy signal.",
          },
        ],
        checks: [
          {
            question: "What is resulting?",
            answer:
              "Judging a decision's quality by its outcome. With real variance the outcome says little about the process.",
          },
          {
            question: "Why do sunk costs dominate despite being irrelevant?",
            answer:
              "Abandoning is a public admission that the earlier spend was wasted; continuing is not. The pressure is social rather than logical.",
          },
          {
            question: "What does scope insensitivity mean practically?",
            answer:
              "Intuition registers that a problem exists but not how big it is, so responses barely scale with magnitude.",
          },
          {
            question:
              "Your company promotes the manager whose product shipped and passes over the one whose didn't. What is wrong with that?",
            answer:
              "It may be resulting. Both processes need examining: a shipped product built on a bad process succeeded despite it, and a failed one built well failed for reasons outside the decision. Promoting on outcomes in a high-variance environment rewards luck and teaches everyone to take risks that look good in expectation of noise.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Outcome bias",
            url: "https://en.wikipedia.org/wiki/Outcome_bias",
            sourceName: "Wikipedia",
            editorNote: "Short, and the definition is the part to hold onto.",
          },
          {
            type: "read",
            title: "Sunk cost",
            url: "https://en.wikipedia.org/wiki/Sunk_cost",
            sourceName: "Wikipedia",
            editorNote:
              "Note the section on why the fallacy persists — the social explanation is more useful than the economic one.",
          },
          {
            type: "read",
            title: "Scope neglect",
            url: "https://en.wikipedia.org/wiki/Scope_neglect",
            sourceName: "Wikipedia",
            editorNote:
              "The willingness-to-pay studies are the clearest demonstration. Two minutes.",
          },
        ],
      },

      {
        title: "Assignment — the decision journal",
        summary:
          "Fourteen days of non-trivial decisions logged before their outcomes are known: context, probabilities, models, and what would change your mind.",
        learningObjectives: [
          "The four-field entry: information at the time, expected probabilities, models applied, mind-changers",
          "Making entries immutable — no editing after outcomes arrive",
          "Why the journal is the only cure for hindsight rewriting your memory",
        ],
        whyToday:
          "Every technique so far fails silently because you cannot remember what you actually believed. The journal is the instrument that makes the rest measurable, and it has to start now to have anything in it by the capstone.",
        principle:
          "Write it down before you know. Memory is reconstructive, and it reconstructs in favour of whatever you learned since.",
        commonMistake:
          "Editing an entry after the outcome. It feels like correcting a record and it destroys the only thing the journal was for — evidence of what you believed when you did not know.",
        challenge:
          "Start it today, with the four fields, on one real decision. Then keep it for fourteen days. Day 24's capstone reads these entries, so a journal begun in week four has nothing to say.",
        challengeMinutes: 30,
        estMinutes: 60,
        points: 40,
        difficulty: "core",
        topics: [
          {
            title: "The four fields",
            detail:
              "What you knew, what you expected and with what probability, which models you applied, and what would change your mind. Four lines, not an essay.",
          },
          {
            title: "Immutability",
            detail:
              "Never edit after an outcome. Append a separate resolution entry instead — the original has to stay wrong where it was wrong.",
          },
          {
            title: "Non-trivial only",
            detail:
              "Decisions with a real alternative and a knowable outcome. Logging everything makes it a chore that stops in a week.",
          },
          {
            title: "Why it works",
            detail:
              "Hindsight bias makes the past feel more predictable than it was. A written record is the only thing that survives it.",
          },
        ],
        checks: [
          {
            question: "Why must entries be immutable?",
            answer:
              "Editing after the outcome destroys the evidence of what you believed while you did not know — which is the entire purpose.",
          },
          {
            question: "What are the four fields?",
            answer:
              "Information at the time, expected outcome with a probability, models applied, and what would change your mind.",
          },
          {
            question: "Why start today rather than later?",
            answer:
              "The capstone on day 24 reads these entries. A journal begun in week four has nothing in it to analyse.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "The decision journal",
            url: "https://fs.blog/decision-journal/",
            sourceName: "Farnam Street",
            editorNote:
              "Template included. Start it today; module 5's capstone feeds on these entries.",
          },
        ],
      },
    ],
  },

  {
    title: "Bayesian reasoning & base rates",
    weekRange: "Week 3",
    objective:
      "Replace true/false with probabilities, anchor them in empirical base rates, and update incrementally by the strength of evidence.",
    deliverable:
      "A Bayesian diagnostic matrix for one live thesis in your field: explicit prior, three pieces of evidence, and the computed posterior for each.",
    estHours: 5,
    nodes: [
      {
        title: "Base rates before case details",
        summary:
          "Before analysing the specifics, ask: how often does this happen in general? Then defend the number.",
        learningObjectives: [
          "Base-rate neglect and the inside view's seduction",
          "Finding empirical priors instead of guessing them",
          "Grounding a baseline in real historical data",
        ],
        whyToday:
          "The single highest-value habit in forecasting, and the one people abandon fastest — because the specifics of your case always feel more relevant than a statistic about other cases.",
        principle:
          "Start outside. How often does this kind of thing happen in general, before anything about this instance.",
        commonMistake:
          "Skipping the base rate because this case is different. It always is, and it is still drawn from a distribution. Adjusting from a base rate beats reasoning from the case every time it has been measured.",
        challenge:
          "Take a project you are estimating. Find how long comparable projects actually took — not your estimate, the record. Then state your estimate as an adjustment from that number, and say what justifies the adjustment.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Outside view first",
            detail:
              "The reference class: what happened to similar cases. It ignores everything specific about yours, which is exactly why it works.",
          },
          {
            title: "The inside view",
            detail:
              "Reasoning from the details of this case. Compelling, detailed, and systematically optimistic — it is where planning-fallacy estimates come from.",
          },
          {
            title: "Choosing a reference class",
            detail:
              "Too narrow and you have no data; too broad and it is not about your case. Choosing it is where the judgement lives.",
          },
          {
            title: "Finding real numbers",
            detail:
              "Your own historical records first, then published data. A guessed prior inherits every bias the last four days catalogued.",
          },
        ],
        checks: [
          {
            question: "What is the outside view?",
            answer:
              "The base rate from a reference class of similar cases, ignoring the specifics of yours.",
          },
          {
            question: "Why is the inside view systematically optimistic?",
            answer:
              "It reasons from a plan, and plans do not contain their own failure modes. That is the planning fallacy.",
          },
          {
            question: "Where does the judgement actually sit?",
            answer:
              "In choosing the reference class. Too narrow gives no data; too broad describes something else.",
          },
        ],
        resources: [
          {
            type: "tool",
            title: "Our World in Data",
            url: "https://ourworldindata.org/",
            sourceName: "Our World in Data",
            editorNote:
              "The empirical anchor for this whole module: pull real baselines from here before trusting your impression of one. CC BY, so unlike most of this roadmap you may quote it with attribution.",
          },
        ],
      },

      {
        title: "Bayes' theorem, mechanically",
        summary: "Prior × likelihood ratio = posterior. The formula is small; the habit is the skill.",
        learningObjectives: [
          "P(A|B) = P(B|A)·P(A) / P(B), each term in words",
          "The likelihood ratio as 'diagnostic strength of evidence'",
          "Working two worked examples by hand, including a medical-test one",
        ],
        whyToday:
          "The formula makes precise what the last five days described loosely. Doing it by hand twice is what turns 'consider the base rate' into a number you can defend.",
        principle:
          "Evidence multiplies a prior; it does not replace it. A test that is right 99% of the time on a condition affecting one in ten thousand still mostly returns false positives.",
        commonMistake:
          "Reading a test's accuracy as the probability you have the thing. Those are different numbers and the gap is enormous when the base rate is low — which is the case in every screening programme.",
        challenge:
          "Work the medical-test example by hand: 1-in-1000 prevalence, 99% sensitivity, 5% false positive rate. Compute the probability of having the condition given a positive result. Then explain the answer to somebody in one sentence.",
        challengeMinutes: 50,
        estMinutes: 90,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The terms in words",
            detail:
              "Prior: how likely before this evidence. Likelihood: how expected this evidence is if true. Posterior: how likely now. The algebra is bookkeeping over those three.",
          },
          {
            title: "The likelihood ratio",
            detail:
              "How much more likely this evidence is under the hypothesis than against it. It is the whole diagnostic strength of a piece of evidence in one number.",
          },
          {
            title: "Why low base rates dominate",
            detail:
              "With a rare condition, the small false-positive rate applied to a huge healthy population produces more false positives than true ones. Accuracy does not rescue it.",
          },
          {
            title: "Natural frequencies",
            detail:
              "Restating the problem as counts out of 10,000 rather than percentages makes it solvable in your head. The same maths, far fewer errors.",
          },
        ],
        checks: [
          {
            question: "What does the likelihood ratio express?",
            answer:
              "How much more expected this evidence is if the hypothesis is true than if it is false — the diagnostic strength of the evidence.",
          },
          {
            question: "Why do rare conditions produce mostly false positives?",
            answer:
              "The false-positive rate applies to a very large healthy population, so it generates more positives than the small true population does.",
          },
          {
            question: "What are natural frequencies and why use them?",
            answer:
              "Restating probabilities as counts out of a fixed population. Same arithmetic, far fewer errors, and solvable without a calculator.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Bayes' theorem",
            url: "https://en.wikipedia.org/wiki/Bayes%27_theorem",
            sourceName: "Wikipedia",
            editorNote:
              "Read the drug-testing example specifically and work it yourself before reading the answer.",
          },
          {
            type: "read",
            title: "The Sequences — how to actually change your mind",
            url: "https://www.readthesequences.com/",
            sourceName: "readthesequences.com (LessWrong mirror)",
            editorNote:
              "The intuitive-Bayes material lives here; read it after the mechanical version, not instead.",
          },
        ],
      },

      {
        title: "Incremental updating",
        summary:
          "Beliefs move in small steps proportional to evidence strength — not binary flips on noisy data.",
        learningObjectives: [
          "Over-updating on vivid noise vs under-updating on dull signal",
          "Chaining updates: yesterday's posterior is today's prior",
          "Holding numeric beliefs you are willing to say out loud",
        ],
        whyToday:
          "Yesterday gave you the formula. Today is about the size of the step, which is where the practical errors are — people flip on one dramatic data point and ignore ten dull ones.",
        principle:
          "The size of the update should match the strength of the evidence, and most evidence is weaker than it feels.",
        commonMistake:
          "Over-updating on the vivid and under-updating on the dull. One angry customer moves a view further than a survey of two hundred, and the survey is the stronger evidence by an enormous margin.",
        challenge:
          "Take a belief you hold at roughly 70%. Write it as a number. Then list three pieces of evidence you encountered this month and, for each, the direction and rough size of the update it should have caused. Compare with how much your view actually moved.",
        challengeMinutes: 40,
        estMinutes: 60,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Proportionality",
            detail:
              "Strong evidence, big move; weak evidence, small move. Most updates should be small, and a belief that swings wildly is responding to noise.",
          },
          {
            title: "Chaining",
            detail:
              "Today's posterior is tomorrow's prior. Done properly, many small updates converge — which is why frequency beats drama.",
          },
          {
            title: "Say the number",
            detail:
              "'Fairly likely' cannot be updated or checked. 70% can be both, and forces you to notice when you have not actually moved.",
          },
          {
            title: "The two failure modes",
            detail:
              "Over-updating looks like decisiveness and under-updating looks like consistency. Both are failures to weigh evidence.",
          },
        ],
        checks: [
          {
            question: "How large should an update be?",
            answer:
              "Proportional to the strength of the evidence, which usually means small. Most evidence is weaker than it feels.",
          },
          {
            question: "What does chaining mean?",
            answer:
              "Today's posterior becomes tomorrow's prior, so a sequence of small updates accumulates correctly.",
          },
          {
            question: "Why state beliefs as numbers?",
            answer:
              "A verbal confidence cannot be updated or checked. A number can be both, and it exposes when you did not actually move.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "Base rate fallacy",
            url: "https://en.wikipedia.org/wiki/Base_rate_fallacy",
            sourceName: "Wikipedia",
            editorNote:
              "Re-read the worked examples now that the formula is in hand — they read differently.",
          },
        ],
      },

      {
        title: "Assignment — the Bayesian diagnostic matrix",
        summary:
          "One debated thesis from your field, one explicit prior, three pieces of evidence, three computed posteriors — measuring how much your view should actually move.",
        learningObjectives: [
          "Setting a numeric prior you can defend",
          "Estimating likelihood ratios for real evidence",
          "Noticing when the computed shift is smaller than your felt shift",
        ],
        whyToday:
          "The point of the module lands here: comparing the movement the arithmetic justifies against the movement you actually felt. The gap is usually large and always instructive.",
        principle:
          "Compute the update, then compare it with the one you felt. The difference is the bias, quantified.",
        commonMistake:
          "Choosing a thesis you already hold at 95%. Nothing moves and nothing is learned — pick one you genuinely hold at somewhere between 40 and 70, where an update is visible.",
        challenge:
          "One genuinely debated thesis. Write the prior as a number and defend it in two sentences. Then three pieces of real evidence with estimated likelihood ratios, computed posteriors, and a final line comparing the computed shift with your felt one.",
        challengeMinutes: 60,
        estMinutes: 90,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Choosing the thesis",
            detail:
              "Genuinely uncertain, genuinely contested, and something you care about. A safe choice makes a safe exercise.",
          },
          {
            title: "Defending the prior",
            detail:
              "Two sentences on why that number and not one twenty points either side. This is where base rates from day 11 earn their place.",
          },
          {
            title: "Estimating likelihood ratios",
            detail:
              "You are estimating, not measuring. A ratio of 2 or 3 is a lot; people routinely assume 10 for evidence that barely discriminates.",
          },
          {
            title: "The comparison line",
            detail:
              "The computed shift against the felt one. Writing that sentence is the whole assignment.",
          },
        ],
        checks: [
          {
            question: "Why not choose a thesis you hold at 95%?",
            answer:
              "Nothing moves. Pick something between roughly 40 and 70% where an update is visible and instructive.",
          },
          {
            question: "How large is a large likelihood ratio in practice?",
            answer:
              "Two or three is substantial. People routinely assume ten for evidence that barely discriminates between hypotheses.",
          },
          {
            question: "What is the actual deliverable?",
            answer:
              "The comparison between the shift the arithmetic justifies and the shift you felt. That gap is the bias made numeric.",
          },
        ],
        resources: [],
      },
    ],
  },
];
