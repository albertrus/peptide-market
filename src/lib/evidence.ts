/**
 * Evidence tiering.
 *
 * Every peptide entry in this codebase MUST declare an `evidenceTier`. The tier
 * describes the strongest kind of study that exists for a compound, not whether
 * it works and not whether anyone should take it.
 *
 * `unrated` is the required default. It is a real, visible state in the UI: it
 * tells a reader "nobody has assessed this yet" rather than implying an
 * assessment that has not happened. See NOTES.md for the list of peptides still
 * sitting at `unrated`.
 */

export const EVIDENCE_TIERS = [
  'human-trial',
  'small-human-study',
  'animal-only',
  'mechanism-only',
  'anecdotal',
  'unrated',
] as const;

export type EvidenceTier = (typeof EVIDENCE_TIERS)[number];

export interface EvidenceTierMeta {
  tier: EvidenceTier;
  /** Short label used on the badge itself. */
  label: string;
  /** One line shown next to the badge or in a tooltip. */
  summary: string;
  /** Longer neutral definition used on the methodology page. */
  definition: string;
  /**
   * Sort weight. Higher means a stronger class of evidence exists. This ranks
   * the *kind* of study, never the size of any benefit.
   */
  rank: number;
  /** Tailwind classes. Tokens live in globals.css so palettes stay in one place. */
  className: string;
}

export const EVIDENCE_TIER_META: Record<EvidenceTier, EvidenceTierMeta> = {
  'human-trial': {
    tier: 'human-trial',
    label: 'Human trial',
    summary: 'Registered controlled trials in people exist.',
    definition:
      'One or more registered, controlled clinical trials in human participants have been run or are underway. Registered trials are the strongest class of evidence listed here. It does not mean the trials were positive, large, or relevant to every use.',
    rank: 5,
    className: 'bg-tier-trial-soft text-tier-trial-ink border-tier-trial-line',
  },
  'small-human-study': {
    tier: 'small-human-study',
    label: 'Small human study',
    summary: 'Small or uncontrolled studies in people exist.',
    definition:
      'Published work in human participants exists, but at small scale, without a control group, or as case reports. Findings at this tier are preliminary and frequently fail to replicate at larger scale.',
    rank: 4,
    className: 'bg-tier-small-soft text-tier-small-ink border-tier-small-line',
  },
  'animal-only': {
    tier: 'animal-only',
    label: 'Animal only',
    summary: 'Studied in animals, not in people.',
    definition:
      'The published work is in animal models. Results in animals routinely do not carry over to humans, and dosing in animal studies is not transferable to people.',
    rank: 3,
    className: 'bg-tier-animal-soft text-tier-animal-ink border-tier-animal-line',
  },
  'mechanism-only': {
    tier: 'mechanism-only',
    label: 'Mechanism only',
    summary: 'A proposed biological pathway, not an outcome study.',
    definition:
      'The available literature describes a plausible biological mechanism, often in cell culture or as a theoretical framework, without measuring an outcome in a living animal or person.',
    rank: 2,
    className:
      'bg-tier-mechanism-soft text-tier-mechanism-ink border-tier-mechanism-line',
  },
  anecdotal: {
    tier: 'anecdotal',
    label: 'Anecdotal',
    summary: 'Self-reports only. No study evidence located.',
    definition:
      'What exists is personal accounts, forum reports, and marketing material. Anecdotal reports are not evidence of effect, and they systematically over-represent people who had a notable experience.',
    rank: 1,
    className:
      'bg-tier-anecdotal-soft text-tier-anecdotal-ink border-tier-anecdotal-line',
  },
  unrated: {
    tier: 'unrated',
    label: 'Not yet rated',
    summary: 'Nobody has assessed the evidence for this entry yet.',
    definition:
      'This entry has not been reviewed against the tiers above. Treat the absence of a rating as an absence of review, not as a neutral or positive signal.',
    rank: 0,
    className: 'bg-tier-unrated-soft text-tier-unrated-ink border-tier-unrated-line',
  },
};

/** Tiers in the order they are presented on the methodology page. */
export const EVIDENCE_TIERS_BY_STRENGTH: EvidenceTierMeta[] = EVIDENCE_TIERS.map(
  (tier) => EVIDENCE_TIER_META[tier],
).sort((a, b) => b.rank - a.rank);

export function evidenceTierMeta(tier: EvidenceTier): EvidenceTierMeta {
  return EVIDENCE_TIER_META[tier];
}
