import { UiInput } from '@/packages/ui/components'

export default [
  {
    operator: 'string.same',
    type: 'string',
    icon: 'mdi:equal',
    text: 'es similar a',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'string.eq',
    type: 'string',
    icon: 'mdi:equal',
    text: 'es igual a',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'string.includes',
    type: 'string',
    icon: 'mdi:equal',
    text: 'contiene',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'string.startsWith',
    type: 'string',
    icon: 'mdi:equal',
    text: 'empieza con',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'string.endsWith',
    type: 'string',
    icon: 'mdi:equal',
    text: 'termina con',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'string.neq',
    type: 'string',
    icon: 'mdi:not-equal',
    text: 'no es igual a',
    editor: {
      component: UiInput,
      props: { type: 'text' },
    },
  },

  {
    operator: 'string.empty',
    type: 'string',
    icon: 'mdi:not-equal',
    text: 'está vacío',
    editor: false,
  },

  {
    operator: 'string.nempty',
    type: 'string',
    icon: 'mdi:not-equal',
    text: 'no está vacío',
    editor: false,
  },

  // {
  //   operator: 'string.gt',
  //   type: 'string',
  //   icon: 'mdi:greater-than',
  //   text: 'es mayor que',
  //   secondary: 'Según su orden alfabético',
  //   editor: {
  //     component: UiInput,
  //     props: { type: 'text' },
  //   },
  // },

  // {
  //   operator: 'string.gte',
  //   type: 'string',
  //   icon: 'mdi:greater-than-or-equal',
  //   text: 'es mayor o igual que',
  //   secondary: 'Según su orden alfabético',
  //   editor: {
  //     component: UiInput,
  //     props: { type: 'text' },
  //   },
  // },

  // {
  //   operator: 'string.lt',
  //   type: 'string',
  //   icon: 'mdi:less-than',
  //   text: 'es menor que',
  //   secondary: 'Según su orden alfabético',
  //   editor: {
  //     component: UiInput,
  //     props: { type: 'text' },
  //   },
  // },

  // {
  //   operator: 'string.lte',
  //   type: 'string',
  //   icon: 'mdi:less-than-or-equal',
  //   text: 'es menor o igual que',
  //   secondary: 'Según su orden alfabético',
  //   editor: {
  //     component: UiInput,
  //     props: { type: 'text' },
  //   },
  // },
]