import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

// Type for possible frontmatter values
export type FrontmatterValue = string | number | boolean | string[] | null | undefined

export interface BaseMDXFrontmatter {
  title: string
  description: string
  date: string
  [key: string]: FrontmatterValue | string
}

export interface MDXContent extends BaseMDXFrontmatter {
  slug: string
  content: string
  ogImage?: string
  coverImage?: string
}

export interface MDXOptions {
  directory: string
  addOgImage?: boolean
  fallbackOgImage?: string
}

// Shared constants
export const CONTENT_CONFIG = {
  baseUrl: process.env.SITE_URL || 'https://www.rezailmi.com',
  paths: {
    works: path.join(process.cwd(), '_content/works'),
    notes: path.join(process.cwd(), '_content/notes'),
  },
  staticRoutes: ['', 'about', 'works', 'notes'] as const,
} as const

// Type for content types
export type ContentType = keyof typeof CONTENT_CONFIG.paths

// Core MDX utilities
function getMDXFiles(directory: string): string[] {
  try {
    if (!fs.existsSync(directory)) {
      return []
    }
    return fs.readdirSync(directory).filter((path) => /\.mdx?$/.test(path))
  } catch (error) {
    console.error(`Error reading directory ${directory}:`, error)
    return []
  }
}

function getMDXSlugs(directory: string): string[] {
  return getMDXFiles(directory).map((path) => path.replace(/\.mdx?$/, ''))
}

function parseMDXFile(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    return matter(fileContent)
  } catch (error) {
    console.error(`Error parsing MDX file ${filePath}:`, error)
    throw new Error(`Failed to parse MDX file: ${filePath}`)
  }
}

function extractFirstImage(content: string): string | undefined {
  const imageMatch =
    content.match(/!\[.*?\]\((.*?)\)/) || content.match(/<OGImage.*?src=["'](.*?)["']/)
  return imageMatch ? imageMatch[1] : undefined
}

function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    return 0
  })
}

function getMDXBySlug(slug: string, options: MDXOptions): MDXContent {
  const filePath = path.join(options.directory, `${slug}.mdx`)
  const { data, content } = parseMDXFile(filePath)

  // Handle OG image
  if (options.addOgImage && !data.ogImage) {
    data.ogImage = data.coverImage || extractFirstImage(content) || options.fallbackOgImage
  }

  return {
    ...data,
    slug,
    content,
  } as MDXContent
}

function getAllMDX(options: MDXOptions): MDXContent[] {
  const slugs = getMDXSlugs(options.directory)
  const items = slugs.map((slug) => getMDXBySlug(slug, options))
  return sortByDate(items)
}

// Generic content type functions
function getContentSlugs(type: ContentType): string[] {
  return getMDXSlugs(CONTENT_CONFIG.paths[type])
}

function getContentBySlug(type: ContentType, slug: string): MDXContent {
  return getMDXBySlug(slug, {
    directory: CONTENT_CONFIG.paths[type],
    addOgImage: true,
  })
}

function getAllContent(type: ContentType): MDXContent[] {
  return getAllMDX({
    directory: CONTENT_CONFIG.paths[type],
    addOgImage: true,
  })
}

// Content type definitions and specific functions
export type Note = MDXContent
export type Work = MDXContent

// Works functions
export const getWorkSlugs = () => getContentSlugs('works')
export const getWorkBySlug = (slug: string) => getContentBySlug('works', slug)
export const getAllWorks = () => getAllContent('works')

// Notes functions
export const getNoteSlugs = () => getContentSlugs('notes')
export const getNoteBySlug = (slug: string) => getContentBySlug('notes', slug)
export const getAllNotes = () => getAllContent('notes')

// Sitemap generation function
export function generateSitemapUrls(): string[] {
  const { baseUrl } = CONTENT_CONFIG

  // Generate static routes
  const staticUrls = CONTENT_CONFIG.staticRoutes.map((route) =>
    `${baseUrl}/${route}`.replace(/\/+$/, '')
  )

  // Generate dynamic content routes
  const dynamicUrls = [
    ...getWorkSlugs().map((slug) => `${baseUrl}/works/${slug}`),
    ...getNoteSlugs().map((slug) => `${baseUrl}/notes/${slug}`),
  ]

  return [...staticUrls, ...dynamicUrls]
}
