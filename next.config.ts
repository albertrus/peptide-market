import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { NextConfig } from 'next';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    /*
     * Pin the workspace root. There is a package-lock.json in the parent
     * directory on this machine, and Turbopack's automatic detection walks up
     * and picks that one, which makes it watch an entire home directory and
     * warn on every build.
     */
    root: projectRoot,
  },
  async redirects() {
    return [
      // The site moved from product-first to condition-first, so /products is
      // gone. Anything already pointing at it lands on the peptide it meant.
      { source: '/products', destination: '/peptides', permanent: true },
      { source: '/products/:id', destination: '/peptides/:id', permanent: true },
      // Saving generalised from vendors to trials and papers.
      { source: '/favorites', destination: '/saved', permanent: true },
    ];
  },
};

export default nextConfig;
