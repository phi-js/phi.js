// https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key

export default function getProperty(sourceObject, propertyPath) {
  if (!propertyPath || typeof propertyPath !== 'string') {
    console.warn('getProperty called without property name', propertyPath)
    return undefined
  }

  if (propertyPath == '$') {
    return sourceObject
  }

  // remove trailing "$."
  if (propertyPath.substring(0, 2) == '$.') {
    propertyPath = propertyPath.substring(2)
  }

  if (!sourceObject || !propertyPath) {
    return undefined
  }

  let s = propertyPath
  let o = sourceObject

  s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  s = s.replace(/^\./, '') // strip a leading dot
  var a = s.split('.')
  for (var i = 0, n = a.length; i < n; ++i) {
    // Ocurre cuando  source:"{{ nombre.foo }}"   variables: {nombre: "yo no tengo subropiedades!"}
    if (typeof o != 'object' || o === null) {
      return
    }

    var k = a[i]
    if (k in o) {
      o = o[k]
    } else {
      return
    }
  }
  return o
}