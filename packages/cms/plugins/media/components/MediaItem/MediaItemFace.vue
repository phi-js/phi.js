<script setup>
import { computed } from 'vue'

import { UiItem } from '@/packages/ui'
import { useI18n } from '@/packages/i18n'
import { parseTranslations } from '../../../../functions'

const props = defineProps({
  /**
     * BLOCK object
    */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const i18n = useI18n()
const translatedProps = computed(() => {
  return parseTranslations(
    {
      ...props.modelValue?.props,
      class: undefined,
      style: undefined,
    },
    i18n.locale,
    props.modelValue.i18n,
  )
})

</script>

<template>
  <UiItem
    v-bind="translatedProps"
    :icon="translatedProps?.icon || 'mdi:help-rhombus'"
    :text="translatedProps?.text || 'Empty item'"
    @click.prevent="() => 0"
  />
</template>