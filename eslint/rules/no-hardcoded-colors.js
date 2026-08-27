const COLOR_PROPS = new Set([
  'backgroundColor',
  'color',
  'borderColor',
  'outlineColor',
  'stroke',
  'fill',
])

function isStylexCreate(node) {
  return (
    node.type === 'CallExpression' &&
    node.callee.type === 'MemberExpression' &&
    node.callee.object.type === 'Identifier' &&
    node.callee.object.name === 'stylex' &&
    node.callee.property.type === 'Identifier' &&
    node.callee.property.name === 'create'
  )
}

function propName(key) {
  if (key.type === 'Identifier') return key.name
  if (key.type === 'Literal' && typeof key.value === 'string') return key.value
  return null
}

function isConditionKey(name) {
  return (
    !name ||
    name === 'default' ||
    name.startsWith(':') ||
    name.startsWith('@') ||
    name.startsWith('[')
  )
}

function walkObject(object, parentProp, visit) {
  for (const prop of object.properties) {
    if (prop.type !== 'Property') continue
    if (prop.computed) {
      if (parentProp) visitValue(prop.value, parentProp, visit)
      continue
    }
    const name = propName(prop.key)
    const next = isConditionKey(name) ? parentProp : name
    visitValue(prop.value, next, visit)
  }
}

function visitValue(node, parentProp, visit) {
  if (!node) return
  if (node.type === 'ObjectExpression') {
    walkObject(node, parentProp, visit)
    return
  }
  if (parentProp && COLOR_PROPS.has(parentProp)) {
    visit(node, parentProp)
  }
}

function usesColorToken(node) {
  if (node.type === 'MemberExpression') {
    return node.object.type === 'Identifier' && node.object.name === 'colors'
  }
  if (node.type === 'TemplateLiteral') {
    return node.expressions.some(
      (expr) =>
        expr.type === 'MemberExpression' &&
        expr.object.type === 'Identifier' &&
        expr.object.name === 'colors'
    )
  }
  return false
}

function isRawColor(value) {
  return (
    value.startsWith('#') ||
    value.startsWith('rgb(') ||
    value.startsWith('rgba(') ||
    value.startsWith('hsl(') ||
    value.startsWith('hsla(') ||
    (value.startsWith('color-mix(') && !value.includes('colors.'))
  )
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require color tokens in stylex.create',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const allow = new Set(context.options[0]?.allow ?? [])
    const filename = context.filename.replaceAll('\\', '/')
    if ([...allow].some((entry) => filename.endsWith(entry))) return {}

    return {
      CallExpression(node) {
        if (!isStylexCreate(node)) return
        const argument = node.arguments[0]
        if (!argument || argument.type !== 'ObjectExpression') return
        walkObject(argument, null, (value, prop) => {
          if (usesColorToken(value)) return
          if (value.type === 'Literal' && typeof value.value === 'string') {
            if (
              value.value === 'transparent' ||
              value.value === 'currentColor' ||
              value.value === 'inherit' ||
              value.value === 'none'
            ) {
              return
            }
            if (isRawColor(value.value)) {
              context.report({
                node: value,
                message: `Use a color token for ${prop} instead of a raw color.`,
              })
            }
          }
          if (value.type === 'TemplateLiteral' && !usesColorToken(value)) {
            const raw = value.quasis.map((part) => part.value.raw).join('')
            if (isRawColor(raw)) {
              context.report({
                node: value,
                message: `Use a color token for ${prop} instead of a raw color.`,
              })
            }
          }
        })
      },
    }
  },
}
