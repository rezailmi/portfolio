function isBoxOrText(name) {
  return name === 'Box' || name === 'Text'
}

export default {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow className and inline style objects on Box and Text',
    },
    schema: [],
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier' || !isBoxOrText(node.name.name)) return
        for (const attribute of node.attributes) {
          if (attribute.type !== 'JSXAttribute' || attribute.name.type !== 'JSXIdentifier') {
            continue
          }
          if (attribute.name.name === 'className') {
            context.report({
              node: attribute,
              message: `Do not pass className to ${node.name.name}. Add a token or a StyleX style.`,
            })
          }
          if (
            attribute.name.name === 'style' &&
            attribute.value?.type === 'JSXExpressionContainer'
          ) {
            const expr = attribute.value.expression
            if (expr.type === 'ObjectExpression') {
              context.report({
                node: attribute,
                message: `Do not pass an inline style object to ${node.name.name}. Pass a StyleX style token.`,
              })
            }
          }
        }
      },
    }
  },
}
