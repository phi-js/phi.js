export default httpClient => ({

  getPaymentsReport(query) {
    return httpClient.get('/ecommerce/mercadopago/report', query);
  }

})