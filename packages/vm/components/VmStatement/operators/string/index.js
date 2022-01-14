import { UiInput } from '@/packages/ui/components'

export default [
  {
    operator: 'eq',
    type: 'string',
    icon: 'mdi:equal',
    text: 'es igual a',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'neq',
    type: 'string',
    icon: 'mdi:not-equal',
    text: 'no es igual a',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'gt',
    type: 'string',
    icon: 'mdi:greater-than',
    text: 'es mayor que',
    secondary: 'Según su orden alfabético',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'gte',
    type: 'string',
    icon: 'mdi:greater-than-or-equal',
    text: 'es mayor o igual que',
    secondary: 'Según su orden alfabético',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'lt',
    type: 'string',
    icon: 'mdi:less-than',
    text: 'es menor que',
    secondary: 'Según su orden alfabético',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'lte',
    type: 'string',
    icon: 'mdi:less-than-or-equal',
    text: 'es menor o igual que',
    secondary: 'Según su orden alfabético',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },
]