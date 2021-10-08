const HttpEditor = () => import('../components/Action/HttpEditor.vue')
import { interpolate } from '../../../functions'

import { getClient } from '../../../../api'

export default {
  id: 'http',
  icon: 'mdi:api',
  text: 'HTTP',
  secondary: 'Ejecutar request HTTP',
  schema: '... json-schema para el objeto "args"',

  handler(args) {
    if (!args.url) {
      console.warn('cms/actions/http2: no url specified')
      return
    }

    let url = args.url
    let method = args.method ? args.method.toUpperCase() : 'GET'
    let body = args.body

    let httpClient = getClient()
    if (!httpClient) {
      console.warn('cms/actions/http2: no httpClient found')
      return
    }

    return httpClient
      .fetch(url, { method, body })
      .then((response) => response.clone().json().catch(() => response.text()))
      .then((incoming) => {
        if (args.map && Array.isArray(incoming)) {
          incoming = incoming.map((item) => interpolate(args.map, { item: item }))
        }

        return incoming
      })
      .catch((err) => {
        console.warn('cms.http:', err)
        return null
      })
  },

  editor: { component: HttpEditor },
}