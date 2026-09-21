import ExternalLink from '@/components/ExternalLink';
import { TRIAL_STATUS_META, type ClinicalTrial } from '@/lib/research';

/**
 * Recruitment status badge.
 *
 * Status is the first thing a patient needs, so it leads the card rather than
 * sitting in a metadata row. Colour is backed by text in every case.
 */
export function TrialStatusBadge({ trial }: { trial: ClinicalTrial }) {
  const meta = TRIAL_STATUS_META[trial.status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${meta.className}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      <span>
        <span className="sr-only">Recruitment status: </span>
        {meta.label}
      </span>
    </span>
  );
}

function PhaseBadge({ phase }: { phase: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-line-strong bg-surface-sunken px-2.5 py-1 text-xs font-semibold text-ink">
      <span className="sr-only">Trial phase: </span>
      {phase}
    </span>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-ink-subtle">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-ink">{value}</dd>
    </div>
  );
}

function locationSummary(countries: string[]): string {
  if (countries.length === 0) return 'Not listed';
  if (countries.length <= 3) return countries.join(', ');
  return `${countries.slice(0, 2).join(', ')} and ${countries.length - 2} more`;
}

export default function TrialCard({ trial }: { trial: ClinicalTrial }) {
  return (
    <li className="rounded-lg border border-line bg-surface p-5 transition-shadow hover:shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <TrialStatusBadge trial={trial} />
        {trial.phase && <PhaseBadge phase={trial.phase} />}
        {trial.studyType && (
          <span className="text-xs font-medium text-ink-subtle">
            {trial.studyType}
          </span>
        )}
      </div>

      <h3 className="font-sans text-base font-semibold leading-snug text-ink">
        <ExternalLink
          href={trial.url}
          className="underline-offset-4 hover:underline"
        >
          {trial.title}
        </ExternalLink>
      </h3>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-4">
        <Fact label="Registry ID" value={trial.nctId} />
        <Fact label="Sponsor" value={trial.sponsor ?? 'Not listed'} />
        <Fact
          label="Enrolment"
          value={
            trial.enrolment !== null
              ? `${trial.enrolment.toLocaleString()} participants`
              : 'Not listed'
          }
        />
        <Fact label="Locations" value={locationSummary(trial.countries)} />
      </dl>

      {trial.interventions.length > 0 && (
        <p className="mt-4 text-sm text-ink-muted">
          <span className="font-medium text-ink">Interventions: </span>
          {trial.interventions.slice(0, 4).join(', ')}
          {trial.interventions.length > 4 &&
            ` and ${trial.interventions.length - 4} more`}
        </p>
      )}
    </li>
  );
}
