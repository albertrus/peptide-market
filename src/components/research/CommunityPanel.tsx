import Callout from '@/components/Callout';
import ExternalLink from '@/components/ExternalLink';
import ResearchSection from './ResearchSection';
import { ResearchEmptyState, ResearchErrorState } from './ResearchStates';
import {
  communitySearchUrl,
  searchCommunity,
  type CommunityQuery,
} from '@/lib/research';

interface CommunityPanelProps extends CommunityQuery {
  id: string;
  title?: string;
}

/**
 * Community discussion.
 *
 * Kept because it is where patients actually talk, and framed so nobody
 * mistakes it for evidence. The standing caveat sits above the list, not below
 * it, and the section never shows a score or vote count in a way that could
 * read as a quality signal about a treatment.
 */
export default async function CommunityPanel({
  id,
  title = 'Community discussion',
  subreddits,
  term,
  limit = 6,
}: CommunityPanelProps) {
  const query: CommunityQuery = { subreddits, term, limit };
  const result = await searchCommunity(query);
  const searchUrl = communitySearchUrl(query);

  return (
    <ResearchSection
      id={id}
      title={title}
      description="What people are saying in patient communities. This is lived experience, not evidence, and it is not reviewed by anyone."
      source="reddit"
      sourceUrl={searchUrl}
      sourceLinkLabel="See the full thread list"
    >
      <Callout tone="notice" title="Not evidence" className="mb-4">
        Posts below are personal accounts from anonymous strangers. They are not
        studies, they are not screened for accuracy, and people who had a
        striking experience are far more likely to post than people who did not.
        Use the{' '}
        <a href="#trials" className="font-medium">
          trials
        </a>{' '}
        and{' '}
        <a href="#literature" className="font-medium">
          literature
        </a>{' '}
        sections for evidence.
      </Callout>

      {!result.ok ? (
        <ResearchErrorState error={result.error} fallbackUrl={searchUrl} />
      ) : result.data.posts.length === 0 ? (
        <ResearchEmptyState
          message="No recent discussion found for this search."
          fallbackUrl={searchUrl}
          fallbackLabel="Search Reddit directly"
        />
      ) : (
        <ul className="space-y-2">
          {result.data.posts.map((post) => (
            <li
              key={post.id}
              className="rounded-lg border border-line bg-surface p-4 transition-shadow hover:shadow-sm"
            >
              <h3 className="font-sans text-sm font-medium leading-snug text-ink">
                <ExternalLink
                  href={post.url}
                  className="underline-offset-4 hover:underline"
                >
                  {post.title}
                </ExternalLink>
              </h3>
              <p className="mt-1.5 text-xs text-ink-subtle">
                r/{post.subreddit} &middot; {post.commentCount}{' '}
                {post.commentCount === 1 ? 'comment' : 'comments'}
              </p>
            </li>
          ))}
        </ul>
      )}
    </ResearchSection>
  );
}
