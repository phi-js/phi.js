import { getClient } from '@/packages/api'

export default class {
  constructor() {
    this.http = getClient('phi')
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