import arrayOps from './array.js'
import booleanOps from './boolean.js'
import dateOps from './date.js'
import enumOps from './enum.js'
import numberOps from './number.js'
import stringOps from './string.js'

export default {
  ...arrayOps,
  ...booleanOps,
  ...dateOps,
  ...enumOps,
  ...numberOps,
  ...stringOps,

  eq(value, args) {
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