# VRhino

Marketing site, journal and admin for VRHINO LIMITED. Next.js App Router,
TypeScript, Tailwind, Supabase, deployed on Vercel.

---

## Before you launch

Two lists of things only you can finish.

### 1. Facts the site does not have

Every unfilled fact renders on the live site as an **amber placeholder chip**,
so it is impossible to miss. They all live in one file: `src/config/site.ts`.
`/admin/settings` lists the outstanding ones.

- Contact email
- Phone number (or remove it)
- Instagram and TikTok (or remove them)
- Both founders' names
- Reply time in working days
- Age guidance
- Typical session duration
- Group size and space needed (in `src/app/(site)/events/page.tsx` and `schools/page.tsx`)
- Deposit, balance due, refund notice periods, insurance cover and data region
  (in the `legal` block of `src/config/site.ts`)

### 2. Things to check yourself

- **Company details.** The registered name, number `16965400`, office address
  and incorporation date were checked against Companies House on 2026-11-11 and
  matched. Confirm them again before launch. Note the official record includes
  "5th Floor", which the original brief omitted.
- **Privacy policy and terms.** Both are complete documents, not placeholders.
  The privacy policy is accurate: every data flow, processor, lawful basis and
  retention period it describes matches what the code actually does. The terms
  cover contract formation, payment, cancellation, consumer rights, VR-specific
  safety, safeguarding and liability.

  What is left blank, because these bind you contractually and must not be
  guessed: deposit percentage, when the balance is due, the two refund notice
  periods, your public liability cover, and your Supabase hosting region. They
  render as amber blanks until set, and `/admin/settings` lists them.

  Neither document has been reviewed by a solicitor. Have that done before you
  launch, particularly sections 11 and 12 of the terms.
- **A 16px favicon.** The supplied logo is a detailed mascot and does not
  survive 256 pixels; see `BRAND.md`. Ask whoever drew it for a simplified
  small-size glyph. Everything 32px and up is fine.
- **Photography.** See `PHOTOS.md`. Five temporary stock images, five slots with
  no photo at all.
- **Testimonials and numbers.** There are none. The blocks where they would go
  are marked "Add real testimonial" and "Add real number". Do not fill them with
  anything that is not real.

---

## Setup

### 1. Supabase

Create a project at supabase.com, then run the migration:

```bash
supabase link --project-ref YOUR_PROJECT_REF
```

```bash
supabase db push
```

Or paste `supabase/migrations/20260101000000_init.sql` into the SQL editor.

This creates `profiles`, `posts`, `enquiries` and `rate_limits`, enables Row
Level Security on all four, and creates the public `blog-images` storage bucket.

### 2. Create the first admin

There is **no sign-up route anywhere on the site**, by design. Accounts are
created by hand.

1. Supabase dashboard, Authentication, Users, "Add user". Set an email and
   password and tick "Auto confirm user".
2. Then add the matching profile row. A user without one cannot reach `/admin`:

```sql
insert into public.profiles (id, email, full_name, role)
select id, email, 'Your Name', 'admin'
from auth.users
where email = 'you@example.com';
```

Roles are `admin` or `editor`. Editors can write and publish posts and manage
enquiries. Only admins can delete an enquiry or manage other profiles.

### 3. Environment variables

```bash
cp .env.example .env.local
```

Fill in the values, then add the same ones to the Vercel project under
Settings, Environment Variables. `SUPABASE_SERVICE_ROLE_KEY` must never be
prefixed with `NEXT_PUBLIC_`.

### 4. Run it

```bash
npm install
```

```bash
npm run dev
```

The site runs without Supabase configured. The journal shows its empty state
and `/admin` is blocked rather than rendered unguarded.

### 5. Seed an example post (local only)

```bash
npm run seed:dev
```

Inserts one post clearly titled "Example post". It refuses to run against a
URL that is not localhost or a Supabase project you confirm, and it is never
run in production.

### 6. Deploy

Import the repo into Vercel. Every push to `main` deploys to production and
every pull request gets a preview URL. Add the domain `vrhino.org` under
Settings, Domains, and point the DNS records Vercel gives you.

Set `NEXT_PUBLIC_SITE_URL` to `https://vrhino.org` in production, otherwise
sitemap, RSS, Open Graph tags and password reset links point at the wrong host.

---

## How things work

### Authorisation

`/admin` is protected in three independent places, because any one of them
could be bypassed on its own:

1. **Middleware** (`src/middleware.ts`) redirects logged-out visitors. This is
   convenience only. It is not a security boundary.
2. **The dashboard layout** calls `requireStaff()` on the server for every page.
3. **Every server action** calls `requireStaff()` or `requireAdmin()` itself.
   A server action is a POST endpoint and can be invoked directly without ever
   loading a page, so this is the check that actually matters.

Sessions use `getUser()`, which revalidates the token with Supabase, never
`getSession()`, which only reads a cookie the client could forge.

### Row Level Security

Every table denies by default.

- `posts` — the public may read rows that are `published` **and** whose
  `published_at` has passed. Staff may read and write everything.
- `enquiries` — **no anon policy at all.** The public cannot read or write this
  table directly. Submissions go through a server action that validates with
  Zod, checks Turnstile, rate limits by IP and then writes using the
  service-role key. Granting `anon` insert would have exposed the table on the
  public REST endpoint, where anyone could flood it and skip all of that.
- `rate_limits` — no policies. Service role only.
- `blog-images` — public read, staff-only write.

### Posts

Bodies are stored as **Tiptap JSON**, not HTML. Rendering structured JSON means
a careless or compromised editor cannot inject a `<script>` into a post: only
schema nodes are emitted.

Publishing or editing calls `revalidatePath` for `/blog`, the post, the sitemap
and the RSS feed, so changes appear without a redeploy. `published_at` is only
set the first time a post goes live, so re-editing does not bump it back to
the top of the listing.

### The enquiry form

One form, three intents, chosen with a segmented toggle. Defence in depth:

1. Honeypot field. A filled honeypot gets a success response, so a bot cannot
   tell it was caught.
2. Zod validation on the client **and** again on the server. The client check
   is a convenience and can be bypassed.
3. Per-IP rate limiting, 5 per hour, held in Postgres. An in-memory counter is
   useless on Vercel: each request can run in its own isolate.
4. Cloudflare Turnstile.
5. Database constraints. The consent columns are enforced by a `CHECK`, so a
   record without them cannot exist even if the application is wrong.

If email sending fails the enquiry is still saved and the visitor still sees
success, because the submission genuinely did succeed. The failure is logged.

### Analytics

Vercel Web Analytics and Speed Insights are mounted in `src/app/(site)/layout.tsx`,
**not** the root layout, so they do not run on `/admin`. Staff browsing their own
enquiries is not traffic worth measuring, and it keeps admin activity out of a
third party.

Both are cookieless, so they run for everyone and need no consent.

### Cookie consent

Tracking cookies are supported, behind a consent manager in
`src/components/consent/`. UK rules shaped the design:

- **Nothing loads before opt-in.** PECR regulation 6 requires consent before a
  non-essential cookie is set, so no Google or Meta request is made at all until
  the visitor accepts. Verified in a browser: zero tracker requests and zero
  cookies on a fresh visit and after "Reject all".
- **Reject is as easy as accept.** The ICO has said refusing must be as easy as
  accepting. "Reject all" and "Accept all" are the same component, same size,
  same weight, same colour, side by side. Do not restyle one to stand out.
- **Withdrawal is permanent and real.** The footer carries a "Cookie settings"
  control on every page. Withdrawing deletes that category's cookies and reloads,
  because a script that has already run cannot be unloaded by React.
- **Consent is evidenced.** The cookie records the categories, a timestamp and a
  version. Bumping `CONSENT_VERSION` in `src/lib/consent.ts` invalidates stored
  consent and asks everyone again, which is what you do if you add a new tool.

Turn trackers on by setting `NEXT_PUBLIC_GA_MEASUREMENT_ID` or
`NEXT_PUBLIC_META_PIXEL_ID`. With neither set, the banner still works and the
privacy policy automatically says that no tools are switched on. **The policy
reads these same variables**, so section 8 describes exactly what is configured
rather than what someone remembered to write down.

The two scripts are served by the Vercel platform at `/_vercel/insights/...`
and do not exist when running locally. A local Lighthouse run therefore reports
a console 404 and scores best practices 96 rather than 100. On a deployment it
loads normally.

### Legal pages

`/privacy` and `/terms` are rendered from structured section data in
`src/app/(site)/privacy/page.tsx` and `terms/page.tsx`, with a shared layout in
`src/components/marketing/legal-doc.tsx`. Commercial figures come from
`site.legal` so there is one place to change them.

The privacy policy is written to match the implementation exactly. If you change
what the app does, change the policy. In particular: the retention claim that IP
addresses are held "up to one hour" is enforced by
`supabase/migrations/20260102000000_rate_limit_retention.sql`, which deletes
expired rate-limit rows. Do not drop that migration without rewording section 6.

### Colour contrast

`tests/contrast.test.ts` checks every foreground and background pair in the
palette against WCAG AA and fails the build if one drops below 4.5:1. It caught
two real problems: white text on the orange accent (2.85:1) and faded
`text-muted/60` and `/70` variants. Accent buttons therefore carry navy text.

### CSV export

Values starting with `=`, `+`, `-` or `@` are prefixed with an apostrophe so a
visitor-supplied message cannot become a live formula when the export is opened
in Excel.

---

## Commands

```bash
npm run dev
```

```bash
npm run build
```

```bash
npm run lint
```

```bash
npm run test
```

```bash
npm run seed:dev
```
