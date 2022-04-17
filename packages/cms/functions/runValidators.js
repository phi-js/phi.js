export default async function runValidators(rules) {
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