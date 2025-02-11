import path from 'path'
import { BaseMDXFrontmatter, getMDXSlugs, parseMDXFile, sortByDate } from './mdx-utils'

const WORKS_PATH = path.join(process.cwd(), 'works')

export interface WorkFrontmatter extends BaseMDXFrontmatter {
  coverImage: string
  images?: string[]
  tags?: string[]
  featured?: boolean
}

export interface Work extends WorkFrontmatter {
  slug: string
  content: string
}

export function getWorkSlugs(): string[] {
  return getMDXSlugs(WORKS_PATH)
}

export function getWorkBySlug(slug: string): Work {
  const filePath = path.join(WORKS_PATH, `${slug}.mdx`)
  const { data, content } = parseMDXFile(filePath)

  return {
    ...data,
    slug,
    content,
  } as Work
}

export function getAllWorks(): Work[] {
  const slugs = getWorkSlugs()
  const works = slugs.map((slug) => getWorkBySlug(slug))
  return sortByDate(works)
}

export function getFeaturedWorks(): Work[] {
  return getAllWorks().filter((work) => work.featured)
}
