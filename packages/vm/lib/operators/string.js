// normalize string: converts a string to lowercase text, replacing accents and ignoring non alphanumeric characters
function normalize(string) {
  if (!string) {
    return ''
  }

  return string
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

export default {
  'string.same'(value, args) {
    return normalize(value) == normalize(args)
  },

  'string.like'(value, args) {
    return normalize(value) == normalize(args)
  },

  'string.eq'(value, args) {
    return value == args
  },

  'string.neq'(value, args) {
    return value != args
  },

  'string.contains'(value, args) {
    return value.indexOf(args) !== -1
  },

  'string.beginsWith'(value, args) {
    return value.indexOf(args) === 0
  },

  'string.endsWith'(value, args) {
    return value.indexOf(args) === (value.length - args.length)
  },

  'string.empty'(value) {
    return !value || !value.trim()
  },

  'string.nempty'(value) {
    return value && !!value.trim()
  },
}