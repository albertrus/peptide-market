import { buildUrl, CACHE_SECONDS, fetchJson } from './http';
import { ok, type Article, type LiteratureSearchResult, type ResearchResult } from './types';

const EUTILS = 'https://eutils.ncbi.nlm.nih.gov/entrez/eutils';
const UI = 'https://pubmed.ncbi.nlm.nih.gov/';

/**
 * NCBI rate limits anonymous callers to three requests a second across the
 * whole IP address. A free API key raises that to ten and makes the limit
 * per-key. Get one at https://www.ncbi.nlm.nih.gov/account/ and set
 * NCBI_API_KEY; the site works without it, just closer to the ceiling.
 */
const API_KEY = process.env.NCBI_API_KEY;

/**
 * Minimum gap between E-utilities calls from this process.
 *
 * Each page renders esearch then esummary, and several pages render at once
 * during a build, so without spacing the calls the later ones get 429s. The
 * retry in fetchJson catches what slips through; this keeps it from having to.
 */
const MIN_INTERVAL_MS = API_KEY ? 110 : 350;

let queue: Promise<void> = Promise.resolve();

/** Serialises E-utilities calls, spacing them by MIN_INTERVAL_MS. */
function throttle(): Promise<void> {
  const ready = queue;
  queue = ready.then(
    () => new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS)),
  );
  return ready;
}

/**
 * "Journal Article" is attached to nearly everything, so it carries no signal.
 * It is dropped when a more specific type is present.
 */
const GENERIC_TYPE = 'Journal Article';

/** Types worth surfacing first because they tell a reader what kind of study it is. */
const TYPE_PRIORITY = [
  'Meta-Analysis',
  'Systematic Review',
  'Randomized Controlled Trial',
  'Clinical Trial',
  'Review',
  'Case Reports',
];

interface RawEsearch {
  esearchresult?: {
    count?: string;
    idlist?: string[];
  };
}

interface RawSummaryRecord {
  uid?: string;
  title?: string;
  source?: string;
  fulljournalname?: string;
  pubdate?: string;
  sortpubdate?: string;
  authors?: { name?: string; authtype?: string }[];
  pubtype?: string[];
  articleids?: { idtype?: string; value?: string }[];
}

interface RawEsummary {
  result?: Record<string, RawSummaryRecord | string[]>;
}

function parseYear(record: RawSummaryRecord): number | null {
  const source = record.sortpubdate ?? record.pubdate ?? '';
  const match = source.match(/\d{4}/);
  return match ? Number(match[0]) : null;
}

function sortTypes(types: string[]): string[] {
  const specific = types.filter((t) => t !== GENERIC_TYPE);
  const pool = specific.length > 0 ? specific : types;
  return [...pool].sort((a, b) => {
    const ai = TYPE_PRIORITY.indexOf(a);
    const bi = TYPE_PRIORITY.indexOf(b);
    if (ai === bi) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });
}

function toArticle(record: RawSummaryRecord): Article | null {
  const pmid = record.uid;
  const title = record.title?.replace(/\.$/, '');
  if (!pmid || !title) return null;

  const doi =
    record.articleids?.find((id) => id.idtype === 'doi')?.value ?? null;

  return {
    pmid,
    title,
    journal: record.fulljournalname ?? record.source ?? 'Unknown journal',
    published: record.pubdate ?? '',
    year: parseYear(record),
    authors: (record.authors ?? [])
      .filter((a) => a.authtype === 'Author' || a.authtype === undefined)
      .map((a) => a.name)
      .filter((n): n is string => Boolean(n)),
    publicationTypes: sortTypes(record.pubtype ?? []),
    doi,
    url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
  };
}

export interface LiteratureQuery {
  /** A PubMed query string. Callers compose this from condition and peptide terms. */
  term: string;
  retmax?: number;
}

/**
 * Searches PubMed with esearch, then hydrates the results with esummary.
 *
 * The two calls are necessarily sequential: esummary needs the IDs esearch
 * returns. Both are cached, and the whole section is wrapped in Suspense so the
 * round trip does not block the rest of the page.
 */
export async function searchLiterature({
  term,
  retmax = 12,
}: LiteratureQuery): Promise<ResearchResult<LiteratureSearchResult>> {
  const searchUrl = buildUrl(UI, { term });

  await throttle();
  const searchResponse = await fetchJson<RawEsearch>(
    buildUrl(`${EUTILS}/esearch.fcgi`, {
      db: 'pubmed',
      term,
      retmode: 'json',
      retmax,
      sort: 'pub_date',
      api_key: API_KEY,
    }),
    {
      source: 'pubmed',
      revalidate: CACHE_SECONDS.literature,
      tags: ['pubmed'],
    },
  );

  if (!searchResponse.ok) return searchResponse;

  const ids = searchResponse.data.esearchresult?.idlist ?? [];
  const totalCount = Number(searchResponse.data.esearchresult?.count ?? 0);

  if (ids.length === 0) {
    return ok({ articles: [], totalCount, searchUrl });
  }

  await throttle();
  const summaryResponse = await fetchJson<RawEsummary>(
    buildUrl(`${EUTILS}/esummary.fcgi`, {
      db: 'pubmed',
      id: ids.join(','),
      retmode: 'json',
      api_key: API_KEY,
    }),
    {
      source: 'pubmed',
      revalidate: CACHE_SECONDS.literature,
      tags: ['pubmed'],
    },
  );

  if (!summaryResponse.ok) return summaryResponse;

  const result = summaryResponse.data.result ?? {};
  const articles = ids
    .map((id) => result[id])
    .filter((r): r is RawSummaryRecord => Boolean(r) && !Array.isArray(r))
    .map(toArticle)
    .filter((a): a is Article => a !== null);

  return ok({ articles, totalCount, searchUrl });
}

/** Combines a condition term and a peptide term into a single PubMed query. */
export function intersectionTerm(
  conditionTerm: string,
  peptideTerm: string,
): string {
  return `${conditionTerm} AND ${peptideTerm}`;
}
