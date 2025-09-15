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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
}

module.exports = {...withPWA(nextConfig)}