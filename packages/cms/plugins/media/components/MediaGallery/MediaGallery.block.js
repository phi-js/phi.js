import { defineAsyncComponent } from 'vue'
import { UiFileList } from '@/packages/ui'
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
        'id': 'MediaGalleryEditor',
        'title': 'Image gallery',
        'component': MediaGalleryEditor,
        'v-model': 'block.props',
        'props': { endpoint: '{{ $settings.uploads.assets }}', imagesOnly: true },
      },
    ],
  },
}