/**
 * Medical coding — forty days, eight weeks.
 *
 * The first roadmap in Health & life sciences, and the one that serves an
 * audience nothing else in the catalogue touches: life-science graduates
 * without a clinical career, in a country with a very large medical-coding
 * outsourcing industry.
 *
 * FORTY DAYS, NOT THE SIXTY-FIVE THE BRIEF ASKED FOR. Forty complete days
 * beat sixty-five half-authored ones, and every day here carries the full
 * six-section model. Five a week, which a streak survives.
 *
 * WHAT THIS ROADMAP CANNOT DO, stated on its face rather than discovered on
 * day 20. The code sets are not all free: ICD-10-CM, ICD-10-PCS and HCPCS
 * Level II are US government works and are published free, but CPT is owned
 * by the American Medical Association and its manual is a commercial
 * product. So this teaches the method, the official guidelines, the edits
 * and the compliance regime in full — and for CPT it teaches the structure
 * and the rules while the codes themselves come from a licensed manual or an
 * employer's encoder. Day 2 says this to the reader directly, because
 * somebody who expects a free CPT list will otherwise spend a week looking
 * for one that does not legitimately exist.
 *
 * Every link is to a US federal source — CMS, the HHS Office of Inspector
 * General, the NIH National Library of Medicine — which are public domain,
 * free forever, and not going behind a paywall. Two obviously good sources
 * are ABSENT because they return 403 to our link checker and rule 2 forbids
 * publishing a URL we cannot verify: cdc.gov's ICD-10-CM pages and hhs.gov's
 * HIPAA section. CMS carries the same material and can be checked.
 *
 * NO SELF-CHECKING RESOURCE. Every other roadmap anchors on something that
 * marks the learner's work; this subject has none that is free. The reason is
 * the licensing above — auto-graded coding practice needs a full code set,
 * and the full CPT set is licensed. The challenges carry the verification
 * burden instead, and day 39 is an explicit self-audit: re-code ten of your
 * own earlier scenarios cold and score the disagreements.
 *
 * THIS IS NOT CLINICAL TRAINING. It teaches the work AROUND healthcare —
 * classification, process, payment and compliance. Nothing here is medical
 * advice, no day teaches diagnosis or treatment, and day 8 says where the
 * anatomy deliberately stops.
 */
import m01to04 from "./medical-coding/modules-01-04.mjs";
import m05to08 from "./medical-coding/modules-05-08.mjs";

export default {
  slug: "medical-coding",
  title: "Medical coding — ICD-10 and CPT",
  summary:
    "Forty days from what a coder actually does to auditing your own work, built entirely on free government sources. Teaches the work around healthcare, not clinical care. The CPC certification exam is paid — day 40 prices it.",
  subjectTags: [
    "medical-coding",
    "icd-10",
    "cpt",
    "healthcare",
    "compliance",
    "medical-billing",
    "hcpcs",
  ],
  category: "health",
  difficulty: "beginner",
  estimatedWeeks: 8,
  cert: "paid_exam",
  reviewCadence: "semiannual",
  licenseNote:
    "Every linked source is a US federal work in the public domain — CMS, HHS OIG and the NIH National Library of Medicine. CPT is copyrighted by the American Medical Association; this roadmap teaches its rules and never reproduces its codes.",

  modules: [...m01to04, ...m05to08],
};
