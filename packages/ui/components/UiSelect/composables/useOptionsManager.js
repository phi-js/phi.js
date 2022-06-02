import { ref, unref, computed } from 'vue'
import { getProperty, normalize } from '../../../helpers'

export default function useOptionsManager(arr, settings = null) {

  const options = computed(() => {
    const arrData = unref(arr)
    if (!Array.isArray(arrData) || !arrData.length) {
      return []
    }

    return arrData
      .filter((item) => item !== null)
      .map((item) => {
        if (item && typeof item === 'object') {
          return {
            ...item,
            text: getProperty(item, settings?.optionText || '$.text'),
            value: getProperty(item, settings?.optionValue || '$.value'),
            keywords: getKeywords(item, settings?.optionSearch).join(' '),
          }
        }

        return {
          text: item,
          value: item,
          keywords: item,
        }
      })
  })

  const searchQuery = ref('')

  const filteredOptions = computed(() => {
    let search = normalize(searchQuery.value.trim())
    if (!search) {
      return options.value
    }

    let words = search.split(' ')
    return options.value.filter((option) =>
      words.every((word) => option.keywords.includes(word)))
  })

  return { options, searchQuery, filteredOptions }
}

// Retorna un arreglo con todas las cadenas encontradas en el objeto
function getKeywords(object, searchableProperties = null) {
  if (!object) {
    return []
  }

  if (typeof object == 'string') {
    let string = normalize(object)
    return string ? [string] : []
  }

  let retval = []
  if (Array.isArray(object)) {
    object.forEach((item) =>
      (retval = retval.concat(getKeywords(item, searchableProperties))))
  } else if (typeof object === 'object') {
    if (Array.isArray(searchableProperties)) {
      searchableProperties.forEach((propPath) => {
        retval = retval.concat(getKeywords(getProperty(object, propPath)))
      })
      return retval
    } else if (searchableProperties) {
      retval = getKeywords(getProperty(object, searchableProperties))
    }

    // If no searchableProperties are defined, get strings from the entire object
    for (const p in object) {
      retval = retval.concat(getKeywords(object[p]))
    }
  }

  return retval
}
