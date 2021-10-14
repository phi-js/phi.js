<script setup>
import { ref, watch, computed } from 'vue'
import SelectOptionsEditor from './SelectOptionsEditor.vue'

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

// const isMultiple = computed({
//   get() {
//     return !!_inputProps.value.multiple
//   },

//   set(newValue) {
//     _inputProps.value.multiple = !!newValue
//     emitUpdate()
//   },
// })

</script>

<template>
  <div class="SelectEditor">
    <!-- <div class="SelectEditor__multiple">
      <label>
        <input
          v-model="isMultiple"
          type="radio"
          :value="false"
        >
        único
      </label>
      <label>
        <input
          v-model="isMultiple"
          type="radio"
          :value="true"
        >
        multiple
      </label>
    </div> -->

    <SelectOptionsEditor
      v-model:options="_inputProps.options"
      :multiple="_inputProps.multiple"
      @update:options="emitUpdate"
    />
  </div>
</template>