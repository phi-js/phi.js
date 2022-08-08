export default async function googleTranslate(arrTerms, targetLanguage, sourceLanguage = undefined) {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY
  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`, {
    method: 'POST',
    body: JSON.stringify({
      q: arrTerms,
      source: sourceLanguage,
      target: targetLanguage,
    }),
  }).then((r) => r.json())

  if (!response?.data?.translations?.length) {
    return (new Array(arrTerms.length)).fill(null)
  }

  return response.data.translations.map((r) => r.translatedText)
}


/*
fillGaps([
  {"language": "en", "value": "Text in english"},
  {"language": "es", "value": "Texto en español"},
  {"language": "de", "value": ""},
  {"language": "fr", "value": ""},
])

Determina el idioma origen:  Primer item del objeto que tenga un value
Traduce el termino en aquellos que no tengan value
*/

export async function fillGaps(arrEntries) {
  let sourceEntry = null
  const emptyEntries = []

  for (let entry of arrEntries) {
    if (!sourceEntry && entry.value && entry.value.trim()) {
      sourceEntry = entry
    }
    if (!entry.value || !entry.value.trim()) {
      emptyEntries.push(entry)
    }
  }

  if (!sourceEntry) {
    console.warn('fillGaps: Could not find source language')
  }

  if (!emptyEntries.length) {
    console.warn('fillGaps: No empty entries found')
  }

  const translations = {}
  const promises = []
  emptyEntries.forEach((emptyEntry) => {
    promises.push(googleTranslate([sourceEntry.value], emptyEntry.language, sourceEntry.language)
      .then((r) => {
        if (r && typeof r[0] == 'string') {
          translations[emptyEntry.language] = r[0]
        }
      }))
  })

  await Promise.all(promises)

  return arrEntries.map((entry) => ({
    language: entry.language,
    value: translations[entry.language] || entry.value,
  }))
}