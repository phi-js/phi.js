import Mercadopago from './Mercadopago.vue';

export default {
  component: Mercadopago,
  settingsSchema: {
    fields: [
      {
        type: 'text',
        label: 'Client ID',
        model: 'clientId',
      },
      {
        type: 'text',
        label: 'Client secret',
        model: 'clientSecret',
      },
      {
        type: 'text',
        label: 'Access token',
        model: 'accesToken',
      },
      {
        type: 'text',
        label: 'Public key',
        model: 'publicKey',
      },
      {
        type: 'text',
        label: 'Merchant account ID',
        model: 'merchantAccountId',
      }
    ]
  }
}