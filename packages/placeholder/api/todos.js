export default (client) => ({
  getTodos(queryParams = null) {
    return client.get('/todos', queryParams)
  },

  getTodo(todoId) {
    return client.get(`/todos/${todoId}`)
  },

  createTodo(body) {
    return client.post('/todos', body)
  },

  updateTodo(todoId, body) {
    return client.post(`/todos/${todoId}`, body)
  },

  patchTodo(todoId, body) {
    return client.patch(`/todos/${todoId}`, body)
  },

  deleteTodo(todoId) {
    return client.delete(`/todos/${todoId}`)
  },

})