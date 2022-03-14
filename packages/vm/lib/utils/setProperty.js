export default function setProperty(sourceObject, propertyName, value) {
  let curvar = sourceObject

  let s = propertyName
  s = s.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  let parts = s.split('.')
  let len = parts.length

  for (let i = 0; i < len - 1; i++) {
    if (typeof curvar[parts[i]] == 'undefined' || curvar[parts[i]] === null) {
      curvar[parts[i]] = {}
    }
    curvar = curvar[parts[i]]
  }

  curvar[parts[len - 1]] = value

  return sourceObject
}