/**
 * Shared types for the research aggregation layer.
 *
 * Every client in this directory returns a `ResearchResult` rather than
 * throwing. A patient-facing page should degrade to an honest "we could not
 * reach this source" panel, not a blank screen or a crash, and the build should
 * not fail because an upstream registry was briefly unavailable.
 */

export type ResearchSource = 'clinicaltrials' | 'pubmed' | 'reddit';

export const RESEARCH_SOURCE_META: Record<
  ResearchSource,
  { name: string; url: string; kind: 'registry' | 'literature' | 'community' }
> = {
  clinicaltrials: {
    name: 'ClinicalTrials.gov',
    url: 'https://clinicaltrials.gov',
    kind: 'registry',
  },
  pubmed: {
    name: 'PubMed',
    url: 'https://pubmed.ncbi.nlm.nih.gov',
    kind: 'literature',
  },
  reddit: {
    name: 'Reddit',
    url: 'https://www.reddit.com',
    kind: 'community',
  },
};

export type ResearchErrorKind = 'timeout' | 'network' | 'http' | 'parse';

export interface ResearchError {
  kind: ResearchErrorKind;
  source: ResearchSource;
  message: string;
}

export type ResearchResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: ResearchError };

export function ok<T>(data: T): ResearchResult<T> {
  return { ok: true, data };
}

export function err<T>(error: ResearchError): ResearchResult<T> {
  return { ok: false, error };
}

/** Recruitment status, normalised from the ClinicalTrials.gov vocabulary. */
export type TrialStatus =
  | 'recruiting'
  | 'not-yet-recruiting'
  | 'enrolling-by-invitation'
  | 'active-not-recruiting'
  | 'completed'
  | 'terminated'
  | 'withdrawn'
  | 'suspended'
  | 'unknown';

export interface TrialStatusMeta {
  label: string;
  /** True when a patient could plausibly still join. Drives sorting and styling. */
  openToEnrolment: boolean;
  className: string;
}

export const TRIAL_STATUS_META: Record<TrialStatus, TrialStatusMeta> = {
  recruiting: {
    label: 'Recruiting',
    openToEnrolment: true,
    className: 'bg-status-open-soft text-status-open-ink border-status-open-line',
  },
  'not-yet-recruiting': {
    label: 'Not yet recruiting',
    openToEnrolment: true,
    className: 'bg-status-soon-soft text-status-soon-ink border-status-soon-line',
  },
  'enrolling-by-invitation': {
    label: 'Enrolling by invitation',
    openToEnrolment: true,
    className: 'bg-status-soon-soft text-status-soon-ink border-status-soon-line',
  },
  'active-not-recruiting': {
    label: 'Active, not recruiting',
    openToEnrolment: false,
    className:
      'bg-status-closed-soft text-status-closed-ink border-status-closed-line',
  },
  completed: {
    label: 'Completed',
    openToEnrolment: false,
    className:
      'bg-status-closed-soft text-status-closed-ink border-status-closed-line',
  },
  terminated: {
    label: 'Terminated',
    openToEnrolment: false,
    className:
      'bg-status-stopped-soft text-status-stopped-ink border-status-stopped-line',
  },
  withdrawn: {
    label: 'Withdrawn',
    openToEnrolment: false,
    className:
      'bg-status-stopped-soft text-status-stopped-ink border-status-stopped-line',
  },
  suspended: {
    label: 'Suspended',
    openToEnrolment: false,
    className:
      'bg-status-stopped-soft text-status-stopped-ink border-status-stopped-line',
  },
  unknown: {
    label: 'Status unknown',
    openToEnrolment: false,
    className:
      'bg-status-unknown-soft text-status-unknown-ink border-status-unknown-line',
  },
};

/** A clinical trial, flattened from the ClinicalTrials.gov v2 payload. */
export interface ClinicalTrial {
  nctId: string;
  title: string;
  status: TrialStatus;
  /** Human-readable phase, for example "Phase 2/3". Null for non-drug studies. */
  phase: string | null;
  studyType: string | null;
  sponsor: string | null;
  enrolment: number | null;
  startDate: string | null;
  conditions: string[];
  interventions: string[];
  /**
   * Countries only. The upstream payload includes investigator names, phone
   * numbers and email addresses; those are deliberately dropped rather than
   * republished.
   */
  countries: string[];
  url: string;
}

export interface TrialSearchResult {
  trials: ClinicalTrial[];
  totalCount: number;
  /** Deep link into the ClinicalTrials.gov UI for the same search. */
  searchUrl: string;
}

/** A journal article, flattened from PubMed esummary. */
export interface Article {
  pmid: string;
  title: string;
  journal: string;
  /** Publication date as PubMed reports it, for example "2026 Jun 24". */
  published: string;
  year: number | null;
  authors: string[];
  /** Article types, for example "Review", "Randomized Controlled Trial". */
  publicationTypes: string[];
  doi: string | null;
  url: string;
}

export interface LiteratureSearchResult {
  articles: Article[];
  totalCount: number;
  searchUrl: string;
}

/** A community post. Explicitly not evidence, and labelled as such in the UI. */
export interface CommunityPost {
  id: string;
  title: string;
  subreddit: string;
  score: number;
  commentCount: number;
  createdUtc: number;
  url: string;
}

export interface CommunitySearchResult {
  posts: CommunityPost[];
}
