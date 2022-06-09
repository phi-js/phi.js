// import getProperty from './getProperty.js'

function parse(string, sourceData, preserveUndefined = false) {

  // BEWARE.    typeof null === "object"  es true.  Thank you JS.
  if (!string) {
    return string
  }

  if (string == '{{}}') {
    return sourceData
  }

  if (Array.isArray(string)) {
    return string.map((item) => parse(item, sourceData, preserveUndefined))
  }

  if (typeof string === 'object') {
    let retval = {}
    for (let key in string) {
      if (Object.prototype.hasOwnProperty.call(string, key)) {
        retval[key] = parse(string[key], sourceData, preserveUndefined)
      }
    }
    return retval
  }

  // Find expressions between {{ }}
  if (typeof string === 'string') {
    // https://stackoverflow.com/questions/6323417/how-do-i-retrieve-all-matches-for-a-regular-expression-in-javascript
    let re = /{{(.+?)}}/g
    let m

    let newValues = {}
    do {
      m = re.exec(string)
      if (m && !(m[0] in newValues)) {
        let strExpression = m[1].trim()

        // Evaluate expression
        let targetValue = evalExpression(strExpression, sourceData)

        if (targetValue === undefined) {
          if (preserveUndefined) {
            continue // Si la propiedad no existe, se conserva la cadena (e.j. el texto se conserva '{{ propiedadQueNoExiste }}')
          }
          targetValue = ''
        } else if (typeof targetValue === 'string') {
          // ENCODE HTML present in target value (!)
          targetValue = targetValue.replaceAll('>', '&gt;').replaceAll('<', '&lt;')
        }

        /*
        Convert object in substrings to json.  e.g.:

        "Hola {{ cosa }}!"
        {
            cosa: {
                soy: "un objeto"
            }
        }
        --->
        "Hola {soy:'un objeto'}!"
        */
        if (string != m[0] && typeof targetValue == 'object') {
          targetValue = JSON.stringify(targetValue, null, 2)
        }

        newValues[m[0]] = targetValue
      }
    } while (m)

    let retval = string

    for (let word in newValues) {
      if (string == word) {
        return newValues[word]
      }

      // Replace all ocurrences of the word with the new value
      let wordRegex = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&') // escape regexp special characters in search string
      retval = retval.replace(new RegExp(wordRegex, 'g'), newValues[word])
    }

    return retval
  }

  return string
}


/*
evalExpression(" nombre + ' ' + apellido ", {nombre: 'a', apellido: 'b', genero: false })
*/
function evalExpression(expr, model) {
  try {
    const fn = new Function(
      Object.keys(model),
      '"use strict"; var window = null; var document = null; var alert = null; var console = null; return ' + expr,
    )
    return fn(...Object.values(model))
  } catch (err) {
    return ''
  }
}

export default parse