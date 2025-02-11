import path from 'path'
import {
  BaseMDXFrontmatter,
  getMDXSlugs,
  parseMDXFile,
  extractFirstImage,
  sortByDate,
} from './mdx-utils'

const NOTES_PATH = path.join(process.cwd(), 'posts')

export interface NoteMeta extends BaseMDXFrontmatter {
  slug: string
  ogImage?: string
  coverImage?: string
}

export interface Note extends NoteMeta {
  content: string
}

export function getNoteSlugs(): string[] {
  return getMDXSlugs(NOTES_PATH)
}

export function getNoteBySlug(slug: string): Note {
  const filePath = path.join(NOTES_PATH, `${slug}.mdx`)
  const { data, content } = parseMDXFile(filePath)

  // Extract the first image from the content if no ogImage is specified
  if (!data.ogImage) {
    data.ogImage = extractFirstImage(content)
  }

  return {
    ...data,
    slug,
    content,
  } as Note
}

export function getAllNotes(): Note[] {
  const slugs = getNoteSlugs()
  const notes = slugs.map((slug) => getNoteBySlug(slug))
  return sortByDate(notes)
}
