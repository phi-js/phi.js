<script setup>
import { ref } from 'vue'
import EcommerceInvoice from './EcommerceInvoice.vue'

const blueprint = ref([
  {
    text: 'BBQ 1',
    subtext: 'Meat platter',
    icon: 'mdi:food-steak',

    value: 100,
    currency: 'USD',
    qty: {
      min: 1,
      max: 1
    }
  },
  {
    text: 'BBQ 2',
    subtext: 'Meat platter',
    icon: 'mdi:food-steak',

    value: 120,
    currency: 'USD',
    qty: {
      min: 0,
      max: 10
    }
  },
  {
    text: 'BBQ 3',
    subtext: 'Meat platter',
    icon: 'mdi:food-steak',

    value: 15000,
    currency: 'COP',
    qty: {
      min: 0,
      max: null
    }
  },
])
</script>

<template>
  <div class="EcommerceInvoiceDocs">
    <EcommerceInvoice :blueprint="blueprint" />
  </div>
</template>

<style lang="scss">
.EcommerceInvoiceDocs {
  max-width: 500px;
  margin: 5rem auto;
  padding: 6px;
  border-radius: 5px;
  background: #fff;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
    rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}
</style>