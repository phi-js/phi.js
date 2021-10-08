const MediaHtml = () => import('./MediaHtml.vue')
const MediaHtmlBlockEditor = () => import('./MediaHtmlBlockEditor.vue')
// const MediaHtmlEditor = () => import('./MediaHtmlEditor.vue')
// const MediaHtmlEditorToolbar = () => import('./MediaHtmlEditorToolbar.vue')

export default {
  title: 'Texto',
  icon: 'mdi:text',

  block: {
    component: MediaHtml,
    props: { value: '' },
  },

  editor: {
    custom: MediaHtmlBlockEditor,
    // face: {
    //   title: 'HTML',
    //   component: MediaHtmlEditor,
    //   'v-model': 'block.props.value',
    //   props: {
    //     theme: '{{ block.props.theme }}'
    //   }
    // },

    // toolbar: {
    //   component: MediaHtmlEditorToolbar
    // },
  },
}