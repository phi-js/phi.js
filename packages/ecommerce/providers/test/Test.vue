<template>
  <div class="ecommerce-provider-test">
    <h1>Aqui mismo</h1>

    <button
      type="button"
      class="ui-button"
      @click="$emit('success', 'Click boton OK')"
    >Emitir OK</button>

    <button
      type="button"
      class="ui-button"
      @click="$emit('error', 'Click boton Error')"
    >Emitir Error</button>

    <button
      type="button"
      class="ui-button"
      @click="openPopup"
    >Abrir popup</button>
  </div>
</template>

<script>
import useApi from "@/modules/api/mixins/useApi";
import * as popup from "@/modules/ecommerce/helpers/popupWindow.js";

export default {
  name: "ecommerce-provider-test",
  mixins: [useApi],

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

  methods: {
    openPopup() {
      popup.open(
        `${this.$httpClient.host}/ecommerce/test/popup?tid=${this.transaction.id}`,
        "ecommerceTest",
        "width=1024,height=768,resizable=yes,toolbar=no,status=yes",
        this.onPopupMessage,
        this.onPopupClose
      );
    },

    onPopupMessage(message) {
      this.isDone = true;

      if (message && typeof message.ok != "undefined") {
        this.result = message.ok;

        if (this.result) {
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