<script setup>
import { getBlockDefinition } from '../../composables'
import { computed, shallowRef, watch, defineAsyncComponent } from 'vue'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const blockDefinition = shallowRef(null)

watch(
  () => props.block?.component,
  async () => {
    let definition = await getBlockDefinition(props.block)
    if (!definition?.block?.component) {
      console.warn('Could not find definition for block', props.block)
      return
    }

    blockDefinition.value = {
      component: (typeof definition.block.component === 'function')
        ? defineAsyncComponent(definition.block.component)
        : definition.block.component,

      props: { ...definition.block.props },
    }
  },
  { immediate: true },
)

const blockProps = computed(() => {
  return {
    ...blockDefinition.value?.props,
    ...props.block?.props,
  }
})
</script>

<template>
  <component
    :is="blockDefinition.component"
    v-if="blockDefinition"
    class="CmsBlock"
    v-bind="blockProps"
  />
</template>