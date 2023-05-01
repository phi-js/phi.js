import ImportFromUrl from '../../../plugins/importer/ImportFromUrl.vue'

export default {
  id: 'template-importer',
  icon: 'mdi:application-import',
  title: {
    $i18n: {
      en: 'Import',
      es: 'Importar',
    },
  },
  subtext: {
    $i18n: {
      en: 'Import content from URL',
      es: 'Importar contenido de URL',
    },
  },

  component: ImportFromUrl,
  props: { open: true },
}