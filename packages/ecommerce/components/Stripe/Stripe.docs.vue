<script setup>
import { ref } from 'vue'
import Stripe from './Stripe.vue'

const amount = ref(0)
</script>

<template>
  <div class="Stripe-docs">
    <h1>Behold, a stripe payment button</h1>

    <input
      v-model="amount"
      type="text"
    >

    <Stripe
      publishable-key="pk_test_SuiHsYxWNU4c4rBxICLQvLyT"
      :amount="amount"
    />
  </div>
</template>