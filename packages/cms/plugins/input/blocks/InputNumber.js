const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

export default {
  "tags": ["input"],

  "name": "InputNumber",
  "title": "Número",
  "icon": "mdi:numeric",

  "block": {
    "component": UiInput,
    "v-model": "number",
    "props": {
      "type": "number"
    }
  },

  "editor": {
    "face": {
      "component": InputEditor,
      "v-model": "block.props"
    },

    "actions": [
      {
        "title": "Número",
        "component": InputSettings,
        "v-model": "block"
      }
    ]
  }
};