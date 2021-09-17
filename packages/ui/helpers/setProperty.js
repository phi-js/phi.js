export default function setProperty(sourceObject, propertyName, value) {
  let curvar = sourceObject;
  let parts = propertyName.split('.');
  let len = parts.length;

  for (let i = 0; i < len - 1; i++) {
    if (typeof curvar[parts[i]] == "undefined") {
      curvar[parts[i]] = {};
    }
    curvar = curvar[parts[i]];
  }

  curvar[parts[len - 1]] = value;

  return sourceObject;
}