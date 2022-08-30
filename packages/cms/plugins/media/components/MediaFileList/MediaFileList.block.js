import { UiFileList, UiInput, UiUpload } from '@/packages/ui'

export default {
  name: 'MediaFileList',
  title: 'Files',
  icon: 'mdi:folder-upload',
  description: 'List or gallery of uploaded files',

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
        endpoint: '{{ $settings.uploads.assets }}',
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