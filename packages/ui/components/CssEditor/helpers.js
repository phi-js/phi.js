/*
Parse a given CSS string
e.g.: "
.someClass {
  background: red !important;
}
.someClass > h1 { color: red; }

// !!! Not supported yet: media queries
@media only screen and (max-width: 600px) {
  body {
    background-color: lightblue;
  }
}
"

into an object (with selectors as keys):

{
  ".someClass": {
    "background": "red !important"
  },

  ".someClass > h1": {
    "color": "red"
  },
}
*/
export function cssStringToObject(strCss) {
  if (!strCss) {
    return {}
  }

  const ruleSets = strCss.split('}')
  const cssObj = {}

  for (let i = 0; i < ruleSets.length; i++) {
    const ruleSet = ruleSets[i].trim()
    if (ruleSet.length === 0) {
      continue
    }

    const parts = ruleSet.split('{')
    if (parts.length !== 2) {
      continue
    }

    const selector = parts[0].trim()
    const declarations = parts[1].split(';')

    if (selector.length === 0) {
      continue
    }

    const selectorObj = {}
    for (let k = 0; k < declarations.length; k++) {
      const declaration = declarations[k].trim()
      if (declaration.length === 0) {
        continue
      }

      // split declaration by first ":"
      const declarationParts = [
        declaration.substring(0, declaration.indexOf(':')),
        declaration.substring(declaration.indexOf(':') + 1),
      ]
      if (!declarationParts[1]) {
        continue
      }

      const property = declarationParts[0].trim()
      const value = declarationParts[1].trim()
      selectorObj[property] = value
    }

    cssObj[selector] = selectorObj
  }

  return cssObj
}


export function cssObjectToString(cssObj) {
  let retval = ''
  for (const [selector, declarations] of Object.entries(cssObj)) {
    retval += `${selector} {\n`
    for (const [propName, propValue] of Object.entries(declarations)) {
      retval += `  ${propName}: ${propValue};\n`
    }
    retval += '}\n'
  }
  return retval
}




/*
  Given an object with css properties as keys,
  sanitize al property names

  * Existing property names in camelCase format will be converted to dash-case (valid CSS property name)
    e.g. backgroundImage --> background-image

  {
    "font-family": "MyFontWhatever, sans-serif",
    "color": "#fff",
    "textShadow": "1px 1px 1px #000",
    "backgroundImage": "url(....)",  --> will be converted to "background-image"
    "background-attachment": "fixed",
  }
*/
export function sanitizeDeclarationObject(cssObj) {
  const sanitizedObj = {}

  if (!cssObj || typeof cssObj !== 'object') {
    return sanitizedObj
  }
  for (const [prop, value] of Object.entries(cssObj)) {
    const sanitizedProp = prop.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`)
    sanitizedObj[sanitizedProp] = value

    if (value === 'null') { // !!! hmmmm
      sanitizedObj[sanitizedProp] = null
    }
  }
  return sanitizedObj
}

/*
parsePositionString('right center')
{
  x: { value: 'right', units: null },
  y: { value: 'center', units: null }
}

parsePositionString('100px 50%')
{
  x: { value: 100, units: 'px' },
  y: { value: 50, units: '%' }
}
*/
export function parsePositionString(strPosition) {
  if (!strPosition || !strPosition.split) {
    return {
      x: { value: 'left', units: null },
      y: { value: 'top', units: null },
    }
  }

  const parts = strPosition.split(' ')
  if (parts.length != 2) {
    return {
      x: { value: 'left', units: null },
      y: { value: 'top', units: null },
    }
  }

  return {
    x: parseUnitString(parts[0]),
    y: parseUnitString(parts[1]),
  }
}


/*
positionToString({
  x: { value: 'center', units: null},
  y: { value: '30', units: '%'},
})
"center 30%"
*/
export function positionToString(objPosition) {
  const xValue = unitToString(objPosition.x)
  const yValue = unitToString(objPosition.y)
  return `${xValue} ${yValue}`.trim()
}



/*
parseUnitString('center')
{ value: 'center', units: null }

parseUnitString('100px')
{ value: 100, units: 'px' }
*/
export function parseUnitString(strUnit, emptyValue = null) {
  if (strUnit === emptyValue) {
    return { value: null, units: null }
  }

  const intValue = parseInt(strUnit)
  if (isNaN(intValue)) {
    return { value: strUnit, units: null }
  }

  const units = strUnit.replace(intValue, '')
  return { value: intValue, units }
}

export function unitToString(objUnit) {
  if (!objUnit || typeof objUnit !== 'object') {
    return ''
  }

  if (!objUnit.units) {
    return objUnit.value
  }

  const intValue = parseInt(objUnit.value)
  if (isNaN(intValue)) {
    return `0${objUnit.units}`
  }

  return `${objUnit.value}${objUnit.units}`
}