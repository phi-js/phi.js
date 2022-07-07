export default {
  'enum.any'(value, args) {
    if (!Array.isArray(args) || !value?.includes) {
      return false
    }
    for (let i = 0; i < args.length; i++) {
      if (value.includes(args[i])) {
        return true
      }
    }
    return false
  },
}