import EnumPicker from './EnumPicker.vue'

export default [
  {
    operator: 'enum.any',
    icon: 'mdi:equal',
    text: 'contiene cualquiera',
    editor: { component: EnumPicker },
  },
]