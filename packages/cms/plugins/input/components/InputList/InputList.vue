<script setup>
import { computed, ref, watch } from 'vue'

import { UiInput } from '@/packages/ui'

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },

  adderLabel: {
    type: String,
    required: false,
    default: 'Add item',
  },

  deleteLabel: {
    type: String,
    required: false,
    default: 'Delete item?',
  },

  // Validation rules (see ./validation.js)
  rules: {
    type: Array,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref([])

let _ignoreUpdates = false

watch(
  () => props.modelValue,
  (newValue) => {
    _ignoreUpdates = true
    innerValue.value = Array.isArray(newValue)
      ? newValue.concat([])
      : []
  },
  { immediate: true },
)

watch(
  innerValue,
  () => {
    if (_ignoreUpdates) {
      _ignoreUpdates = false
      return
    }
    emitUpdate()
  },
  { deep: true },
)

function emitUpdate() {
  emit('update:modelValue', innerValue.value.concat([]))
}

function pushItem() {
  innerValue.value.push({})
}

function removeItemAt(index) {
  if (!isBlank(innerValue.value[index]) && !confirm(props.deleteLabel)) {
    return
  }

  innerValue.value.splice(index, 1)
}

const limits = computed(() => {
  const minRule = Array.isArray(props.rules)
    ? props.rules.find((r) => r.type === 'minlength')
    : null

  const maxRule = Array.isArray(props.rules)
    ? props.rules.find((r) => r.type === 'maxlength')
    : null

  return {
    min: minRule?.value || 0,
    max: maxRule?.value || 999,
  }
})

function isBlank(obj) {
  for (const [key, value] of Object.entries(obj)) {
    if (value && typeof value === 'string' && value.trim() !== '') {
      return false
    }
  }
  return true
}
</script>

<template>
  <div class="InputList">
    <div
      v-for="(item, i) in innerValue"
      :key="i"
      class="InputList__item"
    >
      <slot
        name="item"
        :item="item"
        :index="i"
      />

      <button
        class="InputList__deleter"
        type="button"
        @click="removeItemAt(i)"
      >
        &times;
      </button>
    </div>

    <button
      v-if="innerValue.length < limits.max"
      class="InputList__adder UiButton"
      type="button"
      @click="pushItem"
      v-text="adderLabel"
    />

    <UiInput
      type="invisible"
      :rules="props.rules"
      :model-value="innerValue"
    />
  </div>
</template>

<style lang="scss">
.InputList {
  &__item {
    position: relative;
    padding-right: 35px;
  }

  &__deleter {
    position: absolute;
    top: 8px;
    right: 5px;
  }
}
</style>