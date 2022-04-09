export default function setProperty(sourceObject, propertyName, value) {
  // remove trailing "$."
  if (propertyName.substr(0, 2) == '$.') {
    propertyName = propertyName.substr(2)
  }

  let curvar = sourceObject
  let parts = propertyName.split('.')
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