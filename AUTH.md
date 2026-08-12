# Jintu — auth spec v2
### Email OTP + Google OAuth. Cheaper, faster, one fewer regulator.

> Supersedes the phone-first flow (auth spec v1). Same principles, different rails.

---

## Why this is better, not just cheaper

Phone OTP had three costs: money per message, TRAI DLT registration on the critical path, and a WABA approval you couldn't rush.

Email plus Google removes all three. And Google OAuth is a genuinely better fit for India than phone: Android dominance means near-universal Google account penetration, and it's **one tap with no code to wait for**. Expect the majority of your signups to never touch the email flow at all.

| Method | Setup cost | Per-signup cost | Lead time | Notes |
|---|---|---|---|---|
| **Google OAuth** | Free | **₹0** | Hours | Will be ~80%+ of Indian signups |
| **Email OTP** | Free | ~₹0.02–0.05 | Hours | Fallback for non-Google users |
| Phone SMS OTP | DLT registration | ₹0.15–0.25 | Days–weeks | Dropped |
| WhatsApp OTP | WABA + template | BSP rates | Days | Dropped |
| Apple OAuth | **$99/yr + JWT rotation every 6 months** | ₹0 | Days | **Deferred — see below** |

---

## Apple: skip it, and here's the reasoning

Sign in with Apple is mandated by App Store Review Guideline 4.8 — it applies to apps submitted to the App Store that use third-party login. Jintu is a PWA, and Apple does not permit PWAs in the App Store at all (Guideline 4.2.2 rejects "web clippings").

So the requirement doesn't reach you. What Apple would cost you:

- **$99/year** Apple Developer Program, required to create the Services ID
- **A client secret that expires.** Apple's secret is a signed JWT with a maximum ~6-month lifetime. You must regenerate and redeploy it, forever, or logins silently break
- Services ID, domain verification, and key management setup

Against an iOS share in India of roughly 3–5%, and those users can still sign up with Google or email. **Add Apple only if you ever ship a native iOS app.** Note it in the docs so it doesn't get re-litigated.

---

## Email OTP code, not magic links

Supabase supports both. Choose the 6-digit code.

Magic links break on mobile in ways that are hard to debug and easy to lose users to: the link opens in the device's default browser rather than the one that initiated the request, so the session lands in the wrong browser; and links opened inside the Gmail app's in-app browser frequently strand the user in a webview with no session. On a mobile-first Indian product this is a meaningful drop-off.

A 6-digit code the user reads and types works in every context, and it's the same interaction they already know from every OTP in their life.

---

## The blocker nobody expects: Supabase's default SMTP

**Configure custom SMTP before you build the login screen.**

Supabase's built-in email service is explicitly for testing — it's heavily rate limited (a handful of emails per hour), and new free projects can no longer customise auth email templates on it. Ship on default SMTP and your signups will silently fail the moment more than a couple of people try at once.

Use **Resend** (generous free tier, then roughly $20/month at volume), or Postmark / SES. Set it up in Supabase Auth → SMTP Settings, verify your sending domain with SPF, DKIM, and DMARC records, and send from `hi@jintu.in` rather than a subdomain.

**Deliverability matters more than it sounds.** An OTP that lands in spam is a lost user with no recovery path. Warm the domain gently, keep the email plain and short, and test delivery to Gmail, Outlook, and Yahoo before launch — Indian students are overwhelmingly on Gmail, which is the most forgiving, but verify anyway.

---

## The real cost of this decision — and the fix

Money wasn't the only thing phone auth was buying. **It was buying you a notification channel.**

Streaks, review-queue alerts, and "someone reviewed your submission" were all going to run through WhatsApp. Email nudges to Indian college students will have poor open rates, and a streak mechanic that nobody sees is a streak mechanic that doesn't work.

**The fix is web push, and it's free.**

| Channel | Cost | Reach | Use for |
|---|---|---|---|
| **Web push (PWA)** | **₹0** | Android Chrome: excellent. iOS 16.4+: works but only after home-screen install, with lower opt-in | Streaks, review alerts, submission graded |
| Email | ~₹0.02 | Universal | Weekly digest, account matters, receipts |
| WhatsApp | BSP rates | Excellent | **Later, optional** — collect phone after signup, when revenue justifies it |

Web push is the right primary channel here: it's free, it's instant, and it's exactly what your PWA setup already supports through Serwist. The catch is that it requires the user to install the PWA and grant permission — so **prompt for install after the first successful submission**, not on first visit. Ask when they've just felt the value, not before.

Keep phone as an optional field the user can add later specifically to get WhatsApp reminders. Some will. That's a bonus channel, not a dependency.

---

## The flow

```
Anonymous — reads everything, no account
      │
      │  taps "Start learning" or "Submit"
      ▼
┌─────────────────────────────────────┐
│  [ Continue with Google ]           │  ← one tap, ~80% take this
│  ───────────  or  ───────────       │
│  Email  [                    ]      │
│  [ Send code ]                      │
└─────────────────────────────────────┘
      │
      ├─ Google ──────────────┐
      │                       │
      ▼                       │
  6-digit code ───────────────┤
                              ▼
                    Complete profile
                    name · 18+ · consents
                    (first time only)
                              │
                              ▼
                          Learner
```

Google first and visually dominant. Email below a divider. No separate sign-in page — same screen handles new and returning.

---

## Screens

### 1. Entry
```
Start learning

[  Continue with Google  ]

────────────  or  ────────────

Email     [ you@example.com ]

[ Send code ]

Already started? Same email, same account.
```

### 2. Code — email path only
```
Enter the code

[ _ ][ _ ][ _ ][ _ ][ _ ][ _ ]

Sent to priya@gmail.com · Change email
Resend in 0:28
```
`inputmode="numeric"`, `autocomplete="one-time-code"`, auto-advance, auto-submit on the sixth digit, paste fills all six.

### 3. Complete profile — first time only
```
Almost there

Name       [ prefilled from Google if available ]
College    [ search... ]  optional

Before you start
☐  I am 18 or older.
☐  I agree to the Terms and the Privacy notice.
☐  Send me streak reminders.   Optional

[ Start learning ]
```

Google gives you a verified email and usually a name, so this screen is short. The three checkboxes stay separate and the third stays unticked — DPDP purpose-specific consent.

---

## Schema changes from v1

```sql
profiles (
  id uuid primary key references auth.users on delete cascade,
  email citext unique not null,              -- citext: case-insensitive
  phone_e164 text unique null,               -- OPTIONAL now, for WhatsApp later
  handle text unique not null,
  full_name text,
  avatar_url text,                           -- from Google
  college_id uuid null references colleges,
  is_adult_confirmed boolean not null default false,
  push_subscription jsonb null,              -- web push endpoint
  created_at timestamptz default now(),
  last_active_on date
);

alter table profiles add constraint must_confirm_adult
  check (is_adult_confirmed = true);
alter table profiles add constraint handle_format
  check (handle ~ '^[a-z0-9][a-z0-9-]{2,29}$');

otp_attempts (
  id uuid primary key,
  email citext not null,
  ip_hash text,
  requested_at timestamptz default now(),
  verified_at timestamptz,
  attempt_count int default 0
);
create index on otp_attempts (email, requested_at desc);
```

Two notes. Use `citext` for email so `Priya@Gmail.com` and `priya@gmail.com` are the same account — this is a real source of duplicate accounts otherwise. And `phone_e164` is now nullable, because it's a notification preference rather than an identity.

---

## Identity linking — the trap to handle deliberately

Someone signs up with Google as `priya@gmail.com`. Two months later they use the email flow with `priya@gmail.com`. Do they get one account or two?

**One.** Supabase links identities automatically when the email matches and both are verified, but you must confirm this behaviour in your Auth settings rather than assume it. Test the exact sequence both ways round before launch, because the failure mode is a user losing their points and their streak — which for a points-based platform is the single worst possible bug.

Also handle: Google account whose email later changes, and Apple-style private relay addresses if you ever add Apple. Store the Supabase `user.id` as the foreign key everywhere, never the email. Email is a label, not an identity.

---

## Abuse and bot signups

Email plus OAuth is more bot-exposed than phone was, and you now have a public profile and a points leaderboard worth farming.

- **Rate limit the OTP endpoint** per email (3/hour, 10/day) and per IP hash (20/hour). Return a generic message either way — never reveal whether an email is registered.
- **Points require a verified submission**, which requires real work against a real answer key. This is your strongest anti-spam property and it comes free from the architecture. A bot can create an account; it cannot pass the SQL runner.
- **Handle squatting**: reserve obvious names (`admin`, `jintu`, `support`) and rate-limit handle changes to one.
- **Disposable email domains**: don't block them at signup. Block them from appearing on leaderboards if it becomes a problem. Blocking upfront catches real users.

---

## Build order

**Today — no external dependencies, all of it unblocked**
1. Resend account, verify `jintu.in` sending domain (SPF, DKIM, DMARC)
2. Configure custom SMTP in Supabase Auth
3. Google OAuth: Cloud Console project, OAuth consent screen, credentials, redirect URI
4. Schema plus the constraints, RLS on every table

**Then**
5. Entry screen with Google button and email fallback
6. OTP screen
7. `middleware.ts` session refresh with `@supabase/ssr`
8. Profile completion with granular consent writes
9. Rate limiting
10. Handle generation and `/p/[handle]`

**Phase 2**
Web push via Serwist, prompted after first successful submission · optional phone field for WhatsApp · self-serve account deletion

**Explicitly deferred**
Apple OAuth · SMS OTP · WhatsApp OTP

Note that nothing in "today" waits on an external approval. That's the real win — you went from a multi-week regulatory dependency to a stack you can stand up this afternoon.

---

## Verify before relying on these

- **Resend's current free tier and paid pricing.** Cheap either way, but confirm the numbers.
- **Supabase's current default-SMTP limits and template restrictions.** The direction is clear — default SMTP is test-only — but the exact limits change.
- **Supabase's automatic identity-linking behaviour** for matching verified emails across providers. Test it yourself rather than trusting docs; this is the one bug that would cost a user their points.
- **iOS web push opt-in reality.** It works on 16.4+ but only after home-screen install, and EU iOS PWAs lost standalone mode entirely under the DMA. Not an issue for an India-focused product, but don't assume iOS push works like Android's.

---

## Implementation state (kept by the build, not part of the decision)

What already exists matches this spec closely: email 6-digit OTP is live as the
one door (no separate sign-in/sign-up), onboarding creates the account with the
18+ gate and granular consents, sessions refresh through @supabase/ssr.

- [x] Email OTP, 6-digit code, one door for new and returning
- [x] Onboarding: name, 18+ confirm, per-purpose consents, account created here
- [x] "Continue with Google" in the sign-in dialog — renders only when the
      Supabase project reports the provider enabled, so it appears the moment
      the owner completes console setup (build-order item 3) with zero deploys
- [ ] Owner console tasks, all unblocked today: Resend SMTP (item 1–2),
      Google OAuth credentials (item 3)
- [ ] citext email + optional phone_e164 + handle + avatar_url on profiles
- [ ] otp_attempts rate-limit table (Supabase's built-in limits carry until then)
- [ ] Handle generation + /p/[handle]
- [ ] Web push via Serwist, prompted after first successful submission
- The password path (an owner decision from the email-quota era) retires once
  custom SMTP raises the OTP quota and Google absorbs most sign-ins.
