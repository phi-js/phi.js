import EnumPicker from './EnumPicker.vue'

export default [
  {
    operator: 'enum.any',
    icon: 'mdi:equal',
    text: 'contiene cualquiera',
    editor: { component: EnumPicker },
  },
  {
    operator: 'enum.all',
    icon: 'mdi:equal',
    text: 'contiene todos',
    editor: { component: EnumPicker },
  },
  {
    operator: 'enum.eq',
    icon: 'mdi:equal',
    text: 'contiene exactamente',
    editor: { component: EnumPicker },
  },
]