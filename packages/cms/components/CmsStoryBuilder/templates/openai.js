import OpenAiBlockLauncher from '../../../plugins/openai/OpenAiBlockLauncher.vue'

export default {
  id: 'template-openai',
  icon: 'mdi:head-snowflake',
  title: {
    $i18n: {
      en: 'OpenAI',
      es: 'OpenAI',
    },
  },
  subtext: {
    $i18n: {
      en: 'Generate content from a description',
      es: 'Generar contenido a partir de una descripción',
    },
  },

  component: OpenAiBlockLauncher,
}