// import { getClient } from '@/packages/api'
import { Client } from '@/packages/api'

export default class {
  constructor() {
    // this.http = getClient('phi')
    this.http = new Client({ baseURL: 'http://phi.local/' })
  }

  /*
  postData: {
    amount: 0
  }
  */
  createIntent(postData) {
    return this.http.post('/api/1/stripe/intent', postData)
  }
}