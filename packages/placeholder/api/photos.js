export default (client) => ({
  getPhotos(queryParams = null) {
    return client.get('/photos', queryParams)
  },

  getPhoto(photoId) {
    return client.get(`/photos/${photoId}`)
  },

  createPhoto(body) {
    return client.post('/photos', body)
  },

  updatePhoto(photoId, body) {
    return client.post(`/photos/${photoId}`, body)
  },

  patchPhoto(photoId, body) {
    return client.patch(`/photos/${photoId}`, body)
  },

  deletePhoto(photoId) {
    return client.delete(`/photos/${photoId}`)
  },

})