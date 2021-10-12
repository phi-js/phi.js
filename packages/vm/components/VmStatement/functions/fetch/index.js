const FetchEditor = () => import('./FetchEditor.vue');

export default {
  icon: 'mdi:api',
  text: 'HTTP',
  secondary: 'Ejecutar request HTTP',

  editor: {
    component: FetchEditor,
    props: null
  }
}