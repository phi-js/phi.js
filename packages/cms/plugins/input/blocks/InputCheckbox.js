const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

export default {
  "tags": ["input"],

  "name": "InputCheckbox",
  "title": "Checkbox",
  "icon": "mdi:checkbox-blank-outline",

  "block": {
    "component": UiInput,
    "v-model": "check",
    "props": {
      "type": "checkbox"
    }
  },

  "editor": {
    "face": {
      "component": InputEditor,
      "v-model": "block.props"
    },

    "actions": [
      {
        "title": "Checkbox",
        "component": InputSettings,
        "v-model": "block"
      }
    ]
  }
}