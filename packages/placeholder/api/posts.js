export default (client) => ({
  getPosts(queryParams = null) {
    return client.get('/posts', queryParams)
  },

  getPost(postId) {
    return client.get(`/posts/${postId}`)
  },

  createPost(body) {
    return client.post('/posts', body)
  },

  updatePost(postId, body) {
    return client.post(`/posts/${postId}`, body)
  },

  patchPost(postId, body) {
    return client.patch(`/posts/${postId}`, body)
  },

  deletePost(postId) {
    return client.delete(`/posts/${postId}`)
  },

})