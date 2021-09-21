<script setup>
import { bindProp } from '/packages/ui/helpers'

defineEmits(['update:modelValue'])
defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null
  }
})

const proxy = bindProp('modelValue', {
  foo: 'foo',
  bar: 420,
  baz: 'baz'
})
</script>

<template>
  <h1>ModelChanger</h1>
  <div>
    <input v-model="proxy.foo" type="text" />
    <input v-model="proxy.bar" type="number" />
    <input v-model="proxy.baz" type="text" />
  </div>
</template>
