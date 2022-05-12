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

const block = ref()

watch(
  () => props.modelValue,
  (newValue) => {
    block.value = newValue
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', { ...block.value })
}

</script>

<template>
  <div class="BlockVisibilityEditor">
    <details open>
      <summary>Visible cuando</summary>
      <section>
        <VmStatement
          v-model="block['v-if']"
          :default="{ and: [] }"
          @update:model-value="emitUpdate"
        />
      </section>
    </details>

    <!-- <UiInput
      v-model="block.transition"
      type="checkbox"
      label="Usar animación"
      @update:model-value="emitUpdate"
    /> -->

    <details>
      <summary>Repeat</summary>
      <section>
        <UiInput
          v-model="block['v-for']"
          type="text"
          model="v-for"
          label="Repeat for every item in"
          placeholder="Variable"
          subtext="The iterated value is available as $item"
          @update:model-value="emitUpdate"
        />
      </section>
    </details>
  </div>
</template>