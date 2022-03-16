<template>
  <div class="BanorteVentana">
    <button
      type="button"
      class="ui-button --main"
      @click="go"
      :disabled="isLoading"
    >
      <template v-if="isLoading">... cargando ...</template>
      <template v-else>Pagar {{ $cr(payment.value, payment.currency) }}</template>
    </button>
    <div>
      <small>Banorte</small>
    </div>
  </div>
</template>

<script>
import useApi from '@/modules/api/mixins/useApi';
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import apiBanorte from './api.js';

import getPaymentLibrary from './checkout.js';

export default {
  name: 'BanorteVentana',
  mixins: [useApi, useI18n],
  $api: apiBanorte,

  props: {
    payment: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      banorteUrl: 'https://multicobros.banorte.com/orquestador',
      isLoading: true,
      Payment: null,
    };
  },

  beforeMount() {
    console.log(
      'Cargando jquery: ' + this.banorteUrl + '/resources/js/jquery-3.3.1.js'
    );
    this.isLoading = true;

    this.importJQuery(this.banorteUrl + '/resources/js/jquery-3.3.1.js').then(
      (jQuery) => {
        console.log('jquery cargado');
        console.log('Importando librerias de Banorte');
        this.Payment = getPaymentLibrary(this.banorteUrl, jQuery);
        this.Payment.setJQuery(jQuery);
        this.Payment.setEnv('pro') // pre, dev, pro, int  NO es intuitivo, pero "pro" (PROduccion?!) se usa tambien para pruebas
          .then(() => {
            console.log('librerias cargadas');
            this.isLoading = false;
          });
      }
    );
  },

  computed: {
    banorteParams() {
      return {
        MerchantID: null,
        User: null,
        Password: null,
        Mode: 'AUT', // PRD, AUT, RND
        TerminalID: null,
        MerchantName: null,
        MerchantCity: null,
        Language: 'ES',
        CustomerRef1: null,
        CustomerRef2: null,
        CustomerRef3: null,
        CustomerRef4: null,
        CustomerRef5: null,

        ...this.payment?.clientData?.settings,

        ControlNumber: this.payment?.id,
        Amount: this.payment.value,
      };
    },
  },

  methods: {
    go() {
      if (!this.banorteParams) {
        alert('Error');
        return false;
      }

      let xObjEnc = this.Payment.encrypt({ params: this.banorteParams });

      this.Payment.startPayment({
        params: { crypt: xObjEnc },

        onClosed: (response) => {
          console.log('onClosed', response);
          this.$emit('error', response);
        },

        onError: (response) => {
          console.log('onError', response);
          this.$emit('error', response);
        },

        onSuccess: (response) => {
          console.log('onSuccess', response);

          let didEmit = false;
          if (response?.resultadoPayw == 'A') {
            this.$emit('success', response);
            didEmit = true;
          }

          console.log('Emitiendo request de verificacion');
          this.$api.verifyPayment(this.payment.id).then((verification) => {
            console.log('Resultado de la verificación', verification);
            if (!didEmit) {
              if (verification?.payworks == 'A') {
                this.$emit('success', verification);
              } else {
                this.$emit('error', response);
              }
            }
          });
        },

        onCancel: (response) => {
          console.log('onCancel', response);
          this.$emit('error', response);
        },
      });
    },

    importJQuery(src) {
      return new Promise((resolve, reject) => {
        if (typeof window.$?.ajax != 'undefined') {
          return resolve(window.$);
        }

        let node = document.createElement('script'),
          okHandler,
          errHandler;

        node.src = src;

        okHandler = (event) => {
          node.removeEventListener('load', okHandler);
          node.removeEventListener('error', errHandler);

          if (typeof window.$ == 'undefined') {
            reject(`Could not load jQuery from '${src}'`);
            return;
          }

          let jQuery = $;
          $.noConflict();
          resolve(jQuery);
        };

        errHandler = () => {
          node.removeEventListener('load', okHandler);
          node.removeEventListener('error', errHandler);
          reject(`Error fetching '${node.src}'`);
        };

        node.addEventListener('load', okHandler);
        node.addEventListener('error', errHandler);

        document.body.appendChild(node);
      });
    },
  },
};
</script>