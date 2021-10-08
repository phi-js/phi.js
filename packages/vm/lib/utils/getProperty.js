// https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key

export default function getProperty(sourceObject, propertyName) {
  if (!sourceObject || !propertyName) {
    return undefined
  }

  let s = propertyName
  let o = sourceObject

  s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  s = s.replace(/^\./, '') // strip a leading dot
  var a = s.split('.')
  for (var i = 0, n = a.length; i < n; ++i) {
    if (o === null) {
      return
    }

    var k = a[i]
    if (typeof o[k] != 'undefined') {
      o = o[k]
    } else {
      return
    }
  }
  return o
}