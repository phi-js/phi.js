<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

</script>

<template>
  <div class="UiInputColorCss">
    <input
      type="color"
      :value="props.modelValue"
      @input="emit('update:modelValue', $event.target.value)"
    >
    <input
      type="checkbox"
      :checked="!!props.modelValue"
      @change="emit('update:modelValue', !$event.target.checked ? null : '#000')"
    >
  </div>
</template>