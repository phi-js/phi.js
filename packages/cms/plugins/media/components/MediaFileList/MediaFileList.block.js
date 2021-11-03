const UiFileList = () => import('../../../../../ui/components/UiFileList/UiFileList.vue')
const UiUpload = () => import('../../../../../ui/components/UiUpload/UiUpload.vue')
import { UiInput } from '/packages/ui/components'

export default {
  name: 'MediaFileList',
  title: 'Archivos',
  icon: 'mdi:folder-upload',
  description: 'Lista de archivos',

  block: {
    component: UiFileList,
    props: {
      files: [],
      view: 'list',
    },
  },

  editor: {
    toolbar: {
      'component': UiInput,
      'v-model': 'block.props.view',
      'props': {
        type: 'select-native',
        options: [
          { value: 'list', text: 'Lista' },
          { value: 'gallery', text: 'Galería' },
        ],
      },
    },

    _face: {
      'component': UiUpload,
      'v-model': 'block.props.files',
      'props': {
        endpoint: '{{ $settings.uploads.endpoint }}',
        multiple: true,
        inline: false,
        placeholder: {
          icon: 'mdi:upload',
          text: 'Subir archivos',
        },
      },
    },
  },
}