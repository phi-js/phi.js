import FetchEditor from './FetchEditor.vue'

export default {
  text: 'HTTPS fetch functions',

  functions: {
    fetch: {
      tabs: ['http'],
      icon: 'mdi:api',
      text: 'Fetch',
      subtext: 'Ejecutar request HTTP',

      editor: {
        component: FetchEditor,
        props: null,
      },

      callback: function({ url, options }) {
        return fetch(url, sanitizeOptions(options))
          .then((response) => response.json())
      },
    },

  },
}

function sanitizeOptions(options) {
  const retval = {}

  retval.method = typeof options?.method == 'string'
    ? options.method.trim().toUpperCase()
    : 'GET'

  if (typeof options?.body == 'string') {
    retval.body = JSON.stringify(options.body)
  }

  if (options.headers) {
    retval.headers = options.headers
  }

  return retval
}