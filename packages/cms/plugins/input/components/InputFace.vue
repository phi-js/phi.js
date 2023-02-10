<script setup>
import { computed } from 'vue'
import { useI18n } from '../../../../i18n'
import { UiInput } from '@/packages/ui/components'

const props = defineProps({
  /*
  BLOCK object
  {
    props: {
      type,
      label,
      subtext,
      options,
    },
    rules: [
      {type: 'required'}
    ]
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

const i18n = useI18n()
const translatedProps = computed(() => {
  return i18n.obj({
    ...props.modelValue?.props,
    class: undefined,
    style: undefined,
  })
})

function onClickFace() {
  if (!props.openAction) {
    return
  }

  props.openAction('InputSettings')
}
</script>

<template>
  <UiInput
    class="InputFace CmsBlock"
    v-bind="translatedProps"
    :rules="modelValue.rules"
    @click="onClickFace"
  />
</template>

<style lang="scss">
.InputFace {
  cursor: pointer;
  pointer-events: none;
}
</style>