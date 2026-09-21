/**
 * Vendor directory.
 *
 * Two deliberate changes from the original data set, both noted in NOTES.md:
 *
 * 1. The invented `rating` / `reviewCount` fields are gone. The site had never
 *    collected a review, so displaying "4.8 (1243 reviews)" was fabricated
 *    social proof. On a health-adjacent site that carries affiliate links that
 *    is a real problem, not a cosmetic one.
 * 2. Vendor blurbs no longer assert quality ("most reputable", "rigorous
 *    third-party testing"). They describe what a vendor says about itself, and
 *    the UI labels it that way.
 *
 * Listing prices are placeholder figures carried over from the original repo.
 * `PRICING_IS_PLACEHOLDER` below drives a visible banner wherever they appear.
 */

export interface Vendor {
  id: string;
  name: string;
  url: string;
  /** Neutral description. Self-descriptions must be attributed, not asserted. */
  description: string;
  /** Where the vendor ships from, if stated publicly. */
  basedIn: string | null;
  /** True when Albert has, or plans to have, an affiliate relationship. */
  affiliate: boolean;
}

export interface VendorListing {
  vendorId: string;
  peptideId: string;
  price: number;
  purity: string;
  inStock: boolean;
  quantity: string;
}

/**
 * Listing figures below were hand-entered in the original repo and have never
 * been verified against a live vendor page. Until a real feed or a dated
 * manual check exists, the UI has to say so.
 */
export const PRICING_IS_PLACEHOLDER = true;

/**
 * TODO(albert): confirm which of these you actually hold an affiliate
 * relationship with. The FTC disclosure and the per-row "affiliate link" marker
 * both read from this flag, so a wrong value here is a compliance problem.
 */
export const vendors: Vendor[] = [
  {
    id: 'peptide-sciences',
    name: 'Peptide Sciences',
    url: 'https://www.peptidesciences.com',
    description:
      'US supplier. States that it publishes third-party mass spectrometry and HPLC reports for its catalogue.',
    basedIn: 'United States',
    affiliate: false,
  },
  {
    id: 'swiss-chems',
    name: 'Swiss Chems',
    url: 'https://swisschems.is',
    description:
      'Supplier with a broad research-chemical catalogue. States that it publishes certificates of analysis per batch.',
    basedIn: 'United States',
    affiliate: false,
  },
  {
    id: 'amino-asylum',
    name: 'Amino Asylum',
    url: 'https://aminoasylum.shop',
    description:
      'Supplier offering research peptides in several formats. Lower list prices than most of the directory.',
    basedIn: 'United States',
    affiliate: false,
  },
  {
    id: 'limitless-life',
    name: 'Limitless Life Nootropics',
    url: 'https://limitlesslifenootropics.com',
    description: 'Supplier carrying both nootropics and research peptides.',
    basedIn: 'United States',
    affiliate: false,
  },
  {
    id: 'research-peptides',
    name: 'ResearchPeptides.net',
    url: 'https://researchpeptides.net',
    description: 'European supplier shipping internationally.',
    basedIn: 'Europe',
    affiliate: false,
  },
  {
    id: 'core-peptides',
    name: 'Core Peptides',
    url: 'https://corepeptides.com',
    description: 'US supplier. States that each batch is third-party tested.',
    basedIn: 'United States',
    affiliate: false,
  },
  {
    id: 'biotech-peptides',
    name: 'Biotech Peptides',
    url: 'https://biotechpeptides.com',
    description: 'US supplier of research peptides and related reagents.',
    basedIn: 'United States',
    affiliate: false,
  },
];

export const vendorListings: VendorListing[] = [
  // BPC-157
  { vendorId: 'peptide-sciences', peptideId: 'bpc-157', price: 42.5, purity: '99%+', inStock: true, quantity: '5mg' },
  { vendorId: 'swiss-chems', peptideId: 'bpc-157', price: 38.0, purity: '98%+', inStock: true, quantity: '5mg' },
  { vendorId: 'amino-asylum', peptideId: 'bpc-157', price: 29.99, purity: '97%+', inStock: true, quantity: '5mg' },
  { vendorId: 'core-peptides', peptideId: 'bpc-157', price: 44.0, purity: '99%+', inStock: false, quantity: '5mg' },
  { vendorId: 'biotech-peptides', peptideId: 'bpc-157', price: 35.0, purity: '98%+', inStock: true, quantity: '5mg' },
  // TB-500
  { vendorId: 'peptide-sciences', peptideId: 'tb-500', price: 55.0, purity: '99%+', inStock: true, quantity: '5mg' },
  { vendorId: 'swiss-chems', peptideId: 'tb-500', price: 49.0, purity: '98%+', inStock: true, quantity: '5mg' },
  { vendorId: 'amino-asylum', peptideId: 'tb-500', price: 39.99, purity: '97%+', inStock: false, quantity: '5mg' },
  { vendorId: 'limitless-life', peptideId: 'tb-500', price: 52.0, purity: '98%+', inStock: true, quantity: '5mg' },
  { vendorId: 'core-peptides', peptideId: 'tb-500', price: 57.0, purity: '99%+', inStock: true, quantity: '5mg' },
  // CJC-1295
  { vendorId: 'peptide-sciences', peptideId: 'cjc-1295', price: 38.0, purity: '99%+', inStock: true, quantity: '2mg' },
  { vendorId: 'swiss-chems', peptideId: 'cjc-1295', price: 34.0, purity: '98%+', inStock: true, quantity: '2mg' },
  { vendorId: 'research-peptides', peptideId: 'cjc-1295', price: 31.0, purity: '98%+', inStock: true, quantity: '2mg' },
  { vendorId: 'biotech-peptides', peptideId: 'cjc-1295', price: 36.0, purity: '97%+', inStock: true, quantity: '2mg' },
  // Ipamorelin
  { vendorId: 'peptide-sciences', peptideId: 'ipamorelin', price: 32.0, purity: '99%+', inStock: true, quantity: '2mg' },
  { vendorId: 'amino-asylum', peptideId: 'ipamorelin', price: 24.99, purity: '97%+', inStock: true, quantity: '2mg' },
  { vendorId: 'limitless-life', peptideId: 'ipamorelin', price: 35.0, purity: '98%+', inStock: true, quantity: '2mg' },
  { vendorId: 'core-peptides', peptideId: 'ipamorelin', price: 33.0, purity: '99%+', inStock: false, quantity: '2mg' },
  { vendorId: 'research-peptides', peptideId: 'ipamorelin', price: 29.0, purity: '98%+', inStock: true, quantity: '2mg' },
  // Semaglutide
  { vendorId: 'peptide-sciences', peptideId: 'semaglutide', price: 89.0, purity: '99%+', inStock: true, quantity: '2mg' },
  { vendorId: 'swiss-chems', peptideId: 'semaglutide', price: 79.0, purity: '98%+', inStock: true, quantity: '2mg' },
  { vendorId: 'amino-asylum', peptideId: 'semaglutide', price: 65.0, purity: '97%+', inStock: true, quantity: '2mg' },
  { vendorId: 'core-peptides', peptideId: 'semaglutide', price: 92.0, purity: '99%+', inStock: true, quantity: '2mg' },
  // Tirzepatide
  { vendorId: 'peptide-sciences', peptideId: 'tirzepatide', price: 110.0, purity: '99%+', inStock: true, quantity: '5mg' },
  { vendorId: 'swiss-chems', peptideId: 'tirzepatide', price: 98.0, purity: '98%+', inStock: false, quantity: '5mg' },
  { vendorId: 'limitless-life', peptideId: 'tirzepatide', price: 105.0, purity: '98%+', inStock: true, quantity: '5mg' },
  { vendorId: 'biotech-peptides', peptideId: 'tirzepatide', price: 95.0, purity: '97%+', inStock: true, quantity: '5mg' },
];

export function getVendor(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}

export function listingsForPeptide(peptideId: string): VendorListing[] {
  return vendorListings.filter((l) => l.peptideId === peptideId);
}

export const hasAffiliateRelationships = vendors.some((v) => v.affiliate);
