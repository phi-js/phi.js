<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, watch, computed } from 'vue'
import { UiInput } from '../UiInput'
import editors from './editors'

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})

const _inputProps = ref()
watch(
  () => props.modelValue,
  (newValue) => _inputProps.value = newValue ? JSON.parse(JSON.stringify(newValue)) : {},
  {
    immediate: true,
    deep: true,
  },
)

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
function emitUpdate() {
  emit('update:modelValue', JSON.parse(JSON.stringify(_inputProps.value)))
}

// custom editor component by type
const editorComponent = computed(() => editors?.[_inputProps.value.type] || null)
</script>

<template>
  <div class="UiInputEditor" :style="$attrs.style">
    <div v-if="_inputProps.type != 'button'" class="UiInputEditor__label">
      <input
        v-model="_inputProps.label"
        type="text"
        placeholder="Etiqueta"
        @input="emitUpdate()"
        @focus="$event.target.select(); $emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </div>

    <div v-if="editorComponent" class="UiInputEditor__custom">
      <component
        :is="editorComponent"
        v-bind="{ ...$attrs, style: undefined }"
        v-model="_inputProps"
        @update:modelValue="emitUpdate"
      />
    </div>
    <div v-else>
      <input
        v-if="_inputProps.type == 'button'"
        v-model="_inputProps.label"
        type="text"
        class="UiInputEditor__button UiButton"
        onkeypress="this.size = this.value.length"
        @input="emitUpdate"
        @focus="$event.target.select(); $emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      <UiInput
        v-else
        v-model="_inputProps.placeholder"
        class="UiInputEditor__body"
        :type="_inputProps.type"
        @update:modelValue="emitUpdate"
        @focus="$event.target.select(); $emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
    </div>
  </div>
</template>

<style lang="scss">
.UiInputEditor {
  input.UiInputEditor__button {
    font-size: 0.95em;
    font-weight: 500;
    outline: none;
    padding: 0;
  }

  &__label,
  &__subtext {
    input {
      display: block;
      width: 100%;
      border: 0;
      background: transparent;
    }

    &:hover {
      background-color: #ff8;
    }
  }

  &__subtext {
    input {
      font-size: 1em;
    }
  }

  &__body {
    input {
      color: rgba(0, 0, 0, 0.36);
    }
  }
}
</style>