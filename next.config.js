/** @type {import('next').NextConfig} */
// const nextConfig = {};
// module.exports = nextConfig;

const withPWA = require('next-pwa')({
	dest: 'public',
	register: true,
	skipWaiting: true,
    // disableMiddleware: true,
})

const isProd = process.env.NODE_ENV === 'production'
const repoName = 'next-pwa' // CHANGE THIS

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  trailingSlash: true,
}

module.exports = {...withPWA(nextConfig)}
