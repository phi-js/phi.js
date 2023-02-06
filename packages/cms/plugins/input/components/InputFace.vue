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

const isButton = computed(() =>
  props.modelValue?.props?.type
  && ['button', 'submit', 'cancel'].includes(props.modelValue.props.type))


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
  <div
    class="InputFace CmsBlock UiInput"
    @click="onClickFace"
  >
    <UiInput
      :style="!isButton ? 'pointer-events: none;' : null"
      v-bind="translatedProps"
      :rules="modelValue.rules"
    />
  </div>
</template>

<style lang="scss">
.InputFace {
  cursor: pointer;
  pointer-events: none;
}

// .SlotItem--active {
//   .InputFace {
//     cursor: initial;
//     pointer-events: initial;
//   }
// }
</style>