import UiFileList from '../../../../../ui/components/UiFileList/UiFileList.vue'
import UiUpload from '../../../../../ui/components/UiUpload/UiUpload.vue'
import { UiInput } from '@/packages/ui/components'

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

    face: {
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