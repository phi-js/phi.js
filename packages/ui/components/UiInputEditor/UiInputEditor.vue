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
  { immediate: true },
)

const emit = defineEmits(['update:modelValue'])
function emitUpdate() {
  emit('update:modelValue', JSON.parse(JSON.stringify(_inputProps.value)))
}

// const types = [
//   'text',
//   'textarea',
//   'select',
//   'select-native',
//   'select-list',
//   'select-buttons',
//   'number',
//   'date',
//   'password',
//   'search',
// ]

// custom editor component by type
const editorComponent = computed(() => editors?.[_inputProps.value.type] || null)
</script>

<template>
  <div class="UiInputEditor">
    <div class="UiInputEditor__label">
      <input
        v-model="_inputProps.label"
        type="text"
        placeholder="Etiqueta"
        @input="emitUpdate()"
        @focus="$event.target.select()"
      >
    </div>

    <!-- <div class="UiInputEditor__type">
      <select
        v-model="_inputProps.type"
        @change="emitUpdate()"
      >
        <option
          v-for="typeName in types"
          :key="typeName"
          :value="typeName"
          v-text="typeName"
        />
      </select>
    </div> -->

    <div
      v-if="editorComponent"
      class="UiInputEditor__custom"
    >
      <component
        :is="editorComponent"
        v-model="_inputProps"
        @update:modelValue="emitUpdate"
      />
    </div>
    <div v-else>
      <UiInput
        v-if="_inputProps.type == 'button'"
        v-model="_inputProps.label"
        type="text"
        class="ui-button"
        @update:modelValue="emitUpdate"
        @focus="$event.target.select()"
      />
      <UiInput
        v-else
        v-model="_inputProps.placeholder"
        class="UiInputEditor__body"
        :type="_inputProps.type"
        @update:modelValue="emitUpdate"
        @focus="$event.target.select()"
      />
    </div>
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