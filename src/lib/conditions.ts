/**
 * Conditions are the primary entry point into this site.
 *
 * A condition record carries the search configuration used to pull trials and
 * literature, plus the list of peptides people ask about in that context.
 *
 * Being listed under a condition means only that the intersection is being
 * searched. It is not a statement that a peptide treats the condition. Copy in
 * this file must stay descriptive of the search, never of an outcome.
 */

export interface ConditionQueries {
  /** ClinicalTrials.gov `query.cond` value. */
  trialCondition: string;
  /** PubMed term fragment for the condition. Combined with peptide terms. */
  literatureCondition: string;
  /** Subreddits searched for the community discussion section. */
  subreddits: string[];
}

export interface Condition {
  slug: string;
  name: string;
  /** Short form used in navigation and breadcrumbs. */
  shortName: string;
  /** One-line neutral framing. Safe to display. */
  summary: string;
  /**
   * Longer body copy, one string per paragraph.
   *
   * `needsReview: true` means this is placeholder text that Albert still has
   * to write or approve, and the UI marks it visibly rather than presenting
   * unreviewed copy as finished.
   *
   * Copy here describes the condition and what this page aggregates. It must
   * never describe a peptide as a treatment for it.
   */
  overview: {
    body: string[];
    needsReview: boolean;
  };
  queries: ConditionQueries;
  /**
   * Peptides discussed in this context. Ordering is alphabetical, not a ranking.
   * See NOTES.md: this list needs Albert's review.
   */
  trackedPeptideIds: string[];
}

export const conditions: Condition[] = [
  {
    slug: 'endometriosis',
    name: 'Endometriosis',
    shortName: 'Endometriosis',
    summary:
      'Tissue similar to the uterine lining growing outside the uterus. Affects roughly 1 in 10 women and people assigned female at birth of reproductive age.',
    overview: {
      body: [
        'The World Health Organization puts the number affected at around 10 percent of reproductive age women worldwide, roughly 190 million people, along with transgender men and non-binary people who menstruate. The growths cause inflammation and scar tissue. The causes are not known, there is no cure, and WHO gives the average time from first symptoms to diagnosis as somewhere between four and twelve years.',
        'That delay is why this page exists. Spending years being told the pain is normal leaves people doing their own research, usually through whatever ranks highest in a search, which is often written by someone with something to sell. The trials below come from ClinicalTrials.gov and the literature from PubMed. Every entry links straight to the source, so you can read the study itself instead of a summary of it written by a vendor.',
        'One thing worth knowing while you read: WHO notes that endometriosis is associated with immune system dysregulation, and that people who have it show higher rates of lupus, multiple sclerosis and inflammatory bowel disease. That overlap is part of why this site tracks autoimmune conditions alongside it.',
      ],
      needsReview: false,
    },
    queries: {
      trialCondition: 'endometriosis',
      literatureCondition: '(endometriosis OR adenomyosis)',
      subreddits: ['Endo', 'endometriosis'],
    },
    trackedPeptideIds: ['bpc-157', 'semaglutide', 'tb-500', 'tirzepatide'],
  },
  {
    slug: 'autoimmune',
    name: 'Autoimmune conditions',
    shortName: 'Autoimmune',
    summary:
      'Conditions in which the immune system targets the body’s own tissue. Most autoimmune diagnoses fall disproportionately on women.',
    overview: {
      body: [
        'The National Institute of Environmental Health Sciences counts more than 80 distinct conditions under that heading, from widely recognised ones like type 1 diabetes, multiple sclerosis, lupus and rheumatoid arthritis to rare ones that take years to identify. Most have no cure, and NIEHS lists sex among the characteristics linked to developing one.',
        'This page covers that whole group at once, which is both what makes it useful and what limits it. A trial recruiting for rheumatoid arthritis tells you very little about Hashimoto\u2019s. Treat what follows as a way into the literature rather than as a set of results that all apply to your diagnosis, and narrow the search on the source once you find something relevant.',
        'The trials come from ClinicalTrials.gov and the literature from PubMed. Every entry links to the source.',
      ],
      needsReview: false,
    },
    queries: {
      trialCondition: 'autoimmune disease',
      literatureCondition: '("autoimmune diseases"[MeSH Terms] OR autoimmune)',
      subreddits: ['Autoimmune', 'ChronicIllness'],
    },
    trackedPeptideIds: ['bpc-157', 'semaglutide', 'tb-500', 'tirzepatide'],
  },
];

export function getCondition(slug: string): Condition | undefined {
  return conditions.find((c) => c.slug === slug);
}

/** Conditions that track a given peptide. Powers the peptide detail page. */
export function conditionsForPeptide(peptideId: string): Condition[] {
  return conditions.filter((c) => c.trackedPeptideIds.includes(peptideId));
}
