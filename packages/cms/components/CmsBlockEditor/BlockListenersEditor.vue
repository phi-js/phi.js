<script setup>
import { ref, computed } from 'vue'
import { getBlockDefinition } from '../../functions'

import ListenersEditor from '../ListenersEditor/ListenersEditor.vue'

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

const availableEvents = ref([])
const blockDefinition = getBlockDefinition(props.modelValue)
if (blockDefinition?.emits?.length) {
  availableEvents.value = blockDefinition.emits
}

const blockEvents = computed({
  get() {
    let vOn = props.modelValue?.['v-on'] || {}
    return Object.keys(vOn).map((eventName) => ({
      name: eventName,
      stmt: vOn[eventName] || { chain: [] },
    }))
  },

  set(newValue) {
    let vOn = {}
    newValue.forEach((event) => vOn[event.name] = event.stmt)
    emit('update:modelValue', { ...props.modelValue, 'v-on': vOn })
  },
})
</script>

<template>
  <ListenersEditor
    v-model="blockEvents"
    class="BlockListenersEditor"
    :available-events="availableEvents"
  />
</template>