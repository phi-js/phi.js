<script setup>
import { computed } from 'vue'
import { UiItem } from '../../../ui'
import { useI18n } from '../../../i18n'

const props = defineProps({
  blueprint: {
    type: Array,
    required: false,
    default: () => []
  }
})

const i18n = useI18n()

const total = computed(() => props.blueprint.reduce((prev, cur) => prev + cur.value, 0))
</script>

<template>
  <table class="EcommerceInvoice" cellspacing="0" cellpadding="0">
    <thead>
      <tr>
        <th class="EcommerceInvoice__item">Item</th>
        <th class="EcommerceInvoice__qty">Qty.</th>
        <th class="EcommerceInvoice__value">Value</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="(item, k) in blueprint" :key="k">
        <td class="EcommerceInvoice__item">
          <UiItem :text="item.text" :subtext="item.subtext" />
        </td>
        <td class="EcommerceInvoice__qty">
          <input
            class="UiInput"
            type="number"
            :value="item.qty.min"
            :min="item.qty.min"
            :max="item.qty.max"
          />
        </td>
        <td class="EcommerceInvoice__value">{{ i18n.$(item.value, item.currency) }}</td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td>Total</td>
        <td></td>
        <td class="EcommerceInvoice__value">{{ i18n.$(total, 'USD') }}</td>
      </tr>
    </tfoot>
  </table>
</template>

<style lang="scss">
.EcommerceInvoice {
  width: 100%;

  thead {
    text-align: left;
    font-weight: bold;
    font-size: 0.9rem;
  }

  th {
    border-bottom: 1px solid #ddd;
    padding: 6px 8px;
  }

  td {
    vertical-align: top;
    padding: 6px 8px;
  }

  tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  tfoot {
    font-weight: bold;
    background-color: rgba(0, 0, 0, 0.02);
  }

  &__item {
    width: 100%;
  }

  &__value,
  &__qty {
    white-space: nowrap;
    text-align: right;
    font-size: 0.9rem;
  }

  &__qty {
    .UiInput {
      width: 5rem;
    }
  }

  &__value {
    font-weight: bold;
    color: #666;
    padding-left: 24px !important;
  }
}
</style>