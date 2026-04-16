export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  url: string;
  description: string;
  rating: number;
  reviewCount: number;
}

export interface VendorProduct {
  vendorId: string;
  productId: string;
  price: number;
  purity: string;
  inStock: boolean;
  quantity: string;
}

export const products: Product[] = [
  {
    id: 'bpc-157',
    name: 'BPC-157',
    description: 'Body Protection Compound-157. A pentadecapeptide known for its regenerative properties and gut health benefits.',
    category: 'Research Peptide',
  },
  {
    id: 'tb-500',
    name: 'TB-500',
    description: 'Thymosin Beta-4. Supports tissue repair, reduces inflammation, and promotes cell migration.',
    category: 'Research Peptide',
  },
  {
    id: 'cjc-1295',
    name: 'CJC-1295',
    description: 'A growth hormone releasing hormone analogue that increases plasma growth hormone levels.',
    category: 'Growth Hormone Peptide',
  },
  {
    id: 'ipamorelin',
    name: 'Ipamorelin',
    description: 'A selective growth hormone secretagogue and ghrelin mimetic with minimal side effects.',
    category: 'Growth Hormone Peptide',
  },
  {
    id: 'semaglutide',
    name: 'Semaglutide',
    description: 'A GLP-1 receptor agonist used for blood sugar control and weight management research.',
    category: 'Metabolic Peptide',
  },
  {
    id: 'tirzepatide',
    name: 'Tirzepatide',
    description: 'A dual GIP and GLP-1 receptor agonist being studied for obesity and type 2 diabetes.',
    category: 'Metabolic Peptide',
  },
];

export const vendors: Vendor[] = [
  {
    id: 'peptide-sciences',
    name: 'Peptide Sciences',
    url: 'https://www.peptidesciences.com',
    description: 'One of the most reputable peptide suppliers with rigorous third-party testing and excellent purity standards.',
    rating: 4.8,
    reviewCount: 1243,
  },
  {
    id: 'swiss-chems',
    name: 'Swiss Chems',
    url: 'https://swisschems.is',
    description: 'Swiss Chems offers a wide range of research peptides with competitive pricing and fast shipping.',
    rating: 4.5,
    reviewCount: 876,
  },
  {
    id: 'amino-asylum',
    name: 'Amino Asylum',
    url: 'https://aminoasylum.shop',
    description: 'Popular among researchers for their broad catalog and reasonable prices. Offers injectable and oral formats.',
    rating: 4.3,
    reviewCount: 654,
  },
  {
    id: 'limitless-life',
    name: 'Limitless Life Nootropics',
    url: 'https://limitlesslifenootropics.com',
    description: 'Specializes in nootropics and peptides with a focus on quality control and customer service.',
    rating: 4.6,
    reviewCount: 432,
  },
  {
    id: 'research-peptides',
    name: 'ResearchPeptides.net',
    url: 'https://researchpeptides.net',
    description: 'European-based supplier known for high purity peptides and discreet international shipping.',
    rating: 4.4,
    reviewCount: 321,
  },
  {
    id: 'core-peptides',
    name: 'Core Peptides',
    url: 'https://corepeptides.com',
    description: 'US-based supplier with a strong reputation for quality and reliable stock availability.',
    rating: 4.7,
    reviewCount: 567,
  },
  {
    id: 'biotech-peptides',
    name: 'Biotech Peptides',
    url: 'https://biotechpeptides.com',
    description: 'Dedicated to providing high-quality research chemicals and peptides for scientific purposes.',
    rating: 4.2,
    reviewCount: 289,
  },
];

export const vendorProducts: VendorProduct[] = [
  // BPC-157
  { vendorId: 'peptide-sciences', productId: 'bpc-157', price: 42.50, purity: '99%+', inStock: true, quantity: '5mg' },
  { vendorId: 'swiss-chems', productId: 'bpc-157', price: 38.00, purity: '98%+', inStock: true, quantity: '5mg' },
  { vendorId: 'amino-asylum', productId: 'bpc-157', price: 29.99, purity: '97%+', inStock: true, quantity: '5mg' },
  { vendorId: 'core-peptides', productId: 'bpc-157', price: 44.00, purity: '99%+', inStock: false, quantity: '5mg' },
  { vendorId: 'biotech-peptides', productId: 'bpc-157', price: 35.00, purity: '98%+', inStock: true, quantity: '5mg' },
  // TB-500
  { vendorId: 'peptide-sciences', productId: 'tb-500', price: 55.00, purity: '99%+', inStock: true, quantity: '5mg' },
  { vendorId: 'swiss-chems', productId: 'tb-500', price: 49.00, purity: '98%+', inStock: true, quantity: '5mg' },
  { vendorId: 'amino-asylum', productId: 'tb-500', price: 39.99, purity: '97%+', inStock: false, quantity: '5mg' },
  { vendorId: 'limitless-life', productId: 'tb-500', price: 52.00, purity: '98%+', inStock: true, quantity: '5mg' },
  { vendorId: 'core-peptides', productId: 'tb-500', price: 57.00, purity: '99%+', inStock: true, quantity: '5mg' },
  // CJC-1295
  { vendorId: 'peptide-sciences', productId: 'cjc-1295', price: 38.00, purity: '99%+', inStock: true, quantity: '2mg' },
  { vendorId: 'swiss-chems', productId: 'cjc-1295', price: 34.00, purity: '98%+', inStock: true, quantity: '2mg' },
  { vendorId: 'research-peptides', productId: 'cjc-1295', price: 31.00, purity: '98%+', inStock: true, quantity: '2mg' },
  { vendorId: 'biotech-peptides', productId: 'cjc-1295', price: 36.00, purity: '97%+', inStock: true, quantity: '2mg' },
  // Ipamorelin
  { vendorId: 'peptide-sciences', productId: 'ipamorelin', price: 32.00, purity: '99%+', inStock: true, quantity: '2mg' },
  { vendorId: 'amino-asylum', productId: 'ipamorelin', price: 24.99, purity: '97%+', inStock: true, quantity: '2mg' },
  { vendorId: 'limitless-life', productId: 'ipamorelin', price: 35.00, purity: '98%+', inStock: true, quantity: '2mg' },
  { vendorId: 'core-peptides', productId: 'ipamorelin', price: 33.00, purity: '99%+', inStock: false, quantity: '2mg' },
  { vendorId: 'research-peptides', productId: 'ipamorelin', price: 29.00, purity: '98%+', inStock: true, quantity: '2mg' },
  // Semaglutide
  { vendorId: 'peptide-sciences', productId: 'semaglutide', price: 89.00, purity: '99%+', inStock: true, quantity: '2mg' },
  { vendorId: 'swiss-chems', productId: 'semaglutide', price: 79.00, purity: '98%+', inStock: true, quantity: '2mg' },
  { vendorId: 'amino-asylum', productId: 'semaglutide', price: 65.00, purity: '97%+', inStock: true, quantity: '2mg' },
  { vendorId: 'core-peptides', productId: 'semaglutide', price: 92.00, purity: '99%+', inStock: true, quantity: '2mg' },
  // Tirzepatide
  { vendorId: 'peptide-sciences', productId: 'tirzepatide', price: 110.00, purity: '99%+', inStock: true, quantity: '5mg' },
  { vendorId: 'swiss-chems', productId: 'tirzepatide', price: 98.00, purity: '98%+', inStock: false, quantity: '5mg' },
  { vendorId: 'limitless-life', productId: 'tirzepatide', price: 105.00, purity: '98%+', inStock: true, quantity: '5mg' },
  { vendorId: 'biotech-peptides', productId: 'tirzepatide', price: 95.00, purity: '97%+', inStock: true, quantity: '5mg' },
];
