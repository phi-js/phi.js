import { UiInput } from '@/packages/ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import InputFace from '../components/InputFace.vue'
import BlockValidationEditor from '../../../components/CmsBlockEditor/BlockValidationEditor.vue'

export default {
  tags: ['input'],

  name: 'InputText',
  title: 'Text',
  icon: 'mdi:form-textbox',

  block: {
    'component': UiInput,
    'v-model': 'text',
    'props': { type: 'text' },
  },

  editor: {
    face: {
      'component': InputFace,
      'v-model': 'block.props',
    },

    actions: [
      {
        'id': 'InputSettings',
        'title': 'Field options',
        'component': InputSettings,
        'v-model': 'block',
      },

      {
        'id': 'validation',
        'title': 'Validation',
        'icon': 'mdi:message-alert',
        'component': BlockValidationEditor,
        'v-model': 'block',
      },
    ],
  },
}