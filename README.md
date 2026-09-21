# PeptideEvidence

A research directory. It aggregates registered clinical trials and published
literature about peptides, organised by condition, and links every entry
straight to the primary source so a reader can go and read it themselves.

It is not a store and it is not medical advice. See `/disclosures`.

## What it does

- **Condition-first.** A visitor enters through a condition (endometriosis or
  autoimmune) and gets the trials currently open to enrolment, the newest
  published literature at the intersection of that condition and the peptides
  people ask about, and community discussion, clearly separated.
- **Live primary sources.** Clinical trials from the ClinicalTrials.gov v2 API
  and literature from PubMed E-utilities, fetched server side and cached. Both
  are free and need no key.
- **Recruitment status and phase lead every trial**, because that is the part a
  patient can act on.
- **Evidence tiers.** Every peptide declares what kind of study exists for it:
  human trial, small human study, animal only, mechanism only, anecdotal, or
  not yet rated. The tier describes the evidence, never whether something works.
- **Vendor directory** with an FTC affiliate disclosure shown next to the links
  rather than buried in a footer.
- Sign in to save vendors (mock auth, localStorage).

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Demo sign-in: `alice@example.com` / `password`.

## Project layout

```
src/lib/research/     ClinicalTrials.gov, PubMed and Reddit clients.
                      Typed results, explicit caching, retry and throttling.
src/lib/evidence.ts   Evidence tier definitions. Required on every peptide.
src/lib/conditions.ts Conditions and their search terms. Add one here.
src/lib/peptides.ts   Peptide records. Pharmacology and regulatory facts only.
src/lib/vendors.ts    Vendor directory and listings.
src/components/research/  The aggregation panels (async server components).
src/app/              Routes. Condition-first.
```

### Adding a condition

One object in `src/lib/conditions.ts`: a name, a summary, the
ClinicalTrials.gov and PubMed search terms, subreddits, and the peptides to
track. Routing, navigation and the footer pick it up automatically.

## Environment variables

None are required to run it. All of these are optional improvements.

| Variable | What it does |
|---|---|
| `NCBI_API_KEY` | Raises the PubMed rate limit from 3/sec to 10/sec. Free. |
| `REDDIT_CLIENT_ID` | Enables the community panel (app-only OAuth). |
| `REDDIT_CLIENT_SECRET` | Enables the community panel. |
| `RESEARCH_USER_AGENT` | Identifies this site to the NIH APIs. |
| `NEXTAUTH_SECRET` | JWT signing secret. Falls back to a dev string. |
| `NEXTAUTH_URL` | App base URL. Defaults to `http://localhost:3000`. |

Set `NEXTAUTH_SECRET` to a strong random value before deploying anywhere real.

Reddit no longer serves its public JSON endpoints to unauthenticated server
callers, so the community panel shows its unavailable state until credentials
are set. Create a "script" app at https://www.reddit.com/prefs/apps.

## Tech stack

- Next.js 16 (App Router, Turbopack) and TypeScript
- Tailwind CSS 4, theme tokens in `src/app/globals.css`
- NextAuth.js, JWT strategy, mock credential users

## Status

See `NOTES.md` for what is finished, what is deliberately unfinished, and the
decisions behind both. Short version: evidence tiers are unassigned, condition
overview copy is placeholder, and vendor pricing is unverified placeholder data.
All three are labelled as such in the UI.
