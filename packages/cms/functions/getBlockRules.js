export default function getBlockRules(block, getModelProperty, vmEval) {
  const retval = []
  if (block?.rules?.length) {
    block.rules.forEach((rule) => {

      /* Validate REQUIRED */
      if (rule.required) {
        const callback = () => {
          const currentValue = getModelProperty(block['v-model'])

          if (typeof currentValue === 'string') {
            return !!currentValue.trim()
          }

          if (Array.isArray(currentValue)) {
            return currentValue.length > 0
          }

          // Cualquier falor FALSY se considera vacío
          // i.e. un checkbox no marcado se consideraría vacío
          return !!currentValue
        }

        retval.push({
          callback,
          message: rule.message || 'This field is required',
          breaking: true,
          block,
        })
      }

      /* Validate REGEX */
      if (rule.regex) {
        const callback = () => {
          const currentValue = getModelProperty(block['v-model'])
          return currentValue?.match ? !!currentValue.match(rule.regex) : false
        }

        retval.push({
          callback,
          message: rule.message || 'Field does not match RegEx',
          breaking: true,
          block,
        })
      }

      /* Validate custom expression */
      if (rule.eval) {
        retval.push({
          callback: () => vmEval(rule.eval),
          message: rule.message || 'Invalid value',
          breaking: false,
          block,
        })
      }
    })
  }

  return retval
}