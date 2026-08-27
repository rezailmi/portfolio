import { writeFileSync } from 'node:fs'

const spaceKeys = [
  'none',
  '2xs',
  'xs',
  'fine',
  'sm',
  'sm2',
  'md',
  'lg',
  'xl',
  '2xl',
  '3xl',
  '4xl',
  '5xl',
  '6xl',
  '7xl',
]

const colorKeys = [
  'accent',
  'accentForeground',
  'background',
  'border',
  'card',
  'cardForeground',
  'destructive',
  'destructiveForeground',
  'foreground',
  'input',
  'muted',
  'mutedForeground',
  'popover',
  'popoverForeground',
  'primary',
  'primaryForeground',
  'ring',
  'secondary',
  'secondaryForeground',
  'sidebar',
  'sidebarAccent',
  'sidebarAccentForeground',
  'sidebarBorder',
  'sidebarForeground',
  'sidebarPrimary',
  'sidebarPrimaryForeground',
  'sidebarRing',
  'codeBackground',
  'codeForeground',
  'overlayScrim',
  'proseBody',
  'proseHeading',
]

const radiusKeys = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full']
const shadowKeys = ['none', 'sm', 'lg']

function ident(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? key : `'${key}'`
}

function spaceAccess(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `space.${key}` : `space['${key}']`
}

function colorAccess(key) {
  return `colors.${key}`
}

function radiusAccess(key) {
  return `radius.${key}`
}

function shadowAccess(key) {
  return /^[A-Za-z_$][\w$]*$/.test(key) ? `shadow.${key}` : `shadow['${key}']`
}

function spaceMap(exportName, cssProp, { negatives = false, auto = false } = {}) {
  const lines = []
  for (const key of spaceKeys) {
    lines.push(`  ${ident(key)}: { ${cssProp}: ${spaceAccess(key)} },`)
  }
  if (negatives) {
    for (const key of spaceKeys) {
      if (key === 'none') continue
      lines.push(`  ${ident(`-${key}`)}: { ${cssProp}: \`calc(\${${spaceAccess(key)}} * -1)\` },`)
    }
  }
  if (auto) {
    lines.push(`  auto: { ${cssProp}: 'auto' },`)
  }
  return `export const ${exportName} = stylex.create({\n${lines.join('\n')}\n})\n`
}

function tokenMap(exportName, cssProp, keys, access) {
  const lines = keys.map((key) => `  ${ident(key)}: { ${cssProp}: ${access(key)} },`)
  return `export const ${exportName} = stylex.create({\n${lines.join('\n')}\n})\n`
}

function keywordMap(exportName, cssProp, pairs) {
  const lines = Object.entries(pairs).map(
    ([key, value]) => `  ${ident(key)}: { ${cssProp}: '${value}' },`
  )
  return `export const ${exportName} = stylex.create({\n${lines.join('\n')}\n})\n`
}

const parts = [
  `import * as stylex from '@stylexjs/stylex'`,
  `import { shadow, space } from '@/lib/constants.stylex'`,
  `import { colors, radius } from '@/lib/tokens.stylex'`,
  '',
  spaceMap('paddingStyles', 'padding'),
  spaceMap('paddingInlineStyles', 'paddingInline'),
  spaceMap('paddingBlockStyles', 'paddingBlock'),
  spaceMap('marginStyles', 'margin', { negatives: true, auto: true }),
  spaceMap('marginInlineStyles', 'marginInline', { negatives: true, auto: true }),
  spaceMap('marginBlockStyles', 'marginBlock', { negatives: true, auto: true }),
  spaceMap('gapStyles', 'gap'),
  spaceMap('rowGapStyles', 'rowGap'),
  spaceMap('columnGapStyles', 'columnGap'),
  tokenMap('backgroundColorStyles', 'backgroundColor', colorKeys, colorAccess),
  tokenMap('colorStyles', 'color', colorKeys, colorAccess),
  tokenMap('borderColorStyles', 'borderColor', colorKeys, colorAccess),
  tokenMap('borderRadiusStyles', 'borderRadius', radiusKeys, radiusAccess),
  tokenMap('boxShadowStyles', 'boxShadow', shadowKeys, shadowAccess),
  keywordMap('displayStyles', 'display', {
    block: 'block',
    flex: 'flex',
    inline: 'inline',
    'inline-flex': 'inline-flex',
    grid: 'grid',
    none: 'none',
    contents: 'contents',
  }),
  keywordMap('flexDirectionStyles', 'flexDirection', {
    row: 'row',
    column: 'column',
    'row-reverse': 'row-reverse',
    'column-reverse': 'column-reverse',
  }),
  keywordMap('flexWrapStyles', 'flexWrap', {
    wrap: 'wrap',
    nowrap: 'nowrap',
    'wrap-reverse': 'wrap-reverse',
  }),
  keywordMap('flexStyles', 'flex', {
    1: '1',
    none: 'none',
    auto: 'auto',
  }),
  keywordMap('alignItemsStyles', 'alignItems', {
    start: 'start',
    end: 'end',
    center: 'center',
    baseline: 'baseline',
    stretch: 'stretch',
  }),
  keywordMap('justifyContentStyles', 'justifyContent', {
    start: 'start',
    end: 'end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    evenly: 'space-evenly',
  }),
  keywordMap('borderWidthStyles', 'borderWidth', {
    0: '0',
    1: '1px',
  }),
  keywordMap('borderStyleStyles', 'borderStyle', {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
    none: 'none',
  }),
  keywordMap('widthStyles', 'width', {
    full: '100%',
  }),
]

writeFileSync('lib/box-styles.ts', parts.join('\n'), 'utf8')
