import { ref, computed } from 'vue'

// Manejo de THEMES
import '../packages/ui/themes/base/index.scss'
import '../packages/ui/themes/columns/index.scss'
import '../packages/ui/themes/material/index.scss'
import '../packages/ui/themes/terminal/index.scss'

export const availableThemes = [
  { value: 'ui-theme-base', text: 'Base' },
  { value: 'ui-theme-columns', text: 'Columns' },
  { value: 'ui-theme-material', text: 'Material' },
  { value: 'ui-theme-terminal', text: 'Terminal' },
]

export const activeThemes = ref([])

export function setTheme(fullThemeClass) {
  document.body.classList.forEach(className => {
    if (className.startsWith('ui-theme')) {
      document.body.classList.remove(className)
    }
  })
  document.body.classList.add(fullThemeClass)
  activeThemes.value.push(fullThemeClass)
}


export const currentTheme = computed({
  get() {
    return activeThemes.value?.[0]
  },
  set(newValue) {
    setTheme(newValue)
    activeThemes.value = [newValue]
  },
})