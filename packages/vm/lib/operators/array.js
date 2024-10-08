export default {
  async 'array.map'(value, args, localScope = null) {
    if (!Array.isArray(value)) {
      return []
    }

    let retval = []
    for (let i = 0; i < value.length; i++) {
      let res = await this.runClosure(args, [value[i], i], localScope)
      retval.push(res)
    }

    return retval
  },

  async 'array.filter'(value, args, localScope = null) {
    if (!Array.isArray(value)) {
      return []
    }

    let retval = []
    for (let i = 0; i < value.length; i++) {
      let item = value[i]
      let res = await this.runClosure(args, [item, i], localScope)
      if (res) {
        retval.push(item)
      }
    }

    return retval
  },

  'array.eq'(value, args) {
    if (!Array.isArray(value) || !Array.isArray(args)) {
      return false
    }

    if (value.length != args.length) {
      return false
    }
    let arr1 = value.concat().sort()
    let arr2 = args.concat().sort()
    return arr1.every((value, index) => value == arr2[index])
  },

  'array.includes'(value, args) {
    if (!Array.isArray(value)) {
      return false
    }

    return value.includes(args)
  },

  'array.hasAny'(value, args) {
    if (!Array.isArray(value)) {
      return false
    }

    for (let i = 0; i < args.length; i++) {
      if (value.includes(args[i])) {
        return true
      }
    }
    return false
  },

  'array.hasAll'(value, args) {
    if (!Array.isArray(value)) {
      return false
    }

    for (let i = 0; i < args.length; i++) {
      if (!value.includes(args[i])) {
        return false
      }
    }
    return true
  },

  'array.notHasAny'(value, args) {
    if (!Array.isArray(value) || !value.length) {
      return true
    }

    for (let i = 0; i < args.length; i++) {
      if (value.includes(args[i])) {
        return false
      }
    }
    return true
  },

  'array.empty'(value) {
    if (!Array.isArray(value)) {
      return true
    }

    return value.length == 0
  },

  'array.nempty'(value) {
    if (!Array.isArray(value)) {
      return false
    }

    return value.length > 0
  },
}