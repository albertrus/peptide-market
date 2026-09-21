import type { EvidenceTier } from './evidence';

/**
 * A peptide entry.
 *
 * `description` is deliberately limited to pharmacology and regulatory facts.
 * It must not describe what a peptide does for a condition. Anything that would
 * read as a therapeutic claim belongs in reviewed copy, not in this file.
 */
export interface Peptide {
  id: string;
  name: string;
  /** Other names used in the literature. Drives the research queries. */
  aliases: string[];
  /** Neutral pharmacological class. Used as a chip in the UI. */
  className: string;
  /** Factual description of what the molecule is. No efficacy language. */
  description: string;
  /** Regulatory status in plain language. Kept separate so it is easy to audit. */
  regulatoryNote: string;
  /**
   * REQUIRED. See src/lib/evidence.ts. Every entry currently ships as
   * 'unrated' and is listed in NOTES.md for Albert to assign.
   */
  evidenceTier: EvidenceTier;
  /** Free-text note shown under the badge explaining the current rating. */
  evidenceNote: string;
  /** Term used against ClinicalTrials.gov `query.intr`. */
  trialQuery: string;
  /** Term used against PubMed. Parenthesised OR of the names that index well. */
  literatureQuery: string;
}

/**
 * TODO(albert): every `evidenceTier` below is 'unrated' on purpose. Assign each
 * one after reading the trials and literature the site now surfaces. The type
 * forces a value, so the compiler will not let a new peptide ship without a
 * decision being made.
 */
export const peptides: Peptide[] = [
  {
    id: 'bpc-157',
    name: 'BPC-157',
    aliases: ['BPC 157', 'Body Protection Compound 157', 'PL 14736'],
    className: 'Synthetic peptide',
    description:
      'A synthetic pentadecapeptide based on a partial sequence identified in human gastric juice.',
    regulatoryNote:
      'Not approved by the FDA for any use. Sold only as a research chemical. Placed on the FDA Category 2 bulk substances list in 2023.',
    evidenceTier: 'unrated',
    evidenceNote: 'Not yet reviewed.',
    trialQuery: 'BPC-157',
    literatureQuery: '(BPC-157 OR "BPC 157" OR "body protection compound")',
  },
  {
    id: 'tb-500',
    name: 'TB-500',
    aliases: ['TB500', 'Thymosin beta-4 fragment', 'Tβ4'],
    className: 'Synthetic peptide',
    description:
      'A synthetic fragment of thymosin beta-4, a naturally occurring protein involved in actin binding and cell migration.',
    regulatoryNote:
      'Not approved by the FDA for any use. Prohibited at all times under the WADA Prohibited List.',
    evidenceTier: 'unrated',
    evidenceNote: 'Not yet reviewed.',
    trialQuery: 'thymosin beta 4',
    literatureQuery: '("thymosin beta 4" OR TB-500 OR "TB 500")',
  },
  {
    id: 'cjc-1295',
    name: 'CJC-1295',
    aliases: ['CJC 1295', 'Modified GRF (1-29)', 'DAC:GRF'],
    className: 'Growth hormone secretagogue',
    description:
      'A synthetic analogue of growth hormone releasing hormone (GHRH) that raises circulating growth hormone and IGF-1.',
    regulatoryNote:
      'Not approved by the FDA for any use. Prohibited at all times under the WADA Prohibited List.',
    evidenceTier: 'unrated',
    evidenceNote: 'Not yet reviewed.',
    trialQuery: 'CJC-1295',
    literatureQuery: '(CJC-1295 OR "CJC 1295" OR "growth hormone releasing hormone analog")',
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    aliases: ['NNC 26-0161'],
    className: 'Growth hormone secretagogue',
    description:
      'A synthetic pentapeptide that binds the growth hormone secretagogue receptor, the same receptor targeted by ghrelin.',
    regulatoryNote:
      'Not approved by the FDA for any use. Prohibited at all times under the WADA Prohibited List.',
    evidenceTier: 'unrated',
    evidenceNote: 'Not yet reviewed.',
    trialQuery: 'ipamorelin',
    literatureQuery: '(ipamorelin)',
  },
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    aliases: ['Ozempic', 'Wegovy', 'Rybelsus'],
    className: 'GLP-1 receptor agonist',
    description:
      'A glucagon-like peptide-1 (GLP-1) receptor agonist.',
    regulatoryNote:
      'FDA approved for type 2 diabetes and for chronic weight management under the brand names Ozempic, Rybelsus and Wegovy. Compounded and research-chemical versions are not the approved product and are not FDA reviewed.',
    evidenceTier: 'unrated',
    evidenceNote: 'Not yet reviewed.',
    trialQuery: 'semaglutide',
    literatureQuery: '(semaglutide)',
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    aliases: ['Mounjaro', 'Zepbound'],
    className: 'Dual GIP / GLP-1 receptor agonist',
    description:
      'A dual agonist at the glucose-dependent insulinotropic polypeptide (GIP) and GLP-1 receptors.',
    regulatoryNote:
      'FDA approved for type 2 diabetes and for chronic weight management under the brand names Mounjaro and Zepbound. Compounded and research-chemical versions are not the approved product and are not FDA reviewed.',
    evidenceTier: 'unrated',
    evidenceNote: 'Not yet reviewed.',
    trialQuery: 'tirzepatide',
    literatureQuery: '(tirzepatide)',
  },
];

export function getPeptide(id: string): Peptide | undefined {
  return peptides.find((p) => p.id === id);
}
