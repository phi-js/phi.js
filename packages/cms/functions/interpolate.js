import getProperty from './getProperty.js';


function interpolate(string, sourceData, preserveUndefined = false) {

  // BEWARE.    typeof null === "object"  es true.  Thank you JS.
  if (!string) {
    return string;
  }

  if (string == "{{}}") {
    return sourceData;
  }

  if (Array.isArray(string)) {
    return string.map(item => interpolate(item, sourceData, preserveUndefined));
  }

  if (typeof string === "object") {
    let retval = {};
    for (let key in string) {
      if (Object.prototype.hasOwnProperty.call(string, key)) {
        retval[key] = interpolate(string[key], sourceData, preserveUndefined);
      }
    }
    return retval;
  }

  if (typeof string === "string") {
    // https://stackoverflow.com/questions/6323417/how-do-i-retrieve-all-matches-for-a-regular-expression-in-javascript
    let re = /{{(.+?)}}/g;
    let m;

    let newValues = {};
    do {
      m = re.exec(string);
      if (m && !(m[0] in newValues)) {
        let propertyName = m[1].trim();

        // Expresiones ternarias
        // some.property.here ? 'this' : some.other.propery
        let parts = propertyName.split('?', 2);
        if (parts.length == 2) {
          let boolValue = getProperty(sourceData, parts[0].trim());
          if (boolValue == '0') {
            boolValue = false;
          }

          let targetIndex = boolValue ? 0 : 1;

          let possibleValues = parts[1].split(':', 2);
          let finalValue = possibleValues[targetIndex].trim();

          // valor esta entre comillas 
          if (finalValue[0] == "'") {
            finalValue = finalValue.substr(1, finalValue.length - 2);
          } else {
            finalValue = getProperty(sourceData, finalValue);
          }

          newValues[m[0]] = finalValue;
          continue;
        }

        let targetValue = getProperty(sourceData, propertyName);

        if (targetValue === undefined) {
          if (preserveUndefined) {
            continue; // Si la propiedad no existe, se conserva la cadena (e.j. el texto se conserva '{{ propiedadQueNoExiste }}')
          }
          targetValue = '';
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
        if (string != m[0] && typeof targetValue == "object") {
          targetValue = JSON.stringify(targetValue, null, 2);
        }

        newValues[m[0]] = targetValue;
      }
    } while (m);

    let retval = string;

    for (let word in newValues) {
      if (string == word) {
        return newValues[word];
      }

      // Replace all ocurrences of the word with the new value
      let wordRegex = word.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&'); // escape regexp special characters in search string
      retval = retval.replace(new RegExp(wordRegex, 'g'), newValues[word]);
    }

    return retval;
  }

  return string;
}

export default interpolate