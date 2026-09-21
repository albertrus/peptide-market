import ArticleCard from './ArticleCard';
import ResearchSection from './ResearchSection';
import { ResearchEmptyState, ResearchErrorState } from './ResearchStates';
import { searchLiterature } from '@/lib/research';

interface LiteraturePanelProps {
  id: string;
  title: string;
  description: string;
  /** A PubMed query string. */
  term: string;
  retmax?: number;
}

/**
 * Published literature from PubMed.
 *
 * Async server component; wrap in `<Suspense>` at the page level.
 *
 * Results are sorted by publication date, newest first, because the brief is
 * about finding research that is happening now. Note that a paper appearing
 * here means the terms co-occur in the index, not that the paper found an
 * effect. The section description says so.
 */
export default async function LiteraturePanel({
  id,
  title,
  description,
  term,
  retmax = 10,
}: LiteraturePanelProps) {
  const result = await searchLiterature({ term, retmax });

  return (
    <ResearchSection
      id={id}
      title={title}
      description={description}
      source="pubmed"
      sourceUrl={result.ok ? result.data.searchUrl : undefined}
      sourceLinkLabel="Run this search on PubMed"
      meta={
        result.ok ? (
          <p className="text-sm text-ink-muted">
            <span className="font-semibold text-ink">
              {result.data.totalCount.toLocaleString()}
            </span>{' '}
            {result.data.totalCount === 1 ? 'result' : 'results'}
            {result.data.totalCount > result.data.articles.length &&
              `, newest ${result.data.articles.length} shown`}
          </p>
        ) : null
      }
    >
      {!result.ok ? (
        <ResearchErrorState error={result.error} />
      ) : result.data.articles.length === 0 ? (
        <ResearchEmptyState
          message="PubMed has no indexed papers matching this combination of terms. That is a statement about the index, not a conclusion about the science."
          fallbackUrl={result.data.searchUrl}
          fallbackLabel="Try this search on PubMed"
        />
      ) : (
        <ul className="space-y-3">
          {result.data.articles.map((article) => (
            <ArticleCard key={article.pmid} article={article} />
          ))}
        </ul>
      )}
    </ResearchSection>
  );
}
