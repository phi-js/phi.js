import EcommerceInvoice from '../components/EcommerceInvoice/EcommerceInvoice.block.js'
import EcommercePaymentButton from '../components/EcommercePaymentButton/EcommercePaymentButton.block.js'
import StripeBlock from '../components/Stripe/Stripe.block.js'

export default function() {
  return {
    blocks: [
      {
        title: 'eCommerce',
        children: [
          EcommerceInvoice,
          StripeBlock,
          EcommercePaymentButton,
        ],
      },
    ],
  }
}
