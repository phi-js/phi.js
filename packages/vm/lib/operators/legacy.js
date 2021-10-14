const operators = {
  eq(value, args) {
    // Igualdad de arreglos: Son considerados iguales si contienen los mismos valores escalares
    // (sin importar el orden de cada uno)
    if (Array.isArray(value) && Array.isArray(args)) {
      if (value.length != args.length) {
        return false
      }

      let arr1 = value.concat().sort()
      let arr2 = args.concat().sort()
      return arr1.every((value, index) => value == arr2[index])
    }

    return value == args
  },

  // Es igual a cualquiera de... (args debe ser un arreglo de posibles valores)
  eqAny(value, args) {
    if (!Array.isArray(args)) {
      return false
    }
    return args.includes(value)
  },

  neq(value, args) {
    return value != args
  },

  contains(value, args) {
    if (Array.isArray(args)) {
      return args.includes(value)
    }

    return value.indexOf(args) !== -1
  },

  beginsWith(value, args) {
    return value.indexOf(args) === 0
  },

  endsWith(value, args) {
    return value.indexOf(args) === (value.length - args.length)
  },

  gt(value, args) {
    return parseFloat(value) > parseFloat(args)
  },

  gte(value, args) {
    return parseFloat(value) >= parseFloat(args)
  },

  lt(value, args) {
    return parseFloat(value) < parseFloat(args)
  },

  lte(value, args) {
    return parseFloat(value) <= parseFloat(args)
  },

  between(value, args) {
    return parseFloat(args[0]) <= parseFloat(value) && parseFloat(value) <= parseFloat(args[1])
  },

  hasElement(value, args) {
    let arrValue = Array.isArray(value) ? value : [value]
    return arrValue.includes(args)
  },

  hasAny(value, args) {
    let arrValue = Array.isArray(value) ? value : [value]
    for (let i = 0; i < args.length; i++) {
      if (arrValue.includes(args[i])) {
        return true
      }
    }

    return false
  },

  hasAll(value, args) {
    for (let i = 0; i < args.length; i++) {
      if (!value.includes(args[i])) {
        return false
      }
    }

    return true
  },

  empty(value/*, args*/) {
    if (Array.isArray(value)) {
      return !value.length
    }

    if (typeof value == 'object') {
      for (var key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          return false
        }
      }
      return true
    }

    return !value || !value.trim()
  },

  nempty(value, args) {
    return !operators.empty(value, args)
  },
}

export default operators