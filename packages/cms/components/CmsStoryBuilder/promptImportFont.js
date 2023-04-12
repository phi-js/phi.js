import { useI18n } from '@/packages/i18n'

const i18n = useI18n({
  en: {
    'promptImportForm.ImportPrompt': 'Google font name (case-sensitive)',
    'promptImportForm.FontNotFound': 'Font not found',
  },
  es: {
    'promptImportForm.ImportPrompt': 'Nombre en Google fonts (sensible a mayúsculas)',
    'promptImportForm.FontNotFound': 'Fuente no encontrada',
  },
})

export default async function promptImportFont() {
  const fontName = prompt(i18n.t('promptImportForm.ImportPrompt'))
  if (!fontName?.trim?.()) {
    return
  }

  const fontId = fontName.toLowerCase()

  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`

  // validate the url
  try {
    await fetch(fontUrl)
  } catch (err) {
    alert(i18n.t('promptImportForm.FontNotFound'))
    return
  }

  return {
    id: fontId,
    url: fontUrl,
    name: fontName,
    fontFamily: fontName,
    type: 'google-font',
  }
}