import EcommerceInvoice from '../components/EcommerceInvoice/EcommerceInvoice.block.js'
import EcommercePaymentButton from '../components/EcommercePaymentButton/EcommercePaymentButton.block.js'

export default {
  blocks: [
    {
      title: 'eCommerce',
      children: [
        EcommerceInvoice,
        EcommercePaymentButton,
      ],
    },
  ],
}