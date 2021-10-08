const UiInput = () => import('../../../../ui/components/UiInput/UiInput.vue')
const InputEditor = () => import('../components/InputEditor/InputEditor.vue')
const InputSettings = () => import('../components/InputSettings/InputSettings.vue')

export default {
  "id": "CmsInputTimestamp", // Deprecated.  kept only for backwards compatibility

  "name": "InputDate",
  "tags": ["input"],
  "title": "Fecha",
  "icon": "mdi:calendar",

  "block": {
    "component": UiInput,
    "props": {
      "type": "date"
    }
  },

  "editor": {
    "face": {
      "component": InputEditor,
      "v-model": "block.props"
    },

    "actions": [
      {
        "title": "Fecha",
        "component": InputSettings,
        "v-model": "block"
      }
    ]
  }
}