export default {
  'number.eq'(value, args) {
    return value == args
  },

  'number.neq'(value, args) {
    return value != args
  },

  'number.gt'(value, args) {
    return value > args
  },

  'number.gte'(value, args) {
    return value >= args
  },

  'number.lt'(value, args) {
    return value < args
  },

  'number.lte'(value, args) {
    return value <= args
  },

  'number.between'(value, args) {
    return args[0] <= value && value <= args[1]
  },
}