import { defineAsyncComponent } from 'vue'
import CmsPropsForm from '@/packages/cms/components/CmsPropsForm/CmsPropsForm.vue'
const Stripe = defineAsyncComponent(() => import('./Stripe.vue'))
const StripeFace = defineAsyncComponent(() => import('./StripeFace.vue'))

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
    face: { component: StripeFace },

    actions: [
      {
        'id': 'Stripe',
        'title': 'Stripe settings',
        'component': CmsPropsForm,
        'props': {
          fields: [
            { type: 'text', label: 'publishableKey', model: 'publishableKey' },
            { type: 'number', label: 'Amount', model: 'amount' },
            { type: 'text', label: 'Label', model: 'label' },
          ],
        },
        'v-model': 'block.props',
      },
    ],
  },
}