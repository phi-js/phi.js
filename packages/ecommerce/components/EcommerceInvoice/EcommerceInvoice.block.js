import { UiInput } from '@/packages/ui'
import EcommerceInvoice from './EcommerceInvoice.vue'

export default {
  name: 'EcommerceInvoice',
  title: 'Invoice',
  icon: 'mdi:receipt',

  block: { component: EcommerceInvoice },

  editor: {
    actions: [
      {
        'id': 'InvoiceItems',
        'title': 'Invoice items',
        'component': UiInput,
        'props': { type: 'json' },
        'v-model': 'block.props.blueprint',
      },
    ],
  },
}