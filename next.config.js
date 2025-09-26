/** @type {import('next').NextConfig} */
// const nextConfig = {};
// module.exports = nextConfig;

const isProd = process.env.NODE_ENV === 'production'
const repoName = 'eas-system-frontend'

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
  skipWaiting: true,  // activates new SW immediately
  clientsClaim: true, // takes control of uncontrolled clients
  disable: !isProd,  // disable PWA in dev mode and during static export
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
  images: {
    unoptimized: true, // required for static export
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables lint during build
  },
}

module.exports = {...withPWA(nextConfig)}
