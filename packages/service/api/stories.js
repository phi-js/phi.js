export default (httpClient) => ({

  getStory(storyUrl, clientKey = null) {
    return httpClient.get(storyUrl, { clientKey })
  },

})