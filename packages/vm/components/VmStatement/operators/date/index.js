import DatePicker from './DatePicker.vue';

export default [
  {
    operator: 'between',
    type: 'date',
    icon: 'mdi:less-than-or-equal',
    text: 'Rango de fechas',
    editor: {
      component: DatePicker,
      props: {
        range: true
      }
    }
  },

  {
    operator: 'eq',
    type: 'date',
    icon: 'mdi:equal',
    text: 'es igual a',
    editor: {
      component: DatePicker
    }
  },

  {
    operator: 'neq',
    type: 'date',
    icon: 'mdi:not-equal',
    text: 'no es igual a',
    editor: {
      component: DatePicker
    }
  },

  {
    operator: 'gt',
    type: 'date',
    icon: 'mdi:greater-than',
    text: 'es mayor que',
    editor: {
      component: DatePicker
    }
  },

  {
    operator: 'gte',
    type: 'date',
    icon: 'mdi:greater-than-or-equal',
    text: 'es mayor o igual que',
    editor: {
      component: DatePicker
    }
  },

  {
    operator: 'lt',
    type: 'date',
    icon: 'mdi:less-than',
    text: 'es menor que',
    editor: {
      component: DatePicker
    }
  },

  {
    operator: 'lte',
    type: 'date',
    icon: 'mdi:less-than-or-equal',
    text: 'es menor o igual que',
    editor: {
      component: DatePicker
    }
  }
]