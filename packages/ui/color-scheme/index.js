import { ref, computed } from 'vue'
import { useI18n } from '@/packages/i18n'

/* Browser defined mode (light|dark). Reacts to current browser theme settings */
const browserScheme = ref()
browserScheme.value = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ? 'dark'
  : 'light'

/* Listen for browser settings changes */
if (window.matchMedia) {
  const matched = window.matchMedia('(prefers-color-scheme: dark)')
  if (matched.addEventListener) {
    matched.addEventListener('change', (event) => {
      browserScheme.value = event.matches ? 'dark' : 'light'
    })
  }
}


export const currentColorScheme = ref('auto') // auto | light | dark

export const colorScheme = computed({
  get: () => {
    return currentColorScheme.value == 'auto' ? browserScheme.value : currentColorScheme.value
  },
  set: (newValue) => {
    currentColorScheme.value = newValue
  },
})

export function setColorScheme(newValue) {
  currentColorScheme.value = newValue
}

export function useColorScheme() {
  const i18n = useI18n({
    en: {
      'scheme.auto': 'auto',
      'scheme.light': 'Light mode',
      'scheme.dark': 'Dark mode',
    },
    es: {
      'scheme.auto': 'auto',
      'scheme.light': 'Modo claro',
      'scheme.dark': 'Modo oscuro',
    },
  })


  return {
    currentScheme: currentColorScheme,
    set: setColorScheme,

    available: computed(() => [
      {
        value: 'auto',
        text: i18n.t('scheme.' + browserScheme.value) + ` (${i18n.t('scheme.auto')})`,
        enabled: currentColorScheme.value == 'auto',
      },
      {
        value: 'light',
        text: i18n.t('scheme.light'),
        enabled: currentColorScheme.value == 'light',
      },
      {
        value: 'dark',
        text: i18n.t('scheme.dark'),
        enabled: currentColorScheme.value == 'dark',
      },
    ]),

    isDark: computed(() => {
      return (currentColorScheme.value == 'auto' ? browserScheme.value : currentColorScheme.value) == 'dark'
    }),

    cssClass: computed(() => {
      return `color-scheme-${currentColorScheme.value == 'auto' ? browserScheme.value : currentColorScheme.value}`
    }),
  }

}