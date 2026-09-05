/**
 * What licence each source we link to publishes under.
 *
 * WHY THIS FILE EXISTS
 *
 * "Free to learn" and "free to reuse" are different questions, and Jintu is a
 * commercial platform. Pro Git, MIT OCW, The Odin Project, JavaScript.info
 * and Seeing Theory are all free to read and all carry a NonCommercial
 * clause, which means we may link them and may never quote, adapt or
 * re-host a word. Today that distinction costs nothing because rule 1 makes
 * us link-only anyway. It costs everything the first time somebody writes an
 * inline summary of a source, which is a feature somebody will eventually
 * want.
 *
 * THE DEFAULT IS THE MOST RESTRICTIVE ONE, DELIBERATELY.
 *
 * Being wrong in the restrictive direction costs nothing — we link either
 * way. Being wrong in the permissive direction is a licence breach. So a
 * host is only marked reusable where the licence is stated by the publisher
 * and I have recorded where; everything else is `proprietary`, which permits
 * linking and forbids reuse. `basis` on every entry says which of those two
 * this is, so nobody has to guess later whether an entry was researched or
 * assumed.
 *
 * AN UNLISTED HOST FAILS THE IMPORT. That is the point: adding a new source
 * forces the licence question once, at the moment somebody is already
 * looking at the page, rather than never.
 */

/** Licences that permit commercial reuse with attribution. Keep in sync with
 *  the generated `may_reuse` column in migration 0023. */
export const REUSABLE = new Set(["public-domain", "cc0", "cc-by", "cc-by-sa", "permissive"]);

export const LICENSES = [
  "public-domain",
  "cc0",
  "cc-by",
  "cc-by-sa",
  "cc-by-nc",
  "cc-by-nc-sa",
  "cc-by-nd",
  "cc-by-nc-nd",
  "permissive",
  "proprietary",
  "unknown",
];

const stated = (license, where) => ({ license, basis: `stated: ${where}` });
/** Not researched. Restrictive by default, which is always safe for a link. */
const assumed = () => ({
  license: "proprietary",
  basis: "not verified — restrictive default; we link only, so this is safe",
});

/**
 * Host → licence. Longest suffix match wins, so a subdomain can override.
 */
export const BY_HOST = {
  // ── the finance layer (startup-finance roadmap, 2026-09-03) ─────────────
  // Everything here is link-only under rule 1, so proprietary is safe; the
  // licence column exists for the day somebody wants to quote, and none of
  // these may be quoted without checking the page itself.
  "pages.stern.nyu.edu": assumed(), // Damodaran's NYU pages — freely served, rights reserved
  "ycombinator.com": assumed(),
  "startupschool.org": assumed(),
  "carta.com": assumed(),
  "zerodha.com": assumed(), // Varsity states free-to-read, no signup; not open-licensed
  "sebi.gov.in": assumed(), // Indian government works are NOT public domain like US federal works
  "bseindia.com": assumed(),
  "bsesme.com": assumed(),
  "stripe.com": assumed(),
  "feld.com": assumed(), // Brad Feld's term-sheet series — free to read, rights reserved
  "rbi.org.in": assumed(), // Indian government works are NOT public domain like US federal works
  "iangroup.vc": assumed(), // Indian Angel Network (indianangelnetwork.com redirects here)
  "firstround.com": assumed(),
  "trifectacapital.in": assumed(),
  "alteriacapital.com": assumed(),
  "aswathdamodaran.blogspot.com": assumed(), // Musings on Markets
  "fast-standard.org": assumed(), // the FAST modelling standard — free to read
  "saas-capital.com": assumed(),
  "hindenburgresearch.com": assumed(), // report archive; firm wound down 2025, site stays up
  "angelcapitalassociation.org": assumed(),
  "paulgraham.com": assumed(), // free to read, copyrighted — link only, per the owner inventory
  "forentrepreneurs.com": assumed(), // David Skok
  "a16z.com": assumed(),
  "sequoiacap.com": assumed(),
  "mospi.gov.in": assumed(), // Indian government works are NOT public domain like US federal works
  "eusprig.org": assumed(),

  // ── established, and reusable ───────────────────────────────────────────
  "en.wikipedia.org": stated("cc-by-sa", "Wikipedia:Copyrights — CC BY-SA 4.0"),
  "ourworldindata.org": stated("cc-by", "ourworldindata.org/about — CC BY 4.0 on their own writing and data"),

  // ── US federal works: public domain, the richest reusable pool there is ─
  "cms.gov": stated(
    "public-domain",
    "a work of the US federal government; 17 U.S.C. 105 puts it outside copyright. Citation appreciated, permission not required",
  ),
  "oig.hhs.gov": stated("public-domain", "HHS Office of Inspector General — US federal work"),
  "medlineplus.gov": stated("public-domain", "NIH National Library of Medicine — US federal work"),
  "nlm.nih.gov": stated("public-domain", "NIH National Library of Medicine — US federal work"),
  "ncbi.nlm.nih.gov": stated(
    "cc-by-nc-nd",
    "NCBI Bookshelf licences vary PER TITLE and are not uniformly federal works — StatPearls, the titles used here, is CC BY-NC-ND 4.0. Restrictive default for the whole host because the per-title check is not automatable",
  ),

  // ── established, and NOT reusable: free to read, NonCommercial ─────────
  "git-scm.com": stated(
    "cc-by-nc-sa",
    "Pro Git is CC BY-NC-SA 3.0. The reference pages under /docs are GPL-licensed man pages; both are link-only for us",
  ),
  "pgexercises.com": stated("cc-by-nc-sa", "pgexercises.com/about.html — CC BY-NC-SA"),
  "seeing-theory.brown.edu": stated("cc-by-nc-sa", "the project's own licence statement"),
  "automatetheboringstuff.com": stated("cc-by-nc-sa", "the book's own licence page"),
  "missing.csail.mit.edu": stated("cc-by-nc-sa", "the course site's footer — MIT course material"),

  // ── open-source project documentation ──────────────────────────────────
  // Permissive project licences. Linking is unrestricted; reuse of the prose
  // is governed by the project licence, which these all state.
  "postgresql.org": stated("permissive", "the PostgreSQL Licence, a BSD/MIT-style permissive licence"),
  "numpy.org": stated("permissive", "NumPy is BSD-3-Clause and its docs ship with the project"),
  "pandas.pydata.org": stated("permissive", "pandas is BSD-3-Clause and its docs ship with the project"),
  "matplotlib.org": stated("permissive", "Matplotlib's PSF-based licence"),
  "seaborn.pydata.org": stated("permissive", "seaborn is BSD-3-Clause"),
  "statsmodels.org": stated("permissive", "statsmodels is BSD-3-Clause"),
  "docs.scipy.org": stated("permissive", "SciPy is BSD-3-Clause"),
  "requests.readthedocs.io": stated("permissive", "Requests is Apache-2.0"),
  "docs.docker.com": stated("permissive", "the docs repository is Apache-2.0"),
  "maven.apache.org": stated("permissive", "Apache-2.0"),
  "junit.org": stated("permissive", "JUnit 5 is EPL-2.0; the user guide ships with it"),
  "hibernate.org": stated("permissive", "Hibernate is LGPL/Apache; the reference guide ships with it"),
  "site.mockito.org": stated("permissive", "Mockito is MIT"),
  "shellcheck.net": stated("permissive", "ShellCheck is GPL-3.0; the site is its front end"),
  "tldr.sh": stated("cc-by", "the tldr-pages content is CC BY 4.0 per its repository"),
  "man7.org": stated(
    "permissive",
    "Linux man-pages are variously GPL/BSD per page; permissive is the safe summary and we link only",
  ),

  // ── vendor and publisher documentation: all rights reserved ────────────
  // Free to read, never reusable. Named individually rather than defaulted
  // so the list doubles as the record of who we depend on.
  "advertising.amazon.com": stated("proprietary", "Amazon Ads documentation — all rights reserved"),
  "learningconsole.amazonadvertising.com": stated("proprietary", "Amazon Ads learning console"),
  "sell.amazon.com": stated("proprietary", "Amazon Seller Central"),
  "sell.amazon.in": stated("proprietary", "Amazon Seller Central India"),
  "developer.amazon.com": stated("proprietary", "Amazon developer documentation"),
  "learn.microsoft.com": stated("proprietary", "Microsoft Learn terms of use"),
  "support.microsoft.com": stated("proprietary", "Microsoft support content"),
  "docs.github.com": stated("proprietary", "GitHub Docs — the site content, not the code samples"),
  "github.com": stated("proprietary", "per-repository; assume all rights reserved unless a LICENSE says otherwise"),
  "skills.github.com": stated("proprietary", "GitHub Skills"),
  "atlassian.com": stated("proprietary", "Atlassian tutorials"),
  "spring.io": stated("proprietary", "Spring guides"),
  "docs.spring.io": stated("proprietary", "Spring reference documentation"),
  "start.spring.io": stated("proprietary", "Spring Initializr"),
  "dev.java": stated("proprietary", "Oracle's dev.java"),
  "adoptium.net": stated("proprietary", "Eclipse Adoptium site content"),
  "jetbrains.com": stated("proprietary", "JetBrains documentation"),
  "code.visualstudio.com": stated("proprietary", "Visual Studio Code documentation"),
  "dbeaver.io": stated("proprietary", "DBeaver site content"),
  "jwt.io": stated("proprietary", "Auth0's jwt.io"),
  "youtube.com": stated(
    "proprietary",
    "each video is its creator's. We embed through the official nocookie player and never re-host — see CLAUDE.md rule 1",
  ),
  "kaggle.com": stated("proprietary", "Kaggle terms of service"),
  "public.tableau.com": stated("proprietary", "Tableau Public"),
  "bbc.co.uk": stated("proprietary", "BBC terms of use"),
  "khanacademy.org": stated(
    "cc-by-nc-sa",
    "Khan Academy's own content is CC BY-NC-SA per its terms; link only",
  ),

  // ── independent writers and small sites ────────────────────────────────
  // All rights reserved unless they say otherwise, which is the norm.
  "aapc.com": stated(
    "proprietary",
    "a commercial certifying body. Its explainer articles are free to read and all rights reserved; it also owns nothing we quote",
  ),
  "exceljet.net": assumed(),
  "baeldung.com": assumed(),
  "mode.com": assumed(),
  "datalemur.com": assumed(),
  "stratascratch.com": assumed(),
  "sqlbolt.com": assumed(),
  "sqlzoo.net": assumed(),
  "fs.blog": assumed(),
  "cbea.ms": assumed(),
  "dangitgit.com": assumed(),
  "chandoo.org": assumed(),
  "grymoire.com": assumed(),
  "linuxcommand.org": stated(
    "cc-by-nc-nd",
    "The Linux Command Line (Shotts) is CC BY-NC-ND 3.0 — the most restrictive of the family",
  ),
  "mywiki.wooledge.org": assumed(),
  "explainshell.com": assumed(),
  "learngitbranching.js.org": assumed(),
  "overthewire.org": assumed(),
  "storytellingwithdata.com": assumed(),
  "callingbullshit.org": assumed(),
  "readthesequences.com": assumed(),
  "evanmiller.org": assumed(),
  "jakevdp.github.io": assumed(),
  "vita.had.co.nz": assumed(),
  "gjopen.com": assumed(),
  "goodjudgment.com": assumed(),
  "metaculus.com": assumed(),
};

/**
 * Hosts that mark the learner's work themselves.
 *
 * Bandit will not let you reach level 11 without solving level 10. pgexercises
 * runs your SQL against the answer. DataLemur and StrataScratch grade a query.
 * Metaculus and Good Judgment Open score a forecast against what happened.
 *
 * These are the highest-value resources in the catalogue: verified practice,
 * maintained by somebody else, free, and impossible to fake your way through.
 * Derived from the host rather than set per resource for the same reason
 * licences are — one registry, one place to be wrong.
 *
 * ShellCheck is deliberately NOT here. It finds bugs in a script you wrote; it
 * does not tell you whether you solved the exercise, and the difference
 * matters.
 */
export const SELF_CHECKING = new Set([
  "overthewire.org",          // wargame levels gated on the previous password
  "learngitbranching.js.org", // each level verifies the resulting commit graph
  "skills.github.com",        // runs in a real repo and checks the result
  "pgexercises.com",          // runs your SQL and compares the result set
  "sqlbolt.com",              // inline exercises with checked answers
  "sqlzoo.net",               // same
  "datalemur.com",            // graded SQL interview questions
  "stratascratch.com",        // graded SQL and Python questions
  "kaggle.com",               // Learn's notebook exercises are auto-checked
  "gjopen.com",               // forecasts scored against outcomes
  "metaculus.com",            // same, with a public track record
]);

export const isSelfChecking = (url) => {
  try {
    const host = new URL(url).hostname.replace(/^www./, "");
    if (SELF_CHECKING.has(host)) return true;
    const parts = host.split(".");
    for (let i = 1; i < parts.length - 1; i++)
      if (SELF_CHECKING.has(parts.slice(i).join("."))) return true;
    return false;
  } catch {
    return false;
  }
};

/** Longest-suffix host match, so a subdomain entry beats its parent. */
export function licenseForUrl(url) {
  let host;
  try {
    host = new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
  if (BY_HOST[host]) return { host, ...BY_HOST[host] };
  // Walk up: docs.example.com → example.com
  const parts = host.split(".");
  for (let i = 1; i < parts.length - 1; i++) {
    const parent = parts.slice(i).join(".");
    if (BY_HOST[parent]) return { host: parent, ...BY_HOST[parent] };
  }
  return null;
}
