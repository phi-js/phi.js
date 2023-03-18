import { defineAsyncComponent } from 'vue'
const MediaHtml = defineAsyncComponent(() => import('./MediaHtml.vue'))
const MediaHtmlCode = defineAsyncComponent(() => import('./MediaHtmlCode.vue'))
// import MediaHtml from './MediaHtml.vue'
// import MediaHtmlCode from './MediaHtmlCode.vue'

export default {
  name: 'MediaHtmlCode',
  title: 'HTML',
  icon: 'mdi:language-html5',

  block: {
    component: MediaHtml,
    props: { value: '' },
  },

  staging: false, // Create immediately.  Do not create a "staging" (accept/cancel) preview block

  editor: {
    actions: [
      {
        id: 'MediaHtmlCode',
        icon: 'mdi:language-html5',
        title: 'HTML code',
        component: MediaHtmlCode,
      },
    ],
  },
}