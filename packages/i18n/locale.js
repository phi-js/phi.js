/*
import { locale } from '@/packages/i18n
*/
import { computed, ref } from 'vue'

export const locale = ref(navigator.language)

export const availableLocales = computed(() => {
  const retval = [
    { value: 'en', text: 'English' },
    { value: 'es', text: 'Español' },
    { value: 'de', text: 'Deutsch' },
    { value: 'fr', text: 'Français' },
  ]

  // Make sure the current locale is listed
  if (!retval.find((lang) => lang.value == locale.value)) {
    const baseLanguage = locale.value.substring(0, 2)
    const closestLanguage = retval.find((lang) => lang.value == baseLanguage)
    if (closestLanguage) {
      closestLanguage.value = locale.value
    } else {
      retval.push({
        value: locale.value,
        text: locale.value,
      })
    }
  }

  return retval
})