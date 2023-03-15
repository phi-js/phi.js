import { getClient } from '@/packages/api'

export default class {
  constructor() {
    this.http = getClient('phi')
  }

  getBlocks(url) {
    return this.http.post('/api/1/services/import', { url })
  }
}