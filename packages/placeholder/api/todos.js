import { Client } from '@/packages/api'

export default class {
  constructor() {
    this.http = new Client('https://jsonplaceholder.typicode.com')
  }

  getTodos(queryParams = null) {
    return this.http.get('/todos', queryParams)
  }

  getTodo(todoId) {
    return this.http.get(`/todos/${todoId}`)
  }

  createTodo(body) {
    return this.http.post('/todos', body)
  }

  updateTodo(todoId, body) {
    return this.http.post(`/todos/${todoId}`, body)
  }

  patchTodo(todoId, body) {
    return this.http.patch(`/todos/${todoId}`, body)
  }

  deleteTodo(todoId) {
    return this.http.delete(`/todos/${todoId}`)
  }
}