const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')
import { UiForm } from '/packages/ui/components'

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
      'component': InputEditor,
      'v-model': 'block.props',
    },

    actions: [
      // {
      //   'title': 'Text',
      //   'component': InputSettings,
      //   'v-model': 'block',
      // },
      {
        title: 'UiInputText',
        component: UiForm,
        props: {
          fields: [
            {
              type: 'text',
              label: 'Label',
              model: 'props.label',
            },
            {
              type: 'text',
              label: 'placeholder',
              model: 'props.placeholder',
            },
            {
              type: 'text',
              label: 'subtext',
              model: 'props.subtext',
            },
          ],
        },
      },
    ],
  },
}