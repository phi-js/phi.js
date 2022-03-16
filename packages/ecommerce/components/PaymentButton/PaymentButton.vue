<template>
  <div class="PaymentButton">
    <template v-if="!isDone">
      <!--
        Envia la prop "transaction" para compatibilidad con la especificacion previa
        Una vez todos los componenttes de /ecommerce/providers/* reciban la prop "payment"
        se puede deprecar esta prop
      -->
      <component
        v-if="innerPayment && providerComponent"
        :is="providerComponent"
        :payment="innerPayment"
        @success="onProviderSuccess"
        @error="onProviderError"
        :transaction="innerPayment"
      ></component>
      <slot
        v-else-if="isLoading"
        name="loading"
      ></slot>
    </template>
    <template v-else>
      <slot
        v-if="isSuccess"
        name="success"
        :response="response"
      >
        <h1>Pago completado con exito</h1>
      </slot>
      <slot
        v-else
        name="error"
        :reset="reset"
        :response="response"
      >
        <h1>Error procesando pago</h1>
        <pre>{{ response }}</pre>
        <button
          type="button"
          @click="reset()"
        >Reintentar</button>
      </slot>
    </template>
  </div>
</template>

<script>
import useApi from '@/modules/api/mixins/useApi';
import apiEcommerce from '@/modules/ecommerce/api';

export default {
  name: 'PaymentButton',
  mixins: [useApi],
  $api: apiEcommerce,

  props: {
    payment: {
      type: [Object, String],
      required: true,
    },
  },

  data() {
    return {
      isLoading: false,
      innerPayment: null,
      providerComponent: null,

      response: null,
      isSuccess: null,
      isDone: null,
    };
  },

  watch: {
    payment: {
      immediate: true,
      handler(newValue) {
        this.fetchPayment(newValue);
      },
    },
  },

  methods: {
    async fetchPayment(newValue) {
      this.isLoading = true;
      if (typeof newValue == 'string') {
        try {
          this.innerPayment = await this.$api.getPayment(newValue);
        } catch (e) {
          this.innerPayment = null;
        }
      } else if (typeof newValue == 'object') {
        this.innerPayment = newValue;
      } else {
        this.innerPayment = null;
      }
      this.isLoading = false;

      if (!this.innerPayment) {
        this.onProviderError('Could not find payment');
        return;
      }

      if (this.innerPayment.dateResponse) {
        this.isDone = true;
        this.response = this.innerPayment.response;
        this.isSuccess = this.innerPayment.status == 'success';
        return;
      }

      if (!this.innerPayment.provider) {
        this.onProviderError('No se encontró proveedor de pago (noarg)');
        return;
      }

      try {
        let providerDefinition = await this.getProviderDefinition(
          this.innerPayment.provider
        );
        this.providerComponent = providerDefinition.component;
      } catch (err) {
        this.providerComponent = null;
        this.onProviderError('No se encontró proveedor de pago (nodef)');
      }
    },

    getProviderDefinition(providerName) {
      providerName = providerName.toLowerCase();
      return import(
        `@/modules/ecommerce/providers/${providerName}/index.js`
      ).then((importedModule) => importedModule.default);
    },

    onProviderSuccess($event) {
      this.isDone = true;
      this.response = $event;
      this.isSuccess = true;
      this.$emit('success', $event);
    },

    onProviderError($event) {
      this.isDone = true;
      this.response = $event;
      this.isSuccess = false;
      this.$emit('error', $event);
    },

    reset() {
      this.isDone = null;
      this.response = null;
      this.isSuccess = null;
    },
  },
};
</script>