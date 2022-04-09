export default {
  'enum.eq'(value, args) {
    if (value === undefined || !Array.isArray(args)) {
      return false
    }
    const arrValue = Array.isArray(value) ? value : [value]
    if (arrValue.length != args.length) {
      return false
    }

    let arr1 = arrValue.concat().sort()
    let arr2 = args.concat().sort()
    return arr1.every((value, index) => value == arr2[index])
  },

  'enum.any'(value, args) {
    if (!value?.includes || !Array.isArray(args)) {
      return false
    }

    for (let i = 0; i < args.length; i++) {
      if (value.includes(args[i])) {
        return true
      }
    }
    return false
  },

  'enum.all'(value, args) {
    if (!value?.includes || !Array.isArray(args)) {
      return false
    }

    for (let i = 0; i < args.length; i++) {
      if (!value.includes(args[i])) {
        return false
      }
    }
    return true
  },
}