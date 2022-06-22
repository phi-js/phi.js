<script setup>
import { ref, shallowRef } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiButton } from '@/packages/ui'

defineProps({
  payment: {
    // type: Object,
    type: [Object, String], // be loose.  allow things like <EcommercePaymentButton payment="{{huh}}" />
    required: true,
  },
})

const i18n = useI18n()

const errorMsg = ref(null)
const isSuccess = ref(false)

const windowRef = shallowRef()
const container = ref()
const refWindowContents = ref()

function openPortal() {
  isSuccess.value = false
  errorMsg.value = null

  windowRef.value = window.open('', '', 'width=600,height=400,left=400,top=200')
  windowRef.value.addEventListener('beforeunload', closePortal)
  windowRef.value.document.body.appendChild(refWindowContents.value)

  // Copy all head into window (<link> and <style>)
  document.querySelectorAll('head > *')
    .forEach((styleNode) => windowRef.value.document.head.appendChild(styleNode.cloneNode()))

  // Copy all style nodes into window (<link> and <style>)
  // document.querySelectorAll('link, style')
  //   .forEach((styleNode) => windowRef.value.document.head.appendChild(styleNode.cloneNode()))
}

function closePortal() {
  if (windowRef.value) {
    if (!isSuccess.value && !errorMsg.value) {
      errorMsg.value = 'User closed window'
    }

    container.value.appendChild(refWindowContents.value)
    windowRef.value.close()
    windowRef.value = null
  }
}

function onSuccess() {
  isSuccess.value = true
  closePortal()
}

function onFail() {
  errorMsg.value = 'Error completing payment'
  closePortal()
}
</script>

<template>
  <div class="EcommercePaymentButton">
    <template v-if="isSuccess">
      <div class="EcommercePaymentButton__success">
        <h2>Thank you for your payment!</h2>
        <p>Processed order: 38975763</p>
      </div>
    </template>
    <template v-else>
      <UiButton
        v-if="typeof payment == 'string'"
        :label="`Pay ${payment}`"
      />
      <UiButton
        v-else
        :label="`Pay ${i18n.$(payment.value, payment.currency)}`"
        loading-label="...awaiting payment"
        :is-loading="!!windowRef"
        :error="errorMsg"
        :subtext="errorMsg ? 'Click to retry' : null"
        :disabled="!payment?.value"
        @click="openPortal"
      />
    </template>

    <div
      v-if="payment?.value"
      ref="container"
      style="display:none"
    >
      <div ref="refWindowContents">
        <h1>Payment Gateway Simulator</h1>
        <h2>Total: {{ i18n.$(payment.value, payment.currency) }}</h2>

        <button @click="onSuccess">
          Simulate Success
        </button>
        <button @click="onFail">
          Simulate Fail
        </button>
      </div>
    </div>
  </div>
</template>