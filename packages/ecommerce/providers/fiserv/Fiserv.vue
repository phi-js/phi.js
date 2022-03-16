<template>
  <div class="EcommerceProviderFiserv">
    <button
      class="ui-button --main"
      type="button"
      @click="openPopup"
    >Pagar {{ $cr(payment.value, payment.currency) }}</button>
    <div>
      <small>Vía Fiserv</small>
    </div>
  </div>
</template>

<script>
import { useI18n } from '@/modules/i18n';
import * as popup from '@/modules/ecommerce/helpers/popupWindow.js';

export default {
  name: 'EcommerceProviderFiserv',
  mixins: [useI18n],

  props: {
    payment: {
      type: Object,
      required: false,
    },

    // BACKWARDS COMPAT
    transaction: {
      type: Object,
      required: false,
    },
  },

  data() {
    return {
      isDone: false,
    };
  },

  methods: {
    openPopup() {
      this.isDone = false;
      let form = this.createForm();
      popup.submit(
        form,
        'height=768,width=1024,resizable=yes,toolbar=no,status=yes',
        this.onPopupMessage,
        this.onPopupClose
      );
    },

    onPopupMessage(message) {
      this.isDone = true;

      if (message && typeof message.ok != 'undefined') {
        this.result = message.ok;

        if (this.result) {
          this.$emit('success', message);
        } else {
          this.$emit('error', message);
        }
      }
    },

    onPopupClose() {
      if (!this.isDone) {
        this.$emit('error');
      }
    },

    createForm() {
      // BACKWARDS COMPAT
      let payment = this.payment ? this.payment : this.transaction;

      // Create the form
      var form = document.createElement('form');
      form.setAttribute('method', 'post');
      form.setAttribute('action', payment.clientData.url);

      Object.keys(payment.clientData).forEach((fieldName) => {
        if (fieldName == 'url') {
          return;
        }

        var hiddenField = document.createElement('input');
        hiddenField.setAttribute('type', 'hidden');
        hiddenField.setAttribute('name', fieldName);
        hiddenField.setAttribute('value', payment.clientData[fieldName]);
        form.appendChild(hiddenField);
      });

      document.body.appendChild(form);
      return form;
    },
  },
};
</script>