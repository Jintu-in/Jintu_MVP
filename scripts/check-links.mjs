/**
 * The link-health crawler — what "Jintu sequences it and keeps it alive"
 * actually runs on.
 *
 *   pnpm links:check            # crawl and write results
 *   pnpm links:check --dry      # crawl, print, write nothing
 *
 * Fetches every resource URL on every PUBLISHED roadmap (YouTube embeds via
 * oEmbed, which answers even where watch pages block bots), appends a row
 * to link_checks per probe, and mirrors the verdict onto
 * resources.health/last_checked_at:
 *
 *   2xx                → ok
 *   timeout / network  → flaky   (sites blink; one bad probe is not death)
 *   4xx / 5xx          → broken  (except 429: rate limiting is their
 *                                 health, not the link's — flaky)
 *
 * It REPORTS; it never unpublishes. A broken link is a curation decision
 * for a person — the reader page softens the row, and this script's output
 * is the worklist. Needs SUPABASE_SECRET_KEY (server-side table writes);
 * run it locally or from a scheduled job, never from anything a client
 * can reach.
 */
const dry = process.argv.includes("--dry");
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const secret = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !secret) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY (see apps/web/.env.local + root .env).");
  process.exit(1);
}
// Plain PostgREST over fetch: supabase-js requires Node 22's native
// WebSocket for a realtime client this script never uses.
const rest = async (path, init = {}) => {
  const res = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: secret,
      authorization: `Bearer ${secret}`,
      "content-type": "application/json",
      ...init.headers,
    },
  });
  if (!res.ok) {
    throw new Error(`${init.method ?? "GET"} ${path}: ${res.status} ${await res.text()}`);
  }
  // return=minimal answers 201/204 with an empty body; only parse substance.
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const resources = await rest(
  "resources?select=id,url,title,youtube_video_id,health,nodes!inner(modules!inner(roadmaps!inner(status)))&nodes.modules.roadmaps.status=eq.published",
);

console.log(`probing ${resources.length} resources...`);

const probe = async (r) => {
  const target = r.youtube_video_id
    ? `https://www.youtube.com/oembed?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D${r.youtube_video_id}&format=json`
    : r.url;
  try {
    const res = await fetch(target, {
      redirect: "follow",
      signal: AbortSignal.timeout(25000),
      headers: { "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) JintuLinkCheck/1.0" },
    });
    if (res.ok) return { status: res.status, ok: true, health: "ok" };
    // 429 is their rate limiter answering; 403 is almost always a bot
    // shield refusing THIS crawler while serving humans fine (Metaculus
    // does exactly this). A genuinely gone page 404s. Neither is "broken".
    if (res.status === 429 || res.status === 403) {
      return { status: res.status, ok: false, health: "flaky" };
    }
    return { status: res.status, ok: false, health: "broken" };
  } catch {
    return { status: null, ok: false, health: "flaky" };
  }
};

// Concurrency 4: this is a curation tool, not a load test.
const results = [];
const queue = [...resources];
await Promise.all(
  Array.from({ length: 4 }, async () => {
    for (let r = queue.shift(); r; r = queue.shift()) {
      const verdict = await probe(r);
      results.push({ r, verdict });
      if (verdict.health !== "ok") {
        console.log(`  ${verdict.health.toUpperCase().padEnd(6)} ${verdict.status ?? "net"}  ${r.url}`);
      }
    }
  }),
);

const counts = results.reduce((a, { verdict }) => ((a[verdict.health] = (a[verdict.health] ?? 0) + 1), a), {});
console.log(`\nok ${counts.ok ?? 0} · flaky ${counts.flaky ?? 0} · broken ${counts.broken ?? 0}`);

if (dry) {
  console.log("dry run — nothing written.");
  process.exit(0);
}

const now = new Date().toISOString();
try {
  await rest("link_checks", {
    method: "POST",
    headers: { prefer: "return=minimal" },
    body: JSON.stringify(
      results.map(({ r, verdict }) => ({
        resource_id: r.id,
        status_code: verdict.status,
        ok: verdict.ok,
        checked_at: now,
      })),
    ),
  });
} catch (e) {
  console.error("link_checks insert failed:", e.message);
}

for (const { r, verdict } of results) {
  const patch =
    r.health === verdict.health
      ? { last_checked_at: now } // unchanged; still stamp the check time
      : { health: verdict.health, last_checked_at: now };
  try {
    await rest(`resources?id=eq.${r.id}`, {
      method: "PATCH",
      headers: { prefer: "return=minimal" },
      body: JSON.stringify(patch),
    });
    if (patch.health) console.log(`  health: ${r.health} → ${verdict.health}  ${r.url}`);
  } catch (e) {
    console.error(`update failed for ${r.url}: ${e.message}`);
  }
}

console.log("written. Broken rows are the curation worklist — fix or replace, never leave.");
