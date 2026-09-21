import type { Metadata } from 'next';
import Link from 'next/link';
import Callout from '@/components/Callout';
import PeptideCard from '@/components/PeptideCard';
import { peptides } from '@/lib/peptides';

export const metadata: Metadata = {
  title: 'Peptides',
  description:
    'Every peptide tracked on this site, with its evidence tier, what the molecule actually is, and its regulatory status.',
};

export default function PeptidesPage() {
  return (
    <div className="space-y-10">
      <header className="max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          Peptides
        </h1>
        <p className="prose-body mt-3 text-lg text-ink-muted">
          What each molecule is, what kind of evidence exists for it, and where
          it stands with the FDA. If you are looking for research about a
          specific condition, start from{' '}
          <Link
            href="/conditions"
            className="font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
          >
            conditions
          </Link>{' '}
          instead.
        </p>
      </header>

      <Callout tone="notice" title="Evidence tiers are not assigned yet">
        Every peptide below currently reads &ldquo;Not yet rated&rdquo;. That is
        a real state, not a placeholder that got missed: nobody has reviewed
        these against the tier definitions. Treat an unrated entry as unreviewed,
        not as neutral.{' '}
        <Link href="/evidence">How the tiers work</Link>.
      </Callout>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {peptides.map((peptide) => (
          <PeptideCard key={peptide.id} peptide={peptide} />
        ))}
      </div>
    </div>
  );
}
