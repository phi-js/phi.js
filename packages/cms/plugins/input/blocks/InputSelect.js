import { UiInput, UiInputEditor, UiForm } from '/packages/ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'
import OptionsEditor from '/packages/ui/components/UiInputEditor/editors/OptionsEditor.vue'

export default {
  tags: ['input'],

  name: 'InputSelect',
  title: 'Select',
  icon: 'mdi:form-dropdown',

  block: {
    'component': UiInput,
    'v-model': 'select',
    'props': {
      type: 'select',
      multiple: false,
    },
  },

  editor: {
    toolbar: {
      'v-model': 'block',
      'component': UiForm,
      'props': {
        class: 'ui__group',
        fields: [
          {
            model: 'props.multiple',
            type: 'select-native',
            options: [
              {
                text: 'Múltiple',
                value: true,
              },
              {
                text: 'Único',
                value: false,
              },
            ],
          },
          {
            model: 'props.type',
            type: 'select-native',
            options: [
              {
                text: 'Picker',
                value: 'select',
              },
              // {
              //   text: 'Nativo',
              //   value: 'select-native',
              // },
              {
                text: 'Lista',
                value: 'select-list',
              },
              {
                text: 'Botones',
                value: 'select-buttons',
              },
            ],
          },
        ],
      },
    },

    face: {
      'component': UiInputEditor,
      'v-model': 'block.props',
    },

    actions: [
      {
        'title': 'Options',
        'component': OptionsEditor,
        'v-model': 'block.props.options',
      },
      {
        'title': 'Input',
        'icon': 'mdi:form-textbox',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}