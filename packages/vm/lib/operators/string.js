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

  'string.includes'(value, args) {
    return value && value.includes(args)
  },

  'string.startsWith'(value, args) {
    return value && value.startsWith(args)
  },

  'string.endsWith'(value, args) {
    return value && value.endsWith(args)
  },

  'string.empty'(value) {
    // be nice
    if (Array.isArray(value)) {
      return value.length == 0
    }

    return !value || !value.trim()
  },

  'string.nempty'(value) {
    // be nice
    if (Array.isArray(value)) {
      return value.length > 0
    }

    return value && !!value.trim()
  },
}
