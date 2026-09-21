# Working notes

Overnight session. Everything below is what changed, every judgement call I
made without being able to ask, and what is still waiting on you.

Build, lint and typecheck all pass. Research data is real and verified in the
prerendered HTML (see "How I verified it").

---

## 1. Research aggregation

This was the point of the refocus, so it got built first.

`src/lib/research/` is a typed data layer over two free, keyless public APIs:

| Source | What it gives | Cache |
|---|---|---|
| ClinicalTrials.gov v2 | NCT ID, title, recruitment status, phase, sponsor, enrolment, start date, conditions, interventions, countries | 6 hours |
| PubMed E-utilities | PMID, title, journal, publication date, authors, publication types, DOI | 12 hours |
| Reddit | thread titles and links | 30 min |

Design points worth knowing:

- **Nothing throws.** Every client returns a `ResearchResult<T>`, which is
  either `{ok: true, data}` or `{ok: false, error}`. A registry being down
  produces a visible, honest panel that says the list is incomplete and links
  you to the source, instead of an empty section or a broken build.
- **Caching is explicit** because `fetch` is no longer cached by default in
  Next 16. Each call sets `cache: 'force-cache'` plus `next.revalidate` and a
  cache tag, so you can purge one source with `revalidateTag('pubmed')`.
- **Rate limiting is handled.** NCBI allows three requests a second to
  anonymous callers. `next build` prerenders across seven worker processes at
  once, which was enough to get 429s and bake "could not load" into the static
  HTML on the first build I ran. Fixed with an in-process throttle plus
  retry with jittered backoff. Set `NCBI_API_KEY` to raise the ceiling to ten
  a second (free, from https://www.ncbi.nlm.nih.gov/account/).
- **Trial locations are reduced to countries on purpose.** The upstream payload
  includes investigator names, phone numbers and email addresses. Republishing
  those is not this site's business, so they are dropped at the mapping layer.
- **Two trial queries per page, in parallel:** open-to-enrolment studies for the
  list, and a count of everything ever registered. That is what lets the page
  say "229 open of 950 registered" rather than showing one number that quietly
  implies the other does not exist.

### Reddit needs credentials now

The old `RedditPosts` component fetched from the browser with a custom
`User-Agent` header. That triggers a CORS preflight Reddit does not answer, so
**it was failing for every real visitor**, not just in this sandbox. It is now
server-side.

Reddit also stopped serving `.json` to unauthenticated server callers: you get
HTTP 403, or an HTML page with a 200 status. So the community panel currently
renders its error state. I added app-only OAuth support for when you want it:

1. Create a "script" app at https://www.reddit.com/prefs/apps
2. Set `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET`

It will start working with no code change. Until then it degrades honestly
rather than pretending there is no discussion.

---

## 2. Evidence tiering

`src/lib/evidence.ts` defines six values: `human-trial`, `small-human-study`,
`animal-only`, `mechanism-only`, `anecdotal`, and `unrated`.

`evidenceTier` is a **required field** on `Peptide`, so TypeScript will not let
a new peptide ship without somebody deciding. `<EvidenceBadge>` is used on
peptide cards, peptide pages, condition pages and the methodology page.

**Decision I made:** the brief said to leave tiers as a required field with a
TODO. Rather than a comment that is invisible to readers, I made `unrated` a
real tier that renders as "Not yet rated" and says, in the UI, that an unrated
entry means unreviewed and not neutral. `/evidence` lists every unrated peptide
publicly. That felt more honest than a silent gap, and it is easy to reverse.

### Tiers are now assigned

**Update (later session, at Albert's request).** All six were assigned from
data, not from memory or vibes. Method: registered trial status and phase from
the ClinicalTrials.gov API, plus PubMed publication-type counts
(`clinical trial[pt]`, `randomized controlled trial[pt]`, `humans[mh]`,
`animals[mh] NOT humans[mh]`). Each peptide's `evidenceNote` carries the
numbers and the reasoning.

| Peptide | Tier | Why |
|---|---|---|
| Semaglutide | Human trial | 26 Phase 3 registered, 300+ RCTs indexed, FDA approved |
| Tirzepatide | Human trial | 17 Phase 3 registered, 130+ RCTs indexed, FDA approved |
| Ipamorelin | Human trial | 2 placebo-controlled Phase 2 trials completed |
| BPC-157 | Small human study | 0 published controlled trials; 109 of 230 papers animal-only |
| TB-500 | Small human study | Trials shown are of a different molecule (see below) |
| CJC-1295 | Small human study | 2 small studies, main one 2006; only registered trial terminated |

**I sharpened the tier definitions to make these assignments honest.** On the
original wording, "registered ... or are underway" qualified for the top tier,
which put all six peptides in it. A tier system where everything scores top
tells a reader nothing and would have let BPC-157 look comparable to
semaglutide. `human-trial` now requires a **completed** controlled trial, and
`small-human-study` explicitly covers trials that are registered but have not
reported. A registration is a statement of intent, not a result.

**Two findings worth your attention:**

1. **TB-500 is not what its trials are about.** The Phase 2 and Phase 3 studies
   that the site surfaces for TB-500 study full-length thymosin beta-4, mostly
   as an eye drop (RGN-259) or for wound healing. TB-500 is a fragment sold as
   a research chemical. Searched strictly, TB-500 itself has 28 indexed papers
   and one tagged as a trial, against 1,035 for full-length Tβ4. Showing those
   trials without saying so would have been the most misleading thing on the
   site.
2. **BPC-157 has no published controlled human result at all.** Two trials are
   registered and active as of September 2026 and neither has reported. The
   literature is dominated by rat studies.

Both of those are handled by a new optional `researchCaveat` field on
`Peptide`, rendered in a callout directly above the research panels. Semaglutide
and tirzepatide carry one too, saying their trials are in diabetes and obesity
rather than in the conditions this site covers.

**These are my readings, not a clinician's.** The one most worth arguing with is
ipamorelin at `human-trial`: its trials genuinely completed and were
placebo-controlled, but the whole literature is 54 papers and the programme was
abandoned. If you think completed-but-abandoned should not outrank BPC-157's
active-but-unreported, that is a reasonable position and it is a one-word change.

---

## 3. Information architecture

Was product-first. Now condition-first.

```
/                      condition-first landing
/conditions            condition index
/conditions/[slug]     the hub: open trials, literature at the intersection
                       of condition and tracked peptides, those peptides with
                       their tiers, then community discussion
/peptides              was /
/peptides/[id]         was /products/[id]
/evidence              tier definitions and what they do not tell you
/disclosures           affiliate disclosure, independence, known data gaps
/vendors               unchanged route, rewritten content
/favorites             now reads a shared store
```

`/products/*` permanently redirects to `/peptides/*` in `next.config.ts`.

Conditions live in `src/lib/conditions.ts`. Adding a third is one object:
a name, the ClinicalTrials.gov and PubMed search terms, subreddits, and the
peptides to track.

---

## 4. Design

Moved off the indigo-and-gradient supplement-store look. The new system is in
`src/app/globals.css` as Tailwind 4 `@theme` tokens, so the palette changes in
one place and no component hardcodes a colour.

- Warm paper ground (`#faf8f6`) instead of cold grey
- Deep teal primary, muted plum accent. No pink
- Serif display face for headings, system sans for body
- Measured line length (`.prose-body`, 68ch) and more whitespace
- Every text and badge pair verified against its actual background: **all clear
  WCAG AA, most sit above 7:1**

---

## 5. Accessibility and technical health

Fixed, not just tidied:

- **Login and register labels were not associated with their inputs at all.**
  Plain `<label>` elements with no `htmlFor` and no `id`, so a screen reader
  announced unlabelled fields. Both forms now associate properly, announce
  errors with `role="alert"`, and set autocomplete hints.
- **Skip link** added as the first thing in the tab order.
- **Mobile navigation** did not exist. There is now a real toggle with
  `aria-expanded`, `aria-controls`, Escape-to-close and focus return.
- **Single visible focus ring** for every interactive element. The old build
  relied on the browser default, which disappeared against coloured buttons.
- **Cards use the stretched-link pattern** so the card is clickable but only
  the heading is focusable. Previously a whole card was wrapped in an anchor,
  which collapses everything inside it into one enormous link label.
- **Vendor table** gained a caption, scoped column headers, a row header per
  vendor, and a focusable labelled scroll container. At 375px the table scrolls
  inside its own region and the page does not scroll sideways.
- **`prefers-reduced-motion`** honoured globally.
- Three `react-hooks/set-state-in-effect` lint errors fixed by restructuring
  rather than suppressing: saved vendors moved to `useSyncExternalStore`, and
  the nav menu derives its open state from the route it was opened on.

That store change fixed two real bugs on the way: two save buttons for the same
vendor used to disagree with each other, and the saved list went stale when you
unsaved a vendor from the saved page itself.

---

## 6. Things I changed that you did not ask for

Flagging these because they are judgement calls and each is a one-line revert.

### Removed the vendor star ratings and review counts

The data had `rating: 4.8, reviewCount: 1243` and the UI rendered it as real
review data. **The site has never collected a review.** On a health-adjacent
site that is about to carry affiliate links, publishing invented review counts
is a genuine FTC problem, not a cosmetic one. I removed the fields rather than
softening the presentation. What is left is checkable: where a vendor ships
from, what it says about itself, and whether the link pays a commission.

If you want ratings back, they need to come from somewhere real.

### Labelled the vendor prices as placeholder data

Prices, purity and stock were hand-entered and have never been checked against a
live vendor page. They are still there so the comparison layout works, but
`PRICING_IS_PLACEHOLDER` in `src/lib/vendors.ts` drives a visible banner
wherever they appear. Flip it to `false` once there is a real feed or a dated
manual check.

### Rewrote the peptide descriptions

The old ones made therapeutic claims: BPC-157 was "known for its regenerative
properties and gut health benefits", TB-500 "reduces inflammation". Those are
exactly the claims the brief said not to make. Descriptions are now pharmacology
and regulatory facts only, with FDA and WADA status in a separate field.

### Register page no longer says "Registration received"

It was confirming an account that was never created. It now says plainly that
nothing was saved and warns against entering a real password.

---

## 7. Decisions on ambiguities

- **Caching model.** Next 16 offers `cacheComponents: true` with `use cache`, or
  the previous `fetch`-level model. I used the previous model. It is the smaller,
  more reversible change: `cacheComponents` turns on strict PPR across the whole
  app and makes any uncached access outside Suspense a build error, which is not
  something I wanted to debug without being able to ask you. Migrating later is
  contained to `src/lib/research/http.ts` and the page segment configs.
- **Route revalidate reads as 30m, not the 6h I set.** Next takes the minimum of
  the segment config and the fetch revalidate times, and the Reddit fetch is 30
  minutes. Harmless: the trial and literature fetches keep their own longer
  caches, so a regeneration mostly re-reads cache. Raise `CACHE_SECONDS.community`
  if you want fewer regenerations.
- **System fonts, not Google Fonts.** `next/font/google` fetches at build time.
  Not worth a network dependency in the build for this. Swap in a real face when
  you pick one.
- **Light mode only.** The old `globals.css` declared dark-mode variables that no
  component honoured, so dark mode was half-broken. I removed the dead
  declarations rather than shipping a broken theme. Doing it properly means
  dark values for every token, which is a focused piece of work.
- **Renamed `/products` to `/peptides`** with a permanent redirect. "Products"
  was the framing you are moving away from.
- **Two conditions only** (endometriosis, autoimmune). I did not invent more.
- **Peptide-to-condition mapping needs your review.** I listed BPC-157, TB-500,
  semaglutide and tirzepatide under both conditions on the basis of what is
  discussed, and the UI says inclusion means the intersection is being searched
  and is not a therapeutic association. Still, you should look at it.

---

## 8. Content boundary

No page states or implies that a peptide treats endometriosis or any autoimmune
condition.

**Update (later session, at Albert's request):** both condition overviews are
now written and live (`needsReview: false`). They describe the condition, why
primary sources are hard for patients to find, and what the lists below are
drawn from. They make no claim about any peptide. Facts are sourced from the
WHO endometriosis fact sheet and the NIEHS autoimmune topic page, both checked
against the live pages rather than written from memory. Notably WHO puts the
diagnostic delay at four to twelve years, not the seven to ten figure that gets
quoted second-hand.

They are still not clinician-reviewed, and `/disclosures` says so. Setting
`needsReview: true` on either one puts it back behind the "Unreviewed
placeholder copy" callout.

The one remaining marked placeholder is the contact route on `/disclosures`.

`overview.body` is now `string[]`, one entry per paragraph, so real copy sets
properly instead of running together in a single block.

---

## 9. FTC disclosure

`src/components/AffiliateDisclosure.tsx`, two variants:

- `inline` renders above vendor links on peptide pages and the vendor directory,
  per the FTC guidance that a disclosure sits close to the link rather than in a
  footer
- `full` is the `/disclosures` page

The wording is derived from the data: `hasAffiliateRelationships` reads the
vendor list, so while nothing is flagged as an affiliate it says the site earns
nothing today and states what will change. **Set `affiliate: true` on the right
vendors in `src/lib/vendors.ts` before you add any affiliate link.** That flag
also drives `rel="sponsored"` and the per-row "Affiliate" marker, so a wrong
value there is a compliance problem, not a display bug.

---

## 10. How I verified it

- `npx tsc --noEmit` clean
- `npm run lint` clean
- `npm run build` passes, 20 routes
- Grepped the prerendered HTML to confirm real data rather than error states:

  | Page | Trials | Articles |
  |---|---|---|
  | conditions/endometriosis | 10 | 4 |
  | conditions/autoimmune | 10 | 10 |
  | peptides/semaglutide | 8 | 10 |
  | peptides/bpc-157 | 2 | 10 |

- Checked in a real browser at desktop and 375px
- Scripted accessibility pass: one `h1`, no heading level skips, no unlabelled
  inputs, no unnamed buttons, no missing alt text, labelled landmarks
- Scripted contrast pass against computed backgrounds: all AA, most above 7:1

Reddit is the one source that fails, for the credential reason in section 1.

---

## 11. What I would do next, in order

1. ~~Write the two condition overviews.~~ Done. Read them and check you are
   happy with the voice before you send anyone to the site.
2. ~~Assign the six evidence tiers.~~ Done, from data. Read the notes and
   push back on any you disagree with, particularly ipamorelin.
3. **Reddit credentials**, or drop the community panel. Right now every condition
   page carries a visible error block.
4. **Decide about the vendor listings.** Either wire a real source for price and
   stock, or cut the table and let the site be purely a research directory. The
   placeholder banner is not a long-term answer.
5. **Search across conditions and peptides.** The data layer already takes
   arbitrary query terms, so this is mostly UI.
6. **Save trials and papers, not just vendors.** Saving a vendor is the least
   useful thing on the site now. Saving "trials I want to ask my doctor about"
   is the feature this audience would actually use. `src/lib/favorites.ts`
   generalises to keyed collections without much work.
7. **Dark mode**, properly, token by token.
8. **Real auth.** Credentials are mock users in `src/lib/auth.ts` and
   `NEXTAUTH_SECRET` falls back to a hardcoded dev string. Fine for now,
   not fine in production.

---

## Environment variables

None are required. All are optional improvements.

```
NCBI_API_KEY          # raises PubMed rate limit from 3/sec to 10/sec
REDDIT_CLIENT_ID      # enables the community panel
REDDIT_CLIENT_SECRET  # enables the community panel
RESEARCH_USER_AGENT   # identify the site to NIH once it has a domain
NEXTAUTH_SECRET       # required before any real deployment
```
