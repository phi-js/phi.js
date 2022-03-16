<template>
  <div class="EcommerceProviderBbva">
    <button
      class="ui-button --main"
      type="button"
      @click="begin"
    >Pagar {{ $cr(payment.value, payment.currency) }}</button>
    <div>
      <small>Vía BBVA</small>
    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import * as popup from '../../helpers/popupWindow.js';

export default {
  name: 'EcommerceProviderBbva',
  mixins: [useI18n],

  props: {
    payment: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      isDone: false,
    };
  },

  computed: {
    popupUrl() {
      return this.payment?.clientData?.payment_method?.url;
    },
  },

  methods: {
    begin() {
      this.isDone = false;

      if (!this.popupUrl) {
        console.error('Invalid client data', this.payment);
        alert('Error iniciando pago');
      }

      popup.open(
        this.popupUrl,
        'bbva',
        'height=768,width=1024,resizable=yes,toolbar=no,status=yes',
        this.onPopupMessage,
        this.onPopupClose
      );
    },

    onPopupMessage(message) {
      if (message && typeof message.ok != 'undefined') {
        this.isDone = true;

        if (message.ok) {
          this.$emit('success', message);
        } else {
          this.$emit('error', message);
        }
      }
    },

    onPopupClose() {
      if (!this.isDone) {
        this.$emit('error', 'user cancelled');
      }
    },
  },
};
</script>