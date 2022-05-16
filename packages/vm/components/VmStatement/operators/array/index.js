import EnumPicker from '../enum/EnumPicker.vue'

export default [
  {
    type: 'array',
    operator: 'array.hasAny',
    icon: 'mdi:equal',
    text: 'contiene cualquiera',
    editor: { component: EnumPicker },
  },
  {
    type: 'array',
    operator: 'array.hasAll',
    icon: 'mdi:equal',
    text: 'contiene todos',
    editor: { component: EnumPicker },
  },
  {
    type: 'array',
    operator: 'array.eq',
    icon: 'mdi:equal',
    text: 'contiene exactamente',
    editor: { component: EnumPicker },
  },
]