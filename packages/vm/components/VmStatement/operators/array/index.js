import ArrayHasAny from './ArrayHasAny.vue';
// import ArrayCallbackEditor from './ArrayCallbackEditor.vue';

export default [
  // 'array.map': {
  //   icon: 'mdi:code-brackets',
  //   text: 'Transformar arreglo',
  //   secondary: 'array.map',

  //   editor: {
  //     component: ArrayCallbackEditor,
  //     props: null
  //   }
  // },

  // 'array.filter': {
  //   icon: 'mdi:code-brackets',
  //   text: 'Filtrar arreglo',
  //   secondary: 'array.filter',

  //   editor: {
  //     component: ArrayCallbackEditor,
  //     props: null
  //   }
  // },

  // 'array.includes': {
  //   icon: 'mdi:code-brackets',
  //   text: 'contiene',
  //   secondary: 'array.includes',

  //   editor: {
  //     component: ArrayHasAny,
  //     props: null
  //   }
  // },

  {
    operator: 'hasAny',
    type: 'array',
    icon: 'mdi:code-brackets',
    text: 'contiene cualquiera',
    secondary: 'hasAny',
    editor: {
      component: ArrayHasAny
    }
  }
]