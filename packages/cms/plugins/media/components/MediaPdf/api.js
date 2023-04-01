import { getClient } from '@/packages/api'

export default class {
  constructor() {
    this.http = getClient('v4')
  }

  toPDF(html, options) {
    const request = this.http.buildRequest('/1/esign/pdf/generator', {
      method: 'POST',
      body: { html, options },
    })

    return fetch(request).then((response) => response.blob())
  }
}