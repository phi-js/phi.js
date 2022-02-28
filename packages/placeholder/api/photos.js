import { Client } from '@/packages/api'

export default class {
  constructor() {
    this.http = new Client('https://jsonplaceholder.typicode.com')
  }

  getPhotos(queryParams = null) {
    return this.http.get('/photos', queryParams)
  }

  getPhoto(photoId) {
    return this.http.get(`/photos/${photoId}`)
  }

  createPhoto(body) {
    return this.http.post('/photos', body)
  }

  updatePhoto(photoId, body) {
    return this.http.post(`/photos/${photoId}`, body)
  }

  patchPhoto(photoId, body) {
    return this.http.patch(`/photos/${photoId}`, body)
  }

  deletePhoto(photoId) {
    return this.http.delete(`/photos/${photoId}`)
  }
}