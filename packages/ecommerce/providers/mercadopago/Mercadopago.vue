<template>
  <div class="ecommerce-provider-mercadopago">
    <select @change="openMethod($event.target.value); $event.target.value = ''">
      <option value>Seleccionar método de pago</option>

      <optgroup label="Tarjetas">
        <option value="cc">Tarjeta de crédito</option>
      </optgroup>

      <optgroup label="Bancos">
        <option
          v-for="bank in banks"
          :key="bank.id"
          :value="bank.id"
        >{{ bank.description }}</option>
      </optgroup>
    </select>
  </div>
</template>

<script>
import useApi from "@/modules/api/mixins/useApi";
import apiMercadopago from "@/modules/ecommerce/providers/mercadopago/api.js";

import * as popup from "@/modules/ecommerce/helpers/popupWindow.js";

export default {
  name: "ecommerce-provider-mercadopago",
  mixins: [useApi],
  api: apiMercadopago,

  props: {
    transaction: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      isDone: false
    };
  },

  computed: {
    banks() {
      let pseMethod = this.transaction.clientData.payment_methods.find(m => m.id == "pse");
      if (!pseMethod) {
        return [];
      }

      // hide repeated, and "0"
      let retval = [];
      let seenIds = {};
      pseMethod.financial_institutions.forEach(bank => {
        if (bank.id != "0" && typeof seenIds[bank.id] == "undefined") {
          seenIds[bank.id] = bank.id;
          retval.push(bank);
        }
      });

      return retval;
    }
  },

  methods: {

    openMethod(methodId) {
      if (!methodId) {
        return;
      }

      if (methodId == "cc") {
        return this.opencreditcard();
      }

      return this.openbank(methodId);
    },

    openbank(bankId) {
      if (!bankId) {
        return;
      }

      let urlPSE = this.$httpClient.host + "/ecommerce/mercadopago/popup/pse";

      popup.open(
        `${urlPSE}?phidias_transaction_id=${this.transaction.id}&institution=${bankId}`,
        "mercadoPago",
        "height=768,width=1024,resizable=yes,toolbar=no,status=yes",
        this.onPopupMessage,
        this.onPopupClose
      );

      this.popupIsOpen = true;
    },

    opencreditcard() {
      let urlCC = this.$httpClient.host + "/ecommerce/mercadopago/popup/cc";

      popup.open(
        `${urlCC}?phidias_transaction_id=${this.transaction.id}`,
        "mercadoPago",
        "height=768,width=1024,resizable=yes,toolbar=no,status=yes",
        this.onPopupMessage,
        this.onPopupClose
      );

      this.popupIsOpen = true;
    },

    onPopupMessage(message) {
      if (message && typeof message.ok != "undefined") {
        this.isDone = true;

        if (message.ok) {
          this.$emit("success", message);
        } else {
          this.$emit("error", message);
        }
      }
    },

    onPopupClose() {
      if (!this.isDone) {
        this.$emit("error", "user cancelled");
      }
    }
  }
};
</script>