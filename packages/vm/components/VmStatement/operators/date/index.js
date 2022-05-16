import DatePicker from './DatePicker.vue'

export default [
  {
    operator: 'date.between',
    type: 'date',
    icon: 'mdi:less-than-or-equal',
    text: 'Rango de fechas',
    editor: {
      component: DatePicker,
      props: { range: true },
    },
  },

  {
    operator: 'date.eq',
    type: 'date',
    icon: 'mdi:equal',
    text: 'es igual a',
    editor: { component: DatePicker },
  },

  {
    operator: 'date.neq',
    type: 'date',
    icon: 'mdi:not-equal',
    text: 'no es igual a',
    editor: { component: DatePicker },
  },

  {
    operator: 'date.gt',
    type: 'date',
    icon: 'mdi:greater-than',
    text: 'es mayor que',
    editor: { component: DatePicker },
  },

  {
    operator: 'date.gte',
    type: 'date',
    icon: 'mdi:greater-than-or-equal',
    text: 'es mayor o igual que',
    editor: { component: DatePicker },
  },

  {
    operator: 'date.lt',
    type: 'date',
    icon: 'mdi:less-than',
    text: 'es menor que',
    editor: { component: DatePicker },
  },

  {
    operator: 'date.lte',
    type: 'date',
    icon: 'mdi:less-than-or-equal',
    text: 'es menor o igual que',
    editor: { component: DatePicker },
  },
]