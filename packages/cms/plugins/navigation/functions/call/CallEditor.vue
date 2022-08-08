<script setup>
import { ref, watch, inject, computed } from 'vue'
import { UiInput } from '../../../../../ui'

const props = defineProps({
  /*
  fn call statement
  {
    call: "Story.call"
    args: {
      fn: "Function name"
    }
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const fnName = ref('')
watch(
  () => props.modelValue,
  () => fnName.value = props.modelValue?.args?.fn || '',
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    args: { fn: fnName.value },
  })
}

const injectedStoryData = inject('$_cms_story_builder', null)
const availableMethods = computed(() => injectedStoryData?.story?.value?.methods || [])
</script>

<template>
  <div class="CallEditor">
    <UiInput
      v-model="fnName"
      type="select-native"
      :options="availableMethods"
      option-value="$.name"
      option-text="$.name"
      label="Invocar"
      placeholder="Choose function"
      @update:model-value="emitUpdate()"
    />
  </div>
</template>