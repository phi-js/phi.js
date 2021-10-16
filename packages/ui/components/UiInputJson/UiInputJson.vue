<script setup>
import { ref, watch } from 'vue'
import { UiIcon } from '../UiIcon'

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

  placeholder: {
    type: String,
    default: '',
  },
})

const stringValue = ref('')
const isValid = ref(true)

watch(
  () => props.modelValue,
  (newValue) => {
    let incomingString = JSON.stringify(newValue, null, 2)
    let curString
    try {
      curString = JSON.stringify(JSON.parse(stringValue.value), null, 2)
    } catch (err) {
      curString = null
    }

    if (incomingString != curString) {
      stringValue.value = incomingString
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

function onTextareaInput() {
  try {
    emit('update:modelValue', JSON.parse(stringValue.value))
    isValid.value = true
  } catch (err) {
    isValid.value = false
  }
}

function pretify() {
  try {
    stringValue.value = JSON.stringify(JSON.parse(stringValue.value), null, 2)
  } catch (err) {
    // zzzzzz
  }
}
</script>

<template>
  <div
    class="UiInputJson"
    :class="{ 'UiInputJson--invalid': !isValid }"
  >
    <textarea
      v-model="stringValue"
      class="ui-native UiInputJson__textarea"
      spellcheck="false"
      :placeholder="props.placeholder"
      @input="onTextareaInput"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />

    <div class="UiInputJson__footer">
      <UiIcon
        v-if="isValid"
        class="ui-clickable"
        src="mdi:check"
        title="Format JSON"
        @click="pretify"
      />
      <UiIcon
        v-else
        src="mdi:alert-circle"
      />
    </div>
  </div>
</template>

<style lang="scss">
.UiInputJson {
  display: flex;
  flex-direction: column;

  &__textarea {
    display: block;
    min-height: 200px;
  }

  &__footer {
    &:hover {
      color: green;
    }
  }

  &--invalid {
    .UiInputJson {
      &__textarea {
        outline-color: var(--ui-color-danger);
      }

      &__validator {
        color: var(--ui-color-danger);
      }
    }
  }
}
</style>
