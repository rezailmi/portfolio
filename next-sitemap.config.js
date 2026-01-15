// @ts-check
import { readdirSync, existsSync } from 'fs'
import { join } from 'path'

const BASE_URL = process.env.SITE_URL || 'https://www.rezailmi.com'
const CONTENT_DIR = process.cwd()

function getMDXSlugs(directory) {
  try {
    if (!existsSync(directory)) {
      return []
    }
    return readdirSync(directory)
      .filter((file) => /\.mdx?$/.test(file))
      .map((file) => file.replace(/\.mdx?$/, ''))
  } catch {
    return []
  }
}

function generateSitemapUrls() {
  const staticRoutes = ['', 'about', 'works', 'notes']
  const staticUrls = staticRoutes.map((route) =>
    `${BASE_URL}/${route}`.replace(/\/+$/, '')
  )

  const worksDir = join(CONTENT_DIR, '_content/works')
  const notesDir = join(CONTENT_DIR, '_content/notes')

  const dynamicUrls = [
    ...getMDXSlugs(worksDir).map((slug) => `${BASE_URL}/works/${slug}`),
    ...getMDXSlugs(notesDir).map((slug) => `${BASE_URL}/notes/${slug}`),
  ]

  return [...staticUrls, ...dynamicUrls]
}

function getUrlPriority(url) {
  if (url === BASE_URL) return 1.0
  if (url.endsWith('/about')) return 0.9
  if (url === `${BASE_URL}/works` || url === `${BASE_URL}/notes`) return 0.8
  return 0.7
}

/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: BASE_URL,
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
