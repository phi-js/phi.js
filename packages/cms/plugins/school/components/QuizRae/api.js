export default (httpClient) => ({

  getRandomWord() {
    return httpClient.get('/1/integrations/rae/random');
  }

});