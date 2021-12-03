export default (httpClient) => ({
  fetchEquations(q) {
    return httpClient.get(`/1/proxy/math/crawler`, { q });
  }
});