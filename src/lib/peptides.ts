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
   * REQUIRED. See src/lib/evidence.ts and the methodology note below. The type
   * forces a value, so a new peptide cannot ship without the call being made;
   * 'unrated' is the honest answer until somebody has actually looked.
   */
  evidenceTier: EvidenceTier;
  /** Free-text note shown under the badge explaining the current rating. */
  evidenceNote: string;
  /**
   * Shown directly above the research panels when the trials and literature
   * the site surfaces do not straightforwardly describe the thing people buy.
   *
   * This exists because of TB-500: the registered Phase 2 and Phase 3 trials
   * are of full-length thymosin beta-4, a different molecule from the fragment
   * sold as a research chemical. Showing those trials without saying so would
   * be the single most misleading thing on the site.
   */
  researchCaveat?: string;
  /** Term used against ClinicalTrials.gov `query.intr`. */
  trialQuery: string;
  /** Term used against PubMed. Parenthesised OR of the names that index well. */
  literatureQuery: string;
}

/**
 * Evidence tiers were assigned in September 2026 against the tier definitions
 * in src/lib/evidence.ts, using counts pulled from the same two APIs the site
 * queries: registered trials and their status from ClinicalTrials.gov, and
 * publication-type counts from PubMed.
 *
 * The test applied for 'human-trial' was a COMPLETED registered controlled
 * trial in people. A registration on its own is a statement of intent, not a
 * result, so compounds whose only trials are registered but unreported sit at
 * 'small-human-study'. That is the distinction that separates ipamorelin, whose
 * placebo-controlled Phase 2 trials completed, from BPC-157, whose trials are
 * recruiting and have published nothing.
 *
 * Counts in each note are from that September 2026 pull and will drift. The
 * tiers are a judgement about a body of evidence and should be revisited, not
 * treated as permanent. See NOTES.md.
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
    evidenceTier: 'small-human-study',
    evidenceNote:
      'No controlled trial in people has published a result. The indexed literature is dominated by animal work: of 230 papers, 109 are animal-only and none are tagged as a clinical trial. Two trials are registered and active as of September 2026, a Phase 2 in hamstring strain and a Phase 1 in rotator cuff repair, and neither has reported. The human papers that do exist are small and uncontrolled.',
    researchCaveat:
      'Much of what is written about BPC-157 online generalises from rat studies. When you read the literature below, check whether a paper is in animals before drawing anything from it.',
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
    evidenceTier: 'small-human-study',
    evidenceNote:
      'Searched strictly, TB-500 itself has 28 indexed papers and one tagged as a trial. The Phase 2 and Phase 3 studies listed below are of full-length thymosin beta-4, which is a different molecule. See the caveat above the research sections.',
    researchCaveat:
      'The registered trials below study full-length thymosin beta-4, mostly as an eye drop (RGN-259) or for wound healing, not the TB-500 fragment sold as a research chemical. They are shown because they are the relevant science, but they are not evidence about TB-500. Treating the two as interchangeable is the most common overstatement made about this compound.',
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
    evidenceTier: 'small-human-study',
    evidenceNote:
      'Two small human studies are published, the principal one from 2006. The only registered trial, a Phase 2 in HIV-associated visceral obesity, was terminated. The whole indexed literature is 33 papers.',
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
    evidenceTier: 'human-trial',
    evidenceNote:
      'Two placebo-controlled Phase 2 trials in post-operative ileus were completed. The programme did not advance past them, and the total literature is small at 54 indexed papers, 20 of them animal-only. This tier reflects that real controlled trials were run and finished, not that they succeeded.',
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
    evidenceTier: 'human-trial',
    evidenceNote:
      'A large Phase 3 programme: 26 Phase 3 trials registered and more than 300 randomised controlled trials indexed. FDA approved for type 2 diabetes and weight management.',
    researchCaveat:
      'Almost all of the trials and papers below are in type 2 diabetes and obesity. Very little of it addresses endometriosis or autoimmune conditions directly, so read what a study actually measured before drawing anything from it. The approved product is also not the same thing as a compounded or research-chemical version.',
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
    evidenceTier: 'human-trial',
    evidenceNote:
      'A large Phase 3 programme: 17 Phase 3 trials registered and more than 130 randomised controlled trials indexed. FDA approved for type 2 diabetes and weight management.',
    researchCaveat:
      'Almost all of the trials and papers below are in type 2 diabetes and obesity. Very little of it addresses endometriosis or autoimmune conditions directly, so read what a study actually measured before drawing anything from it. The approved product is also not the same thing as a compounded or research-chemical version.',
    trialQuery: 'tirzepatide',
    literatureQuery: '(tirzepatide)',
  },
];

export function getPeptide(id: string): Peptide | undefined {
  return peptides.find((p) => p.id === id);
}
