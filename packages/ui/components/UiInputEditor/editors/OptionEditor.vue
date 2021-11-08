<script setup>
import { ref, watch, computed } from 'vue'
import { normalize } from '/packages/ui/helpers'
import { UiItem } from '../../UiItem'

const props = defineProps({
  option: {
    type: Object,
    required: false,
    default: () => ({
      text: '',
      value: null,
    }),
  },
})

const emit = defineEmits(['update:option'])

const innerOption = ref()
watch(
  () => props.option,
  (newValue) => innerOption.value = { text: newValue?.text || '', value: newValue?.value },
  { immediate: true },
)

function emitUpdate() {
  emit('update:option', { ...innerOption.value })
}

const isNormalized = computed(() => innerOption.value.value === normalize(innerOption.value.text))

function onTextChange(newValue) {
  if (isNormalized.value) {
    innerOption.value.value = normalize(newValue)
  }
  innerOption.value.text = newValue
  emitUpdate()
}
</script>

<template>
  <div class="OptionEditor">
    <input
      :value="innerOption.text"
      type="text"
      class="OptionEditor__input-text"
      placeholder="Texto"
      @input="onTextChange($event.target.value)"
    >
    <input
      v-model="innerOption.value"
      type="text"
      class="OptionEditor__input-value"
      placeholder="Valor"
      @input="emitUpdate"
    >
  </div>
</template>

<style lang="scss">

.OptionEditor {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &__input-text {
    border: 0;
    background: transparent;
    font-size: inherit;
  }

  &__input-value {
    flex: 1;
    border: 0;
    border-radius: 3px;
    padding: 4px 12px;
    background-color: rgba(0, 0, 0, 0.06);
  }
}
</style>