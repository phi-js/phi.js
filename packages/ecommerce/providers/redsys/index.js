import Redsys from './Redsys.vue';

export default {
  component: Redsys,

  settingsSchema: {
    fields: [
      {
        type: 'text',
        label: 'redsysFuc',
        model: 'redsysFuc',
      },

      {
        type: 'text',
        label: 'redsysMerchantCurrency',
        model: 'redsysMerchantCurrency',
      },

      {
        type: 'text',
        label: 'redsysMerchantTerminal',
        model: 'redsysMerchantTerminal',
      },

      {
        type: 'text',
        label: 'redsysUrl',
        model: 'redsysUrl',
      },

      {
        type: 'text',
        label: 'redsysVersion',
        model: 'redsysVersion',
      },

      {
        type: 'text',
        label: 'redsysPasswd',
        model: 'redsysPasswd',
      }
    ]
  }
}