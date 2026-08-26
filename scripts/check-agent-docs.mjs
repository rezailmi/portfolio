/**
 * Fail when agent-facing StyleX rules drift back to Tailwind-era files.
 * Invariants live here so AGENTS.md does not restate them in five places.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')

function read(relPath) {
  return readFileSync(path.join(ROOT, relPath), 'utf8')
}

function walk(relDir, files = []) {
  const abs = path.join(ROOT, relDir)
  if (!existsSync(abs)) return files
  for (const name of readdirSync(abs)) {
    const rel = path.join(relDir, name)
    const absFile = path.join(ROOT, rel)
    if (statSync(absFile).isDirectory()) {
      walk(rel, files)
      continue
    }
    if (/\.(ts|tsx)$/.test(name)) files.push(rel)
  }
  return files
}

const BANNED_SOURCE = [
  { re: /from ['"]@\/lib\/utils['"]/, why: 'import @/lib/utils.stylex, not @/lib/utils' },
  { re: /from ['"]class-variance-authority['"]/, why: 'cva is gone; use StyleX variant maps' },
  { re: /from ['"]tailwind-merge['"]/, why: 'tailwind-merge is gone' },
  { re: /from ['"]clsx['"]/, why: 'clsx is gone; use stylex.props conditionals' },
]

/** @type {Array<{ name: string, run: () => string | null }>} */
const checks = [
  {
    name: 'lib/utils.ts is gone',
    run() {
      return existsSync(path.join(ROOT, 'lib/utils.ts'))
        ? 'delete lib/utils.ts; callers use @/lib/utils.stylex'
        : null
    },
  },
  {
    name: 'source does not import Tailwind-era helpers',
    run() {
      const hits = []
      for (const file of [
        ...walk('app'),
        ...walk('components'),
        ...walk('lib'),
        ...walk('hooks'),
      ]) {
        const text = read(file)
        for (const ban of BANNED_SOURCE) {
          if (ban.re.test(text)) hits.push(`${file}: ${ban.why}`)
        }
      }
      return hits.length ? hits.join('\n') : null
    },
  },
  {
    name: 'VS Code does not enable Tailwind validation',
    run() {
      const text = read('.vscode/settings.json')
      return text.includes('tailwindCSS')
        ? '.vscode/settings.json still enables Tailwind'
        : null
    },
  },
  {
    name: 'components.json has stylex, not tailwind',
    run() {
      const json = JSON.parse(read('components.json'))
      if ('tailwind' in json) return 'components.json still has a tailwind key'
      if (!json.stylex) return 'components.json is missing the stylex key'
      if (json.aliases?.utils !== '@/lib/utils.stylex') {
        return `components.json aliases.utils is ${json.aliases?.utils}`
      }
      return null
    },
  },
  {
    name: 'CLAUDE.md imports AGENTS.md',
    run() {
      const first = read('CLAUDE.md').split('\n')[0].trim()
      return first === '@AGENTS.md' ? null : `CLAUDE.md starts with ${JSON.stringify(first)}`
    },
  },
  {
    name: 'AGENTS.md stays short and names boundaries',
    run() {
      const text = read('AGENTS.md')
      const lines = text.split('\n').length
      if (lines > 150) return `AGENTS.md is ${lines} lines; keep it under 150`
      if (!text.includes('### Never') || !text.includes('### Always')) {
        return 'AGENTS.md is missing ### Never / ### Always'
      }
      if (!/stylex/i.test(text)) return 'AGENTS.md does not mention StyleX'
      return null
    },
  },
  {
    name: 'dev and build stay on webpack',
    run() {
      const pkg = JSON.parse(read('package.json'))
      const missing = ['dev', 'build'].filter(
        (key) => !String(pkg.scripts?.[key] ?? '').includes('--webpack'),
      )
      return missing.length ? `package.json scripts missing --webpack: ${missing.join(', ')}` : null
    },
  },
  {
    name: 'lint runs this check',
    run() {
      const pkg = JSON.parse(read('package.json'))
      const lint = String(pkg.scripts?.lint ?? '')
      return lint.includes('check-agent-docs')
        ? null
        : 'package.json lint must run scripts/check-agent-docs.mjs'
    },
  },
]

const failures = []
for (const check of checks) {
  const detail = check.run()
  if (detail) failures.push(`${check.name}\n  ${detail.replaceAll('\n', '\n  ')}`)
}

if (failures.length) {
  console.error(`check-agent-docs: ${failures.length} failed\n\n${failures.join('\n\n')}`)
  process.exit(1)
}

console.log(`check-agent-docs: ${checks.length} passed`)
