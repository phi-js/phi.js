export default (httpClient) => {

  return {
    verifyPayment(paymentId) {
      return httpClient.get(`/1/ecommerce/providers/banorte/verify/${paymentId}`);
    },

  }
}