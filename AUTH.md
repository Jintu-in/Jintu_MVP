# Jintu — auth spec v3
### Verify the email, then set a password. Long sessions.

> Supersedes v2 (passwordless email OTP). That spec was written for a
> six-week cohort where people signed in rarely. For a daily-habit product
> it is wrong: a streak app where signing in means switching to your email
> client and waiting for a code is a streak app people stop opening.

---

## The thing that matters more than the login screen

**Session length.** If a user is signed out every week, the streak breaks,
the habit breaks, and the login flow becomes the most-used screen in the
product — a failure state.

Dashboard settings (see the console checklist at the bottom):

```
Supabase → Authentication → Sessions
  Time-box user sessions        : never (or 90 days minimum)
  Inactivity timeout            : never
  Refresh token rotation        : enabled
  Refresh token reuse interval  : 10 seconds
```

The session refreshes in `middleware.ts` on every request (already true —
`getUser()` in `lib/supabase/middleware.ts`). Every password screen carries
**"Stay signed in on this device"**, defaulted **on**; unticking it strips
`maxAge` from the auth cookies so the browser drops them on close
(`lib/supabase/server.ts`, the `remember` option).

---

## The flow

```
                    ┌─ email field ─┐
                    │   Continue     │
                    └───────┬────────┘
                            │
              does an account exist for this email?
                            │
        ┌───────────────────┴───────────────────┐
        │ NO — new                              │ YES — returning
        ▼                                       ▼
  send 6-digit code                       password field
        │                                       │
  verify code  ──► email is now verified        │
        │                                       │
  set a password                                │
        │                                       │
  onboarding (18+, consents, phone)             │
        │                                       │
        └───────────────┬───────────────────────┘
                        ▼
                     signed in
```

**Verify first, then set a password**: no account ever exists half-made,
and nobody types a password before knowing the address works.

**Google OAuth sits above all of this** — the primary button on the entry
screen. Expect most Indian signups to take it and never touch a code or a
password.

**One deliberate deviation from the v3 screens as drafted:** the 18+
confirmation and the consent checkboxes stay on the onboarding screen, not
on set-a-password. The 18+ gate is a database CHECK on `profiles`, and a
checkbox is only real on the form whose submit that constraint can refuse —
`profiles` also requires the phone number, which is collected there. Moving
the checkboxes forward would make them theatre on one screen and redundant
on the next. (If spec-exact screens matter more than this argument, make
`profiles.phone` nullable first and say so.)

---

## The enumeration tradeoff — decided

Branching on "does this email exist" reveals whether an address is
registered. **Decision: reveal it, and rate-limit hard** — the Notion/
Linear/Google shape. For a free learning app the UX gain outweighs the
disclosure; for a bank it would not.

Mitigations, all implemented:

- The probe is a **security-definer RPC** (`email_registered`,
  `0006_auth.sql`) with EXECUTE **revoked from anon and authenticated** —
  only the service role can ask, and only the `checkEmail` server action
  holds that role. No public endpoint exists.
- **6 checks per email per hour, 20 per IP per hour**, counted in
  `auth_attempts` (hashes only, never plaintext addresses or IPs —
  service-role-only table).
- Password sign-ins: **exponential backoff after 5 failures** in the hour
  (2 min, 4, 8… capped at 30), and every failure is recorded with an IP
  hash for abuse review.
- After the branch, a failure is only ever **"That did not match."** —
  never "wrong password" vs "no such account".
- The forgot-password form answers identically for known and unknown
  addresses; it is separately reachable, and quiet costs nothing there.

Degraded mode is safe by construction: if the service key is missing or the
RPC fails, `checkEmail` answers "not registered" and the flow falls back to
sending a code — which signs in an existing account correctly too
(`verifyOtp` tries both token types).

---

## Password rules — NIST, not 2010

- Minimum **10** characters (spec says 8; stricter is allowed and this was
  already shipped — length is the one property that helps).
- Maximum 72, spaces and any Unicode welcome, paste always works, show-
  password toggle on every field.
- **No composition rules.** No "one uppercase, one symbol" — those push
  people to `Password1!`.
- **Leaked-password protection ON** in the dashboard (HaveIBeenPwned
  screening); Supabase's rejection message is passed through to the form.
- No periodic rotation, no security questions, ever.

## What carries over unchanged

- 18+ hard gate as a CHECK constraint on `profiles`, enforced again in the
  onboarding action.
- Granular consents — separate rows per purpose, reminder checkbox unticked
  by default, `core_service` never a checkbox.
- Case-insensitive email: `email_registered` compares `lower() = lower()`
  (no citext dependency); Supabase stores sign-up emails lowercased and the
  contracts lowercase on input.
- **Identity linking**: Google-then-email and email-then-Google must land in
  one account. This is a dashboard behaviour (automatic linking for
  verified emails); the launch checklist below tests both orderings.
- `user.id` is the foreign key everywhere. Never the email.

## Files

| Piece | Where |
|---|---|
| Existence RPC + attempt ledger | `supabase/migrations/0006_auth.sql` |
| Rate limits, backoff, hashing | `apps/web/src/lib/auth-limits.ts` |
| All server actions | `apps/web/src/actions/auth.ts` |
| The stepper (entry/code/create/password/forgot) | `apps/web/src/components/join-form.tsx` |
| Reset landing | `apps/web/src/app/auth/reset/` + `reset-password-form.tsx` |
| Session-cookie option | `apps/web/src/lib/supabase/server.ts` |
| Reset email template | `supabase/templates/recovery.html` |

---

## Owner console checklist — do these before announcing the flow

Nothing here is reachable from code; every item is a dashboard or DNS task.

1. **Custom SMTP (Resend)** — Authentication → Emails → SMTP settings.
   Supabase's built-in sender is test-only (~2 emails/hour) and cannot use
   custom templates on new free projects. Verify `jintu.in` in Resend with
   SPF + DKIM + DMARC records, then test deliverability **against Gmail
   specifically**.
2. **Sessions** — Authentication → Sessions: time-box *never* (or ≥90
   days), inactivity timeout *never*, refresh token rotation *on*, reuse
   interval 10 s.
3. **Leaked-password protection** — Authentication → Passwords: minimum
   length 10, leaked-password protection *on*.
4. **Google OAuth** — Google Cloud Console OAuth client (web), authorised
   redirect `https://nejtogeezerebdeflhfa.supabase.co/auth/v1/callback`;
   paste client id + secret into Authentication → Providers → Google.
5. **Redirect URLs** — Authentication → URL Configuration: add
   `https://jintu-mvp.vercel.app/auth/reset` and
   `https://jintu-mvp.vercel.app/auth/callback` (plus localhost variants).
6. **Email templates** — mirror `supabase/templates/*.html` into the
   dashboard: confirmation, magic link, email change, **recovery** (new).
7. **Vercel env** — `SUPABASE_SECRET_KEY` must be set (the existence check
   and rate limiting degrade to code-only sign-in without it, loudly).
8. **Launch test** — sign up with Google, sign out, come back with email +
   password on the same address: one account, one streak. Then the reverse
   ordering. A duplicate account losing someone's streak is the worst bug
   this product can ship.
