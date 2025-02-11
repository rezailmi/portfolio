import fs from 'fs'
import matter from 'gray-matter'

// Type for possible frontmatter values
export type FrontmatterValue = string | number | boolean | string[] | null | undefined

export interface BaseMDXFrontmatter {
  title: string
  description: string
  date: string
  [key: string]: FrontmatterValue | string
}

export function getMDXFiles(directory: string): string[] {
  if (!fs.existsSync(directory)) {
    return []
  }
  return fs.readdirSync(directory).filter((path) => /\.mdx?$/.test(path))
}

export function getMDXSlugs(directory: string): string[] {
  return getMDXFiles(directory).map((path) => path.replace(/\.mdx?$/, ''))
}

export function parseMDXFile(filePath: string) {
  const fileContent = fs.readFileSync(filePath, 'utf8')
  return matter(fileContent)
}

export function extractFirstImage(content: string): string | undefined {
  const imageMatch =
    content.match(/!\[.*?\]\((.*?)\)/) || content.match(/<OGImage.*?src=["'](.*?)["']/)
  return imageMatch ? imageMatch[1] : undefined
}

export function sortByDate<T extends { date: string }>(items: T[]): T[] {
  return items.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    return 0
  })
}
