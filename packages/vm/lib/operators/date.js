export default {
  'date.eq'(value, args) {
    return value == args;
  },

  'date.neq'(value, args) {
    return value != args;
  },

  'date.gt'(value, args) {
    return value > args;
  },

  'date.gte'(value, args) {
    return value >= args;
  },

  'date.lt'(value, args) {
    return value < args;
  },

  'date.lte'(value, args) {
    return value <= args;
  },

  'date.between'(value, args) {
    return args[0] <= value && value <= args[1];
  }
}