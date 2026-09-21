import type { Metadata } from 'next';
import Callout from '@/components/Callout';
import ConditionCard from '@/components/ConditionCard';
import { conditions } from '@/lib/conditions';

export const metadata: Metadata = {
  title: 'Conditions',
  description:
    'Browse peptide research by condition. Clinical trials and published literature from ClinicalTrials.gov and PubMed.',
};

export default function ConditionsPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Conditions
        </h1>
        <p className="prose-body mt-3 text-lg text-ink-muted">
          Pick a condition to see the trials currently open to enrolment, the
          newest published literature, and which peptides come up in that
          context.
        </p>
      </header>

      <div className="grid gap-5 sm:grid-cols-2">
        {conditions.map((condition) => (
          <ConditionCard key={condition.slug} condition={condition} />
        ))}
      </div>

      <Callout title="Only two conditions so far">
        Conditions are defined in one file, <code>src/lib/conditions.ts</code>.
        Adding another is a single object: a name, the search terms for
        ClinicalTrials.gov and PubMed, and the peptides to track for it.
      </Callout>
    </div>
  );
}
