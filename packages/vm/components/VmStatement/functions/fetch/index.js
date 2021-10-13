const FetchEditor = () => import('./FetchEditor.vue')

export default {
  icon: 'mdi:api',
  text: 'fetch',
  subtext: 'Ejecutar request HTTP',
  editor: {
    component: FetchEditor,
    props: null,
  },
}