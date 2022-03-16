<template>
  <div class="PaymentTester">
    <form @submit.prevent="onFormSubmit()">
      <select v-model="targetGatewayId">
        <option
          v-for="gateway in gateways"
          :key="gateway.id"
          :value="gateway.id"
        >{{ gateway.name }}</option>
      </select>
      <input
        type="number"
        v-model="targetValue"
      />
      <button
        type="submit"
        :disabled="!isValid"
      >Pagar</button>
    </form>

    <div v-if="payment">
      <PaymentButton :payment="payment" />

      <button
        type="button"
        @click="payment = null"
      >Reset</button>

    </div>
    <div v-else>
      ... aun no hay pago
    </div>

  </div>
</template>

<script>
import { useApi } from '@/modules/api';
import v4Api, { ecommerce } from '/apis/v4';
import PaymentButton from '../PaymentButton/PaymentButton.vue';

export default {
  name: 'PaymentTester',
  components: { PaymentButton },
  mixins: [useApi],

  $api: {
    type: v4Api,
    wrappers: [ecommerce],
  },

  data() {
    return {
      gateways: [],
      targetGatewayId: null,
      targetValue: 0,
      payment: null,
    };
  },

  mounted() {
    this.fetchGateways();
  },

  computed: {
    isValid() {
      return this.targetGatewayId && this.targetValue > 0;
    },
  },

  methods: {
    async fetchGateways() {
      let response = await this.$api.getGateways();
      this.gateways = response?.length ? response : [];
    },

    async onFormSubmit() {
      if (!this.isValid) {
        alert('Faltan datos');
        return false;
      }

      this.payment = await this.$api.createPayment(
        { value: this.targetValue },
        null,
        this.targetGatewayId
      );
    },
  },
};
</script>