import { buildUrl, CACHE_SECONDS, fetchJson } from './http';
import {
  ok,
  TRIAL_STATUS_META,
  type ClinicalTrial,
  type ResearchResult,
  type TrialSearchResult,
  type TrialStatus,
} from './types';

const API = 'https://clinicaltrials.gov/api/v2/studies';
const UI = 'https://clinicaltrials.gov/search';

/**
 * Only the fields the UI renders are requested. The full study payload is
 * enormous and includes investigator phone numbers and email addresses that
 * this site has no business republishing.
 */
const FIELDS = [
  'protocolSection.identificationModule.nctId',
  'protocolSection.identificationModule.briefTitle',
  'protocolSection.statusModule.overallStatus',
  'protocolSection.statusModule.startDateStruct',
  'protocolSection.designModule.phases',
  'protocolSection.designModule.studyType',
  'protocolSection.designModule.enrollmentInfo',
  'protocolSection.sponsorCollaboratorsModule.leadSponsor',
  'protocolSection.conditionsModule.conditions',
  'protocolSection.armsInterventionsModule.interventions',
  'protocolSection.contactsLocationsModule.locations',
].join(',');

/** Statuses a patient could still plausibly join. */
const OPEN_STATUSES = [
  'RECRUITING',
  'NOT_YET_RECRUITING',
  'ENROLLING_BY_INVITATION',
].join('|');

const STATUS_MAP: Record<string, TrialStatus> = {
  RECRUITING: 'recruiting',
  NOT_YET_RECRUITING: 'not-yet-recruiting',
  ENROLLING_BY_INVITATION: 'enrolling-by-invitation',
  ACTIVE_NOT_RECRUITING: 'active-not-recruiting',
  COMPLETED: 'completed',
  TERMINATED: 'terminated',
  WITHDRAWN: 'withdrawn',
  SUSPENDED: 'suspended',
  UNKNOWN: 'unknown',
  NO_LONGER_AVAILABLE: 'unknown',
  TEMPORARILY_NOT_AVAILABLE: 'unknown',
  APPROVED_FOR_MARKETING: 'unknown',
  AVAILABLE: 'unknown',
  WITHHELD: 'unknown',
};

const PHASE_MAP: Record<string, string> = {
  EARLY_PHASE1: 'Early Phase 1',
  PHASE1: 'Phase 1',
  PHASE2: 'Phase 2',
  PHASE3: 'Phase 3',
  PHASE4: 'Phase 4',
};

/** Minimal shape of the upstream response, limited to the requested fields. */
interface RawStudiesResponse {
  totalCount?: number;
  studies?: RawStudy[];
}

interface RawStudy {
  protocolSection?: {
    identificationModule?: { nctId?: string; briefTitle?: string };
    statusModule?: {
      overallStatus?: string;
      startDateStruct?: { date?: string };
    };
    designModule?: {
      phases?: string[];
      studyType?: string;
      enrollmentInfo?: { count?: number };
    };
    sponsorCollaboratorsModule?: { leadSponsor?: { name?: string } };
    conditionsModule?: { conditions?: string[] };
    armsInterventionsModule?: { interventions?: { name?: string }[] };
    contactsLocationsModule?: { locations?: { country?: string }[] };
  };
}

function normalisePhase(phases: string[] | undefined): string | null {
  if (!phases || phases.length === 0) return null;
  const mapped = phases.map((p) => PHASE_MAP[p]).filter(Boolean);
  if (mapped.length === 0) return null; // "NA" means phase is not applicable.
  if (mapped.length === 1) return mapped[0];
  // "Phase 2" + "Phase 3" reads better as "Phase 2/3".
  const numbers = mapped.map((label) => label.replace('Phase ', ''));
  return `Phase ${numbers.join('/')}`;
}

function normaliseStudyType(studyType: string | undefined): string | null {
  if (!studyType) return null;
  return studyType.charAt(0) + studyType.slice(1).toLowerCase().replace(/_/g, ' ');
}

function toTrial(raw: RawStudy): ClinicalTrial | null {
  const p = raw.protocolSection;
  const nctId = p?.identificationModule?.nctId;
  const title = p?.identificationModule?.briefTitle;
  if (!nctId || !title) return null;

  const countries = Array.from(
    new Set(
      (p?.contactsLocationsModule?.locations ?? [])
        .map((l) => l.country)
        .filter((c): c is string => Boolean(c)),
    ),
  ).sort();

  return {
    nctId,
    title,
    status: STATUS_MAP[p?.statusModule?.overallStatus ?? ''] ?? 'unknown',
    phase: normalisePhase(p?.designModule?.phases),
    studyType: normaliseStudyType(p?.designModule?.studyType),
    sponsor: p?.sponsorCollaboratorsModule?.leadSponsor?.name ?? null,
    enrolment: p?.designModule?.enrollmentInfo?.count ?? null,
    startDate: p?.statusModule?.startDateStruct?.date ?? null,
    conditions: p?.conditionsModule?.conditions ?? [],
    interventions: (p?.armsInterventionsModule?.interventions ?? [])
      .map((i) => i.name)
      .filter((n): n is string => Boolean(n)),
    countries,
    url: `https://clinicaltrials.gov/study/${nctId}`,
  };
}

export interface TrialQuery {
  /** Condition term, for example "endometriosis". */
  condition?: string;
  /** Intervention term, for example "semaglutide". */
  intervention?: string;
  /** Restrict to studies a patient could still join. */
  openOnly?: boolean;
  pageSize?: number;
}

function uiSearchUrl({ condition, intervention }: TrialQuery): string {
  return buildUrl(UI, { cond: condition, intr: intervention });
}

/** Sorts trials a patient can act on to the top, then most recent first. */
function byUsefulness(a: ClinicalTrial, b: ClinicalTrial): number {
  const aOpen = TRIAL_STATUS_META[a.status].openToEnrolment ? 1 : 0;
  const bOpen = TRIAL_STATUS_META[b.status].openToEnrolment ? 1 : 0;
  if (aOpen !== bOpen) return bOpen - aOpen;
  return (b.startDate ?? '').localeCompare(a.startDate ?? '');
}

export async function searchTrials(
  query: TrialQuery,
): Promise<ResearchResult<TrialSearchResult>> {
  const url = buildUrl(API, {
    'query.cond': query.condition,
    'query.intr': query.intervention,
    'filter.overallStatus': query.openOnly ? OPEN_STATUSES : undefined,
    sort: 'LastUpdatePostDate:desc',
    countTotal: 'true',
    pageSize: query.pageSize ?? 20,
    fields: FIELDS,
  });

  const result = await fetchJson<RawStudiesResponse>(url, {
    source: 'clinicaltrials',
    revalidate: CACHE_SECONDS.trials,
    tags: ['clinicaltrials'],
  });

  if (!result.ok) return result;

  const trials = (result.data.studies ?? [])
    .map(toTrial)
    .filter((t): t is ClinicalTrial => t !== null)
    .sort(byUsefulness);

  return ok({
    trials,
    totalCount: result.data.totalCount ?? trials.length,
    searchUrl: uiSearchUrl(query),
  });
}

/**
 * Counts every registered study for a query, regardless of status, so a page
 * can say "24 open of 950 registered" rather than implying 24 is the whole
 * picture.
 */
export async function countTrials(
  query: TrialQuery,
): Promise<ResearchResult<number>> {
  const url = buildUrl(API, {
    'query.cond': query.condition,
    'query.intr': query.intervention,
    countTotal: 'true',
    pageSize: 1,
    fields: 'protocolSection.identificationModule.nctId',
  });

  const result = await fetchJson<RawStudiesResponse>(url, {
    source: 'clinicaltrials',
    revalidate: CACHE_SECONDS.trials,
    tags: ['clinicaltrials'],
  });

  if (!result.ok) return result;
  return ok(result.data.totalCount ?? 0);
}
