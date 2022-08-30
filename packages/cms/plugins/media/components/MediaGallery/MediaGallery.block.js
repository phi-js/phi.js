import { UiFileList } from '@/packages/ui'

import { defineAsyncComponent } from 'vue'
const MediaGalleryEditor = defineAsyncComponent(() => import('./MediaGalleryEditor.vue'))

export default {
  name: 'MediaGallery',
  title: 'Image gallery',
  icon: 'mdi:image-multiple',

  block: {
    component: UiFileList,
    props: {
      files: [],
      view: 'gallery',
      previewLimit: 4,
    },
  },

  editor: {
    actions: [
      {
        'title': 'Images',
        'component': MediaGalleryEditor,
        'v-model': 'block.props',
        'props': { endpoint: '{{ $settings.uploads.assets }}' },
      },
    ],
  },
}