export default {
  'enum.any'(value, args) {
    if (Array.isArray(value)) {
      return arrayIncludesAny(value, args)
    }

    return stringIncludesAny(value, args)
  },
}


function stringIncludesAny(str, args) {
  if (!Array.isArray(args)) {
    return false
  }
  return args.includes(str)
}

function arrayIncludesAny(arr, args) {
  if (!Array.isArray(args)) {
    return false
  }

  for (let i = 0; i < args.length; i++) {
    if (arr.includes(args[i])) {
      return true
    }
  }
  return false
}