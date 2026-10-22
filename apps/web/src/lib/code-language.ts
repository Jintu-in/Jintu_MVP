import "server-only";
import { DEFAULT_CODE_LANGUAGE, type CodeLanguageKey } from "@jintu/contracts";
import { createClient } from "@/lib/supabase/server";

/**
 * The DSA language switch's remembered choice (V2Dsa/DeskDsa, migration
 * 0033). Scoped to the lesson reader only — not threaded onto the global
 * Viewer (lib/session.ts), which every page pays for; this is read only
 * by the one page that currently has a reason to.
 *
 * Forgiving like lib/momentum.ts: a failed read falls back to the default
 * rather than taking the lesson page down over a preference.
 */
export async function getMyCodeLanguage(): Promise<CodeLanguageKey> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return DEFAULT_CODE_LANGUAGE;

    const { data } = await supabase.from("profiles").select("code_language").eq("id", user.id).maybeSingle();
    return (data?.code_language as CodeLanguageKey | null) ?? DEFAULT_CODE_LANGUAGE;
  } catch {
    return DEFAULT_CODE_LANGUAGE;
  }
}
