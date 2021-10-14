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
    return value.includes(args)
  },

  'array.hasAny'(value, args) {
    for (let i = 0; i < args.length; i++) {
      if (value.includes(args[i])) {
        return true
      }
    }
    return false
  },

  'array.hasAll'(value, args) {
    for (let i = 0; i < args.length; i++) {
      if (!value.includes(args[i])) {
        return false
      }
    }
    return true
  },

  'array.empty'(value) {
    return value.length == 0
  },

  'array.nempty'(value) {
    return value.length > 0
  },
}