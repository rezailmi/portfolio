/**
 * Install shadcn-cssinjs registry items without CLI namespace resolution issues.
 * registryDependencies are resolved against shadcn-cssinjs.com only.
 */
import { writeFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const REGISTRY_BASE = 'https://www.shadcn-cssinjs.com/r'
const ROOT = path.resolve(import.meta.dirname, '..')

const COMPONENTS = [
  'accordion',
  'alert-dialog',
  'avatar',
  'breadcrumb',
  'button',
  'card',
  'checkbox',
  'collapsible',
  'dialog',
  'dropdown-menu',
  'hover-card',
  'input',
  'label',
  'popover',
  'progress',
  'radio-group',
  'scroll-area',
  'separator',
  'sheet',
  'sidebar',
  'skeleton',
  'slider',
  'switch',
  'tabs',
  'toggle',
  'toggle-group',
  'tooltip',
]

const installed = new Set()

async function fetchItem(name) {
  if (installed.has(name)) return
  const url = `${REGISTRY_BASE}/${name}.json`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const item = await res.json()
  installed.add(name)

  for (const dep of item.registryDependencies ?? []) {
    await fetchItem(dep)
  }

  for (const file of item.files ?? []) {
    const target = path.join(ROOT, file.target)
    await mkdir(path.dirname(target), { recursive: true })
    await writeFile(target, file.content, 'utf8')
    console.log(`wrote ${file.target}`)
  }
}

for (const name of COMPONENTS) {
  console.log(`installing ${name}...`)
  await fetchItem(name)
}

console.log('done')
