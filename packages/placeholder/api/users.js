export default (client) => ({
  getUsers(queryParams = null) {
    return client.get('/users', queryParams)
  },

  getUser(userId) {
    return client.get(`/users/${userId}`)
  },

  createUser(body) {
    return client.post('/users', body)
  },

  updateUser(userId, body) {
    return client.post(`/users/${userId}`, body)
  },

  patchUser(userId, body) {
    return client.patch(`/users/${userId}`, body)
  },

  deleteUser(userId) {
    return client.delete(`/users/${userId}`)
  },

})