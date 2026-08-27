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
    if (prop.type !== 'Property' || prop.computed) {
      if (prop.type === 'Property' && prop.computed && parentProp) {
        visitValue(prop.value, parentProp, visit)
      }
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
  if (parentProp && SPACE_PROPS.has(parentProp)) {
    visit(node, parentProp)
  }
}

function isAllowedString(value) {
  if (value === '0' || value === 'auto' || value === '1px' || value === '-1px') return true
  if (value.endsWith('%') || value.endsWith('em')) return true
  if (value.startsWith('var(')) return true
  return false
}

function usesToken(node) {
  if (node.type === 'MemberExpression') {
    const object = node.object
    return object.type === 'Identifier' && (object.name === 'space' || object.name === 'shadow')
  }
  if (node.type === 'TemplateLiteral') {
    return node.expressions.some(
      (expr) =>
        expr.type === 'MemberExpression' &&
        expr.object.type === 'Identifier' &&
        expr.object.name === 'space'
    )
  }
  return false
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Require space tokens for spacing in stylex.create',
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
          if (usesToken(value)) return
          if (value.type === 'Literal' && typeof value.value === 'number' && value.value === 0) {
            return
          }
          if (value.type === 'Literal' && typeof value.value === 'string') {
            if (isAllowedString(value.value)) return
            if (/rem|px/.test(value.value)) {
              context.report({
                node: value,
                message: `Use a space token for ${prop} instead of '${value.value}'.`,
              })
            }
          }
        })
      },
    }
  },
}
