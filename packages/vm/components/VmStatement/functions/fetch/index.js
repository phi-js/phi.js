import FetchEditor from './FetchEditor.vue'

export default {
  icon: 'mdi:api',
  text: 'Fetch',
  subtext: 'Ejecutar request HTTP',
  editor: {
    component: FetchEditor,
    props: null,
  },
}