import { Client } from '@/packages/api'

export default class {
  constructor() {
    this.http = new Client('https://jsonplaceholder.typicode.com')
  }

  getPosts(queryParams = null) {
    return this.http.get('/posts', queryParams)
  }

  getPost(postId) {
    return this.http.get(`/posts/${postId}`)
  }

  createPost(body) {
    return this.http.post('/posts', body)
  }

  updatePost(postId, body) {
    return this.http.post(`/posts/${postId}`, body)
  }

  patchPost(postId, body) {
    return this.http.patch(`/posts/${postId}`, body)
  }

  deletePost(postId) {
    return this.http.delete(`/posts/${postId}`)
  }
}