import { ref, computed } from 'vue'

export default function useLocationHashPage(prefix = '#p:') {
  const hash = ref('')

  function onHashChange() {
    const foundPageId = extractPageId(window.location.hash, prefix)
    if (foundPageId) {
      hash.value = foundPageId
    }
  }

  window.addEventListener('hashchange', onHashChange)
  onHashChange() // initial run

  return computed({
    get() {
      return hash.value
    },

    set(newPageId) {
      window.location.hash = hash.value // hash.value is the "old" pageId value
        ? window.location.hash.replace(`${prefix}${hash.value}`, '') + `${prefix}${newPageId}`
        : window.location.hash + `${prefix}${newPageId}`
    },
  })
}

// str: '#/some/page/hash/-#p:hola'
// prefix: '#p'
// ---> 'hola'
// (by chatGPT)
function extractPageId(str, prefix) {
  if (!str.includes(prefix)) {
    return null
  }
  const startIndex = str.indexOf(prefix) + prefix.length
  return str.substring(startIndex)
}