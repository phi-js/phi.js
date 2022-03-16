<template>
  <div class="PaymentViewer">

    <div>
      <table
        class="ui-table"
        width="100%"
      >
        <thead>
          <tr>
            <td>Concepto</td>
            <td align="right">Valor a pagar</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item,i in paidList"
            :key="i"
          >
            <td>{{item.text}}</td>
            <td align="right">{{ $cr(item.paid, currency) }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td align="right">{{ $cr(payment.paid, currency) }}</td>
          </tr>
        </tfoot>
      </table>

      <div class="ui-button --main">Completar el pago de {{ $cr(payment.paid, currency) }}</div>
    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
export default {
  name: 'PaymentViewer',
  mixins: [useI18n],

  props: {
    value: {
      required: false,
      default: null,
    },

    currency: {
      required: false,
      default: 'COP',
    },
  },

  data() {
    return {
      payment: null,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.payment = newValue;
      },
    },
  },

  computed: {
    itemList() {
      return this.getItemList(this.payment);
    },

    paidList() {
      return this.itemList.filter((i) => !i.items && i.paid > 0);
    },
  },

  methods: {
    getItemList(targetItem, retval = []) {
      retval.push(targetItem);

      if (Array.isArray(targetItem.items)) {
        targetItem.items.forEach((child) => this.getItemList(child, retval));
      }

      return retval;
    },
  },
};
</script>