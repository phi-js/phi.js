import getProperty from './getProperty'

export default function getBlockRules(block, modelValue, vm) {
  const retval = []
  if (block?.rules?.length) {
    block.rules.forEach((rule) => {
      if (rule.required) {
        const callback = () => {
          const currentValue = getProperty(modelValue, block['v-model'])
          return typeof currentValue === 'string'
            ? !!currentValue.trim()
            : (currentValue !== null && currentValue !== undefined)
        }

        retval.push({
          callback,
          message: rule.message || 'This field is required',
          breaking: true,
          trigger: ['update:modelValue', 'blur'],
          block,
        })
      }

      if (rule.regex) {
        const callback = () => {
          const currentValue = getProperty(modelValue, block['v-model'])
          return currentValue?.match ? !!currentValue.match(rule.regex) : false
        }

        retval.push({
          callback,
          message: rule.message || 'Field does not match RegEx',
          breaking: true,
          trigger: ['update:modelValue', 'blur'],
          block,
        })
      }

      if (rule.eval) {
        retval.push({
          callback: () => vm.eval(rule.eval, modelValue),
          message: rule.message || 'Invalid value',
          breaking: false,
          trigger: ['blur'],
          block,
        })
      }
    })
  }

  return retval
}


export async function runValidators(rules) {
  const errors = []

  // First, run all breaking rules sequentially, interrupting on failure
  const breakingRules = rules.filter((r) => r.breaking)
  for (let i = 0; i < breakingRules.length; i++) {
    const rule = breakingRules[i]
    try {
      const result = await rule.callback()
      if (result === false) {
        errors.push(rule)
        return errors
      }
    } catch (err) {
      errors.push(rule)
      return errors
    }
  }

  // Asynchronally run all other rules
  const nonBreakingRules = rules.filter((r) => !r.breaking)
  await Promise.all(nonBreakingRules.map(async (rule) => {
    try {
      const result = await rule.callback()
      if (result === false) {
        errors.push(rule)
      }
    } catch (err) {
      errors.push(rule)
    }
  }))

  return errors
}