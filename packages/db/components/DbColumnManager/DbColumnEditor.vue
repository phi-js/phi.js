<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  {
    ... column object
    The column object is a JSON SCHEMA, with an added "property" property
    and an added "enabled" property

    "title": "Fecha"
    "type": "integer",
    "format": "date",

    "property": "objrecord.date",
    "enabled": true
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'accept', 'cancel'])

const innerValue = ref([])
const originalValue = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = JSON.parse(JSON.stringify(newValue))

    if (!originalValue.value) {
      originalValue.value = JSON.parse(JSON.stringify(innerValue.value))
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', innerValue.value)
}

function accept() {
  originalValue.value = null
  emit('accept', innerValue.value)
}

function cancel() {
  innerValue.value = JSON.parse(JSON.stringify(originalValue.value))
  originalValue.value = null
  emitUpdate()
  emit('cancel')
}
</script>

<template>
  <form
    class="DbColumnEditor"
    @submit.prevent="accept()"
  >
    <UiInput
      v-model="innerValue.title"
      type="text"
      label="Title"
      @update:model-value="emitUpdate"
    />
    <UiInput
      v-model="innerValue.format"
      type="text"
      label="Format"
      @update:model-value="emitUpdate"
    />

    <details>
      <summary>Advanced</summary>
      <section>
        <UiInput
          v-model="innerValue"
          type="json"
          @update:model-value="emitUpdate"
        />
      </section>
    </details>

    <footer>
      <UiInput
        type="submit"
        label="Accept"
      />
      <UiInput
        type="button"
        class="UiButton--cancel"
        label="Cancel"
        @click="cancel()"
      />
    </footer>
  </form>
</template>