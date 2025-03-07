// @ts-check
import { generateSitemapUrls, CONTENT_CONFIG } from './lib/content.ts'

function getUrlPriority(url) {
  if (url === CONTENT_CONFIG.baseUrl) return 1.0 // homepage
  if (url.endsWith('/about')) return 0.9 // about page
  if (url === `${CONTENT_CONFIG.baseUrl}/works` || url === `${CONTENT_CONFIG.baseUrl}/notes`)
    return 0.8 // main listing pages
  return 0.7 // individual content pages
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: CONTENT_CONFIG.baseUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  additionalPaths: async () => {
    const urls = generateSitemapUrls()
    return urls.map((url) => ({
      loc: url,
      changefreq: 'monthly',
      priority: getUrlPriority(url),
    }))
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  outDir: 'public',
}

export default config
