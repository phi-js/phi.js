<script setup>
import { shallowRef, watchEffect, useAttrs } from 'vue'
import { useI18n } from '../../../i18n'

const props = defineProps({
  value: {
    validator: () => true,
    required: false,
    default: null,
  },

  type: {
    type: String,
    required: false,
    default: 'text',
  },
})

const attrs = useAttrs()

const arrValue = shallowRef([])
watchEffect(() => arrValue.value = Array.isArray(props.value) ? props.value : [props.value])

const i18n = useI18n()
</script>

<template>
  <div
    class="UiOutput"
    :class="`UiOutput--type-${props.type}`"
  >
    <template v-if="props.type == 'image'">
      <img
        v-for="(img,i) in arrValue"
        :key="i"
        :src="img"
      >
    </template>
    <template v-else-if="props.type == 'date'">
      <span
        v-for="(val ,i) in arrValue"
        :key="i"
        v-text="i18n.d(val)"
      />
    </template>
    <template v-else>
      <span
        v-for="(val ,i) in arrValue"
        :key="i"
        v-text="val"
      />
    </template>
  </div>
</template>