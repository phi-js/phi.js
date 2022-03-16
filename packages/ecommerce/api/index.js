export default (httpClient) => {

  // httpClient.host = 'http://v4.local';

  return {
    /*
    Gateways
    {
        "name": "",
        "provider": "",
        "settings": { ... }
    }
    */
    getGateways() {
      return httpClient.get('/1/ecommerce/gateways')
    },

    getGatewaysWithSettings() {
      return httpClient.get('/1/ecommerce/manage/gateways')
    },

    createGateway(gatewayData) {
      return httpClient.post(`/1/ecommerce/manage/gateways/`, gatewayData);
    },

    updateGateway(gatewayId, gatewayData) {
      return httpClient.put(`/1/ecommerce/manage/gateways/${gatewayId}`, gatewayData);
    },

    deleteGateway(gatewayId) {
      return httpClient.delete(`/1/ecommerce/manage/gateways/${gatewayId}`);
    },

    /* payments */
    getPayment(paymentId) {
      return httpClient.get(`/1/ecommerce/payments/${paymentId}`);
    },
  }
}