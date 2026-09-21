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

      <Callout title="What the tiers mean">
        Each peptide carries a tier describing the strongest kind of study that
        exists for it, not whether it works. A compound can sit at
        &ldquo;human trial&rdquo; because a controlled trial was run and found
        nothing.{' '}
        <Link href="/evidence">How the tiers are assigned</Link>.
      </Callout>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {peptides.map((peptide) => (
          <PeptideCard key={peptide.id} peptide={peptide} />
        ))}
      </div>
    </div>
  );
}
