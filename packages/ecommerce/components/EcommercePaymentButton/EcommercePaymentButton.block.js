import { UiInput } from '@/packages/ui'
import EcommercePaymentButton from './EcommercePaymentButton.vue'

export default {
  name: 'EcommercePaymentButton',
  title: 'Payment button',
  icon: 'mdi:credit-card-outline',

  tags: ['ecommerce'],

  block: { component: EcommercePaymentButton },

  editor: {
    actions: [
      {
        'id': 'PaymentSettings',
        'title': 'Payment settings',
        'component': UiInput,
        'props': { type: 'json' },
        'v-model': 'block.props',
      },
    ],
  },
}