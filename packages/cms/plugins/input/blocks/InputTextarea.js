const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

export default {
  "tags": ["input"],

  "name": "InputTextarea",
  "title": "Textarea",
  "icon": "mdi:form-textarea",

  "block": {
    "component": UiInput,
    "v-model": "textarea",
    "props": {
      "type": "textarea"
    }
  },

  "editor": {
    "face": {
      "component": InputEditor,
      "v-model": "block.props"
    },

    "actions": [
      {
        "title": "Textarea",
        "component": InputSettings,
        "v-model": "block"
      }
    ]
  }
}