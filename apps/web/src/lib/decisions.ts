import "server-only";
import { createClient } from "@/lib/supabase/server";

/**
 * DeskDecide's "Your founder log" aside — every decision this user has
 * made in this roadmap, oldest first, the current step's own row (if any)
 * marked `current`.
 *
 * `optionLabel` is the raw `option_id`, not the authored option's own
 * label text: resolving a human label would mean loading every OTHER
 * node's full authored-steps content just for this aside, and with no
 * real roadmap authoring a second decide step yet (see
 * packages/contracts/src/steps.ts's own note on this), there is no real
 * multi-entry log to make that join worth its cost today. Revisit once a
 * real judgment roadmap has more than one.
 */
export type FounderLogEntry = {
  nodeTitle: string;
  nodeHref: string;
  optionLabel: string;
  current: boolean;
};

/** This user's own saved row for one exact decide step, if any — merged
 *  into that step's `existingDecision` field before the reader ever
 *  renders, so a revisit opens straight in the reveal state. */
export async function getMyDecision(
  nodeId: string,
  stepId: string,
): Promise<{ optionId: string; reason: string; covered: string[] } | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("decisions")
      .select("option_id, reason, covered")
      .eq("node_id", nodeId)
      .eq("step_id", stepId)
      .maybeSingle();
    if (error || !data) return null;
    return { optionId: data.option_id, reason: data.reason, covered: data.covered ?? [] };
  } catch {
    return null;
  }
}

export async function getFounderLog(
  roadmapSlug: string,
  roadmapId: string,
  currentStepId: string,
): Promise<FounderLogEntry[]> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from("decisions")
      .select("step_id, option_id, created_at, nodes ( title, slug )")
      .eq("roadmap_id", roadmapId)
      .order("created_at", { ascending: true });
    if (error || !data) return [];

    type Row = { step_id: string; option_id: string; nodes: { title: string; slug: string } | null };
    return (data as unknown as Row[])
      .filter((r) => r.nodes)
      .map((r) => ({
        nodeTitle: r.nodes!.title,
        nodeHref: `/learn/${roadmapSlug}/${r.nodes!.slug}`,
        optionLabel: r.option_id,
        current: r.step_id === currentStepId,
      }));
  } catch {
    // The reveal and the lock-in flow both work without this — a founder
    // log read that fails just means the aside renders empty this time.
    return [];
  }
}
