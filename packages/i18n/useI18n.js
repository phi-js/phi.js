import singleton from './singleton.js'

export default function useI18n(componentDictionary = null) {
  if (componentDictionary) {
    singleton.patch(componentDictionary)
  }

  return singleton
}
