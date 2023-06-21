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
    default: '',
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

let _changesCameFromProp = false
let _isFirstExecution = true

watch(
  () => props.modelValue,
  (newValue) => {
    if (_isFirstExecution) {
      _isFirstExecution = false
    } else {
      _changesCameFromProp = true
    }

    innerValue.value = Array.isArray(newValue)
      ? JSON.parse(JSON.stringify(newValue))
      : []
  },
  { immediate: true },
)

watch(
  innerValue,
  () => {
    // Ignore this watch if the changes came from props.modelValue
    if (_changesCameFromProp) {
      _changesCameFromProp = false
      return
    }

    // Emit an upate when innerValue was changed directly
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
        tabindex="-1"
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
      v-text="adderLabel || 'Add item'"
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

    padding: 4px 12px;
    padding-right: 35px;

    border-radius: 4px;
    background-color: rgba(0,0,0, 0.03);
    margin-bottom: 1rem;
  }

  &__deleter {
    position: absolute;
    top: 3px;
    right: 3px;

    border: 0;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 18px;
    font-weight: bold;
    background: transparent;
    color: red;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }
}
</style>