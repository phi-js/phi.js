// import legacyOps from './legacy.js'
import arrayOps from './array.js'
import booleanOps from './boolean.js'
import dateOps from './date.js'
import enumOps from './enum.js'
import numberOps from './number.js'
import stringOps from './string.js'

export default {
  // ...legacyOps,
  ...arrayOps,
  ...booleanOps,
  ...dateOps,
  ...enumOps,
  ...numberOps,
  ...stringOps,

  eq(value, args) {
    return value == args
  },
}