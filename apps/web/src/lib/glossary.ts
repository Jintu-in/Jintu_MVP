/**
 * Structurally identical to lib/steps.ts's own `LessonStep`/`Rich`, not
 * imported from there: scripts/assert-glossary.mjs compiles this file in
 * isolation (same posture as scripts/assert-roles.mjs — see its own
 * header for why a weaker, non-compiling check is refused), and
 * lib/steps.ts pulls in lib/blocks.ts and beyond, which is a much bigger
 * graph to replicate a tsconfig for than this feature needs. TypeScript's
 * structural typing means the real LessonStep[] built in page.tsx is
 * still accepted here without a cast — these just have to name the same
 * fields, not be the same declaration.
 */
export type GlossaryTermSegment = {
  kind: "glossaryTerm";
  /** The as-authored display text — "staging area", not the glossary
   *  entry's own canonical casing, if they ever differ. */
  text: string;
  meaning: string;
  roadmapTitle: string;
  taughtInLabel: string;
  taughtInHref: string;
  /** False for every occurrence after the first in a lesson (CHANGES.md:
   *  "only the first use ... gets the dotted underline"). */
  interactive: boolean;
};
type RichLike = ({ kind: "text" | "code" | "mono"; text: string } | GlossaryTermSegment)[];
type LessonStepLike =
  | { kind: "concept"; paragraphs: RichLike[] }
  | { kind: "challenge" | "gotcha"; text: RichLike }
  | { kind: "check"; question: RichLike; answer: RichLike[] }
  | { kind: string; [key: string]: unknown };

/**
 * GlossaryKit (design pack update 3 §C) — one static content file per
 * roadmap that has glossary terms, registered here by slug. Static, not
 * database-backed: a glossary entry is editorial content "written and
 * reviewed like lessons" (CHANGES.md), exactly the same posture as
 * content/roles/index.ts's ROLES array — ships with the deploy, costs a
 * database read never. CHANGES.md's own illustrative path
 * (`content/<roadmap>/glossary.yaml`) is YAML; this repo has no YAML
 * content anywhere and no YAML parser dependency, so the shape lives in
 * TypeScript instead — same content, same review process, one fewer new
 * dependency for a single feature.
 *
 * `taughtIn` names the teaching node by its exact authored TITLE, not a
 * slug or id computed by hand: applyGlossary() resolves it against the
 * live roadmap tree at render time, so a lesson retitled in
 * docs/roadmaps/*.mjs can never leave a glossary entry silently pointing
 * at a slug that no longer exists.
 */
export type GlossaryEntry = {
  term: string;
  aliases: string[];
  /** One line, 25 words at most — enforced by scripts/assert-glossary.mjs,
   *  not here; this type carries the shape, not the limit. */
  meaning: string;
  taughtIn: string;
};

/** Exported (not module-private) so scripts/assert-glossary.mjs can
 *  enumerate every roadmap that has a glossary, not just look one up. */
export const REGISTRY: Record<string, GlossaryEntry[]> = {
  "git-and-github": [
    {
      term: "staging area",
      aliases: ["the index", "staged"],
      meaning: "The list of changes you have picked for your next commit. You add to it with `git add`.",
      taughtIn: "The three places a change can be",
    },
  ],
};

export function getGlossary(roadmapSlug: string): GlossaryEntry[] {
  return REGISTRY[roadmapSlug] ?? [];
}

const MARKER = /\[\[([^\]]+)\]\]/g;

function findEntry(glossary: GlossaryEntry[], phrase: string): GlossaryEntry | undefined {
  const needle = phrase.trim().toLowerCase();
  return glossary.find(
    (g) => g.term.toLowerCase() === needle || g.aliases.some((a) => a.toLowerCase() === needle),
  );
}

function splitRich(
  rich: RichLike,
  glossary: GlossaryEntry[],
  roadmapTitle: string,
  roadmapSlug: string,
  flatNodes: { title: string; slug: string }[],
  seen: Set<string>,
): RichLike {
  const out: RichLike = [];
  for (const seg of rich) {
    if (seg.kind !== "text") {
      out.push(seg);
      continue;
    }
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let sawMarker = false;
    MARKER.lastIndex = 0;
    while ((match = MARKER.exec(seg.text))) {
      sawMarker = true;
      const [full, phrase = ""] = match;
      const before = seg.text.slice(lastIndex, match.index);
      if (before) out.push({ kind: "text", text: before });
      const entry = findEntry(glossary, phrase);
      if (!entry) {
        // No matching entry — leave the brackets off but the words in
        // place, a visible authoring slip rather than a silently eaten
        // one. scripts/assert-glossary.mjs is where this actually gets
        // caught before a term like this ships.
        out.push({ kind: "text", text: phrase });
      } else {
        const taughtInNode = flatNodes.find((n) => n.title === entry.taughtIn);
        const lessonNumber = taughtInNode ? flatNodes.indexOf(taughtInNode) + 1 : null;
        const key = entry.term.toLowerCase();
        const interactive = !seen.has(key);
        seen.add(key);
        out.push({
          kind: "glossaryTerm",
          text: phrase,
          meaning: entry.meaning,
          roadmapTitle,
          taughtInLabel:
            taughtInNode && lessonNumber
              ? `Taught in lesson ${lessonNumber} · ${taughtInNode.title}`
              : entry.taughtIn,
          taughtInHref: taughtInNode ? `/learn/${roadmapSlug}/${taughtInNode.slug}` : `/learn/${roadmapSlug}`,
          interactive,
        });
      }
      lastIndex = match.index + full.length;
    }
    if (!sawMarker) {
      out.push(seg);
      continue;
    }
    const rest = seg.text.slice(lastIndex);
    if (rest) out.push({ kind: "text", text: rest });
  }
  return out;
}

/**
 * Resolves every `[[term]]` marker across `steps`' authored prose into a
 * GlossaryTermSegment, in step order — the one place "first use in this
 * lesson" is decided, once, rather than live during render (which would
 * mean a `useRef` whose correctness depended on the order someone
 * actually navigated the reader in, not the order the lesson is
 * authored in). Only the concept/challenge/gotcha/check kinds carry free
 * prose through text() — the worked-example kinds (choose, find, decide,
 * …) have their own typed fields instead and are left untouched.
 */
export function applyGlossary<T extends LessonStepLike>(
  steps: T[],
  glossary: GlossaryEntry[],
  roadmapTitle: string,
  roadmapSlug: string,
  flatNodes: { title: string; slug: string }[],
): T[] {
  if (glossary.length === 0) return steps;
  const seen = new Set<string>();
  const mapRich = (r: RichLike) => splitRich(r, glossary, roadmapTitle, roadmapSlug, flatNodes, seen);

  // The real, exported type is T[] — the same concrete LessonStep union
  // callers pass in (checked by the `T extends LessonStepLike` bound) —
  // but building each transformed step necessarily goes through the
  // loose structural shape, which TS can't itself re-prove is still
  // exactly T; see this function's own header comment for why `Rich`
  // isn't imported here to let it prove that directly.
  return steps.map((step) => {
    // Two casts, confined to this loop body (see this function's own
    // header comment for why `Rich` isn't imported to prove this
    // directly): the outer one narrows the generic T down to the local
    // structural union at all; the inner ones are needed per branch
    // because LessonStepLike's own catch-all member (`kind: string`)
    // still structurally overlaps every literal `kind` check below, so
    // `===` narrowing alone never eliminates it the way narrowing a
    // closed union normally would.
    const s = step as LessonStepLike;
    if (s.kind === "concept") {
      const c = s as { kind: "concept"; paragraphs: RichLike[] };
      return { ...c, paragraphs: c.paragraphs.map(mapRich) };
    }
    if (s.kind === "challenge" || s.kind === "gotcha") {
      const c = s as { kind: "challenge" | "gotcha"; text: RichLike };
      return { ...c, text: mapRich(c.text) };
    }
    if (s.kind === "check") {
      const c = s as { kind: "check"; question: RichLike; answer: RichLike[] };
      return { ...c, question: mapRich(c.question), answer: c.answer.map(mapRich) };
    }
    return s;
  }) as T[];
}
