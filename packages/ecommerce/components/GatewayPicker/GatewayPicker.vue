<template>
  <ui-select
    class="ecommerce-gateway-picker"
    :options="options"
    :value="value"
    @change="$emit('input', $event)"
  ></ui-select>
</template>

<script>
import useApi from "@/modules/api/mixins/useApi";
import apiEcommerce from "@/modules/ecommerce/api";

import { UiSelect } from "@/modules/ui/components";

export default {
  name: "ecommerce-gateway-picker",
  mixins: [useApi],
  api: apiEcommerce,

  components: { UiSelect },

  props: {
    value: {
      required: false,
      default: null
    }
  },

  data() {
    return {
      gateways: []
    };
  },

  computed: {
    options() {
      return this.gateways.map(gateway => ({
        value: gateway.id,
        text: gateway.name,
        secondary: gateway.provider
      }));
    }
  },

  mounted() {
    this.fetchGateways();
  },

  methods: {
    async fetchGateways() {
      this.gateways = await this.$api.getGateways();
    }
  }
};
</script>