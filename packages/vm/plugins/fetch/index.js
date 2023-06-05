import FetchEditor from './FetchEditor.vue'

export default {
  functions: [
    {
      name: 'http',
      title: 'HTTP',
      children: [
        {
          name: 'fetch',
          icon: 'mdi:api',
          title: 'Fetch',
          description: 'Ejecutar request HTTP',

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
    if (typeof retval.headers['content-type'] == 'undefined') {
      retval.headers['content-type'] = 'application/json'
    }

    if (retval.headers['content-type'] === null) {
      delete retval.headers['content-type']
    }
  }

  if (!retval.headers) {
    retval.headers = undefined
  }

  return retval
}