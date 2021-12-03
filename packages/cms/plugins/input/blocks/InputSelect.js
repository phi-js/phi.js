import { UiInput, UiInputEditor, UiForm } from '/packages/ui/components'
import InputSettings from '../components/InputSettings/InputSettings.vue'

export default {
  tags: ['input'],

  name: 'InputSelect',
  title: 'Select',
  icon: 'mdi:form-dropdown',

  block: {
    'component': UiInput,
    'v-model': 'select',
    'props': { type: 'select' },
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
                value: '1',
              },
              {
                text: 'Único',
                value: 0,
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
        'title': 'Select',
        'component': InputSettings,
        'v-model': 'block',
      },
    ],
  },
}