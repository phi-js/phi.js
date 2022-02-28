import { Client } from '@/packages/api'

export default class {
  constructor() {
    this.http = new Client('https://jsonplaceholder.typicode.com')
  }

  getUsers(queryParams = null) {
    return this.http.get('/users', queryParams)
  }

  getUser(userId) {
    return this.http.get(`/users/${userId}`)
  }

  createUser(body) {
    return this.http.post('/users', body)
  }

  updateUser(userId, body) {
    return this.http.post(`/users/${userId}`, body)
  }

  patchUser(userId, body) {
    return this.http.patch(`/users/${userId}`, body)
  }

  deleteUser(userId) {
    return this.http.delete(`/users/${userId}`)
  }
}