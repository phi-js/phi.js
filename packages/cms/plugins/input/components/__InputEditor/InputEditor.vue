<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const block = ref()
watch(
  () => props.modelValue,
  (newValue) => block.value = { props: {}, ...newValue },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', block.value)
}

</script>

<template>
  <div class="UiInputEditor">
    <template v-if="block.component === 'InputButton'">
      <input
        v-model="block.props.label"
        class="ui-button"
        type="text"
        placeholder="Título"
        @input="emitUpdate()"
        @focus="$event.target.select()"
      >
    </template>
    <template v-else>
      <div class="UiInputEditor__label">
        <input
          v-model="block.props.label"
          type="text"
          placeholder="Título"
          @input="emitUpdate()"
          @focus="$event.target.select()"
        >
      </div>

      <div class="UiInputEditor__body">
        <input
          v-model="block.props.placeholder"
          class="ui-input__elem ui-native"
          type="text"
          @input="emitUpdate()"
          @focus="$event.target.select()"
        >
      </div>

      <div class="UiInputEditor__subtext">
        <input
          v-model="block.props.subtext"
          type="text"
          placeholder="Subtext"
          @input="emitUpdate()"
          @focus="$event.target.select()"
        >
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.UiInputEditor {
  input.ui-button {
    display: inline-block;
    font-family: var(--ui-font-secondary);
    font-size: 15px;
    font-weight: 500;
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

  &__label {
    input {
      font-family: var(--ui-font-secondary);
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