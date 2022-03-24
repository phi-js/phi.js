export default function parseTranslations(sourceObj, dictionary, language) {
  let str = JSON.stringify(sourceObj)
  str = str.replace(/lang\(([^"]+?)\)/g, function(_fullMatch, langExpr) {
    const word = dictionary?.[language]?.[langExpr]
    return word || `${langExpr}????`
  })

  return JSON.parse(str)
}