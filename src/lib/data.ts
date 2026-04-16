import { Category, Product, Vendor } from "./types";

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "ghs",
    slug: "growth-hormone-secretagogues",
    name: "Growth Hormone Secretagogues",
    description: "Peptides that stimulate the natural release of growth hormone",
    icon: "💪",
  },
  {
    id: "healing",
    slug: "healing-peptides",
    name: "BPC & Healing Peptides",
    description: "Tissue repair, injury recovery, and gut-healing peptides",
    icon: "🔬",
  },
  {
    id: "nootropics",
    slug: "nootropic-peptides",
    name: "Nootropic Peptides",
    description: "Cognitive enhancement and neuroprotection peptides",
    icon: "🧠",
  },
  {
    id: "weight",
    slug: "weight-management",
    name: "Weight Management",
    description: "Metabolic and appetite-regulating peptides",
    icon: "⚖️",
  },
  {
    id: "antiaging",
    slug: "anti-aging",
    name: "Anti-Aging & Longevity",
    description: "Peptides targeting cellular aging and longevity pathways",
    icon: "⏳",
  },
  {
    id: "skin",
    slug: "skin-beauty",
    name: "Skin & Beauty",
    description: "Collagen, tanning, and cosmetic peptides",
    icon: "✨",
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────

export const products: Product[] = [
  // Growth Hormone Secretagogues
  {
    id: "ipamorelin",
    name: "Ipamorelin",
    slug: "ipamorelin",
    description:
      "A selective GH secretagogue with a clean side-effect profile. Often stacked with CJC-1295.",
    categorySlug: "growth-hormone-secretagogues",
    vendorIds: ["vendor-ppr", "vendor-stl", "vendor-aa"],
  },
  {
    id: "cjc-1295",
    name: "CJC-1295",
    slug: "cjc-1295",
    description:
      "Long-acting GHRH analogue that elevates baseline GH and IGF-1 levels.",
    categorySlug: "growth-hormone-secretagogues",
    vendorIds: ["vendor-ppr", "vendor-stl", "vendor-llno", "vendor-aa"],
  },
  // Healing Peptides
  {
    id: "bpc-157",
    name: "BPC-157",
    slug: "bpc-157",
    description:
      "Body Protection Compound 157 – accelerates tendon, ligament, and gut healing.",
    categorySlug: "healing-peptides",
    vendorIds: ["vendor-ppr", "vendor-stl", "vendor-llno", "vendor-aa", "vendor-sbio"],
  },
  {
    id: "tb-500",
    name: "TB-500 (Thymosin Beta-4)",
    slug: "tb-500",
    description:
      "Promotes angiogenesis and cell migration to speed recovery from injury.",
    categorySlug: "healing-peptides",
    vendorIds: ["vendor-ppr", "vendor-stl", "vendor-aa"],
  },
  // Nootropic Peptides
  {
    id: "semax",
    name: "Semax",
    slug: "semax",
    description:
      "ACTH-derived nootropic peptide shown to improve focus, memory, and BDNF levels.",
    categorySlug: "nootropic-peptides",
    vendorIds: ["vendor-llno", "vendor-sbio"],
  },
  {
    id: "selank",
    name: "Selank",
    slug: "selank",
    description:
      "Anxiolytic peptide that modulates GABA and improves stress resilience.",
    categorySlug: "nootropic-peptides",
    vendorIds: ["vendor-llno", "vendor-sbio"],
  },
  // Weight Management
  {
    id: "aod-9604",
    name: "AOD-9604",
    slug: "aod-9604",
    description:
      "C-terminal fragment of hGH that stimulates fat breakdown without affecting IGF-1.",
    categorySlug: "weight-management",
    vendorIds: ["vendor-ppr", "vendor-stl", "vendor-aa"],
  },
  // Anti-Aging
  {
    id: "epithalon",
    name: "Epithalon",
    slug: "epithalon",
    description:
      "Tetrapeptide that activates telomerase and regulates pineal melatonin secretion.",
    categorySlug: "anti-aging",
    vendorIds: ["vendor-llno", "vendor-sbio"],
  },
  // Skin & Beauty
  {
    id: "ghk-cu",
    name: "GHK-Cu",
    slug: "ghk-cu",
    description:
      "Copper peptide that boosts collagen synthesis and has wound-healing properties.",
    categorySlug: "skin-beauty",
    vendorIds: ["vendor-ppr", "vendor-llno"],
  },
];

// ─── Vendors ──────────────────────────────────────────────────────────────────

export const vendors: Vendor[] = [
  {
    id: "vendor-ppr",
    name: "Paradigm Peptides",
    slug: "paradigm-peptides",
    description:
      "US-based supplier with an extensive catalog, third-party CoA testing, and fast domestic shipping.",
    website: "https://paradigmpeptides.com",
    established: 2014,
    location: "United States",
    productIds: ["ipamorelin", "cjc-1295", "bpc-157", "tb-500", "aod-9604", "ghk-cu"],
    tags: ["US-based", "3rd-party tested", "Fast shipping", "Large catalog"],
    redditThreadId: undefined, // Set after creating a thread in r/peptidemarket
    metrics: {
      overallRating: 4.5,
      totalReviews: 312,
      labTesting: "Third-party",
      shipping: "US Domestic",
      purity: "98%+",
      responseTime: "< 24 hours",
    },
  },
  {
    id: "vendor-stl",
    name: "Sports Technology Labs",
    slug: "sports-technology-labs",
    description:
      "Research-grade peptides and SARMs with published third-party certificates of analysis.",
    website: "https://www.sportstechnologylabs.com",
    established: 2019,
    location: "United States",
    productIds: ["ipamorelin", "cjc-1295", "bpc-157", "tb-500", "aod-9604"],
    tags: ["US-based", "COA published", "HPLC verified"],
    redditThreadId: undefined,
    metrics: {
      overallRating: 4.7,
      totalReviews: 198,
      labTesting: "Third-party",
      shipping: "US Domestic",
      purity: "99%+",
      responseTime: "< 12 hours",
    },
  },
  {
    id: "vendor-llno",
    name: "Limitless Life Nootropics",
    slug: "limitless-life-nootropics",
    description:
      "Specialises in hard-to-find nootropic peptides, nasal sprays, and international shipping.",
    website: "https://limitlesslifenootropics.com",
    established: 2017,
    location: "United States",
    productIds: ["cjc-1295", "bpc-157", "semax", "selank", "epithalon", "ghk-cu"],
    tags: ["Nootropic specialist", "Nasal sprays", "International shipping"],
    redditThreadId: undefined,
    metrics: {
      overallRating: 4.3,
      totalReviews: 145,
      labTesting: "Third-party",
      shipping: "Both",
      purity: "98%+",
      responseTime: "< 48 hours",
    },
  },
  {
    id: "vendor-aa",
    name: "Amino Asylum",
    slug: "amino-asylum",
    description:
      "Budget-friendly peptides and SARMs aimed at the research community.",
    website: "https://aminoasylum.shop",
    established: 2018,
    location: "United States",
    productIds: ["ipamorelin", "cjc-1295", "bpc-157", "tb-500", "aod-9604"],
    tags: ["Budget-friendly", "US-based", "Fast dispatch"],
    redditThreadId: undefined,
    metrics: {
      overallRating: 3.9,
      totalReviews: 287,
      labTesting: "In-house",
      shipping: "US Domestic",
      purity: "97%+",
      responseTime: "< 24 hours",
    },
  },
  {
    id: "vendor-sbio",
    name: "Science.bio",
    slug: "science-bio",
    description:
      "Science-focused supplier offering full-panel CoA reports and a wide range of peptides.",
    website: "https://science.bio",
    established: 2020,
    location: "United States",
    productIds: ["bpc-157", "semax", "selank", "epithalon"],
    tags: ["Full CoA", "HPLC + NMR", "Research focused"],
    redditThreadId: undefined,
    metrics: {
      overallRating: 4.6,
      totalReviews: 221,
      labTesting: "Third-party",
      shipping: "Both",
      purity: "99%+",
      responseTime: "< 24 hours",
    },
  },
];

// ─── Lookup helpers ───────────────────────────────────────────────────────────

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getVendorById(id: string): Vendor | undefined {
  return vendors.find((v) => v.id === id);
}

export function getVendorBySlug(slug: string): Vendor | undefined {
  return vendors.find((v) => v.slug === slug);
}

export function getProductsByVendor(vendorId: string): Product[] {
  return products.filter((p) => p.vendorIds.includes(vendorId));
}
