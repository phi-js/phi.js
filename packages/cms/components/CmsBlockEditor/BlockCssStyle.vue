<script setup>
import { ref, watch } from 'vue'
import { UiDetails } from '@/packages/ui'
import { useStorySettings } from '../../functions'

import OpenAiCss from '../../plugins/openai/OpenAiCss.vue'
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
  <div class="BlockCssStyle">
    <UiDetails
      open
      text="OpenAI"
      class="BlockCssStyle__ai"
    >
      <OpenAiCss
        :existing="innerStyle"
        @input="innerStyle = $event; emitUpdate()"
      />
    </UiDetails>
    <CssEditor
      v-model="innerStyle"
      class="BlockCssStyle__css"
      :endpoint="uploadsEndpoint"
      @update:model-value="emitUpdate"
    />
  </div>
</template>