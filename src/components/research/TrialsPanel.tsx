import ResearchSection from './ResearchSection';
import TrialCard from './TrialCard';
import { ResearchEmptyState, ResearchErrorState } from './ResearchStates';
import { countTrials, searchTrials, type TrialQuery } from '@/lib/research';

interface TrialsPanelProps extends TrialQuery {
  id: string;
  title: string;
  description: string;
}

/**
 * Clinical trials from ClinicalTrials.gov.
 *
 * Async server component. Pages wrap it in `<Suspense>` so a slow registry
 * streams in instead of blocking the page.
 *
 * Two requests run in parallel: the trials a patient could still join, and a
 * count of everything ever registered for the same query. Showing "24 open of
 * 950 registered" is honest in a way that showing only one of those numbers is
 * not.
 */
export default async function TrialsPanel({
  id,
  title,
  description,
  condition,
  intervention,
  pageSize = 10,
}: TrialsPanelProps) {
  const query: TrialQuery = { condition, intervention };

  const [openResult, allCount] = await Promise.all([
    searchTrials({ ...query, openOnly: true, pageSize }),
    countTrials(query),
  ]);

  const totalRegistered = allCount.ok ? allCount.data : null;

  const meta =
    openResult.ok || totalRegistered !== null ? (
      <p className="text-sm text-ink-muted">
        {openResult.ok && (
          <span className="font-semibold text-ink">
            {openResult.data.totalCount.toLocaleString()} open
          </span>
        )}
        {openResult.ok && totalRegistered !== null && ' of '}
        {totalRegistered !== null && (
          <span>{totalRegistered.toLocaleString()} registered</span>
        )}
      </p>
    ) : null;

  return (
    <ResearchSection
      id={id}
      title={title}
      description={description}
      source="clinicaltrials"
      sourceUrl={openResult.ok ? openResult.data.searchUrl : undefined}
      sourceLinkLabel="Browse all on ClinicalTrials.gov"
      meta={meta}
    >
      {!openResult.ok ? (
        <ResearchErrorState error={openResult.error} />
      ) : openResult.data.trials.length === 0 ? (
        <ResearchEmptyState
          message="No trials are currently open to enrolment for this search. Trials that have closed or completed may still exist, and new ones are registered regularly."
          fallbackUrl={openResult.data.searchUrl}
          fallbackLabel="See every registered trial for this search"
        />
      ) : (
        <ul className="space-y-3">
          {openResult.data.trials.map((trial) => (
            <TrialCard key={trial.nctId} trial={trial} />
          ))}
        </ul>
      )}
    </ResearchSection>
  );
}
