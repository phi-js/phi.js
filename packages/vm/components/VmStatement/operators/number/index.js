import { UiInput } from '@/packages/ui/components'

export default [
  {
    operator: 'number.eq',
    type: 'number',
    icon: 'mdi:equal',
    text: 'es igual a',
    editor: {
      component: UiInput,
      props: { type: 'number' },
    },
  },

  {
    operator: 'number.neq',
    type: 'number',
    icon: 'mdi:not-equal',
    text: 'no es igual a',
    editor: {
      component: UiInput,
      props: { type: 'number' },
    },
  },

  {
    operator: 'number.gt',
    type: 'number',
    icon: 'mdi:greater-than',
    text: 'es mayor que',
    editor: {
      component: UiInput,
      props: { type: 'number' },
    },
  },

  {
    operator: 'number.gte',
    type: 'number',
    icon: 'mdi:greater-than-or-equal',
    text: 'es mayor o igual que',
    editor: {
      component: UiInput,
      props: { type: 'number' },
    },
  },

  {
    operator: 'number.lt',
    type: 'number',
    icon: 'mdi:less-than',
    text: 'es menor que',
    editor: {
      component: UiInput,
      props: { type: 'number' },
    },
  },

  {
    operator: 'number.lte',
    type: 'number',
    icon: 'mdi:less-than-or-equal',
    text: 'es menor o igual que',
    editor: {
      component: UiInput,
      props: { type: 'number' },
    },
  },
]