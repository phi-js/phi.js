import FetchEditor from './FetchEditor.vue'

export default {
  text: 'HTTPS fetch functions',

  functions: {
    fetch: {
      icon: 'mdi:api',
      text: 'Fetch',
      subtext: 'Ejecutar request HTTP',

      editor: {
        component: FetchEditor,
        props: null,
      },

      callback: function({ url, options }) {
        if (options && options.body && typeof options.body != 'string') {
          options.body = JSON.stringify(options.body)
        }

        if (options?.method) {
          options.method = options.method.toUpperCase()
        }

        return fetch(url, options).then((response) => response.json())
      },
    },

  },
}