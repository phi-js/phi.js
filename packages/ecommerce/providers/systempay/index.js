import Systempay from './Systempay.vue';

export default {
  component: Systempay,

  settingsSchema: {
    fields: [
      {
        type: 'text',
        label: 'Rest API User',
        model: 'user',
      },

      {
        type: 'text',
        label: 'Test password',
        model: 'passwordTest',
      },

      {
        type: 'text',
        label: 'Production password',
        model: 'password',
      },

      {
        type: 'text',
        label: 'REST API server',
        model: 'url',
      }
    ]
  }
}