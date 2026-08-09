/**
 * Retries a Supabase read when the failure was the network rather than the
 * query.
 *
 * The failure this exists for, observed in dev: a single `TypeError: fetch
 * failed` took /learn to a 500. The database was fine — the same request
 * succeeded five times in a row seconds later. One dropped connection should
 * not take down the page people reach from a search result.
 *
 * Retrying is only safe because these are reads. Nothing here may be used to
 * wrap an insert: a write that "failed" at the network layer may well have
 * been applied, and retrying it would double a submission.
 */

/**
 * A transport failure, not a database answer. PostgREST errors carry a `code`
 * (PGRST205, 42501, …); these arrive with none, because the request never got
 * far enough to produce one.
 */
const TRANSIENT = /fetch failed|network|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|socket hang up|terminated|other side closed/i;

export function isTransient(error: { message: string; code?: string } | null): boolean {
  if (!error) return false;
  // A Postgres/PostgREST code means the server answered. Answers are not
  // retried, however unwelcome — retrying a 42501 just fails slower.
  if (error.code) return false;
  return TRANSIENT.test(error.message ?? "");
}

/**
 * Generic over the whole result rather than over `data`, so the caller keeps
 * the exact type the query builder produced — including `error` being a
 * PostgrestError. An earlier version declared its own `{ message, code }`
 * shape and quietly widened every call site until describeSupabaseError
 * stopped type-checking.
 */
export async function retryRead<T extends { error: { message: string; code?: string } | null }>(
  run: () => PromiseLike<T>,
  { attempts = 3, baseDelayMs = 150 }: { attempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  let last!: T;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    last = await run();
    if (!isTransient(last.error)) return last;

    if (attempt < attempts) {
      // Linear, not exponential: the whole budget has to fit inside a page
      // render, and a visitor waiting on the funnel page would rather see an
      // error than a spinner for eight seconds.
      await new Promise((resolve) => setTimeout(resolve, baseDelayMs * attempt));
    }
  }

  return last;
}
