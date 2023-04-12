import { getClient } from '@/packages/api'

export default class {
  constructor() {
    this.http = getClient('phi')
  }

  toPDF(html, options) {
    const request = this.http.buildRequest('/api/1/services/pdf', {
      method: 'POST',
      body: { html, options },
    })

    return fetch(request).then((response) => response.blob())
  }
}