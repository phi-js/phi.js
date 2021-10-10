<script setup>
import getEditors from '../../functions/getEditors.js'
import { shallowRef, watch } from 'vue'
import { UiTabs, UiTab, UiInput } from '/packages/ui/components'
import { VmStatement } from '/packages/vm/components'

const props = defineProps({
  block: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:block'])

const actions = shallowRef([])
watch(
  () => props?.block?.component,
  async () => {
    const editors = await getEditors(props.block)
    actions.value = editors.actions
  },
  { immediate: true },
)
</script>

<template>
  <UiTabs
    class="BlockEditorActions"
    :model-value="0"
  >
    <UiTab
      v-for="(action,i) in actions"
      :key="i"
      :value="i"
      :text="action.title"
      icon="mdi:star"
    >
      <component
        :is="action.component"
        v-if="action.component"
        v-bind="action.props"
        :model-value="props.block"
        @update:modelValue="emit('update:block', $event)"
      />
    </UiTab>

    <UiTab
      text="v-if"
      icon="mdi:vuejs"
    >
      <VmStatement
        :model-value="props.block['v-if']"
        @update:modelValue="emit('update:block', {...props.block, 'v-if': $event})"
      />
    </UiTab>

    <UiTab
      xxxxx-v-if="typeof props.block['v-model'] !== 'undefined'"
      text="v-model"
      icon="mdi:vuejs"
    >
      <UiInput
        type="text"
        :model-value="props.block['v-model']"
        @update:modelValue="emit('update:block', {...props.block, 'v-model': $event})"
      />
    </UiTab>

    <UiTab
      text="Source"
      icon="mdi:vuejs"
    >
      <UiInput
        type="json"
        :model-value="props.block"
        @update:modelValue="emit('update:block', $event)"
      />
    </UiTab>
  </UiTabs>
</template>