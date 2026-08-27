import noClassnameBox from './rules/no-classname-box.js'
import noHardcodedColors from './rules/no-hardcoded-colors.js'
import noHardcodedSpacing from './rules/no-hardcoded-spacing.js'

export default {
  meta: { name: 'local' },
  rules: {
    'no-classname-box': noClassnameBox,
    'no-hardcoded-colors': noHardcodedColors,
    'no-hardcoded-spacing': noHardcodedSpacing,
  },
}
