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

// Path constants
const WORKS_PATH = path.join(process.cwd(), '_content/works')
const NOTES_PATH = path.join(process.cwd(), '_content/notes')

// Core MDX utilities
function getMDXFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return []
  }
  return fs.readdirSync(directory).filter((path) => /\.mdx?$/.test(path))
}

function getMDXSlugs(directory: string): string[] {
  return getMDXFiles(directory).map((path) => path.replace(/\.mdx?$/, ''))
}

function parseMDXFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  return matter(fileContent)
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

// Content type definitions
export type Note = MDXContent
export type Work = MDXContent

// Works functions
export function getWorkSlugs(): string[] {
  return getMDXSlugs(WORKS_PATH)
}

export function getWorkBySlug(slug: string): Work {
  return getMDXBySlug(slug, {
    directory: WORKS_PATH,
    addOgImage: true,
  })
}

export function getAllWorks(): Work[] {
  return getAllMDX({
    directory: WORKS_PATH,
    addOgImage: true,
  })
}

// Notes functions
export function getNoteSlugs(): string[] {
  return getMDXSlugs(NOTES_PATH)
}

export function getNoteBySlug(slug: string): Note {
  return getMDXBySlug(slug, {
    directory: NOTES_PATH,
    addOgImage: true,
  })
}

export function getAllNotes(): Note[] {
  return getAllMDX({
    directory: NOTES_PATH,
    addOgImage: true,
  })
}
