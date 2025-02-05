import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_PATH = path.join(process.cwd(), 'posts')

export interface PostMeta {
  title: string
  date: string
  description: string
  slug: string
  [key: string]: any
}

export interface Post extends PostMeta {
  content: string
}

export function getPostSlugs(): string[] {
  return fs
    .readdirSync(POSTS_PATH)
    .filter((path) => /\.mdx?$/.test(path))
    .map((path) => path.replace(/\.mdx?$/, ''))
}

export function getPostBySlug(slug: string): Post {
  const filePath = path.join(POSTS_PATH, `${slug}.mdx`)
  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)
  
  return {
    ...data,
    slug,
    content,
  } as Post
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs()
  const posts = slugs.map((slug) => getPostBySlug(slug))
  
  return posts.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    return 0
  })
} 