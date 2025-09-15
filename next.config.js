/** @type {import('next').NextConfig} */
// const nextConfig = {};
// module.exports = nextConfig;

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
})

const isProd = process.env.NODE_ENV === 'production'
const repoName = 'eas-system'
const repoPath = isProd ? `/${repoName}` : ''
// const repoPath = ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: repoPath,
  assetPrefix: repoPath,
  trailingSlash: true,
}

module.exports = {...withPWA(nextConfig)}