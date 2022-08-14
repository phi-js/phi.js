import FetchEditor from './FetchEditor.vue'

export default {
  text: 'HTTP calls',

  functions: [
    {
      title: 'HTTP',
      children: [
        {
          name: 'fetch',
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
      ],
    },
  ],
}

function sanitizeOptions(options) {
  const retval = { ...options }

  retval.method = typeof options?.method == 'string'
    ? options.method.trim().toUpperCase()
    : 'GET'

  if (retval.body && typeof retval.body == 'object') {
    retval.body = JSON.stringify(retval.body)
    if (!retval.headers) {
      retval.headers = {}
    }
    retval.headers['content-type'] = 'application/json'
  }

  if (!retval.headers) {
    retval.headers = undefined
  }

  return retval
}