const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

export default {
  "tags": ["input"],

  "name": "InputPassword",
  "title": "Contraseña",
  "icon": "mdi:form-textbox-password",

  "block": {
    "component": UiInput,
    "v-model": "password",
    "props": {
      "type": "password"
    }
  },

  "editor": {
    "face": {
      "component": InputEditor,
      "v-model": "block.props"
    },

    "actions": [
      {
        "title": "Contraseña",
        "component": InputSettings,
        "v-model": "block"
      }
    ]
  }
}