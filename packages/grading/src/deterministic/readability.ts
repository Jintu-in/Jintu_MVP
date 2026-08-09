/**
 * Cheap lexical checks on the submitted SQL.
 *
 * These are style signals a reviewer would raise, worth a small part of the
 * mark and never worth failing a correct query over. They are heuristics on
 * text, not a parser, so each one is written to under-report: a false pass is
 * a missed teaching moment, a false fail is a student arguing with a robot
 * about something the robot got wrong.
 */

/** Strip strings and comments so their contents cannot trip a rule. */
export function stripNoise(sql: string): string {
  return sql
    .replace(/--[^\n]*/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/'(?:[^']|'')*'/g, "''")
    .replace(/"(?:[^"]|"")*"/g, '""');
}

export function usesSelectStar(sql: string): boolean {
  // `count(*)` and `sum(x) over ()` are fine; a bare `select *` is not.
  return /\bselect\s+\*/i.test(stripNoise(sql));
}

export function joinsWithoutCondition(sql: string): boolean {
  const s = stripNoise(sql);
  // Comma-joined tables in FROM with no WHERE at all is the classic
  // accidental cross product. With a WHERE we cannot tell lexically whether
  // it actually relates the tables, so we do not guess — the plan check does
  // that job properly.
  const from = /\bfrom\b([\s\S]*?)(\bwhere\b|\bgroup\s+by\b|\border\s+by\b|\blimit\b|$)/i.exec(s);
  if (!from) return false;
  const clause = from[1] ?? "";
  const hasComma = /,/.test(clause);
  const hasWhere = /\bwhere\b/i.test(s);
  return hasComma && !hasWhere;
}

export function hasTableAliases(sql: string): boolean {
  const s = stripNoise(sql);
  // Only meaningful once more than one table is involved.
  const tables = (s.match(/\b(from|join)\s+[a-z_][\w.]*/gi) ?? []).length;
  if (tables < 2) return true;
  return /\b(from|join)\s+[a-z_][\w.]*\s+(as\s+)?[a-z_]\w*/i.test(s);
}

/**
 * Detects a cross join from the query plan, which is the only reliable way:
 * `a, b` with an unrelated WHERE still produces one, and no amount of regex
 * will tell you that.
 */
export function planHasCrossJoin(plan: unknown): boolean {
  let found = false;

  const walk = (node: unknown): void => {
    if (found || node === null || typeof node !== "object") return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    const n = node as Record<string, unknown>;

    const joinType = typeof n["Join Type"] === "string" ? (n["Join Type"] as string) : null;
    const nodeType = typeof n["Node Type"] === "string" ? (n["Node Type"] as string) : null;

    // A Nested Loop with no join filter and no index condition beneath it is
    // Postgres's shape for a cartesian product.
    if (nodeType === "Nested Loop" && !("Join Filter" in n)) {
      const inner = n["Plans"];
      const innerHasCondition =
        Array.isArray(inner) &&
        inner.some(
          (p) =>
            p !== null &&
            typeof p === "object" &&
            ("Index Cond" in (p as object) || "Recheck Cond" in (p as object)),
        );
      if (!innerHasCondition) found = true;
    }
    if (joinType === "Full" && !("Join Filter" in n) && !("Hash Cond" in n)) found = true;

    Object.values(n).forEach(walk);
  };

  walk(plan);
  return found;
}
