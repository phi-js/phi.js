<script setup>
/*
A formatted representation of an ecommerce item or subscription price.
e.g. "US$ 20,95/mo."
*/
import { computed } from 'vue'

const props = defineProps({
  /*
  Numeric value, in cents.  E.g. 1000 = 10.00 USD
  */
  value: {
    type: [String, Number],
    required: false,
    default: 0,
  },

  currency: {
    type: String,
    required: false,
    default: '$',
  },

  period: { // year, month, empty
    type: String,
    required: false,
    default: '',
  },
})

const displayValue = computed(() => {
  // return props.value / 100
  return {
    integer: Math.floor(props.value / 100),
    decimals: props.value % 100,
  }
})
</script>

<template>
  <div class="UiOutputPrice">
    <span class="UiOutputPrice__currency">{{ props.currency }}</span>
    <span class="UiOutputPrice__value">
      <span class="UiOutputPrice__integer">{{ displayValue.integer }}</span>
      <span
        v-if="displayValue.decimals"
        class="UiOutputPrice__decimals"
      >{{ displayValue.decimals }}</span>
    </span>
    <span class="UiOutputPrice__period">/mo</span>
  </div>
</template>

<style lang="scss">
.UiOutputPrice {
  &__currency,
  &__period {
    font-size: 1em;
    font-weight: bold;
    opacity: 0.6;
  }

  &__integer {
    font-weight: bold;
    font-size: 1.8em;
  }

  &__decimals {
    font-weight: bold;
    font-size: 1.2em;
    &::before {
      content: ',';
    }
  }
}
</style>