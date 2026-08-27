import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import ts from 'typescript'

const root = process.cwd()

const SKIP = new Set([
  'lib/constants.stylex.ts',
  'lib/tokens.stylex.ts',
  'lib/box-styles.ts',
  'lib/token-types.ts',
  'components/computer-wrapper.tsx',
  'components/onboarding-screen.tsx',
  'components/congratulations-message.tsx',
  'components/scary-numbers.tsx',
  'app/opengraph-image.tsx',
  'components/mdx-components.tsx',
])

const SPACE_PROPS = new Set([
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingInline',
  'paddingBlock',
  'paddingInlineStart',
  'paddingInlineEnd',
  'paddingBlockStart',
  'paddingBlockEnd',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginInline',
  'marginBlock',
  'marginInlineStart',
  'marginInlineEnd',
  'marginBlockStart',
  'marginBlockEnd',
  'gap',
  'rowGap',
  'columnGap',
  'inset',
  'insetInline',
  'insetBlock',
  'insetInlineStart',
  'insetInlineEnd',
  'top',
  'right',
  'bottom',
  'left',
])

const SPACE_BY_VALUE = {
  0: 'none',
  '0px': 'none',
  '0.125rem': '2xs',
  '0.25rem': 'xs',
  '0.375rem': 'fine',
  '0.5rem': 'sm',
  '0.625rem': 'sm2',
  '0.75rem': 'md',
  '1rem': 'lg',
  '1.25rem': 'xl',
  '1.5rem': '2xl',
  '1.75rem': '3xl',
  '2rem': '4xl',
  '2.5rem': '5xl',
  '3rem': '6xl',
  '4rem': '7xl',
}

const NEGATIVE_SPACE = {
  '-0.125rem': '-2xs',
  '-0.25rem': '-xs',
  '-0.375rem': '-fine',
  '-0.5rem': '-sm',
  '-0.625rem': '-sm2',
  '-0.75rem': '-md',
  '-1rem': '-lg',
  '-1.25rem': '-xl',
  '-1.5rem': '-2xl',
  '-1.75rem': '-3xl',
  '-2rem': '-4xl',
  '-2.5rem': '-5xl',
  '-3rem': '-6xl',
  '-4rem': '-7xl',
}

const WEIGHT_BY_VALUE = {
  400: 'normal',
  500: 'medium',
  600: 'semibold',
}

const Z_BY_VALUE = {
  [-1]: 'behind',
  10: 'base',
  20: 'raised',
  50: 'overlay',
  99999: 'popover',
}

const SHADOW_SM = ['0 1px 2px 0 rgb(0 0 0 / 0.05)', '0 1px 2px rgb(0 0 0 / 0.05)']
const SHADOW_LG = '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)'
const OVERLAY_SCRIM = 'color-mix(in oklab, black 80%, transparent)'

function walkFiles(dir, out = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (
      entry.name === 'node_modules' ||
      entry.name === '.next' ||
      entry.name === 'scripts' ||
      entry.name === 'eslint'
    ) {
      continue
    }
    const path = join(dir, entry.name)
    if (entry.isDirectory()) walkFiles(path, out)
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(path)
  }
  return out
}

function isStylexCreate(node) {
  return (
    ts.isCallExpression(node) &&
    ts.isPropertyAccessExpression(node.expression) &&
    ts.isIdentifier(node.expression.expression) &&
    node.expression.expression.text === 'stylex' &&
    node.expression.name.text === 'create'
  )
}

function propName(name) {
  if (ts.isIdentifier(name)) return name.text
  if (ts.isStringLiteral(name)) return name.text
  return null
}

function isConditionKey(name) {
  return name === 'default' || name.startsWith(':') || name.startsWith('@') || name.startsWith('[')
}

function nextPropName(name, parentProp) {
  if (!name || isConditionKey(name)) return parentProp
  return name
}

function access(ns, key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `${ns}.${key}` : `${ns}['${key}']`
}

function collectImports(source) {
  const needed = {
    space: false,
    shadow: false,
    zIndex: false,
    weight: false,
    tracking: false,
    leading: false,
    colors: false,
    radius: false,
  }

  function visitCreate(object, parentProp) {
    for (const member of object.properties) {
      if (!ts.isPropertyAssignment(member)) continue
      const name = propName(member.name)
      const nextProp = nextPropName(name, parentProp)
      visitValue(member.initializer, nextProp)
    }
  }

  function visitValue(node, parentProp) {
    if (ts.isObjectLiteralExpression(node)) {
      visitCreate(node, parentProp)
      return
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const value = node.text
      if (SPACE_PROPS.has(parentProp) && (SPACE_BY_VALUE[value] || NEGATIVE_SPACE[value])) {
        needed.space = true
      }
      if (
        parentProp === 'boxShadow' &&
        (SHADOW_SM.includes(value) || value === SHADOW_LG || value === 'none')
      ) {
        needed.shadow = true
      }
      if (parentProp === 'borderRadius' && (value === '9999px' || value === '0.125rem')) {
        needed.radius = true
      }
      if (parentProp === 'letterSpacing' && (value === '-0.025em' || value === '0.05em')) {
        needed.tracking = true
      }
      if (
        ['backgroundColor', 'color', 'borderColor', 'stroke', 'fill'].includes(parentProp) &&
        value === OVERLAY_SCRIM
      ) {
        needed.colors = true
      }
      return
    }
    if (ts.isNumericLiteral(node)) {
      const num = Number(node.text)
      if (parentProp === 'fontWeight' && WEIGHT_BY_VALUE[num]) needed.weight = true
      if (parentProp === 'zIndex' && Z_BY_VALUE[num] !== undefined) needed.zIndex = true
      if (parentProp === 'lineHeight' && num === 1.625) needed.leading = true
    }
  }

  function visit(node) {
    if (
      isStylexCreate(node) &&
      node.arguments[0] &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      visitCreate(node.arguments[0], null)
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  return needed
}

function replacementsFor(source) {
  const edits = []

  function replaceNode(node, text) {
    edits.push({ start: node.getStart(source), end: node.getEnd(), text })
  }

  function visitCreate(object, parentProp) {
    for (const member of object.properties) {
      if (!ts.isPropertyAssignment(member)) continue
      const name = propName(member.name)
      const nextProp = nextPropName(name, parentProp)
      visitValue(member.initializer, nextProp)
    }
  }

  function visitValue(node, parentProp) {
    if (ts.isObjectLiteralExpression(node)) {
      visitCreate(node, parentProp)
      return
    }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const value = node.text
      if (SPACE_PROPS.has(parentProp)) {
        if (SPACE_BY_VALUE[value]) {
          replaceNode(node, access('space', SPACE_BY_VALUE[value]))
          return
        }
        if (NEGATIVE_SPACE[value]) {
          const token = NEGATIVE_SPACE[value].slice(1)
          replaceNode(node, `\`calc(\${${access('space', token)}} * -1)\``)
          return
        }
      }
      if (parentProp === 'boxShadow') {
        if (SHADOW_SM.includes(value)) {
          replaceNode(node, 'shadow.sm')
          return
        }
        if (value === SHADOW_LG) {
          replaceNode(node, 'shadow.lg')
          return
        }
        if (value === 'none') {
          replaceNode(node, 'shadow.none')
          return
        }
      }
      if (parentProp === 'borderRadius') {
        if (value === '9999px') {
          replaceNode(node, 'radius.full')
          return
        }
        if (value === '0.125rem') {
          replaceNode(node, 'radius.xs')
          return
        }
      }
      if (parentProp === 'letterSpacing') {
        if (value === '-0.025em') {
          replaceNode(node, 'tracking.tight')
          return
        }
        if (value === '0.05em') {
          replaceNode(node, 'tracking.wide')
          return
        }
      }
      if (
        ['backgroundColor', 'color', 'borderColor', 'stroke', 'fill'].includes(parentProp) &&
        value === OVERLAY_SCRIM
      ) {
        replaceNode(node, 'colors.overlayScrim')
      }
      return
    }
    if (ts.isNumericLiteral(node)) {
      const num = Number(node.text)
      if (parentProp === 'fontWeight' && WEIGHT_BY_VALUE[num]) {
        replaceNode(node, access('weight', WEIGHT_BY_VALUE[num]))
      }
      if (parentProp === 'zIndex' && Z_BY_VALUE[num] !== undefined) {
        replaceNode(node, access('zIndex', Z_BY_VALUE[num]))
      }
      if (parentProp === 'lineHeight' && num === 1.625) {
        replaceNode(node, 'leading.relaxed')
      }
    }
  }

  function visit(node) {
    if (
      isStylexCreate(node) &&
      node.arguments[0] &&
      ts.isObjectLiteralExpression(node.arguments[0])
    ) {
      visitCreate(node.arguments[0], null)
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
  return edits
}

function ensureImports(text, needed) {
  const constNames = ['space', 'shadow', 'zIndex', 'weight', 'tracking', 'leading'].filter(
    (name) => needed[name]
  )
  const tokenNames = ['colors', 'radius'].filter((name) => needed[name])
  let next = text

  if (constNames.length > 0) {
    const match = next.match(/import\s*\{([^}]+)\}\s*from\s*['"]@\/lib\/constants\.stylex['"]/)
    if (match) {
      const existing = match[1]
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
      const merged = [...new Set([...existing, ...constNames])]
      next = next.replace(match[0], `import { ${merged.join(', ')} } from '@/lib/constants.stylex'`)
    } else {
      const importLine = `import { ${constNames.join(', ')} } from '@/lib/constants.stylex'\n`
      next = next.startsWith("'use client'")
        ? next.replace("'use client'\n", `'use client'\n${importLine}`)
        : next.startsWith('"use client"')
          ? next.replace('"use client"\n', `"use client"\n${importLine}`)
          : importLine + next
    }
  }

  if (tokenNames.length > 0) {
    const match = next.match(/import\s*\{([^}]+)\}\s*from\s*['"]@\/lib\/tokens\.stylex['"]/)
    if (match) {
      const existing = match[1]
        .split(',')
        .map((part) => part.trim())
        .filter(Boolean)
      const merged = [...new Set([...existing, ...tokenNames])]
      next = next.replace(match[0], `import { ${merged.join(', ')} } from '@/lib/tokens.stylex'`)
    } else {
      const importLine = `import { ${tokenNames.join(', ')} } from '@/lib/tokens.stylex'\n`
      next = next.startsWith("'use client'")
        ? next.replace("'use client'\n", `'use client'\n${importLine}`)
        : next.startsWith('"use client"')
          ? next.replace('"use client"\n', `"use client"\n${importLine}`)
          : importLine + next
    }
  }

  return next
}

let changed = 0
for (const file of walkFiles(root)) {
  const rel = relative(root, file)
  if (SKIP.has(rel) || rel.startsWith('packages/')) continue
  const text = readFileSync(file, 'utf8')
  if (!text.includes('stylex.create')) continue
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
  const needed = collectImports(source)
  const edits = replacementsFor(source)
  if (edits.length === 0) continue
  edits.sort((a, b) => b.start - a.start)
  let next = text
  for (const edit of edits) {
    next = next.slice(0, edit.start) + edit.text + next.slice(edit.end)
  }
  next = ensureImports(next, needed)
  if (next !== text) {
    writeFileSync(file, next)
    changed += 1
    console.log(rel, edits.length)
  }
}

console.log(`updated ${changed} files`)
