<script setup>
import { ref, watch } from 'vue'
import { UiItem } from '../../../ui'
import { useI18n } from '../../../i18n'

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  blueprint: {
    type: Object,
    required: false,
    default: () => null,
  },
})

const emit = defineEmits(['update:modelValue'])


const payment = ref()
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      payment.value = sanitizePayment(newValue)
    } else if (props.blueprint) {
      payment.value = createPaymentFromBlueprint(props.blueprint)
      emit('update:modelValue', { ...payment.value })
    }
  },
  { immediate: true },
)

function createPaymentFromBlueprint(blueprint) {
  return sanitizePayment(blueprint)
}


function sanitizePayment(payment) {
  if (!payment) {
    return { value: 0, items: [] }
  }
  const retval = { ...payment }

  if (Array.isArray(payment.items)) {
    retval.items = payment.items
      .map((i) => sanitizePayment(i))
      .filter((i) => !!i)

    retval.value = retval.items.reduce((prev, cur) => prev + cur.value, 0)
  } else {
    payment.value = parseFloat(payment.value) || 0
    payment.unitValue = parseFloat(payment.unitValue) || payment.value
    if (typeof payment.qty !== 'undefined') {
      retval.value = (parseFloat(payment.qty) || 0) * payment.unitValue
    }
  }

  return retval
}

function emitInput() {
  payment.value = sanitizePayment(payment.value)
  emit('update:modelValue', { ...payment.value })
}

const i18n = useI18n()
</script>

<template>
  <table
    class="EcommerceInvoice"
    cellspacing="0"
    cellpadding="0"
  >
    <thead>
      <tr>
        <th class="EcommerceInvoice__item">
          Item
        </th>
        <th class="EcommerceInvoice__value">
          Value
        </th>
        <th class="EcommerceInvoice__qty">
          Qty.
        </th>
        <th class="EcommerceInvoice__value">
          Total
        </th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="(item, k) in payment.items"
        :key="k"
      >
        <td class="EcommerceInvoice__item">
          <UiItem
            :icon="item.icon"
            :text="item.text"
            :subtext="item.subtext"
          />
        </td>
        <td class="EcommerceInvoice__value">
          {{ i18n.$(item.unitValue || item.value, payment.currency) }}
        </td>
        <td class="EcommerceInvoice__qty">
          <input
            v-model="item.qty"
            class="UiInput"
            type="number"
            min="0"
            @update:model-value="emitInput"
          >
        </td>
        <td class="EcommerceInvoice__value">
          {{ i18n.$(item.value, payment.currency) }}
        </td>
      </tr>
    </tbody>

    <tfoot>
      <tr>
        <td>Total</td>
        <td />
        <td />
        <td class="EcommerceInvoice__value">
          {{ i18n.$(payment.value, 'USD') }}
        </td>
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
    vertical-align: middle;
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
    padding-left: 32px !important;
  }
}
</style>