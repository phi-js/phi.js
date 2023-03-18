<script setup>
/*
http://localhost:3000/build/?payment_intent=pi_3LdEROKYqXBTZV721oiLHXew&payment_intent_client_secret=pi_3LdEROKYqXBTZV721oiLHXew_secret_pu8DTuC1A4HdFfZeLNjKXr037&redirect_status=succeeded#/home
http://localhost:3000/build/?payment_intent=pi_3LdEzWKYqXBTZV720YKPWzDA&payment_intent_client_secret=pi_3LdEzWKYqXBTZV720YKPWzDA_secret_zwf5mD3TT6ji1kqodN9RONp1n&redirect_status=succeeded#/home
*/
import { onBeforeMount, ref, computed } from 'vue'

// import { loadStripe } from '@stripe/stripe-js'
import { loadStripe } from '@stripe/stripe-js/pure' // see https://stackoverflow.com/questions/45718026/stripe-js-making-duplicate-requests-new-requests-on-state-change
import { UiButton } from '@/packages/ui'
import { useApi } from '@/packages/api'
import stripeApi from './stripe.api.js'


const api = useApi(stripeApi)

const props = defineProps({
  publishableKey: {
    type: String,
    required: true,
  },

  amount: {
    type: [String, Number],
    required: false,
    default: 0,
  },

  label: {
    type: String,
    required: false,
    default: '',
  },
})

let stripeInstance = null
async function getStripeInstance() {
  if (!props.publishableKey) {
    throw 'No Stripe publishable key specified'
  }

  if (!stripeInstance) {
    stripeInstance = await loadStripe(props.publishableKey)
  }

  return stripeInstance
}


const isReady = ref(false)
const paymentIntent = ref()
const isLoading = ref(false)
const errorMsg = ref('')

async function retrievePaymentIntent(clientSecret) {
  if (!clientSecret) {
    paymentIntent.value = null
    return
  }

  isLoading.value = true
  const stripe = await getStripeInstance()
  const response = await stripe.retrievePaymentIntent(clientSecret)
  paymentIntent.value = response.paymentIntent
  isLoading.value = false
}


onBeforeMount(async () => {
  const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret')
  if (clientSecret) {
    await retrievePaymentIntent(clientSecret)
  }
  isReady.value = true
})

const isIntentCreated = ref(false)
let elements = null

async function createIntent() {
  const amount = parseInt(props.amount)
  if (!amount) {
    console.warn('createIntent: Amount cannot be zero')
    return
  }

  const stripe = await getStripeInstance()
  const response = await api.createIntent({ amount })

  elements = stripe.elements({ clientSecret: response.clientSecret })
  const paymentElement = elements.create('payment')
  paymentElement.on('change', () => {
    errorMsg.value = ''
  })
  paymentElement.mount('#payment-element')

  isIntentCreated.value = true
}

async function onFormSubmit() {
  isLoading.value = true

  const stripe = await getStripeInstance()
  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      // return_url: 'http://localhost:3000/build/',
      return_url: window.location.toString(),
    },
  })

  isLoading.value = false
  errorMsg.value = error.message
}

const buttonLabel = computed(() => props.label || 'Pay')

</script>

<template>
  <div
    v-show="isReady"
    class="Stripe"
  >
    <template v-if="paymentIntent">
      <div
        v-if="paymentIntent.status === 'succeeded'"
        class="Stripe__success"
      >
        <slot
          name="success"
          :payment-intent="paymentIntent"
        >
          <h3>Payment successful</h3>
          <p>$ {{ paymentIntent.amount/100 }} {{ paymentIntent.currency }}</p>
        </slot>
      </div>
      <div
        v-else
        class="Stripe__resolved"
      >
        <h3>{{ paymentIntent.status }}</h3>
        <p>$ {{ paymentIntent.amount/100 }} {{ paymentIntent.currency }}</p>
        <pre>{{ paymentIntent }}</pre>
      </div>
    </template>
    <template v-else>
      <UiButton
        v-show="!isIntentCreated"
        class="Stripe__button"
        :disabled="amount <= 0"
        @click="createIntent()"
      >
        {{ buttonLabel }}
      </UiButton>

      <form @submit.prevent="onFormSubmit">
        <div
          id="payment-element"
          class="Stripe__element"
        >
          <!--Stripe.js injects the Payment Element-->
        </div>

        <UiButton
          v-if="isIntentCreated"
          class="Stripe__button"
          type="submit"
          :is-loading="isLoading"
          loading-label="Processing ..."
          :error="errorMsg"
        >
          {{ buttonLabel }}
        </UiButton>
      </form>
    </template>
  </div>
</template>

<style lang="scss">
.Stripe {
  &__button {
    margin: 16px 0;
  }
}
</style>