import Fiserv from './Fiserv.vue';

export default {
  component: Fiserv,
  settingsSchema: {
    fields: [
      {
        type: 'text',
        label: 'URL',
        model: 'url',
      },


      {
        type: 'text',
        label: 'Store Id',
        model: 'storeId',
      },

      {
        type: 'text',
        label: 'Shared Secret',
        model: 'secret',
      },

    ]
  }
}