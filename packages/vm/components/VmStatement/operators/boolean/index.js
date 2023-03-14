import BoolPicker from './BoolPicker.vue'

export default [
  {
    operator: 'boolean.isTrue',
    type: 'boolean',
    icon: 'mdi:checkbox-outline',
    text: 'es verdadero',
    editor: false,
  },

  {
    operator: 'boolean.isFalse',
    type: 'boolean',
    icon: 'mdi:checkbox-blank-outline',
    text: 'es falso',
    editor: false,
  },

  {
    operator: 'boolean.eq',
    type: 'boolean',
    icon: 'mdi:checkbox-outline',
    text: 'booleano',
    editor: { component: BoolPicker },
  },
]