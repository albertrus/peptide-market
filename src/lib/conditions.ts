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
   * Longer body copy. `needsReview: true` means this is placeholder text that
   * Albert still has to write or approve. The UI marks it visibly rather than
   * presenting unreviewed copy as finished.
   */
  overview: {
    body: string;
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
      body:
        'PLACEHOLDER: Albert to write the condition overview. Keep it descriptive of the condition and of what this page aggregates. Do not describe any peptide as a treatment for endometriosis. A good shape for this section: what the condition is, why primary sources are hard for patients to find, and what the trial and literature lists below are drawn from.',
      needsReview: true,
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
      body:
        'PLACEHOLDER: Albert to write the condition overview. This page covers autoimmune conditions as a group, so the copy should say plainly that trial and literature results span many different diagnoses and that relevance varies a great deal between them. Do not describe any peptide as a treatment.',
      needsReview: true,
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
