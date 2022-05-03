import MediaHtml from '../MediaHtml/MediaHtml.vue'
import IframeEditorFace from './IframeEditorFace.vue'

export default {
  name: 'MediaIframe',
  title: 'IFrame',
  icon: 'mdi:application',

  block: {
    component: MediaHtml,
    props: { value: '' },
  },

  editor: {
    face: {
      'component': IframeEditorFace,
      'v-model': 'block.props.value',
    },
  },
}