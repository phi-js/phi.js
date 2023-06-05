import EnumPicker from '../enum/EnumPicker.vue'

export default [
  {
    type: 'array',
    operator: 'array.hasAny',
    icon: 'mdi:equal',
    text: 'contiene (alguno)',
    editor: { component: EnumPicker },
  },
  {
    type: 'array',
    operator: 'array.hasAll',
    icon: 'mdi:equal',
    text: 'contiene (todos)',
    editor: { component: EnumPicker },
  },
  {
    type: 'array',
    operator: 'array.notHasAny',
    icon: 'mdi:equal',
    text: 'no contiene',
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