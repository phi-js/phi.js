<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '../../../../../ui'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])
function emitInput() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerModel.value)))
}

const innerModel = ref(null)
watch(
  () => props.modelValue,
  (newValue) => {
    let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue
    if (typeof clone != 'object') {
      clone = {}
    }
    innerModel.value = {
      call: clone.call,
      args: Object.assign(
        {
          message: '',
          placeholder: '',
        },
        clone.args,
      ),
    }
  },
  { immediate: true },
)
</script>

<template>
  <div class="WindowDialogEditor">
    <label class="ui-label">{{ innerModel.call }}</label>
    <UiInput
      v-model="innerModel.args.message"
      type="text"
      label="Mensaje"
      @input="emitInput"
    />
    <UiInput
      v-if="innerModel.call == 'window.prompt'"
      v-model="innerModel.args.placeholder"
      type="text"
      label="Valor predeterminado"
      @input="emitInput"
    />
  </div>
</template>