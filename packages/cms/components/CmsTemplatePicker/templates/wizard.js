import Wizard from '../Wizard.vue'

export default {
  id: 'template-wizard',
  icon: 'mdi:application-edit',
  title: {
    $i18n: {
      en: 'AI Wizard',
      es: 'Wizard AI',
    },
  },
  subtext: {
    $i18n: {
      en: 'Generate content from a description',
      es: 'Generar contenido a partir de una descripción',
    },
  },

  component: Wizard,
  props: { open: true },
}