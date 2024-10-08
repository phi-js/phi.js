export default {
  eq(value, args) {
    if (isEmpty(value) && isEmpty(args)) {
      return true
    }

    return value == args
  },

  empty(value) {
    return isEmpty(value)
  },

  nempty(value) {
    return !isEmpty(value)
  },
}

function isEmpty(value) {
  if (typeof value === 'string') {
    return !value.trim()
  }

  if (Array.isArray(value)) {
    return value.length == 0
  }

  return value === null || value === undefined
}