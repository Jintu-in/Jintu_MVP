"use server";

import { NOTICE_VERSION, waitlistInput } from "@jintu/contracts";
import { actionClient } from "@/lib/safe-action";
import { createClient } from "@/lib/supabase/server";

const UNIQUE_VIOLATION = "23505";

export const joinWaitlist = actionClient
  .inputSchema(waitlistInput)
  .action(async ({ parsedInput }) => {
    const supabase = await createClient();

    // No .select(). The table has an insert policy and deliberately no select
    // policy, so RETURNING would be rejected — see the migration for why the
    // phone list must not be readable with the anon key.
    const { error } = await supabase.from("waitlist_signups").insert({
      phone: parsedInput.phone,
      full_name: parsedInput.fullName ?? null,
      college_name: parsedInput.collegeName ?? null,
      is_adult_confirmed: parsedInput.isAdultConfirmed,
      consent_contact: parsedInput.consentContact,
      consent_whatsapp: parsedInput.consentWhatsapp,
      notice_version: NOTICE_VERSION,
      source: "landing",
    });

    if (error && error.code !== UNIQUE_VIOLATION) {
      throw new Error(`waitlist insert failed: ${error.code} ${error.message}`);
    }

    // A duplicate phone number resolves to the same success message as a new
    // signup. Saying "you are already on the list" would turn this form into
    // an oracle for whether a given number has registered.
    return { joined: true };
  });
