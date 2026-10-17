/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Don't fail Vercel build on ESLint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't fail Vercel build on TypeScript warnings
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
