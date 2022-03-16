import Bbva from './Bbva.vue';

export default {
  component: Bbva,
  settingsSchema: {
    fields: [
      {
        type: 'text',
        label: 'URL',
        model: 'url',
        default: 'https://sand-api.ecommercebbva.com/v1/'
      },

      {
        type: 'text',
        label: 'merchantId',
        model: 'merchantId',
      },

      {
        type: 'text',
        label: 'privateKey',
        model: 'privateKey',
      },

      {
        type: 'text',
        label: 'affiliation',
        model: 'affiliation',
      }
    ]
  }
}