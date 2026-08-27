const LAYOUT_TAGS = new Set([
  'div',
  'span',
  'section',
  'article',
  'aside',
  'main',
  'nav',
  'header',
  'footer',
  'form',
  'fieldset',
  'label',
  'ul',
  'ol',
  'li',
])

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw HTML layout tags; use Box instead',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
          allowPrefixes: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = context.options[0] ?? {}
    const allow = options.allow ?? []
    const allowPrefixes = options.allowPrefixes ?? []
    const filename = context.filename.replaceAll('\\', '/')
    if (allow.some((entry) => filename.endsWith(entry))) return {}
    if (allowPrefixes.some((prefix) => filename.includes(prefix))) return {}

    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier') return
        const name = node.name.name
        if (!LAYOUT_TAGS.has(name)) return
        context.report({
          node,
          message: `Use <Box /> from @/components/box instead of raw <${name}>.`,
        })
      },
    }
  },
}
