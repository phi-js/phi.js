import { defineAsyncComponent } from 'vue'
import { UiFileList } from '@/packages/ui'
const MediaGalleryEditor = defineAsyncComponent(() => import('../MediaGallery/MediaGalleryEditor.vue'))

export default {
  name: 'MediaFileList',
  title: 'Files',
  icon: 'mdi:folder-upload',

  block: {
    component: UiFileList,
    props: {
      files: [],
      view: 'list',
    },
  },

  editor: {
    actions: [
      {
        'id': 'MediaGalleryEditor',
        'title': 'Files',
        'component': MediaGalleryEditor,
        'v-model': 'block.props',
        'props': { endpoint: '{{ $settings.uploads.assets }}' },
      },
    ],
  },
}