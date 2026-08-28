/**
 * Medical coding — modules 5–8, days 21–40.
 *
 * Procedure coding, modifiers and edits, the claim's life after you submit
 * it, and the compliance regime that decides whether a mistake is an error
 * or an offence.
 */
export default [
  {
    title: "Procedure coding",
    weekRange: "Weeks 4–5",
    objective:
      "Read a procedure code set and choose within it — with CPT's rules, not its codes.",
    deliverable:
      "A written comparison of how CPT, HCPCS Level II and ICD-10-PCS are each built.",
    estHours: 4,
    nodes: [
      {
        title: "How CPT is organised",
        summary:
          "Three categories, six sections, and a structure you can learn from published rules even though the codes are copyrighted.",
        learningObjectives: [
          "Name the three CPT categories and what each is for",
          "Navigate the six sections of Category I",
          "Explain why guidelines at the head of a section are binding",
        ],
        whyToday:
          "CPT is where most outpatient money is. The code set belongs to the AMA and you will use a licensed manual or an employer's encoder — but the structure and the rules are public, and the structure is what makes the manual usable.",
        principle:
          "You are learning where to look and what the rules are. The codes themselves come from a licensed source, and no legitimate free copy exists.",
        commonMistake:
          "Jumping straight to the index. Every CPT section opens with guidelines that govern everything under it, and the index cannot tell you they exist.",
        challenge:
          "Write out the six Category I sections in order with their approximate code ranges and what each covers. Then say, for each, one thing you would expect its section guidelines to constrain.",
        challengeMinutes: 35,
        estMinutes: 55,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Category I",
            detail:
              "Five digits, the main set. Six sections: Evaluation and Management, Anesthesia, Surgery, Radiology, Pathology and Laboratory, Medicine.",
          },
          {
            title: "Category II",
            detail:
              "Four digits and an F. Performance-measurement tracking codes, optional, and they carry no payment. Used for quality reporting.",
          },
          {
            title: "Category III",
            detail:
              "Four digits and a T. Emerging technology, temporary. A Category III code exists so a new procedure can be tracked before it earns a permanent one.",
          },
          {
            title: "Section guidelines bind",
            detail:
              "Each section opens with instructions governing everything in it. They are not preamble — they answer most of the questions the code descriptions raise.",
          },
          {
            title: "Where the codes come from",
            detail:
              "A licensed AMA manual or your employer's encoder. Every practice has one; you do not need to own it to learn the method.",
          },
        ],
        checks: [
          {
            question: "What are Category II codes for?",
            answer:
              "Performance measurement and quality reporting. They are optional and carry no payment.",
          },
          {
            question: "Why does a Category III code exist?",
            answer:
              "So an emerging procedure can be tracked and studied before it is assigned a permanent Category I code.",
          },
          {
            question: "Why read the section guidelines before the index?",
            answer:
              "They govern every code in the section and answer most of the questions the code descriptions raise. The index cannot surface them.",
          },
        ],
        resources: [
          {
            type: "read",
            title: "What is medical coding",
            url: "https://www.aapc.com/resources/what-is-medical-coding",
            sourceName: "AAPC",
            editorNote:
              "Return to it for the CPT overview specifically. Ignore the course sell; day 40 covers what the certification actually costs.",
          },
        ],
      },
      {
        title: "Evaluation and Management",
        summary:
          "The highest-volume codes in outpatient medicine, and the ones most often coded wrong in both directions.",
        learningObjectives: [
          "Say what an E/M code represents",
          "Name the two bases on which a level may be selected",
          "Explain why time-based selection changed what documentation matters",
        ],
        whyToday:
          "E/M is most of what a physician bills and the single most audited area in the field. The level-selection rules were rewritten in recent years, so much of the advice you will hear from colleagues describes the old system.",
        principle:
          "The level is chosen by medical decision making or by total time — not by how much was written down. The old counting-bullet-points system is gone and advice based on it is wrong.",
        commonMistake:
          "Selecting a level by the length of the note. Volume of documentation stopped determining the level; padding a note now adds risk without adding payment.",
        challenge:
          "Write out the two selection bases and, for medical decision making, its three elements. Then describe one encounter and say which basis you would use and why.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "What E/M covers",
            detail:
              "The cognitive work of a visit — history, examination, and deciding what to do. Distinct from any procedure performed at the same encounter.",
          },
          {
            title: "Medical decision making",
            detail:
              "Three elements: the number and complexity of problems, the amount and complexity of data reviewed, and the risk of complications. The overall level follows from two of the three.",
          },
          {
            title: "Total time",
            detail:
              "All the clinician's time on that patient on that date, including work before and after the face-to-face part. An alternative basis, not an addition.",
          },
          {
            title: "New versus established",
            detail:
              "Whether the patient has been seen by this practice and specialty within three years. It changes the code and the payment.",
          },
          {
            title: "Why this is audited hardest",
            detail:
              "Volume plus a judgement-based level equals the largest overpayment exposure in the programme. Every compliance review starts here.",
          },
        ],
        checks: [
          {
            question: "What are the two bases for selecting an E/M level?",
            answer: "Medical decision making, or total time on the date of the encounter.",
          },
          {
            question: "What are the three elements of medical decision making?",
            answer:
              "Number and complexity of problems, amount and complexity of data reviewed, and risk of complications.",
          },
          {
            question: "Does a longer note support a higher level?",
            answer:
              "No. Documentation volume no longer drives level selection, so padding adds audit risk without adding payment.",
          },
          {
            question:
              "A physician asks how to document to support a higher E/M level. What do you say?",
            answer:
              "Document the decision making that actually happened — the problems addressed, the data reviewed and the risk — or the total time spent. The level follows the work; it cannot be produced by writing more. If the work supports a higher level and the note does not show it, that is a documentation fix. If the work does not support it, there is nothing to fix.",
            kind: "interview",
            difficulty: "hard",
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
              "Look up the common office-visit codes and compare their RVUs across levels. The payment gap is why this area is audited.",
          },
        ],
      },
      {
        title: "HCPCS Level II",
        summary:
          "Supplies, drugs, equipment and transport — the free code set you can explore completely.",
        learningObjectives: [
          "Say what HCPCS Level II covers that CPT does not",
          "Navigate its letter-led structure",
          "Explain when a HCPCS code replaces a CPT code rather than joining it",
        ],
        whyToday:
          "It is maintained by CMS and published free, which makes it the one procedure set where you can practise on the real thing without a licence.",
        principle:
          "If it is a thing rather than a service — a drug, a wheelchair, an ambulance ride — it is probably Level II.",
        commonMistake:
          "Reporting a supply separately when it is already included in the procedure. Bundling rules apply here too, and a separately billed included item is exactly what post-payment review looks for.",
        challenge:
          "Open the HCPCS files and find the letter groups for drugs, durable medical equipment and ambulance. Then find one item you would expect to be bundled into a procedure and check whether it is.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "Letter-led structure",
            detail:
              "One letter and four digits. The letter groups by kind: J for drugs administered other than orally, E for durable medical equipment, A for transport and supplies.",
          },
          {
            title: "What it covers",
            detail:
              "Everything CPT does not: products, supplies, drugs, equipment and services that are not physician procedures.",
          },
          {
            title: "Medicare-specific codes",
            detail:
              "Some exist because Medicare needed to identify something CPT does not distinguish. Commercial payers may or may not recognise them.",
          },
          {
            title: "It is free",
            detail:
              "Published by CMS and updated quarterly. Download it and look things up as you go — this is the one set with no licensing barrier.",
          },
        ],
        checks: [
          {
            question: "What does the J group cover?",
            answer: "Drugs administered other than by mouth — injections and infusions.",
          },
          {
            question: "What distinguishes HCPCS Level II from CPT?",
            answer:
              "Level II covers products, supplies, drugs, equipment and transport; CPT covers physician procedures and services.",
          },
          {
            question: "Why can you practise freely on HCPCS Level II?",
            answer:
              "It is maintained and published by CMS as a US government work, so the full set is free and in the public domain.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Place of service and HCPCS code sets",
            url: "https://www.cms.gov/medicare/coding-billing/place-of-service-codes/code-sets",
            sourceName: "CMS",
            editorNote:
              "The free code sets, downloadable. Have one open while you read — it is the only procedure set you can do that with.",
          },
        ],
      },
      {
        title: "ICD-10-PCS, and why it is nothing like CPT",
        summary:
          "Seven characters, each a position with a defined meaning, for hospital inpatient procedures only.",
        learningObjectives: [
          "Say what each of the seven positions means",
          "Build a code by choosing each character rather than looking one up",
          "Explain why inpatient needs a different system at all",
        ],
        whyToday:
          "PCS is constructed, not looked up, which makes it the strangest thing in this roadmap and the easiest to learn properly — the logic is completely regular.",
        principle:
          "You do not find a PCS code. You build it, one character at a time, and every character has to be supported by the record.",
        commonMistake:
          "Trying to look PCS codes up as though they were CPT. The index exists but it points at tables; the code is assembled from the table, and skipping that produces codes that do not exist.",
        challenge:
          "Name the seven positions in order and what each specifies. Then take one common inpatient procedure and build its code by choosing each character in turn from the tables.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "The seven positions",
            detail:
              "Section, body system, root operation, body part, approach, device, qualifier. Every character is a choice from a table, and every table is defined.",
          },
          {
            title: "Root operation is the hard one",
            detail:
              "Thirty-one defined operations — excision, resection, drainage, and so on — each with a precise definition. Choosing between excision and resection is the classic PCS decision.",
          },
          {
            title: "Approach",
            detail:
              "Open, percutaneous, endoscopic and the rest. It changes the code and it changes the payment, and it is often the character the note is vaguest about.",
          },
          {
            title: "Why inpatient is different",
            detail:
              "Inpatient payment runs on diagnosis-related groups rather than per-procedure fees, and the grouping needs a systematic procedure description that CPT was not built to give.",
          },
        ],
        checks: [
          {
            question: "What does the third character specify?",
            answer:
              "The root operation — one of thirty-one defined operations such as excision or resection.",
          },
          {
            question: "Why is PCS built rather than looked up?",
            answer:
              "Each of the seven positions is an independent choice from a defined table. The index points at tables; the code is assembled from them.",
          },
          {
            question: "Why does inpatient need its own procedure system?",
            answer:
              "Inpatient pays by diagnosis-related group, which needs a systematic, complete procedure description rather than CPT's fee-per-service structure.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "ICD-10 code files — PCS",
            url: "https://www.cms.gov/medicare/coding-billing/icd-10-codes",
            sourceName: "CMS",
            editorNote:
              "The PCS tables and reference manual are in the same free download. Open one table and read it as a grid, which is what it is.",
          },
        ],
      },
      {
        title: "Practice: matching the procedure to the set",
        summary:
          "A rep day. Ten described procedures — decide which code set applies before touching a code.",
        learningObjectives: [
          "Choose the correct code set from the description alone",
          "Say which setting each belongs to",
          "Recognise the cases where two sets both apply",
        ],
        whyToday:
          "Choosing the wrong code set is a bigger error than choosing the wrong code within one, and it is a decision made before any lookup.",
        principle:
          "Ask what kind of thing this is and where it happened, before asking which code it is.",
        commonMistake:
          "Reaching for CPT reflexively. It is the biggest set and the wrong one for anything inpatient-procedural, and for anything that is a product rather than a service.",
        challenge:
          "Ten procedure descriptions. For each: which set, which setting, and why — before opening anything. Then check, and note every case where the description was genuinely ambiguous.",
        challengeMinutes: 45,
        estMinutes: 50,
        points: 30,
        difficulty: "core",
        topics: [
          {
            title: "The two questions",
            detail:
              "Service or product? Inpatient or outpatient? Those two answers pick the set before you look anything up.",
          },
          {
            title: "Where both apply",
            detail:
              "A hospital inpatient stay generates a facility claim with PCS and a physician claim with CPT for the same operation. Two claims, two sets, one procedure.",
          },
          {
            title: "Ambiguity is a finding",
            detail:
              "A description you cannot place usually means the record is missing the setting or the approach. That is a query, not a guess.",
          },
        ],
        checks: [
          {
            question: "Which two questions select the code set?",
            answer: "Is it a service or a product, and did it happen inpatient or outpatient.",
          },
          {
            question: "Can one procedure generate both PCS and CPT codes?",
            answer:
              "Yes — the facility bills PCS for an inpatient procedure and the physician bills CPT for their own work on the same operation.",
          },
          {
            question: "What does an unplaceable description usually mean?",
            answer:
              "The record is missing the setting or the approach. Query rather than guess.",
          },
        ],
        resources: [],
      },
    ],
  },
  {
    title: "Modifiers, edits and bundling",
    weekRange: "Weeks 5–6",
    objective: "Say why two codes that are each correct may not be billed together.",
    deliverable: "A worked NCCI check on five code pairs.",
    estHours: 4,
    nodes: [
      {
        title: "What a modifier does",
        summary:
          "Two characters appended to a code that change what it means without changing which code it is.",
        learningObjectives: [
          "Say what a modifier is and what it cannot do",
          "Name the modifiers that appear most often",
          "Explain why an unsupported modifier is worse than a missing one",
        ],
        whyToday:
          "Modifiers are how you tell a payer that the ordinary rule does not apply here. They are also the most abused field on a claim, which is why they attract scrutiny.",
        principle:
          "A modifier is an assertion about the circumstances. Every one you add is a statement you would have to defend, and some of them override an edit that exists for a reason.",
        commonMistake:
          "Adding a modifier to clear a rejection. That is the single most common compliance failure in billing — the edit fired because two services are normally bundled, and overriding it without documented justification is a false claim.",
        challenge:
          "List the modifiers you see most in any published payer guidance and write, for each, the specific circumstance it asserts. Then write what documentation would have to exist to support it.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "What a modifier changes",
            detail:
              "The circumstances, not the identity. Same procedure, different situation — a different side, a repeated service, a distinct encounter.",
          },
          {
            title: "The common ones",
            detail:
              "Anatomical modifiers for side and digit, modifiers for a repeated procedure, for a distinct procedural service, and for a significant separately identifiable E/M service on the same day.",
          },
          {
            title: "Informational versus payment",
            detail:
              "Some modifiers only inform; others change what is paid. Knowing which is which stops you expecting money that was never coming.",
          },
          {
            title: "The override problem",
            detail:
              "A modifier that unbundles two normally-bundled services is a formal assertion that they were genuinely separate. Using it to clear an edit is the textbook abuse case.",
          },
        ],
        checks: [
          {
            question: "What does a modifier change?",
            answer:
              "The circumstances of the service, not which service it was. Same code, different situation.",
          },
          {
            question: "Why is adding a modifier to clear a rejection dangerous?",
            answer:
              "The edit fired because the services are normally bundled. Overriding it asserts they were genuinely separate, and asserting that without documentation is a false claim.",
          },
          {
            question: "Do all modifiers affect payment?",
            answer:
              "No. Some are informational only. Knowing which is which prevents expecting payment that was never going to come.",
          },
          {
            question:
              "What is a modifier, and give me a case where leaving one off costs money.",
            answer:
              "A modifier is a two-character suffix that qualifies a procedure code without changing what the code means — it says the service was bilateral, repeated, performed by a different provider, or distinct from another service billed the same day. The classic loss is a genuinely separate procedure that falls inside another's edit pair: without the modifier indicating the distinct service, the payer bundles it and pays once. The reverse is worse — appending a bypass modifier where the services were not distinct is a documented fraud pattern, not a billing shortcut.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "National Correct Coding Initiative edits",
            url:
              "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits",
            sourceName: "CMS",
            editorNote:
              "The edits and the modifier indicators that say whether an edit may be overridden at all. Free and authoritative.",
          },
        ],
      },
      {
        title: "NCCI edits and bundling",
        summary:
          "CMS publishes which code pairs may not be billed together, and which of those an appropriate modifier may override.",
        learningObjectives: [
          "Look up a code pair in the NCCI tables",
          "Read the modifier indicator and say what it permits",
          "Explain the difference between a procedure-to-procedure edit and a units edit",
        ],
        whyToday:
          "This is the most useful free resource in the entire subject. It answers 'can I bill these together' definitively, and most people never open it.",
        principle:
          "Bundling is not a payer's opinion. It is published, it is checkable before you submit, and checking takes a minute.",
        commonMistake:
          "Submitting and finding out. The edits are public — a pair that will be denied is knowable in advance, and a preventable denial costs the practice more than the check would have.",
        challenge:
          "Take five code pairs and look each up in the NCCI tables. Record the modifier indicator for each and what it permits. At least one should be an edit that may not be overridden at all.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Procedure-to-procedure edits",
            detail:
              "Pairs that may not both be reported for the same patient on the same day. One is the column-one code that gets paid; the other is denied.",
          },
          {
            title: "The modifier indicator",
            detail:
              "0 means the edit may never be overridden. 1 means an appropriate modifier may override it where the circumstances genuinely differ. It is one digit and it is the whole answer.",
          },
          {
            title: "Medically unlikely edits",
            detail:
              "A maximum unit count for a code on one day. Six of something that a body has two of is a units edit, not a bundling one.",
          },
          {
            title: "The policy manual",
            detail:
              "CMS publishes the reasoning behind the edits, chapter by chapter. It answers 'why is this bundled' when the table only says that it is.",
          },
        ],
        checks: [
          {
            question: "What does a modifier indicator of 0 mean?",
            answer:
              "The edit may never be overridden. No modifier makes that pair billable together.",
          },
          {
            question: "What is a medically unlikely edit?",
            answer:
              "A cap on units of a code for one patient on one day — anatomically or clinically implausible quantities.",
          },
          {
            question: "Why check before submitting?",
            answer:
              "The edits are published. A denial you could have predicted costs the practice rework it never needed to do.",
          },
          {
            question:
              "A surgeon insists two bundled procedures should both be paid. How do you handle it?",
            answer:
              "Look up the pair's modifier indicator. If it is 0 there is no route and the answer is no. If it is 1, the question becomes whether the record documents genuinely distinct circumstances — and if it does, the modifier is correct and the appeal is winnable. Either way the answer comes from the published table, not from seniority.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
          {
            question:
              "What is an NCCI edit and what does the modifier indicator on it tell you?",
            answer:
              "A Correct Coding Initiative edit is a pair of codes the payer will not reimburse together, because one is considered a component of the other or the two are mutually exclusive. Each pair carries a modifier indicator: 0 means the edit can never be bypassed, so no modifier will make both payable; 1 means it may be bypassed when the services were genuinely distinct and the documentation supports it. Reading that indicator before appending anything is the difference between correct billing and a pattern an auditor will find.",
            kind: "interview",
            difficulty: "hard",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "NCCI policy manual",
            url:
              "https://www.cms.gov/medicare/coding-billing/national-correct-coding-initiative-ncci-edits/medicare-ncci-policy-manual",
            sourceName: "CMS",
            editorNote:
              "The reasoning behind the edits, chapter by chapter. Read your specialty's chapter — it explains what the tables only assert.",
          },
        ],
      },
      {
        title: "Global periods and what is already included",
        summary:
          "A surgical code buys a window of follow-up care. Billing inside it for related work is billing twice.",
        learningObjectives: [
          "Say what a global period covers",
          "Distinguish related from unrelated care within the window",
          "Find a code's global period",
        ],
        whyToday:
          "Global periods are invisible on the claim and decisive for payment. A follow-up visit inside the window is usually already paid for, and billing it is a duplicate.",
        principle:
          "The surgical fee already includes the routine follow-up. Billing that follow-up separately is asking to be paid twice for the same work.",
        commonMistake:
          "Billing a post-operative visit that falls inside the global period. It denies, and repeated across a practice it is a pattern an auditor will characterise less charitably than carelessness.",
        challenge:
          "Find the global period for three surgical codes on the fee schedule. Then write, for one of them, an example of care inside the window that WOULD be separately billable and say what makes it so.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "What the window covers",
            detail:
              "Routine care related to the surgery: the pre-operative visit, the procedure, and typical post-operative follow-up for a defined number of days.",
          },
          {
            title: "Zero, ten and ninety days",
            detail:
              "Minor procedures carry 0 or 10 days; major surgery carries 90. The fee schedule states it per code.",
          },
          {
            title: "What is still billable",
            detail:
              "Unrelated care, a return to theatre for a complication, and a distinct problem addressed at the same visit. Each needs the right modifier and documentation.",
          },
          {
            title: "Why it is invisible",
            detail:
              "Nothing on the follow-up claim says a global period applies. The payer knows; the biller has to know too.",
          },
        ],
        checks: [
          {
            question: "What does a 90-day global period include?",
            answer:
              "The pre-operative visit, the procedure, and routine related post-operative care for ninety days.",
          },
          {
            question: "What remains separately billable inside the window?",
            answer:
              "Unrelated care, a return to theatre for a complication, and a distinct problem addressed at the same visit — each with the appropriate modifier and documentation.",
          },
          {
            question: "Where do you find a code's global period?",
            answer: "On the physician fee schedule, stated per code.",
          },
          {
            question: "A patient returns eight days after surgery. Is that visit billable?",
            answer:
              "It depends on the procedure's global period and on why they came. Routine post-operative care within the global period is already paid for in the surgical fee and is not separately billable. A visit for something unrelated, or a return to theatre for a complication, can be billable with the appropriate modifier to signal it falls outside the global package. The first question is always the global period length — nought, ten or ninety days — because that determines whether the question even arises.",
            kind: "interview",
            difficulty: "hard",
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
              "The global-period indicator is one of the columns in the search tool. Look up three surgical codes and read it.",
          },
        ],
      },
      {
        title: "Medical necessity",
        summary:
          "The diagnosis has to justify the procedure. A correct procedure code with an unsupportive diagnosis is a denial.",
        learningObjectives: [
          "Explain what medical necessity means on a claim",
          "Link a diagnosis to a procedure the way a payer does",
          "Find a coverage determination for a procedure",
        ],
        whyToday:
          "Everything so far assumed the procedure should have happened. Medical necessity is the payer asking why, and the answer is the diagnosis code you sequenced first.",
        principle:
          "The procedure says what was done. The first-listed diagnosis says why it was justified. A payer reads them as one sentence.",
        commonMistake:
          "Treating diagnosis and procedure as independent fields. They are checked against each other, and a procedure with no supporting diagnosis denies however correct each is alone.",
        challenge:
          "Find a coverage determination for any procedure and read which diagnoses support it. Then take a procedure you have coded and check whether your first-listed diagnosis is on the equivalent list.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "What the payer is asking",
            detail:
              "Whether this service was reasonable and necessary for this condition. The diagnosis code is the entire answer they can see.",
          },
          {
            title: "Coverage determinations",
            detail:
              "National and local determinations list which diagnoses support which procedures. Published, free, and checkable before submission.",
          },
          {
            title: "Sequencing matters here too",
            detail:
              "Necessity is judged against the first-listed diagnosis. The right code in the wrong position can fail the check.",
          },
          {
            title: "Advance notice",
            detail:
              "Where a service is likely not covered, the patient is told in advance so they can decide. That is a process requirement, not a formality.",
          },
        ],
        checks: [
          {
            question: "What is medical necessity, on a claim?",
            answer:
              "Whether the service was reasonable and necessary for the documented condition — judged from the diagnosis codes, primarily the first-listed one.",
          },
          {
            question: "What is a coverage determination?",
            answer:
              "A published list of which diagnoses support which procedures for a payer. Free and checkable before submitting.",
          },
          {
            question: "Can correct codes still fail a necessity check?",
            answer:
              "Yes. If the supporting diagnosis is not sequenced first, the check can fail even though every code is right.",
          },
          {
            question:
              "A procedure was performed and documented correctly, and the payer denied it as not medically necessary. What went wrong?",
            answer:
              "The procedure code was supported but the diagnosis linked to it did not justify the service under the payer's coverage policy. Medical necessity is the link between the why and the what: the diagnosis has to be one the payer accepts as an indication for that procedure, and it has to be specific enough. An unspecified diagnosis where the documentation supported a specific one is a common cause. The fix is checking the coverage determination before the service where possible, and re-reviewing the documentation for a supportable, more specific diagnosis before appealing.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Medicare Internet-Only Manuals",
            url:
              "https://www.cms.gov/medicare/regulations-guidance/manuals/internet-only-manuals-ioms",
            sourceName: "CMS",
            editorNote:
              "The claims-processing manual is where necessity rules live. Enormous — use the chapter list, never read it through.",
          },
        ],
      },
      {
        title: "Practice: five pairs, checked properly",
        summary: "A rep day. Five code pairs run through NCCI, global periods and necessity.",
        learningObjectives: [
          "Run the full pre-submission check five times",
          "Record which check catches which problem",
          "Notice how long it actually takes",
        ],
        whyToday:
          "Three checks apply to every claim and doing them together is the job. Timing yourself is the point — people skip these believing they are slow, and they are not.",
        principle:
          "Bundling, global period, necessity. Three lookups, all free, all faster than a denial.",
        commonMistake:
          "Doing the checks only on unfamiliar codes. Familiar codes are where habits hide, and a habit formed under an old edit is exactly what a quarterly update breaks.",
        challenge:
          "Five pairs, all three checks each. Record the time. Then compare it against what a denial costs in rework — the ratio is the argument for doing this every time.",
        challengeMinutes: 50,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The three checks",
            detail:
              "NCCI for bundling, the fee schedule for the global period, the coverage determination for necessity. In that order, because bundling rules out fastest.",
          },
          {
            title: "Time it",
            detail:
              "The checks take a few minutes. A denial takes a rework cycle plus the delay. The arithmetic is not close.",
          },
          {
            title: "Familiar codes are the risk",
            detail:
              "Edits update quarterly. A pair you have billed together for a year may have become an edit last quarter, silently.",
          },
        ],
        checks: [
          {
            question: "In what order do the three checks go, and why?",
            answer:
              "Bundling, global period, necessity. Bundling rules a pair out fastest, so it goes first.",
          },
          {
            question: "Why check familiar codes?",
            answer:
              "NCCI edits update quarterly. A pair that was billable last year may not be now, and nothing announces it.",
          },
          {
            question: "What is the argument for checking every claim?",
            answer:
              "A few minutes against a full rework cycle plus payment delay. The arithmetic is not close.",
          },
        ],
        resources: [],
      },
    ],
  },
  {
    title: "The claim after you submit it",
    weekRange: "Weeks 6–7",
    objective: "Read a remittance, diagnose a denial, and write an appeal that works.",
    deliverable: "A worked appeal letter for one denied claim.",
    estHours: 4,
    nodes: [
      {
        title: "Reading a remittance",
        summary:
          "The payer's answer: what was allowed, what was adjusted, what the patient owes, and the codes explaining each.",
        learningObjectives: [
          "Read the adjustment and remark codes on a remittance",
          "Distinguish a denial from a contractual adjustment",
          "Say which line to act on and which to ignore",
        ],
        whyToday:
          "Everything upstream is guesswork until you can read the answer. Most people cannot, and treat every reduction as a denial worth appealing — which wastes the time the real denials needed.",
        principle:
          "A contractual adjustment is the contract working. A denial is the payer refusing. Appealing the first is wasted work and appealing none of the second is lost money.",
        commonMistake:
          "Appealing a contractual write-off. It is the difference between the billed and allowed amounts, it was agreed in the contract, and no appeal will recover it.",
        challenge:
          "Take any published sample remittance and classify every line: paid, contractual adjustment, denial, or patient responsibility. Then say which ones you would work and why.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The structure",
            detail:
              "One line per service, with billed, allowed, paid, adjustment and patient responsibility. The codes beside each say why.",
          },
          {
            title: "Adjustment reason codes",
            detail:
              "Standardised codes explaining a reduction. Learning the twenty most common turns a remittance from a wall of numbers into a worklist.",
          },
          {
            title: "Contractual versus denial",
            detail:
              "A contractual adjustment is the agreed discount. A denial is a refusal. Only the second is worth working.",
          },
          {
            title: "Patient responsibility",
            detail:
              "Deductible, co-insurance and copay. Not a denial — it is money owed by somebody other than the payer.",
          },
        ],
        checks: [
          {
            question: "What is a contractual adjustment?",
            answer:
              "The agreed difference between billed and allowed. It cannot be collected or appealed — it is the contract working as intended.",
          },
          {
            question: "How do you tell a denial from an adjustment?",
            answer:
              "The adjustment reason code. A denial refuses payment for a reason you can address; an adjustment applies the contracted rate.",
          },
          {
            question: "Is patient responsibility a denial?",
            answer:
              "No. It is money owed by the patient under their plan — deductible, co-insurance or copay.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Electronic billing and EDI",
            url: "https://www.cms.gov/medicare/coding-billing/electronic-billing",
            sourceName: "CMS",
            editorNote:
              "The remittance advice transaction is described here. Read the structure; the code lists are reference.",
          },
        ],
      },
      {
        title: "Why claims deny",
        summary:
          "Eligibility, necessity, bundling, timeliness, documentation — five causes cover most of them.",
        learningObjectives: [
          "Classify a denial into one of the common causes",
          "Say which are preventable at coding time",
          "Identify the ones that are not yours to fix",
        ],
        whyToday:
          "Denials cluster. Knowing the five causes turns a queue into a sorted worklist and tells you which ones your own work can prevent.",
        principle:
          "Classify before you appeal. The cause determines whether this is a correction, an appeal, or somebody else's problem.",
        commonMistake:
          "Treating every denial as a coding error. Eligibility and timely-filing denials have nothing to do with the code, and reworking the coding on those wastes the window for the ones that matter.",
        challenge:
          "List the five common causes. For each, say who owns the fix and whether it was preventable at coding time. Then say which single change would prevent the most denials in a typical practice.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Eligibility",
            detail:
              "The patient was not covered on that date, or not by that plan. Front desk, not coding — and preventable at check-in.",
          },
          {
            title: "Medical necessity",
            detail:
              "The diagnosis does not support the procedure. Sometimes a coding fix, sometimes a documentation gap, sometimes genuinely not covered.",
          },
          {
            title: "Bundling",
            detail:
              "An NCCI edit. Preventable entirely by the check from day 27, which is why that check is the highest-leverage habit here.",
          },
          {
            title: "Timely filing",
            detail:
              "Submitted after the window. Almost never recoverable, and the most avoidable money a practice loses.",
          },
          {
            title: "Documentation",
            detail:
              "The record does not support what was billed. The fix is upstream of coding and needs the clinician.",
          },
        ],
        checks: [
          {
            question: "Which denial cause is most preventable by a coder?",
            answer: "Bundling. The NCCI tables are published and checkable before submission.",
          },
          {
            question: "Why classify before appealing?",
            answer:
              "The cause decides the action — correction, appeal, or referral to whoever owns it. Appealing an eligibility denial achieves nothing.",
          },
          {
            question: "What makes timely-filing denials the worst kind?",
            answer:
              "They are almost never recoverable and they were entirely avoidable. The money is simply gone.",
          },
          {
            question: "You are handed a denial queue of two hundred claims. How do you work it?",
            answer:
              "Group before touching any single claim. Sort by denial reason code, payer and provider, and look for the concentration — most large queues are a handful of systematic causes, not two hundred individual mistakes. A single registration field, one provider's documentation habit, or one payer policy change usually explains the bulk. Fix the cause first, then rework the affected claims as a batch, and work the genuine one-offs last. Working the queue top to bottom in date order is the mistake, because it fixes symptoms at the slowest possible rate.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Medicare Internet-Only Manuals",
            url:
              "https://www.cms.gov/medicare/regulations-guidance/manuals/internet-only-manuals-ioms",
            sourceName: "CMS",
            editorNote:
              "The claims-processing manual defines the filing limits and the appeal levels. Look up the filing window for your payer type.",
          },
        ],
      },
      {
        title: "Writing an appeal",
        summary:
          "One page: what was billed, what the record shows, which rule supports it, and what you are asking for.",
        learningObjectives: [
          "Structure an appeal so a reviewer can act on it in two minutes",
          "Cite the rule rather than assert the conclusion",
          "Attach the right documentation and nothing else",
        ],
        whyToday:
          "This is the deliverable an employer can see. A coder who writes appeals that get paid is measurably more valuable than one who codes the same and does not.",
        principle:
          "The reviewer is reading dozens of these. Make yours the one where the rule is quoted, the record is attached, and the ask is on the first line.",
        commonMistake:
          "Attaching the entire chart. A reviewer with sixty pages finds nothing; a reviewer with the two relevant pages finds the answer. Volume reads as an absence of a case.",
        challenge:
          "Write a one-page appeal for a denial of your choosing: what was billed, what the record shows, the rule that supports it with its citation, and the specific ask. One page, and cut anything that is not one of those four.",
        challengeMinutes: 45,
        estMinutes: 55,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "The four parts",
            detail:
              "What was billed, what the record shows, which rule supports it, what you are asking for. Nothing else belongs on the page.",
          },
          {
            title: "Cite, do not assert",
            detail:
              "A guideline section, a coverage determination, or an NCCI modifier indicator. A citation can be checked; an opinion has to be argued.",
          },
          {
            title: "Attach precisely",
            detail:
              "The pages that prove the point. Everything else lengthens the review and buries the argument.",
          },
          {
            title: "Know the levels",
            detail:
              "Appeals escalate through defined stages with their own deadlines. Missing a deadline ends the matter regardless of merit.",
          },
        ],
        checks: [
          {
            question: "What are the four parts of an appeal?",
            answer:
              "What was billed, what the record shows, the rule that supports it, and the specific ask.",
          },
          {
            question: "Why not attach the whole chart?",
            answer:
              "A reviewer with sixty pages finds nothing. Precision reads as a case; volume reads as the absence of one.",
          },
          {
            question: "What ends an appeal regardless of merit?",
            answer: "Missing the deadline for that appeal level.",
          },
          {
            question: "What makes an appeal succeed?",
            answer:
              "Addressing the specific denial reason with the specific evidence that rebuts it, and nothing else. Quote the reason code, state what the documentation shows, cite the guideline or coverage policy that supports the coding, and attach the relevant pages rather than the whole chart. Appeals fail when they restate the claim rather than answering the objection, when they miss the payer's filing deadline, or when the underlying coding was in fact wrong — in which case the correct action is a corrected claim, not an appeal.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Medicare Internet-Only Manuals",
            url:
              "https://www.cms.gov/medicare/regulations-guidance/manuals/internet-only-manuals-ioms",
            sourceName: "CMS",
            editorNote:
              "The appeals process, with levels and deadlines. Find the chapter and note the first-level deadline — it is shorter than people expect.",
          },
        ],
      },
      {
        title: "Value-based payment, briefly",
        summary:
          "Payment increasingly depends on outcomes and risk, which changes what coding is measuring.",
        learningObjectives: [
          "Say how value-based payment differs from fee-for-service",
          "Explain what risk adjustment does with diagnosis codes",
          "Say why complete diagnosis coding matters more under it",
        ],
        whyToday:
          "The field is shifting, and under risk adjustment a diagnosis code stops being a justification for a procedure and becomes a description of a population. Missing chronic conditions costs money in a way it never did under fee-for-service.",
        principle:
          "Under risk adjustment, an uncoded chronic condition is a patient who looks healthier than they are — and a plan that is paid less to care for them.",
        commonMistake:
          "Carrying fee-for-service habits into risk adjustment. Coding only what was treated today is correct fee-for-service and incomplete under risk adjustment, where chronic conditions must be documented and coded each year.",
        challenge:
          "Write the difference in one paragraph: what a diagnosis code is FOR under fee-for-service versus under risk adjustment. Then say what a coder does differently under each.",
        challengeMinutes: 35,
        estMinutes: 50,
        points: 30,
        difficulty: "stretch",
        topics: [
          {
            title: "Fee-for-service",
            detail: "Paid per service. The diagnosis justifies the procedure and nothing more.",
          },
          {
            title: "Risk adjustment",
            detail:
              "A plan is paid according to how sick its members are, calculated from their diagnosis codes. The codes describe a population rather than justifying a service.",
          },
          {
            title: "Annual recapture",
            detail:
              "Chronic conditions must be documented and coded each year to count. A condition coded once and never again disappears from the risk calculation.",
          },
          {
            title: "The compliance edge",
            detail:
              "Because completeness now pays, there is pressure toward coding conditions the record does not support. That is fraud, and it is the fastest-growing enforcement area in the field.",
          },
        ],
        checks: [
          {
            question: "What does a diagnosis code do under risk adjustment?",
            answer:
              "Describes the health of a population so a plan is paid appropriately for caring for it — rather than justifying one procedure.",
          },
          {
            question: "Why must chronic conditions be recoded annually?",
            answer:
              "Risk scores are recalculated each year. A condition not documented and coded that year does not count.",
          },
          {
            question: "What is the compliance risk specific to risk adjustment?",
            answer:
              "Completeness pays, which creates pressure to code conditions the record does not support. That is fraud, and enforcement in this area is growing fastest.",
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Value-based programs",
            url: "https://www.cms.gov/medicare/quality/value-based-programs",
            sourceName: "CMS",
            editorNote:
              "The overview of how the payment model is shifting. Read the introduction; the individual programme pages are reference.",
          },
        ],
      },
      {
        title: "Practice: work a denial queue",
        summary: "A rep day. Ten denials — classify, decide, and write one appeal.",
        learningObjectives: [
          "Sort a queue by cause and by recoverability",
          "Decide which to appeal and which to write off",
          "Produce one appeal end to end",
        ],
        whyToday:
          "Not every denial is worth appealing, and deciding which is the judgement an employer is buying. A queue worked in order of arrival is a queue worked badly.",
        principle:
          "Sort by recoverable value, not by date. The oldest denial is often the least recoverable.",
        commonMistake:
          "Working the queue chronologically. Appeal deadlines and recoverable amounts vary enormously, and first-in-first-out guarantees you spend the most time on the least valuable.",
        challenge:
          "Ten denials of your own construction, based on the five causes. Sort them by whether they are recoverable and by value. Write the one appeal you would actually send, and say why you would not send the other nine.",
        challengeMinutes: 50,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "Sort by recoverable value",
            detail:
              "Amount times probability of recovery, against the time it takes. Some denials are worth ten minutes and some are worth none.",
          },
          {
            title: "Know when to stop",
            detail:
              "A denial that is correct is a write-off. Appealing it wastes time and, repeated, damages your credibility with that payer's reviewers.",
          },
          {
            title: "Look for the pattern",
            detail:
              "Ten denials with one cause is a process problem, not ten problems. Fixing the cause is worth more than winning all ten.",
          },
        ],
        checks: [
          {
            question: "How should a denial queue be sorted?",
            answer:
              "By recoverable value against effort — not chronologically, which guarantees the most time on the least valuable.",
          },
          {
            question: "When should you not appeal?",
            answer:
              "When the denial is correct. Appealing correct denials wastes time and erodes credibility with reviewers.",
          },
          {
            question: "What does a cluster of same-cause denials mean?",
            answer:
              "A process problem. Fixing the cause is worth more than winning the individual appeals.",
          },
        ],
        resources: [],
      },
    ],
  },
  {
    title: "Compliance, audits and the certification",
    weekRange: "Weeks 7–8",
    objective: "Know where an error becomes an offence, and what the credential actually costs.",
    deliverable: "A self-audit of ten of your own coded scenarios.",
    estHours: 4,
    nodes: [
      {
        title: "Fraud, abuse and the line between them",
        summary:
          "Error, abuse and fraud are three different things with three different consequences, and intent is what separates them.",
        learningObjectives: [
          "Define error, abuse and fraud as the enforcement bodies do",
          "Name the main statutes that apply",
          "Say what makes a pattern rather than a mistake",
        ],
        whyToday:
          "Everyone in this field makes mistakes. What matters is knowing which mistakes stop being mistakes, and the answer is about pattern and intent rather than about size.",
        principle:
          "One wrong code is an error. The same wrong code every time, in the direction that pays more, is a pattern — and a pattern is what an investigator is looking for.",
        commonMistake:
          "Assuming good intentions protect you. Some liability does not require intent to defraud, and 'reckless disregard' is a standard a busy coder can meet without meaning anything by it.",
        challenge:
          "Write the three definitions in your own words with an example of each. Then write the one thing that most reliably converts an error into a pattern — and what a practice does to stop it.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Error",
            detail:
              "A mistake, corrected when found. Practices make them constantly; the compliance question is whether they are found and fixed.",
          },
          {
            title: "Abuse",
            detail:
              "Practices inconsistent with sound fiscal or clinical standards that result in unnecessary cost — without established intent to deceive.",
          },
          {
            title: "Fraud",
            detail:
              "Knowingly submitting false claims. Knowledge includes reckless disregard, which is why 'I did not check' is a weak defence.",
          },
          {
            title: "The statutes",
            detail:
              "The False Claims Act, the Anti-Kickback Statute and the physician self-referral law. You are not expected to be a lawyer; you are expected to know they exist and what triggers them.",
          },
          {
            title: "Pattern is the signal",
            detail:
              "Investigators look for consistency and direction. Errors scatter; fraud points one way, and data analysis finds that easily.",
          },
        ],
        checks: [
          {
            question: "What separates abuse from fraud?",
            answer:
              "Established intent. Abuse is practice inconsistent with sound standards causing unnecessary cost; fraud is knowingly submitting false claims.",
          },
          {
            question: "Does 'I did not know' protect you?",
            answer:
              "Not necessarily. Knowledge includes reckless disregard, so not checking can meet the standard.",
          },
          {
            question: "Why is pattern the thing investigators look for?",
            answer:
              "Genuine errors scatter in both directions. Errors that consistently favour higher payment are a signal, and data analysis finds them easily.",
          },
          {
            question:
              "What separates fraud from abuse, and why does the distinction matter to you?",
            answer:
              "Intent. Abuse is billing that is inconsistent with accepted practice and results in unnecessary cost — often error, poor process or ignorance. Fraud is knowingly submitting false claims. The distinction matters because the penalties differ enormously, and because it means a coder's protection is documentation and consistency: a defensible process, queries on file and a self-audit trail are what demonstrate that an error was an error. It also means pressure to code a particular way is a compliance issue to escalate, not a judgement call to make quietly.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Physician compliance education",
            url: "https://oig.hhs.gov/compliance/physician-education/",
            sourceName: "HHS Office of Inspector General",
            editorNote:
              "Written by the people who investigate. Public domain, plainly written, and the definitions here are the operative ones.",
          },
          {
            type: "doc",
            title: "Physician self-referral",
            url: "https://www.cms.gov/medicare/regulations-guidance/physician-self-referral",
            sourceName: "CMS",
            editorNote:
              "The Stark law in outline. You need to recognise a referral arrangement that raises a question, not to advise on one.",
          },
        ],
      },
      {
        title: "The compliance programme",
        summary:
          "Seven elements a practice is expected to have, and what each of them asks of you specifically.",
        learningObjectives: [
          "Name the elements of an effective compliance programme",
          "Say what a coder's obligations are within one",
          "Explain what to do when told to code something you believe is wrong",
        ],
        whyToday:
          "This is the day that protects you. A coder who knows the reporting route and uses it is in a different position from one who complied quietly.",
        principle:
          "You are not required to be right about everything. You are required to raise what you cannot resolve, in writing, through the route the programme defines.",
        commonMistake:
          "Raising a concern verbally and letting it go. If there is no record that you raised it, then as far as any later review is concerned you did not.",
        challenge:
          "Write the seven elements. Then write, in three sentences, exactly what you would do if a supervisor instructed you to code something the record does not support — including where you would put it in writing.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "core",
        topics: [
          {
            title: "The seven elements",
            detail:
              "Written standards, a compliance officer, training, communication lines, auditing, enforcement, and prompt response to detected problems. The OIG guidance sets them out.",
          },
          {
            title: "Your obligation",
            detail:
              "Code what the record supports, raise what you cannot resolve, and do it through the defined channel. Silence is not neutrality.",
          },
          {
            title: "In writing",
            detail:
              "A verbal concern leaves no evidence you raised it. Email the compliance officer, keep the copy.",
          },
          {
            title: "Retaliation protection",
            detail:
              "Reporting in good faith is protected. Knowing that before you need it is what makes it usable.",
          },
        ],
        checks: [
          {
            question: "How many elements does an effective compliance programme have?",
            answer:
              "Seven — standards, a compliance officer, training, communication, auditing, enforcement, and prompt response.",
          },
          {
            question: "Why raise a concern in writing?",
            answer:
              "A verbal concern leaves no evidence it was raised. In a later review, unrecorded means it did not happen.",
          },
          {
            question: "What is a coder's core obligation?",
            answer:
              "Code what the record supports, and escalate through the defined channel what cannot be resolved.",
          },
          {
            question:
              "A supervisor tells you to bill a level the note does not support. What do you do?",
            answer:
              "Decline to submit it, explain what the record does support, and put the exchange in writing to the compliance officer. Complying makes you a participant; the programme exists precisely for this and reporting in good faith is protected.",
            kind: "interview",
            difficulty: "hard",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Provider compliance training",
            url: "https://oig.hhs.gov/compliance/provider-compliance-training/",
            sourceName: "HHS Office of Inspector General",
            editorNote:
              "Free official training materials from the enforcement body itself. Work through the coding and billing sections.",
          },
        ],
      },
      {
        title: "How an audit works",
        summary:
          "Sampling, extrapolation and the reason a small error rate can produce a very large repayment.",
        learningObjectives: [
          "Describe how an audit sample is drawn",
          "Explain extrapolation and its consequence",
          "Say what a practice does on receiving an audit letter",
        ],
        whyToday:
          "Extrapolation is the mechanism that makes coding errors expensive out of all proportion to their number, and almost nobody outside the field knows it exists.",
        principle:
          "An auditor checks thirty claims and applies the error rate to thousands. A three percent error rate is not three percent of the money.",
        commonMistake:
          "Treating an audit sample as the exposure. The sample is the measurement; the exposure is the whole population it is extrapolated across.",
        challenge:
          "Work the arithmetic: thirty claims sampled, four errors, average overpayment per error, applied across a universe of four thousand claims. Write the number. That number is why the checks on day 30 are worth the minutes.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 35,
        difficulty: "stretch",
        topics: [
          {
            title: "Sampling",
            detail:
              "A statistically valid random sample from a defined universe of claims. The method is published, which means it can be challenged if it was not followed.",
          },
          {
            title: "Extrapolation",
            detail:
              "The error rate from the sample is applied to the whole universe. This is where a modest error rate becomes a six-figure repayment.",
          },
          {
            title: "Self-audit first",
            detail:
              "Finding and repaying your own errors is treated very differently from having them found. The compliance guidance is explicit about it.",
          },
          {
            title: "What to do on the letter",
            detail:
              "Do not respond alone. Compliance officer, counsel, and a careful read of what is actually being requested and by when.",
          },
        ],
        checks: [
          {
            question: "What is extrapolation?",
            answer:
              "Applying the error rate found in a sample to the whole universe of claims it was drawn from — which is how a small error rate becomes a large repayment.",
          },
          {
            question: "Why does self-auditing matter?",
            answer:
              "Errors found and repaid voluntarily are treated very differently from errors found by an auditor. The guidance says so explicitly.",
          },
          {
            question: "What is the first step on receiving an audit letter?",
            answer:
              "Involve the compliance officer and counsel, and read exactly what is requested and by when. Not responding alone.",
          },
          {
            question: "Your coding accuracy is audited at 88%. Is that good?",
            answer:
              "Below where most departments want to be — 95% is a common internal benchmark — but the rate alone says little. What matters is the pattern: twelve percent spread randomly across code families is a training problem, while twelve percent concentrated in one service line or all erring in the same financial direction is a compliance problem and reads very differently to an external reviewer. I would ask for the error breakdown by type and direction before drawing any conclusion.",
            kind: "interview",
            difficulty: "medium",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "doc",
            title: "Physician compliance education",
            url: "https://oig.hhs.gov/compliance/physician-education/",
            sourceName: "HHS Office of Inspector General",
            editorNote:
              "The self-audit and voluntary-disclosure material. Read what the OIG says it does differently when a practice finds its own errors.",
          },
        ],
      },
      {
        title: "Self-auditing your own work",
        summary:
          "The habit that makes the rest of it safe: sample your own coding and score it against the record.",
        learningObjectives: [
          "Design a self-audit of your own work",
          "Score against the record rather than against your memory",
          "Turn the findings into a specific change",
        ],
        whyToday:
          "Every professional coder is audited eventually, internally or externally. The ones who are fine are the ones who were already auditing themselves.",
        principle:
          "Audit against the record, not against what you remember deciding. Your memory reconstructs a justification; the record does not.",
        commonMistake:
          "Auditing only the unusual cases. Errors cluster in high-volume routine coding, because that is where speed and habit operate.",
        challenge:
          "Take ten scenarios you coded earlier in this roadmap. Re-code them cold, without looking at your first answer, then compare. Every disagreement is a finding — write what caused it.",
        challengeMinutes: 50,
        estMinutes: 55,
        points: 40,
        difficulty: "stretch",
        topics: [
          {
            title: "Sample randomly",
            detail:
              "Not the ones you remember. Random within a period, or you audit your confidence rather than your accuracy.",
          },
          {
            title: "Re-code cold",
            detail:
              "Without seeing your original answer. Seeing it first produces agreement rather than a check.",
          },
          {
            title: "Score against the record",
            detail:
              "Does the documentation support what you assigned. Not whether it seemed reasonable at the time.",
          },
          {
            title: "One change per finding",
            detail:
              "A finding with no change attached is a note. The output is a specific thing you will do differently.",
          },
        ],
        checks: [
          {
            question: "Why sample randomly?",
            answer:
              "Choosing memorable cases audits your confidence rather than your accuracy. Errors hide in routine volume.",
          },
          {
            question: "Why re-code without seeing the original?",
            answer:
              "Seeing your first answer produces agreement rather than an independent check.",
          },
          {
            question: "What makes a finding useful?",
            answer: "A specific change attached to it. Without one it is a note, not a finding.",
          },
        ],
        resources: [],
      },
      {
        title: "The certification, and what it costs",
        summary:
          "The CPC and its alternatives are paid exams. Everything in this roadmap was free; the credential is not, and the price belongs on the first screen.",
        learningObjectives: [
          "Name the main certifications and who issues each",
          "State what the exam actually costs, including membership",
          "Decide whether and when to sit one",
        ],
        whyToday:
          "Last day. Every source in this roadmap has been free and government-published. The credential is the one part that costs money, and you should have the number before you decide, not after.",
        principle:
          "The learning is free. The certificate is not, and anybody telling you otherwise is selling something.",
        commonMistake:
          "Budgeting for the exam and forgetting the membership and the manuals. The exam fee is the smallest of the three, and the code books are an annual cost rather than a one-off.",
        challenge:
          "Price it properly: exam fee, required membership, current code manuals, and a retake. Check the current figures on the issuing body's own site rather than trusting any number quoted second-hand, including here. Then decide whether you sit it now, later, or not at all.",
        challengeMinutes: 40,
        estMinutes: 55,
        points: 40,
        difficulty: "core",
        topics: [
          {
            title: "The main credentials",
            detail:
              "AAPC's CPC is the most widely recognised for outpatient physician coding. AHIMA's CCS leans inpatient and facility. Employers usually name one.",
          },
          {
            title: "What the exam costs",
            detail:
              "A fee to sit it, plus annual membership in the issuing body, plus current code manuals you must bring. Prices change yearly — check the issuing site.",
          },
          {
            title: "The apprentice designation",
            detail:
              "Pass without experience and you carry an apprentice suffix until you evidence experience. Employers know exactly what it means.",
          },
          {
            title: "When it is worth sitting",
            detail:
              "When you can already do the work. The exam tests speed on material this roadmap covers; sitting it early buys a retake fee.",
          },
          {
            title: "What this roadmap gave you instead",
            detail:
              "The method, the guidelines, the edits, the compliance regime — all free and all from primary sources. The certificate proves it to a stranger; it does not replace it.",
          },
        ],
        checks: [
          {
            question: "What is the full cost of certifying, beyond the exam fee?",
            answer:
              "Annual membership in the issuing body and current code manuals, which recur yearly. The exam fee is the smallest component.",
          },
          {
            question: "What does the apprentice designation mean?",
            answer:
              "You passed the exam without documented experience. It is removed once experience is evidenced, and employers read it accurately.",
          },
          {
            question: "When should you sit the exam?",
            answer:
              "When you can already do the work. It tests speed on familiar material, so sitting it early mostly buys a retake.",
          },
          {
            question: "Which certification are you pursuing, and what does it actually require?",
            answer:
              "Name the credential, the examining body, the exam format and its cost, and be honest about status — passed, scheduled, or studying. Certification exams in this field are paid and often require membership plus a renewal cycle with continuing education units. Overstating a credential is the fastest way to fail a background check in a compliance-sensitive profession, so the answer should be exact.",
            kind: "interview",
            difficulty: "easy",
            askedInInterviews: true,
          },
        ],
        resources: [
          {
            type: "read",
            title: "What is medical coding",
            url: "https://www.aapc.com/resources/what-is-medical-coding",
            sourceName: "AAPC",
            editorNote:
              "AAPC issues the CPC, so their site carries the current fees. Read the pricing yourself — it changes annually and no figure quoted elsewhere, including in this roadmap, should be trusted over theirs.",
          },
        ],
      },
    ],
  },
];
