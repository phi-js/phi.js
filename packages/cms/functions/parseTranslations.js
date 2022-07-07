export default function parseTranslations(sourceObj, language, dictionary = null) {
  let retval = sourceObj

  if (dictionary) {
    // Replace all lang(aDictionaryKey) with their respective translation
    let str = JSON.stringify(sourceObj)
    str = str.replace(/lang\(([^"]+?)\)/g, function(_fullMatch, langExpr) {
      const word = dictionary?.[language]?.[langExpr]
      return word || `${langExpr}????`
    })
    retval = JSON.parse(str)
  }

  // Replace all {"$i18n": {....}} object translations
  return parseTranslationObject(retval, language)
}


/*
const myThing = {
  "title": "OY",
  "description": {
    "$i18n": {
      "en": "A description in english",
      "fr": "Une description en français",
      "es": "Una descripción en español",
    }
  }
}
*/

function parseTranslationObject(obj, language) {
  if (Array.isArray(obj)) {
    return obj.map((i) => parseTranslations(i, language))
  }

  if (!obj || typeof obj !== 'object') {
    return obj
  }

  if (typeof obj['$i18n'] === 'object') {
    return obj['$i18n']?.[language] || obj['$i18n'][Object.keys(obj['$i18n'])[0]]
  }

  const retval = {}
  for (let [property, value] of Object.entries(obj)) {
    retval[property] = parseTranslationObject(value, language)
  }
  return retval
}