<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { useAttrs, computed, ref, watchEffect } from 'vue'
import { useI18n } from '../../../../i18n'
import { parseTranslations } from '../../../functions'
import { UiItem, UiInput } from '@/packages/ui/components'

const attrs = useAttrs()

const props = defineProps({
  /*
  BLOCK object
  {
    props: {
      type,
      label,
      subtext,
      options,
    }
  }
  */
  modelValue: {
    type: Object,
    required: true,
  },

  openAction: {
    type: Function,
    required: false,
    default: null,
  },
})

const isSelect = computed(() =>
  props.modelValue?.props?.type
  && props.modelValue.props.type.substring(0, 6) == 'select')

const i18n = useI18n()
const translatedProps = ref()
watchEffect(() => {
  if (props.modelValue.i18n) {
    translatedProps.value = parseTranslations({ ...props.modelValue?.props }, props.modelValue.i18n, i18n.locale)
  } else {
    translatedProps.value = { ...props.modelValue?.props }
  }
})
</script>

<template>
  <div
    class="InputFace"
    :class="attrs?.class"
    :style="attrs?.style"
    @click="openAction('InputSettings')"
  >
    <UiInput
      v-bind="translatedProps"
      style="pointer-events: none;"
    />
    <UiItem
      v-if="isSelect && !translatedProps?.options?.length"
      text="Add options"
      icon="mdi:form-dropdown"
      class="ui--clickable"
    />
  </div>
</template>