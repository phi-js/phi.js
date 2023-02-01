import { ref, computed } from 'vue'

export default function useLocationHashPage(prefix = '') {
  const hash = ref('')

  function onHashChange() {
    hash.value = window.location.hash
      .replace(prefix, '')
      .replace('#', '')
  }

  // initial et
  onHashChange()

  window.addEventListener('hashchange', onHashChange)

  return computed({
    get() {
      return hash.value
    },

    set(newValue) {
      window.location.hash = prefix + '#' + newValue
    },
  })
}