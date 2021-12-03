import MediaHtml from './MediaHtml.vue'
import MediaHtmlBlockEditor from './MediaHtmlBlockEditor.vue'

export default {
  title: 'Texto',
  icon: 'mdi:text',

  block: {
    component: MediaHtml,
    props: { value: '' },
  },

  editor: { component: MediaHtmlBlockEditor },
}