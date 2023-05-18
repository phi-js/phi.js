<script setup>
import { ref, watch } from 'vue'
import { UiIcon } from '../UiIcon'

const props = defineProps({
  modelValue: {
    type: [Number, String],
    required: false,
    default: null,
  },

  min: {
    type: [Number, String],
    required: false,
    default: 0,
  },
})

const emit = defineEmits(['update:modelValue'])

const qty = ref(props.min)

watch(
  () => props.modelValue,
  (newValue) => qty.value = Math.max(parseInt(newValue) || 0, props.min),
  { immediate: true },
)

function setQty(newValue) {
  qty.value = Math.max(props.min, newValue)
  emit('update:modelValue', qty.value)
}
</script>

<template>
  <div class="UiInputQty">
    <UiIcon
      src="mdi:minus"
      @click="setQty(qty - 1)"
    />
    <input
      class="UiInput__element"
      v-bind="$attrs"
      type="number"
      :value="qty"
      :min="props.min"
      size="2"
      @input="setQty($event.target.value)"
    >
    <UiIcon
      src="mdi:plus"
      @click="setQty(qty + 1)"
    />
  </div>
</template>

<style lang="scss">
.UiInputQty {
  display: inline-flex;
  flex-wrap: nowrap;

  & > input {
    max-width: 4em;
  }

  .UiIcon {
    border-radius: 4px;
    width: 40px;

    user-select: none;
    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }
}
</style>