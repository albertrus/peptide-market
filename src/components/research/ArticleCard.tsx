import ExternalLink from '@/components/ExternalLink';
import SaveButton from '@/components/SaveButton';
import type { Article } from '@/lib/research';

/**
 * Publication type chips, for example "Randomized Controlled Trial".
 *
 * These come straight from PubMed's own indexing. They are the closest thing to
 * a study-design label that a reader can get without opening the paper, so they
 * are shown up front rather than buried.
 */
function TypeChip({ type }: { type: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line bg-surface-sunken px-2.5 py-0.5 text-xs font-medium text-ink-muted">
      {type}
    </span>
  );
}

function authorLine(authors: string[]): string {
  if (authors.length === 0) return 'Authors not listed';
  if (authors.length === 1) return authors[0];
  if (authors.length <= 3) return authors.join(', ');
  return `${authors[0]} and ${authors.length - 1} others`;
}

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <li className="rounded-lg border border-line bg-surface p-5 transition-shadow hover:shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {article.publicationTypes.slice(0, 3).map((type) => (
            <TypeChip key={type} type={type} />
          ))}
        </div>
        <SaveButton
          variant="labelled"
          item={{
            kind: 'paper',
            id: article.pmid,
            title: article.title,
            url: article.url,
            subtitle: article.journal,
          }}
        />
      </div>

      <h3 className="font-sans text-base font-semibold leading-snug text-ink">
        <ExternalLink
          href={article.url}
          className="underline-offset-4 hover:underline"
        >
          {article.title}
        </ExternalLink>
      </h3>

      <p className="mt-2 text-sm text-ink-muted">
        {authorLine(article.authors)}
      </p>

      <p className="mt-1 text-sm text-ink-subtle">
        <cite className="not-italic font-medium text-ink-muted">
          {article.journal}
        </cite>
        {article.published && <> &middot; {article.published}</>}
        <> &middot; PMID {article.pmid}</>
      </p>

      {article.doi && (
        <p className="mt-2 text-xs text-ink-subtle">
          <ExternalLink
            href={`https://doi.org/${article.doi}`}
            className="underline underline-offset-2 hover:text-primary"
          >
            doi:{article.doi}
          </ExternalLink>
        </p>
      )}
    </li>
  );
}
