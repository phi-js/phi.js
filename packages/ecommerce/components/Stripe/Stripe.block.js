import { UiForm } from '@/packages/ui'
import Stripe from './Stripe.vue'

export default {
  name: 'Stripe',
  title: 'Stripe payment button',
  icon: 'mdi:credit-card-outline',

  block: {
    component: Stripe,
    props: {
      // publishableKey: '',
      amount: 0,
    },
  },

  editor: {
    actions: [
      {
        'id': 'Stripe',
        'title': 'Stripe settings',
        'component': UiForm,
        'props': {
          fields: [
            { type: 'text', label: 'publishableKey', model: 'publishableKey' },
            { type: 'number', label: 'Amount', model: 'amount' },
          ],
        },
        'v-model': 'block.props',
      },
    ],
  },
}