/**
 * Medical coding — modules 1–4, days 1–20.
 *
 * What the job is, the terminology it runs on, how an ICD-10-CM code is
 * built, and the official guidelines that decide which one is right.
 */
export default [
  {
    title: "What a coder actually does",
    weekRange: "Week 1",
    objective: "Understand the money, the documents and the people before touching a code.",
    deliverable: "A written walk-through of one claim from encounter to payment.",
    estHours: 4,
    nodes: [
      {
        title: "The encounter, the record and the claim",
        summary:
          "A patient is seen, a clinician writes it down, and somebody turns that writing into codes a payer will act on. That somebody is you.",
        learningObjectives: [
          "Trace an encounter from the clinical note to a paid claim",
          "Name who reads the code after you assign it, and what they do with it",
          "Say why the coder is not the person deciding what care was given",
        ],
        whyToday:
          "Almost everyone learns coding as a lookup exercise and then cannot explain why a claim was denied. The lookup is ten percent of it. The other ninety is knowing what the code is FOR, and it is for a payment decision somebody else makes.",
        principle:
          "You are not describing the patient. You are describing what the clinician documented, in a vocabulary a payer's system can read.",
        commonMistake:
          "Coding what you believe happened rather than what the note says. If the physician did not document it, it did not happen — and coding it anyway is not helpfulness, it is a false claim.",
        challenge:
          "Write the path of a single routine encounter end to end: who sees the patient, what gets written, who reads it, what codes come out, where the claim goes, who pays and how long it takes. Name every party. Most first attempts miss at least two.",
        challengeMinutes: 35,
        estMinutes: 55,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "The clinical note is the source of truth",
            detail:
              "Everything you assign has to be supported by something a clinician wrote. Your job is translation, and translation cannot add facts.",
          },
          {
            title: "Two questions, two code sets",
            detail:
              "Diagnosis codes say why the patient was seen; procedure codes say what was done. They are separate systems maintained by separate bodies, and a claim needs both to make sense.",
          },
          {
            title: "Who reads it afterwards",
            detail:
              "A payer's adjudication system first, then sometimes a human reviewer, then possibly an auditor years later. All three see only what you coded, never what you meant.",
          },
          {
            title: "Where the money actually moves",
            detail:
              "The claim goes to the payer, the payer applies a fee schedule and its own edits, and what comes back is a remittance saying what was allowed and what was not. The gap between billed and allowed is where the job lives.",
          },
        ],
        checks: [
          {
            question: "What is the source of truth for a code?",
            answer:
              "The clinician's documentation. If it is not in the record, it cannot be coded, however obvious it seems.",
          },
          {
            question: "Why does a claim need both diagnosis and procedure codes?",
            answer:
              "One says why the patient was seen, the other says what was done. A payer decides whether the second was justified by the first.",
          },
          {
            question: "Who reads the code after you assign it?",
            answer:
              "The payer's adjudication system, sometimes a human reviewer, and potentially an auditor much later. None of them can see your reasoning.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "What is medical coding",
            url: "https://www.aapc.com/resources/what-is-medical-coding",
            sourceName: "AAPC",
            editorNote:
              "The clearest short overview of the job. AAPC sells the certification, so read the description and ignore the course pitch — day 40 covers what the exam actually costs.",
          },
          {
            type: "doc",
            title: "Medicare Claims Processing — the Internet-Only Manuals",
            url:
              "https://www.cms.gov/medicare/regulations-guidance/manuals/internet-only-manuals-ioms",
            sourceName: "CMS",
            editorNote:
              "The actual rulebook, free and public domain. Do not read it today — bookmark it and notice that it exists, because every argument later in this roadmap ends here.",
          },
        ],
      },
      {
        title: "The three code sets, and who owns each",
        summary:
          "ICD-10-CM for diagnoses, CPT for physician procedures, HCPCS Level II for everything else — and only one of them is free.",
        learningObjectives: [
          "Name the three sets, what each covers, and who maintains it",
          "Say which are freely published and which are copyrighted",
          "Explain why that ownership shapes how you will learn this",
        ],
        whyToday:
          "The ownership question is not trivia — it determines what you can practise on. ICD-10-CM files are published free by the US government. CPT is owned by the American Medical Association and the code book costs money. Knowing this on day two stops you looking for a free CPT list that does not legally exist.",
        principle:
          "Two of the three code sets are somebody's copyrighted property. You can learn the method for free; you cannot get the full CPT set for free, and anywhere offering it is not a source you should be using.",
        commonMistake:
          "Downloading a 'free CPT code list' from a content site. Those are unlicensed copies, they are frequently out of date, and building a habit on one means learning last year's codes as this year's.",
        challenge:
          "Open the CMS ICD-10 page and download the current code files — they are free and official. Then write one paragraph on what you can and cannot get free for CPT, and what that means for how you will practise.",
        challengeMinutes: 30,
        estMinutes: 50,
        points: 30,
        difficulty: "intro",
        topics: [
          {
            title: "ICD-10-CM — diagnoses",
            detail:
              "Maintained by CDC/NCHS with CMS. The code files and the official guidelines are published free and are US government works, so they are in the public domain.",
          },
          {
            title: "ICD-10-PCS — inpatient procedures",
            detail:
              "Maintained by CMS, also free. Used for hospital inpatient procedures only, and built completely differently from CPT — seven characters, each a position with meaning.",
          },
          {
            title: "CPT — physician procedures",
            detail:
              "Owned by the American Medical Association. The code set is copyrighted and the manual is a commercial product. You will learn its structure and rules here and buy or borrow the book to work with it.",
          },
          {
            title: "HCPCS Level II — everything else",
            detail:
              "Supplies, drugs, ambulance, durable equipment. Maintained by CMS and free, which makes it the one procedure set you can explore fully without buying anything.",
          },
          {
            title: "Why this roadmap is built the way it is",
            detail:
              "Every link here is to material a government agency published. That covers ICD-10-CM, ICD-10-PCS, HCPCS, the payment rules and the compliance regime in full, and it covers CPT's rules but never its codes.",
          },
        ],
        checks: [
          {
            question: "Which code sets are freely published, and by whom?",
            answer:
              "ICD-10-CM and ICD-10-PCS by CDC/NCHS and CMS, and HCPCS Level II by CMS. All are US government works and therefore public domain.",
          },
          {
            question: "Who owns CPT, and what follows from that?",
            answer:
              "The American Medical Association. The code set is copyrighted, so the manual is a purchase and no legitimate free full listing exists.",
          },
          {
            question: "What is ICD-10-PCS for?",
            answer:
              "Hospital inpatient procedures. It is structurally unlike CPT — seven characters, each position carrying a defined meaning.",
          },
          {
            question: "A colleague sends you a free CPT lookup site. What do you do?",
            answer:
              "Do not rely on it. A full CPT listing outside AMA licensing is an unlicensed copy, and unlicensed copies are typically stale — which in this job means billing last year's codes. Use the licensed manual or your employer's encoder.",
            kind: "interview",
            difficulty: "easy",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10 code files and guidelines",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "The official files, free, updated every October. Download this year's — you will use it for the rest of the roadmap.",
          },
          {
            type: "doc",
            title: "HCPCS place of service code set",
            url: "https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets",
            sourceName: "CMS",
            editorNote:
              "A small, complete, free code set. Worth skimming today just to see what an official code list looks like before meeting a large one.",
          },
        ],
      },
      {
        title: "Where the money comes from",
        summary:
          "Fee schedules, relative value units and the difference between what is billed and what is allowed.",
        learningObjectives: [
          "Explain how a physician fee schedule turns a code into an amount",
          "Distinguish billed, allowed, paid and patient responsibility",
          "Say why the coder affects revenue without ever setting a price",
        ],
        whyToday:
          "Coding is a revenue function, and a coder who cannot read a remittance cannot tell a denial from an adjustment. Today is the arithmetic that makes the rest of the job legible.",
        principle:
          "You never choose a price. You choose a code, and the code chooses the price from a schedule somebody else set.",
        commonMistake:
          "Treating the billed amount as the number that matters. It is close to fiction — the allowed amount from the fee schedule is what will be paid, and the difference is written off, not collected.",
        challenge:
          "Look up one common code on the physician fee schedule and find its allowed amount for a locality. Then write the four numbers for a hypothetical claim: billed, allowed, paid by the payer, and patient responsibility. Explain what happens to the gap.",
        challengeMinutes: 35,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The fee schedule",
            detail:
              "A published list mapping each procedure code to an amount, adjusted by geography. Medicare's is public; commercial payers negotiate their own, often expressed as a percentage of it.",
          },
          {
            title: "Relative value units",
            detail:
              "Each code carries RVUs for physician work, practice expense and malpractice risk. Multiply by a conversion factor and you have the payment — which is why an RVU change is a pay cut nobody announces as one.",
          },
          {
            title: "Billed, allowed, paid, responsibility",
            detail:
              "Billed is what the practice asked for. Allowed is what the contract permits. Paid is the payer's share. Responsibility is the patient's. Billed minus allowed is a contractual write-off and is never collected.",
          },
          {
            title: "How a coder moves revenue",
            detail:
              "By assigning the code the documentation supports rather than a less specific one. Not by choosing a bigger code — that is fraud, and day 37 covers what happens.",
          },
        ],
        checks: [
          {
            question: "What is the difference between billed and allowed?",
            answer:
              "Billed is what the practice charged; allowed is what the payer contract permits. The difference is a contractual write-off, not a debt.",
          },
          {
            question: "What are RVUs?",
            answer:
              "Relative value units for physician work, practice expense and malpractice risk. Multiplied by a conversion factor, they produce the payment for a code.",
          },
          {
            question: "How does a coder legitimately affect revenue?",
            answer:
              "By coding to the specificity the documentation supports. Choosing a higher-paying code the record does not support is upcoding, which is fraud.",
          },
          {
            question:
              "Walk me through what happens between a patient visit and the practice being paid.",
            answer:
              "The clinician documents the encounter. A coder abstracts diagnoses and procedures from that documentation into ICD-10-CM and CPT or HCPCS codes. Those go onto a claim with the payer, patient and provider identifiers, and are submitted electronically. The payer adjudicates — checking eligibility, medical necessity and its own edits — and returns a remittance showing what was paid, adjusted or denied. Denials go to appeal or correction, and the patient is billed for whatever remains. The coder sits at one step but every later step depends on it.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Physician Fee Schedule",
            url: "https://www.cms.gov/medicare/payment/fee-schedules/physician",
            sourceName: "CMS",
            editorNote:
              "The search tool is the useful part. Look up one code and read every column — the RVU breakdown is today's lesson made concrete.",
          },
        ],
      },
      {
        title: "The people and the places",
        summary:
          "Provider, payer, clearinghouse, patient — and why place of service changes the payment.",
        learningObjectives: [
          "Name each party in a claim and what it does",
          "Say what a clearinghouse is for",
          "Explain why the same procedure pays differently in two settings",
        ],
        whyToday:
          "Place of service is a two-digit code that changes the money, and it is one of the most common quiet errors. Understanding the parties is what makes it obvious why.",
        principle:
          "The same work in a hospital and in an office is not the same claim. The setting is part of what was done.",
        commonMistake:
          "Leaving place of service at whatever the system defaults to. A telehealth visit coded as an office visit is a wrong claim even though every other field is right, and it is the sort of error an audit finds in bulk.",
        challenge:
          "Open the place-of-service code set and find the codes for office, outpatient hospital, inpatient hospital, and telehealth. Then write one sentence on why the payment differs between the first two for identical work.",
        challengeMinutes: 30,
        estMinutes: 50,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "Provider and payer",
            detail:
              "The provider delivers care and submits the claim; the payer adjudicates and pays. Government payers follow published rules, commercial payers follow contracts you may never see.",
          },
          {
            title: "The clearinghouse",
            detail:
              "A middleman that validates claim format and routes to the right payer. It catches structural errors before the payer does, which is faster and cheaper than a denial.",
          },
          {
            title: "Place of service",
            detail:
              "Two digits saying where care happened. It changes the payment because practice expense differs — a facility supplies the room and equipment, so the physician's component is smaller.",
          },
          {
            title: "The patient",
            detail:
              "Deductible, co-insurance and copay determine their share. A coding error usually reaches them as a bill they did not expect, which is how coding errors become complaints.",
          },
        ],
        checks: [
          {
            question: "What does a clearinghouse do?",
            answer:
              "Validates claim structure and routes claims to the correct payer, catching format errors before they become denials.",
          },
          {
            question: "Why does the same procedure pay less in a hospital outpatient setting?",
            answer:
              "The facility provides the room, equipment and staff, so the physician's practice-expense component is lower. The facility bills its own claim separately.",
          },
          {
            question: "Who ends up seeing the consequence of a coding error most often?",
            answer:
              "The patient, as an unexpected bill — which is how a coding error becomes a complaint rather than a correction.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Place of service codes",
            url: "https://www.cms.gov/medicare/coding-billing/place-of-service-codes",
            sourceName: "CMS",
            editorNote:
              "The full list with definitions. Short enough to read properly, and worth doing once so the two-digit codes stop being arbitrary.",
          },
          {
            type: "doc",
            title: "Electronic billing and EDI",
            url: "https://www.cms.gov/medicare/coding-billing/electronic-billing",
            sourceName: "CMS",
            editorNote:
              "How a claim physically reaches a payer. Skim — you need the shape, not the transaction-set details.",
          },
        ],
      },
      {
        title: "Reading a clinical note without being a clinician",
        summary:
          "Where the diagnosis lives, where the procedure lives, and what to do when the two disagree.",
        learningObjectives: [
          "Locate assessment, plan and procedure in a note",
          "Distinguish a documented diagnosis from a suspected one",
          "Write a query to a physician instead of guessing",
        ],
        whyToday:
          "The rest of this roadmap assumes you can find the facts in a record. Today is that skill, and it is the one that separates a coder from a code-lookup tool.",
        principle:
          "When the note is ambiguous, the answer is a question to the clinician — never your best guess, and never the code that pays more.",
        commonMistake:
          "Coding from the problem list. It carries historical conditions that may not have been addressed at this encounter, and coding them makes the claim say the patient was treated for something they were not.",
        challenge:
          "Find any published de-identified sample note — the NIH bookshelf has clinical case material — and mark where the diagnosis, the procedure and the plan each appear. Then write one physician query for something the note leaves genuinely unclear.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The parts of a note",
            detail:
              "Subjective, objective, assessment, plan is the common shape. The assessment carries the diagnosis; the plan carries what was ordered or done.",
          },
          {
            title: "Documented versus suspected",
            detail:
              "'Rule out', 'probable' and 'consistent with' are not confirmed diagnoses in the outpatient setting. Code the signs and symptoms instead — the inpatient rules differ, which is day 18.",
          },
          {
            title: "The problem list trap",
            detail:
              "A standing list of the patient's conditions. Only what was actually addressed at this encounter belongs on this claim.",
          },
          {
            title: "The physician query",
            detail:
              "A written, non-leading question asking the clinician to clarify. Non-leading matters: a query that suggests an answer is a compliance problem, not a clarification.",
          },
        ],
        checks: [
          {
            question: "What do you code when an outpatient note says 'rule out pneumonia'?",
            answer:
              "The signs and symptoms that prompted the workup, not pneumonia. An unconfirmed condition is not a diagnosis in the outpatient setting.",
          },
          {
            question: "Why is coding from the problem list wrong?",
            answer:
              "It lists conditions the patient has, not conditions addressed at this encounter. Coding them claims treatment that did not happen.",
          },
          {
            question: "What makes a physician query compliant?",
            answer:
              "It is written, it is specific, and it does not suggest an answer. A leading query is a compliance finding rather than a clarification.",
          },
          {
            question: "The note is ambiguous and the deadline is today. What do you do?",
            answer:
              "Query the physician and hold the claim. Coding a guess to meet a deadline puts a false statement on a claim, and the deadline is not a defence — every compliance programme in this field says the same thing.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
          {
            question:
              "The documentation is ambiguous and you cannot tell which of two codes applies. What do you do?",
            answer:
              "Query the provider. You do not choose the higher-paying option, you do not infer from the rest of the chart, and you do not code the vaguer unspecified option to avoid the conversation — although unspecified is correct when the documentation genuinely does not support more detail. The query must be non-leading: it presents what is documented and asks for clarification without suggesting the answer, because a leading query is itself a compliance finding.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "StatPearls — clinical documentation",
            url: "https://www.ncbi.nlm.nih.gov/books/NBK470564/",
            sourceName: "NIH National Library of Medicine",
            editorNote:
              "Free, peer-reviewed and public domain. Read it for the structure of a record rather than the clinical content.",
          },
        ],
      },
    ],
  },
  {
    title: "The language and the body",
    weekRange: "Weeks 1–2",
    objective: "Read a clinical term you have never seen and work out what it means.",
    deliverable: "A worked decomposition of twenty unfamiliar terms.",
    estHours: 4,
    nodes: [
      {
        title: "Roots, prefixes and suffixes",
        summary:
          "Medical vocabulary is assembled from parts. Learn about sixty of them and most terms become readable.",
        learningObjectives: [
          "Break an unfamiliar term into root, prefix and suffix",
          "Predict a meaning from the parts and then verify it",
          "Recognise the suffixes that signal a procedure rather than a condition",
        ],
        whyToday:
          "You will meet thousands of terms and cannot memorise them. You can memorise the roughly sixty pieces they are built from, and after that most terms decode on sight.",
        principle:
          "Decompose before you look up. A term you worked out stays; a term you looked up does not.",
        commonMistake:
          "Memorising whole terms as vocabulary. It works for a hundred and fails at a thousand, and the failure arrives exactly when the coding gets harder.",
        challenge:
          "Take twenty terms you do not know from any clinical page and decompose each into parts before looking any up. Then check. Your accuracy on the second ten should beat the first.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The root is the body part",
            detail:
              "cardi (heart), nephr (kidney), oste (bone), gastr (stomach). Almost every term is anchored on one of these.",
          },
          {
            title: "The prefix modifies",
            detail:
              "hyper (above), hypo (below), peri (around), endo (within), a/an (without). Small set, enormous coverage.",
          },
          {
            title: "The suffix says what kind of word it is",
            detail:
              "-itis inflammation, -ectomy removal, -ostomy an opening, -otomy an incision, -plasty repair. The suffix is what tells you whether you are reading a diagnosis or a procedure.",
          },
          {
            title: "Three suffixes worth separating carefully",
            detail:
              "-otomy is cutting into, -ostomy is creating an opening, -ectomy is taking out. They differ by two letters and by a great deal of money.",
          },
        ],
        checks: [
          {
            question: "What does 'nephrostomy' break down to, and what kind of term is it?",
            answer:
              "nephr (kidney) + -ostomy (creating an opening). A procedure — the suffix is what tells you.",
          },
          {
            question: "How do -otomy, -ostomy and -ectomy differ?",
            answer:
              "Cutting into, creating an opening, and removing. Two letters apart and clinically and financially distinct.",
          },
          {
            question: "Why decompose rather than look up?",
            answer:
              "Memorising whole terms does not scale past a few hundred. The parts number about sixty and cover most of the vocabulary.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "MedlinePlus health topics",
            url: "https://medlineplus.gov/healthtopics.html",
            sourceName: "NIH MedlinePlus",
            editorNote:
              "Public domain, plain language, and enormous. Use it as your source of unfamiliar terms to decompose rather than as reading.",
          },
        ],
      },
      {
        title: "Body systems, one at a time",
        summary:
          "Cardiovascular, respiratory, digestive, musculoskeletal — enough anatomy to code, not enough to practise medicine.",
        learningObjectives: [
          "Name the major systems and their principal organs",
          "Say which ICD-10-CM chapter covers each",
          "Locate a structure well enough to choose between similar codes",
        ],
        whyToday:
          "ICD-10-CM is organised by body system, so the chapter you need is chosen by anatomy before you look at a single code. Not knowing the anatomy means searching alphabetically forever.",
        principle:
          "You need enough anatomy to navigate the book, and no more. This is not clinical training and nothing here is medical advice.",
        commonMistake:
          "Trying to learn anatomy to a clinical standard. It is months of work you do not need — the requirement is knowing which system a structure belongs to and how structures relate.",
        challenge:
          "For each major system, write its principal organs and the ICD-10-CM chapter that covers it. Keep the sheet: it is your navigation index for the rest of the roadmap.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Why organised by system",
            detail:
              "ICD-10-CM chapters are mostly one body system each, with some by cause — infections, injuries, neoplasms. Knowing which applies narrows a search from thousands of codes to dozens.",
          },
          {
            title: "The systems you will meet most",
            detail:
              "Cardiovascular, respiratory, digestive, musculoskeletal and endocrine carry the bulk of outpatient volume.",
          },
          {
            title: "Laterality",
            detail:
              "ICD-10-CM asks left, right or bilateral for many structures. Anatomy you cannot place cannot be lateralised, and unspecified laterality is a denial in waiting.",
          },
          {
            title: "Where to stop",
            detail:
              "Enough to choose between adjacent codes. Not enough to have an opinion about the diagnosis, which is not your role and not your licence.",
          },
        ],
        checks: [
          {
            question: "How is ICD-10-CM organised?",
            answer:
              "Mostly by body system, with some chapters by cause — infections, neoplasms, injuries. Anatomy selects the chapter before you search.",
          },
          {
            question: "What is laterality and why does it matter?",
            answer:
              "Left, right or bilateral. Many codes require it, and unspecified laterality where a specific code exists is a common denial.",
          },
          {
            question: "How much anatomy does this job need?",
            answer:
              "Enough to place a structure in a system and choose between adjacent codes. Not clinical depth — coding is not clinical practice.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "MedlinePlus anatomy",
            url: "https://medlineplus.gov/anatomy.html",
            sourceName: "NIH MedlinePlus",
            editorNote:
              "Public domain and pitched at exactly the level this job needs. One system per sitting.",
          },
        ],
      },
      {
        title: "Abbreviations, and the ones that are banned",
        summary:
          "Clinical shorthand is everywhere, some of it is dangerous, and some of it is prohibited outright.",
        learningObjectives: [
          "Read the abbreviations that appear in most notes",
          "Recognise the do-not-use list and why each entry is on it",
          "Say what to do with an abbreviation you cannot resolve",
        ],
        whyToday:
          "You will read shorthand on every note, and some abbreviations mean different things in different specialties. Knowing which are ambiguous is what stops a confident wrong code.",
        principle:
          "An abbreviation with two meanings is not information. Resolve it or query it; never pick the likelier one.",
        commonMistake:
          "Assuming a specialty-specific meaning. 'MS' is multiple sclerosis in neurology and mitral stenosis in cardiology, and the wrong guess produces a claim that is wrong in a way nobody catches until an audit.",
        challenge:
          "Collect twenty abbreviations from real clinical sources and find one that has more than one accepted meaning. Write down how you would resolve it in practice.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 25,
        difficulty: "core",
        topics: [
          {
            title: "The common set",
            detail:
              "Hx history, Dx diagnosis, Tx treatment, Rx prescription, c/o complains of, s/p status post. A few dozen cover most notes.",
          },
          {
            title: "Ambiguity by specialty",
            detail:
              "The same letters mean different things in different departments. Context resolves most; where it does not, the answer is a query.",
          },
          {
            title: "Do-not-use lists",
            detail:
              "Some abbreviations are prohibited in records because they have caused harm — 'U' for units read as a zero, trailing zeros read as tenfold doses. Their presence in a note is itself worth flagging.",
          },
          {
            title: "What not to do",
            detail:
              "Do not expand an ambiguous abbreviation on the balance of probability. The record has to say it, or a clinician has to.",
          },
        ],
        checks: [
          {
            question: "What does 's/p' mean?",
            answer: "Status post — the patient is in the state following a procedure or event.",
          },
          {
            question: "Why do do-not-use lists exist?",
            answer:
              "Because specific abbreviations have caused dosing errors — 'U' misread as zero, trailing zeros read as a tenfold dose.",
          },
          {
            question: "You cannot resolve an abbreviation. What is the correct action?",
            answer:
              "Query the clinician. Choosing the more likely meaning puts an unsupported claim on the record.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "StatPearls — medical error reduction and prevention",
            url: "https://www.ncbi.nlm.nih.gov/books/NBK499956/",
            sourceName: "NIH National Library of Medicine",
            editorNote:
              "Covers why abbreviation errors are treated as a safety issue rather than a style one. Public domain.",
          },
        ],
      },
      {
        title: "The vocabulary behind the codes",
        summary:
          "UMLS, SNOMED and the idea that clinical terms and billing codes are different vocabularies serving different jobs.",
        learningObjectives: [
          "Distinguish a clinical terminology from a billing classification",
          "Say what UMLS is for",
          "Explain why a clinician's term and your code are not the same object",
        ],
        whyToday:
          "Clinicians write in one vocabulary and you code in another, and the mapping between them is lossy. Knowing that the loss is structural, not your mistake, changes how you handle the ambiguous cases.",
        principle:
          "A classification exists to group things for counting and paying. A terminology exists to describe things precisely. Mapping one onto the other loses detail by design.",
        commonMistake:
          "Expecting a code that means exactly what the clinician wrote. Often none exists, because the classification was built to aggregate rather than to describe.",
        challenge:
          "Take one specific clinical term and find the ICD-10-CM code it maps to. Write down what the code loses. That loss is what 'unspecified' codes exist to absorb.",
        challengeMinutes: 30,
        estMinutes: 45,
        points: 25,
        difficulty: "stretch",
        topics: [
          {
            title: "Terminology versus classification",
            detail:
              "SNOMED CT describes clinical meaning in detail. ICD-10-CM classifies for statistics and payment. They are not competing; they do different jobs.",
          },
          {
            title: "UMLS",
            detail:
              "The National Library of Medicine's metathesaurus, linking terms across vocabularies. Free with a licence agreement, and the reason automated mapping is possible at all.",
          },
          {
            title: "Why 'unspecified' exists",
            detail:
              "Because the classification is coarser than the clinical language. An unspecified code is sometimes the honest answer and sometimes a documentation gap — telling those apart is the skill.",
          },
          {
            title: "Where computer-assisted coding fits",
            detail:
              "Software suggests codes from the note. It is a suggestion engine over exactly this lossy mapping, which is why a coder still signs off.",
          },
        ],
        checks: [
          {
            question: "What is the difference between SNOMED CT and ICD-10-CM?",
            answer:
              "SNOMED describes clinical meaning precisely; ICD-10-CM classifies for counting and payment. Different purposes, not competitors.",
          },
          {
            question: "What is UMLS?",
            answer:
              "The NLM's metathesaurus linking terms across clinical vocabularies. Free under a licence agreement.",
          },
          {
            question: "Why do unspecified codes exist?",
            answer:
              "The classification is coarser than clinical language. Sometimes unspecified is genuinely correct; sometimes it signals missing documentation.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Unified Medical Language System",
            url: "https://www.nlm.nih.gov/research/umls/index.html",
            sourceName: "NIH National Library of Medicine",
            editorNote:
              "Read the overview only. You are learning that the mapping problem exists and has a name, not learning to use UMLS.",
          },
        ],
      },
      {
        title: "Practice: twenty terms, cold",
        summary:
          "A rep day. No new material — twenty unfamiliar terms, decomposed and verified.",
        learningObjectives: [
          "Decompose twenty terms without reference",
          "Verify each and record the misses",
          "Identify which parts you keep getting wrong",
        ],
        whyToday:
          "The parts from day 6 only work once they are automatic. This is the day that makes them automatic, and rep days are why this roadmap is five days a week rather than three.",
        principle:
          "Retrieval is what fixes vocabulary. Reading the list again is not retrieval.",
        commonMistake:
          "Checking each answer immediately. Do all twenty first — being wrong and finding out later is what makes it stick, and the immediate check turns a test into a reading exercise.",
        challenge:
          "Twenty unfamiliar terms from MedlinePlus. Write your decomposition and predicted meaning for all twenty before checking any. Then score, and list the parts you missed — those are tomorrow's revision.",
        challengeMinutes: 45,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Do all twenty before checking",
            detail:
              "Checking as you go converts the exercise into reading. The interval between attempting and finding out is doing the work.",
          },
          {
            title: "Record the misses, not the hits",
            detail:
              "The parts you got wrong are the revision list. The ones you got right need nothing.",
          },
          {
            title: "Predict the word class too",
            detail:
              "Say whether each term is a condition, a procedure or a structure before checking. Getting the class right matters more than the exact meaning.",
          },
        ],
        checks: [
          {
            question: "Why score all twenty at the end rather than as you go?",
            answer:
              "The gap between attempting and finding out is what produces retention. Immediate checking turns retrieval into reading.",
          },
          {
            question: "Which results are worth recording?",
            answer:
              "The misses. They are the revision list; correct answers need no further work.",
          },
          {
            question: "What should you predict besides the meaning?",
            answer:
              "Whether the term is a condition, a procedure or a structure — the suffix usually says, and the class matters more than the precise meaning.",
          },
        ],
        resources: [],
      },
    ],
  },
  {
    title: "How an ICD-10-CM code is built",
    weekRange: "Weeks 2–3",
    objective: "Read any diagnosis code and say what each character is doing.",
    deliverable: "A written breakdown of ten codes of increasing length.",
    estHours: 4,
    nodes: [
      {
        title: "The anatomy of a code",
        summary:
          "Three to seven characters, each position meaning something. Category, then detail, then extension.",
        learningObjectives: [
          "Name what each character position contributes",
          "Say why some codes are three characters and others seven",
          "Recognise an incomplete code on sight",
        ],
        whyToday:
          "Once the positional structure is clear, a code stops being a string and becomes a sentence. Everything about specificity follows from it.",
        principle:
          "A code is valid only when it is complete. A three-character category with subdivisions is not a code you may submit, however correct it looks.",
        commonMistake:
          "Submitting a category as a code. If subdivisions exist, the category alone is invalid — and the rejection message rarely says so plainly.",
        challenge:
          "Take ten codes of different lengths from the CMS files and break each into positions, saying what each character contributes. Include at least two with a seventh character.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Characters 1–3, the category",
            detail:
              "A letter then two digits. Names the condition broadly. Sometimes a valid code on its own — only where no subdivisions exist.",
          },
          {
            title: "Characters 4–6, the detail",
            detail:
              "Aetiology, anatomical site, severity, laterality. This is where most of the specificity lives and where most denials are earned.",
          },
          {
            title: "The seventh character",
            detail:
              "Extension: initial encounter, subsequent encounter, sequela. Common in injuries. It must sit in position seven, which is why placeholders exist.",
          },
          {
            title: "The X placeholder",
            detail:
              "Where a code needs a seventh character but has fewer than six, X fills the gap. Omitting it produces an invalid code that looks fine.",
          },
        ],
        checks: [
          {
            question: "What do characters 4 to 6 typically carry?",
            answer:
              "Aetiology, anatomical site, severity and laterality — the specificity a payer checks for.",
          },
          {
            question: "What is the X placeholder for?",
            answer:
              "Holding position so a required seventh character lands in position seven when the code is shorter. Omitting it invalidates the code.",
          },
          {
            question: "When is a three-character code valid?",
            answer:
              "Only when the category has no subdivisions. If subdivisions exist, the category alone cannot be submitted.",
          },
          {
            question:
              "A claim rejects for an invalid diagnosis code that looks right. Where do you look?",
            answer:
              "Completeness first — a category submitted where subdivisions exist, or a missing X placeholder before a seventh character. Both produce codes that look correct and are not, and both are far more common than a genuinely wrong code.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10 code files",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "Open the tabular list from the files you downloaded on day 2 and read a chapter's structure rather than its content.",
          },
        ],
      },
      {
        title: "The alphabetic index and the tabular list",
        summary:
          "Two books, used in one order. Index to find a candidate, tabular to confirm it — never the index alone.",
        learningObjectives: [
          "Use the index to locate a candidate code",
          "Verify in the tabular list before assigning",
          "Say why the index alone is never sufficient",
        ],
        whyToday:
          "This two-step is the single most-broken rule in the job, and breaking it produces codes that are plausible and wrong.",
        principle:
          "The index points; the tabular decides. A code assigned from the index alone has skipped every instructional note that governs it.",
        commonMistake:
          "Stopping at the index because the code looked right. The index carries no exclusion notes, no required additional codes and no sequencing instructions — all of which live in the tabular list.",
        challenge:
          "Look up five conditions in the index, then verify each in the tabular list. Record every case where the tabular changed your answer or added a requirement. On five attempts it will usually be at least two.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The index is alphabetical by term",
            detail:
              "Main terms with indented subterms. You find the main term for the condition, then narrow by the modifiers the note gives you.",
          },
          {
            title: "The tabular is numerical by code",
            detail:
              "Where the instructional notes live: includes, excludes, code first, use additional code. None of that appears in the index.",
          },
          {
            title: "Why the order is fixed",
            detail:
              "The index gives a candidate; the tabular tells you whether it is allowed here and what else must accompany it. Reversing the order means you never see the constraints.",
          },
          {
            title: "Non-essential modifiers",
            detail:
              "Terms in parentheses in the index that do not change the code. Knowing they are optional stops a lot of unnecessary searching.",
          },
        ],
        checks: [
          {
            question: "Why is the index alone never sufficient?",
            answer:
              "It carries no exclusion notes, no 'code first' instructions and no sequencing rules. Those live in the tabular list and frequently change the answer.",
          },
          {
            question: "What are non-essential modifiers?",
            answer:
              "Parenthetical terms in the index that do not affect code selection — present for findability, not for meaning.",
          },
          {
            question: "What is the correct order of use?",
            answer:
              "Index first to find a candidate, tabular second to verify it and pick up its instructions. Always both, always that order.",
          },
          {
            question: "Can you code from the alphabetic index alone?",
            answer:
              "No, and doing so is the single most common beginner error. The index points you to a candidate code; the tabular list carries the instructional notes, the excludes notes, the required additional characters and the sequencing rules that decide whether that candidate is right. The index is a lookup, the tabular is the authority. Coding from the index produces codes that are plausible, frequently incomplete in character count, and deniable.",
            kind: "interview",
            difficulty: "easy",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10-CM files — index and tabular",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "Both books are in the download. Have them open side by side today; that is the whole exercise.",
          },
        ],
      },
      {
        title: "Excludes1 and Excludes2",
        summary:
          "Two notes that look almost identical and mean opposite things. This is the most consequential distinction in the book.",
        learningObjectives: [
          "State what each excludes note permits and forbids",
          "Apply them to a case with two conditions",
          "Recognise when an Excludes1 has been violated",
        ],
        whyToday:
          "Excludes1 says never together. Excludes2 says together is fine. One character of difference, opposite instructions, and getting it backwards produces a claim that is wrong in a way edits will catch.",
        principle:
          "Excludes1: not coded here, ever, because the two cannot coexist. Excludes2: not included here, so code both if the patient has both.",
        commonMistake:
          "Reading both as 'do not code together'. Excludes2 means the opposite — the excluded condition is a separate thing the patient may also have, and omitting it under-reports the encounter.",
        challenge:
          "Find one Excludes1 and one Excludes2 note in the tabular list. For each, write a two-condition scenario and say exactly what you would code. Then say what an edit would reject if you got it backwards.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Excludes1 — pure exclusion",
            detail:
              "The two conditions cannot occur together, so the codes may never both appear. A congenital and an acquired form of the same condition is the classic pair.",
          },
          {
            title: "Excludes2 — not included here",
            detail:
              "The excluded condition is not part of this code, but the patient may have both. Code both when both are documented.",
          },
          {
            title: "The exception to Excludes1",
            detail:
              "Where the two conditions are genuinely unrelated in this patient, both may be coded. The guidelines state this narrowly and it is not a general escape hatch.",
          },
          {
            title: "How the mistake surfaces",
            detail:
              "An Excludes1 violation is a hard edit and rejects. An Excludes2 omission is silent — the claim pays and under-reports, which is worse because nothing tells you.",
          },
        ],
        checks: [
          {
            question: "What does Excludes1 mean?",
            answer:
              "The two conditions cannot coexist, so the codes may not both be reported — except in the narrow case where the guidelines say they are unrelated in this patient.",
          },
          {
            question: "What does Excludes2 mean?",
            answer:
              "The excluded condition is not covered by this code but the patient may have both. Code both when both are documented.",
          },
          {
            question: "Which mistake is more dangerous, and why?",
            answer:
              "Getting Excludes2 wrong. An Excludes1 violation rejects loudly; an Excludes2 omission pays and silently under-reports.",
          },
          {
            question: "What is the difference between an Excludes1 and an Excludes2 note?",
            answer:
              "Excludes1 means not coded here — the two conditions are mutually exclusive and cannot both be reported for the same encounter, because the excluded code represents the same condition under a different classification. Excludes2 means not included here — the condition is separate, the patient may genuinely have both, and both may be reported together when documented. Getting these the wrong way round either bundles away a legitimate second diagnosis or reports two codes that the payer will reject as contradictory.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10-CM Official Guidelines for Coding and Reporting",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "The guidelines PDF is in the same download. Section I.A.12 is the excludes notes, and it is two pages you should read three times.",
          },
        ],
      },
      {
        title: "Code first, use additional code, and sequencing",
        summary:
          "Some conditions may not be coded alone, and the order on the claim carries meaning.",
        learningObjectives: [
          "Follow a 'code first' instruction",
          "Apply 'use additional code' correctly",
          "Say what first-listed position means and why it matters",
        ],
        whyToday:
          "Sequencing is where a technically correct set of codes still produces a wrong claim. The codes can all be right and the order wrong, and the payer reads the order.",
        principle:
          "The first-listed diagnosis is the reason for the encounter. Everything else is context, and putting context first changes what the claim says happened.",
        commonMistake:
          "Sequencing by severity. The first-listed code is the condition chiefly responsible for THIS visit, which is often not the patient's most serious problem.",
        challenge:
          "Find a code carrying a 'code first' note and one carrying 'use additional code'. Write the full correct code set for a plausible scenario, in order, and one sentence on why that order.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Code first",
            detail:
              "The underlying condition must be sequenced before this one. Common with manifestations of a systemic disease — the disease leads, the manifestation follows.",
          },
          {
            title: "Use additional code",
            detail:
              "Something else must accompany this code to complete the picture. Omitting it leaves the claim incomplete rather than wrong, which is why it is easy to miss.",
          },
          {
            title: "First-listed versus principal",
            detail:
              "Outpatient claims have a first-listed diagnosis: the reason for this encounter. Inpatient has a principal diagnosis, defined differently. Do not mix the vocabularies.",
          },
          {
            title: "Why the order is read",
            detail:
              "Medical necessity is judged against the first-listed code. Put context first and the procedure looks unjustified.",
          },
        ],
        checks: [
          {
            question: "What does 'code first' require?",
            answer:
              "Sequencing the underlying condition ahead of this one — typically a systemic disease before its manifestation.",
          },
          {
            question: "How is the first-listed diagnosis chosen?",
            answer:
              "It is the condition chiefly responsible for this encounter, not the patient's most serious condition.",
          },
          {
            question: "Why does sequence affect payment?",
            answer:
              "Medical necessity is judged against the first-listed code. Wrong order can make a justified procedure look unjustified.",
          },
          {
            question:
              "What does a 'code first' note tell you, and why does order matter at all?",
            answer:
              "It tells you the underlying aetiology must be sequenced before the manifestation code, so the claim describes cause then effect. Order matters because the first-listed diagnosis is what the payer reads as the reason for the encounter — it drives medical-necessity checks and, in facility settings, grouping and payment. A correct pair of codes in the wrong sequence can be denied as readily as a wrong code.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10-CM Official Guidelines",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "Section I.B covers general coding guidelines including sequencing. Read it with the tabular list open.",
          },
        ],
      },
      {
        title: "Practice: ten codes, index to tabular",
        summary:
          "A rep day. Ten conditions, coded properly through both books, with the instructions followed.",
        learningObjectives: [
          "Complete the full index-to-tabular process ten times",
          "Catch every instructional note in the path",
          "Record which step you skip when you are tired",
        ],
        whyToday:
          "Days 11 to 14 gave you four rules that all apply at once. Today is the first time you run them together, which is the only way to find out which one you drop under pressure.",
        principle:
          "The process is index, tabular, instructions, sequence. Doing three of the four is the same as doing none, because the one you skipped is where the error was.",
        commonMistake:
          "Skipping the tabular verification on the codes that feel obvious. Those are exactly the ones with an excludes note attached, because obvious conditions are the ones with common look-alikes.",
        challenge:
          "Ten conditions, coded end to end. For each, record the index term, the tabular code, every instructional note you hit, and the final sequence. Then look at which step you skipped most — that is your weakness under time pressure.",
        challengeMinutes: 50,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The four steps, every time",
            detail:
              "Index for a candidate, tabular to verify, read every instructional note, then sequence. No shortcuts on the easy ones.",
          },
          {
            title: "Write the path, not just the answer",
            detail:
              "Recording how you got there is what lets you audit your own work later and what an employer will ask you to demonstrate.",
          },
          {
            title: "Notice the fatigue pattern",
            detail:
              "Everyone drops the same step when tired. Knowing which one is yours is worth more than getting today's ten right.",
          },
        ],
        checks: [
          {
            question: "What are the four steps, in order?",
            answer:
              "Index for a candidate, tabular to verify, read the instructional notes, then sequence.",
          },
          {
            question: "Which codes most often carry an excludes note?",
            answer:
              "The obvious, common conditions — precisely the ones people skip verifying, because common conditions have common look-alikes.",
          },
          {
            question: "Why record the path rather than the answer?",
            answer:
              "It makes your own work auditable and it is what an employer asks you to demonstrate. An answer with no path cannot be checked.",
          },
        ],
        resources: [],
      },
    ],
  },
  {
    title: "The official guidelines",
    weekRange: "Weeks 3–4",
    objective: "Read the rulebook that decides every disputed code.",
    deliverable: "A summary of the guideline sections that govern your target specialty.",
    estHours: 4,
    nodes: [
      {
        title: "What the guidelines are and why they bind",
        summary:
          "A free, official document, updated annually, that is the tiebreaker in every coding argument.",
        learningObjectives: [
          "Say who publishes the guidelines and what authority they carry",
          "Navigate the four sections",
          "Find the rule governing a specific question",
        ],
        whyToday:
          "Every disagreement in this job ends with somebody opening this document. Knowing its structure is what lets you be the person who does.",
        principle:
          "Opinion loses to the guidelines. Learn to find the section rather than to remember the answer.",
        commonMistake:
          "Learning rules as folklore from colleagues. Practices accumulate habits that were true three revisions ago, and the document is free, so there is no excuse for inheriting one.",
        challenge:
          "Download the current guidelines and map the four sections in one page — what each covers and roughly where. Then find, by navigation rather than search, the rule about unconfirmed outpatient diagnoses.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Who writes them",
            detail:
              "Four cooperating parties: CMS, NCHS, the American Hospital Association and AHIMA. Published free with the code files.",
          },
          {
            title: "Section I — conventions and chapter rules",
            detail:
              "The general conventions, then chapter-specific guidance. The longest section and the one you will return to most.",
          },
          {
            title: "Sections II and III — inpatient selection",
            detail:
              "Principal diagnosis and additional diagnoses for inpatient. Different rules from outpatient, and confusing the two is a standing source of error.",
          },
          {
            title: "Section IV — outpatient",
            detail:
              "Where most coders live. Includes the rule that unconfirmed conditions are not coded in the outpatient setting.",
          },
          {
            title: "They change every October",
            detail:
              "Annually, with the code files. Working from last year's is how a practice ends up with a habit that stopped being right.",
          },
        ],
        checks: [
          {
            question: "Who publishes the official guidelines?",
            answer:
              "The four cooperating parties — CMS, NCHS, the AHA and AHIMA — free alongside the code files.",
          },
          {
            question: "Which section governs outpatient coding?",
            answer:
              "Section IV, including the rule that unconfirmed diagnoses are not coded in the outpatient setting.",
          },
          {
            question: "How often do they change?",
            answer: "Annually, effective 1 October, together with the code files.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10-CM Official Guidelines for Coding and Reporting",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "Free, public domain, and the whole rulebook. Print the table of contents if nothing else — navigation is today's skill.",
          },
        ],
      },
      {
        title: "Section I: the conventions",
        summary:
          "And, with, see, see also, other, unspecified — words with defined meanings that are not their ordinary ones.",
        learningObjectives: [
          "Apply the defined meanings of 'and' and 'with'",
          "Follow 'see' and 'see also' correctly",
          "Distinguish 'other specified' from 'unspecified'",
        ],
        whyToday:
          "These words look ordinary and are not. 'And' means or. 'With' implies a relationship you do not need documented. Reading them as English produces confident errors.",
        principle:
          "In this book, 'and' means and/or, and 'with' means a link you may assume unless the record says otherwise. Both are the opposite of how they read.",
        commonMistake:
          "Requiring documentation of a link that 'with' already presumes. The guidelines say conditions linked by 'with' are assumed related unless the record states otherwise — querying for it wastes a clinician's time.",
        challenge:
          "Find one code whose title contains 'and' and one containing 'with'. Write what each actually permits, then write what a plain-English reading would have made you do differently.",
        challengeMinutes: 35,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "'And' means and/or",
            detail:
              "A title reading 'X and Y' covers X alone, Y alone, or both. Reading it as requiring both narrows your search wrongly.",
          },
          {
            title: "'With' presumes a link",
            detail:
              "Conditions joined by 'with' in the index or a title are assumed related unless the record says they are not. No documentation of the link is required.",
          },
          {
            title: "'See' and 'see also'",
            detail:
              "'See' is mandatory — go there. 'See also' is optional and only if the current entry does not fit.",
          },
          {
            title: "'Other specified' versus 'unspecified'",
            detail:
              "'Other specified' means documented but no specific code exists. 'Unspecified' means the record does not say. They are different findings and one of them is a documentation gap.",
          },
        ],
        checks: [
          {
            question: "What does 'and' mean in a code title?",
            answer: "And/or. The code covers either condition alone or both together.",
          },
          {
            question: "Does 'with' require documentation of the link?",
            answer:
              "No. Conditions linked by 'with' are presumed related unless the record explicitly says otherwise.",
          },
          {
            question: "Distinguish 'other specified' from 'unspecified'.",
            answer:
              "'Other specified' means the condition is documented but has no dedicated code. 'Unspecified' means the documentation does not say — a gap rather than a category.",
          },
          {
            question: "Why does the 'with' convention matter operationally?",
            answer:
              "It removes a whole class of unnecessary physician queries. Coders who read 'with' as English query for a link the guidelines already presume, which slows the clinician and delays the claim for nothing.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10-CM Official Guidelines — Section I.A",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "Section I.A is the conventions. It is short, it is dense, and almost every argument about a code is settled in it.",
          },
        ],
      },
      {
        title: "Outpatient rules that differ from inpatient",
        summary:
          "Unconfirmed diagnoses, first-listed selection, and the rules that reverse when the setting changes.",
        learningObjectives: [
          "State the outpatient rule for unconfirmed conditions",
          "Contrast it with the inpatient rule",
          "Say why the same note codes differently in two settings",
        ],
        whyToday:
          "The single most-confused pair of rules in the field. Outpatient: do not code a suspected condition. Inpatient: you may. Same words in the note, different codes.",
        principle:
          "The setting changes the rule, not just the paperwork. Ask which setting before you ask which code.",
        commonMistake:
          "Applying the inpatient rule outpatient. Coding 'probable pneumonia' as pneumonia in an office visit puts a diagnosis the patient may not have onto their permanent record and onto a claim.",
        challenge:
          "Write one short scenario with a suspected diagnosis, then code it twice — once as outpatient, once as inpatient — and explain the difference in one sentence each.",
        challengeMinutes: 35,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Outpatient: code the certainty you have",
            detail:
              "Probable, suspected and rule-out are not coded. Code the signs, symptoms or test findings that prompted the workup.",
          },
          {
            title: "Inpatient: code the working diagnosis",
            detail:
              "A condition documented as probable at discharge may be coded as if established. The reasoning is that inpatient care was directed at it.",
          },
          {
            title: "First-listed versus principal",
            detail:
              "Outpatient has a first-listed diagnosis — the reason for this encounter. Inpatient has a principal diagnosis — the condition established after study as chiefly responsible for admission.",
          },
          {
            title: "Why it matters beyond the claim",
            detail:
              "A coded diagnosis follows the patient. Coding a suspected condition outpatient can affect their insurability for something they never had.",
          },
        ],
        checks: [
          {
            question: "How do you code 'probable pneumonia' in an office visit?",
            answer:
              "Code the signs and symptoms. Unconfirmed conditions are not coded in the outpatient setting.",
          },
          {
            question: "How does the inpatient rule differ?",
            answer:
              "A condition documented as probable at discharge may be coded as if established, because the admission's care was directed at it.",
          },
          {
            question: "What is the consequence beyond payment?",
            answer:
              "A coded diagnosis stays on the patient's record and can affect insurability for a condition they may never have had.",
          },
          {
            question:
              "A physician documents 'rule out pneumonia'. How do you code it in an outpatient setting, and would that change on the inpatient side?",
            answer:
              "In outpatient you do not code an unconfirmed condition. You code the signs and symptoms that brought the patient in — cough, fever — because outpatient rules prohibit coding probable, suspected or rule-out diagnoses as though established. Inpatient rules differ: a condition documented at discharge as probable or suspected may be coded as if it existed, because the workup and treatment consumed resources. Knowing that the two settings genuinely disagree is the point of the question.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10-CM Official Guidelines — Section IV",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "Section IV for outpatient, Section II for inpatient principal diagnosis. Read them together today — the contrast is the lesson.",
          },
        ],
      },
      {
        title: "Chapter-specific rules worth knowing early",
        summary:
          "Neoplasms, diabetes, injuries and pregnancy each carry their own rules that override the general ones.",
        learningObjectives: [
          "Name four chapters with substantial specific guidance",
          "Apply one chapter rule that contradicts a general one",
          "Say why chapter rules take precedence",
        ],
        whyToday:
          "The general conventions get you most of the way and then a chapter rule reverses one of them. Knowing which chapters do that is what stops the surprise.",
        principle:
          "A chapter-specific rule beats a general one. When they conflict, the more specific instruction wins.",
        commonMistake:
          "Applying the general sequencing rule inside a chapter that specifies its own. Neoplasms and pregnancy both do, and both are high volume.",
        challenge:
          "Pick the chapter closest to the specialty you want to work in. Read its guidance in full and write the three rules that surprised you most.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Neoplasms",
            detail:
              "Sequencing depends on whether treatment was directed at the malignancy or at a complication, and the neoplasm table is a separate lookup with its own logic.",
          },
          {
            title: "Diabetes",
            detail:
              "Combination codes carrying the diabetes and its manifestation together, with 'with' doing the linking work from day 17.",
          },
          {
            title: "Injuries and the seventh character",
            detail:
              "Initial, subsequent and sequela. 'Initial' means active treatment, not the first visit — a distinction that catches almost everyone.",
          },
          {
            title: "Pregnancy",
            detail:
              "Obstetric codes take sequencing priority, and trimester is often required. High volume and unforgiving.",
          },
        ],
        checks: [
          {
            question: "What does the seventh character 'A' actually mean for an injury?",
            answer:
              "Active treatment, not the first encounter. A second visit still receiving active treatment is still 'initial'.",
          },
          {
            question: "What decides neoplasm sequencing?",
            answer:
              "Whether the encounter's treatment was directed at the malignancy itself or at a complication of it.",
          },
          {
            question: "What happens when a chapter rule conflicts with a general one?",
            answer: "The chapter-specific rule wins. Specific beats general.",
          },
          {
            question: "Why can chapter-specific guidelines override the general ones?",
            answer:
              "Because the guidelines are ordered: chapter-specific instruction takes precedence over the general conventions where they conflict, and instructional notes in the tabular list take precedence over both. A coder who has learned only the general rules will apply them confidently in a chapter that says otherwise. The practical habit is to read the chapter's opening guidance before coding in an unfamiliar body system rather than after a denial.",
            kind: "interview",
            difficulty: "medium",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10-CM Official Guidelines — Section I.C",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "Section I.C is chapter-specific guidance and it is most of the document. Read your chapter, skim the rest.",
          },
        ],
      },
      {
        title: "Practice: coding against the guidelines",
        summary:
          "A rep day. Ten scenarios where the general rule and a specific rule both apply, and the specific one wins.",
        learningObjectives: [
          "Identify which guideline governs a scenario",
          "Cite the section number, not just the answer",
          "Notice where you would have gone wrong on instinct",
        ],
        whyToday:
          "Citing the section is the difference between knowing and having heard. It is also what an audit response looks like.",
        principle:
          "An answer with a section number is defensible. The same answer without one is a preference.",
        commonMistake:
          "Getting the right code and not knowing why. It survives until somebody disagrees, and then there is nothing to argue with.",
        challenge:
          "Ten scenarios. For each, write the code and the guideline section that governs it. Where you cannot find a section, say so — that is a real finding, not a failure.",
        challengeMinutes: 50,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Cite the section",
            detail:
              "I.A.12 for excludes, I.B for general coding, I.C by chapter, IV for outpatient. The numbering is how professionals refer to these rules.",
          },
          {
            title: "Where no rule exists",
            detail:
              "Sometimes the guidelines are silent and the answer is payer policy or a coding clinic. Recognising the boundary is part of the skill.",
          },
          {
            title: "The instinct check",
            detail:
              "Write your first instinct before looking it up. Where instinct and guideline diverge is exactly what to revise.",
          },
        ],
        checks: [
          {
            question: "Which section covers excludes notes?",
            answer: "Section I.A.12 of the official guidelines.",
          },
          {
            question: "What do you do when the guidelines are silent?",
            answer:
              "Fall back to payer policy or published coding guidance, and note that the guidelines did not settle it rather than inventing a rule.",
          },
          {
            question: "Why cite the section rather than just the code?",
            answer:
              "A cited answer is defensible in an audit or a disagreement. An uncited one is a preference.",
          },
        ],
        resources: [],
      },
    ],
  },
];
