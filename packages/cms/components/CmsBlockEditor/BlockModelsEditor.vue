<script setup>
import { ref, watch } from 'vue'
import { VmStatement } from '../../../vm/components'
import { UiInput } from '../../../ui/components'

const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const models = ref([])

watch(
  () => props.modelValue,
  (newValue) => {
    models.value = []
    for (const propName in newValue) {
      if (propName === 'v-model') {
        models.value.push({
          propName,
          modelName: 'default',
          targetName: newValue[propName],
        })
      } else if (propName.substring(0, 8) === 'v-model:') {
        models.value.push({
          propName,
          modelName: propName.substring(8),
          targetName: newValue[propName],
        })
      }
    }
  },
  { immediate: true },
)

function emitUpdate() {
  let modelProps = {}
  models.value.forEach((modelInfo) => modelProps[modelInfo.propName] = modelInfo.targetName)
  emit('update:modelValue', { ...props.modelValue, ...modelProps })
}
</script>

<template>
  <div class="BlockModelsEditor UiForm">
    <UiInput
      v-for="(model, i) in models"
      :key="i"
      v-model="models[i].targetName"
      type="text"
      :label="model.propName"
      @update:modelValue="emitUpdate()"
    />
  </div>
</template>