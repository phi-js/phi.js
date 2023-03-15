<script setup>
import { ref, watch } from 'vue'
import { useStorySettings } from '../../functions'
import CssEditor from '../../../ui/components/CssEditor/CssEditor.vue'

const props = defineProps({
  block: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:block'])

const settings = useStorySettings()
const uploadsEndpoint = settings.uploads.assets

const innerStyle = ref({})

watch(
  () => props.block,
  (block) => innerStyle.value = typeof block?.props?.style == 'object'
    ? { ...block.props.style }
    : {},
  { immediate: true },
)

function emitUpdate() {
  emit('update:block', {
    ...props.block,
    props: {
      ...props.block?.props,
      style: { ...innerStyle.value },
    },
  })
}

</script>

<template>
  <CssEditor
    v-model="innerStyle"
    class="BlockCssStyle"
    :endpoint="uploadsEndpoint"
    @update:model-value="emitUpdate"
  />
</template>