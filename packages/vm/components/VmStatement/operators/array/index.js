import ArrayEnumPicker from './ArrayEnumPicker.vue'
// import ArrayCallbackEditor from './ArrayCallbackEditor.vue';

export default [
  // 'array.map': {
  //   icon: 'mdi:code-brackets',
  //   text: 'Transformar arreglo',
  //   subtext: 'array.map',

  //   editor: {
  //     component: ArrayCallbackEditor,
  //     props: null
  //   }
  // },

  // 'array.filter': {
  //   icon: 'mdi:code-brackets',
  //   text: 'Filtrar arreglo',
  //   subtext: 'array.filter',

  //   editor: {
  //     component: ArrayCallbackEditor,
  //     props: null
  //   }
  // },
  {
    operator: 'hasAny',
    type: 'array',
    icon: 'mdi:code-brackets',
    text: 'contiene cualquiera',
    subtext: 'hasAny',
    editor: { component: ArrayEnumPicker },
  },

  {
    operator: 'hasAll',
    type: 'array',
    icon: 'mdi:code-brackets',
    text: 'contiene todos',
    subtext: 'hasAll',
    editor: { component: ArrayEnumPicker },
  },

  {
    operator: 'array.eq',
    type: 'array',
    icon: 'mdi:code-brackets',
    text: 'contiene exactamente',
    subtext: 'array.eq',
    editor: { component: ArrayEnumPicker },
  },
]