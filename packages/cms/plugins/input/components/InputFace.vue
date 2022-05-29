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
    <!-- stand-in for empty Select fields -->
    <div
      v-if="isSelect && !translatedProps?.options?.length"
      class="InputFace__dummy"
    >
      <span>Click to add options</span>
      <UiInput
        v-bind="translatedProps"
        style="pointer-events: none;"
        :options="['Sample option 1', 'Sample option 2', 'Sample option 3']"
      />
    </div>
    <UiInput
      v-else
      v-bind="translatedProps"
      style="pointer-events: none;"
    />
  </div>
</template>

<style lang="scss">
.InputFace {
  cursor: pointer;

  &__dummy {
    position: relative;

    & > span {
      position: absolute;
      top: 50%;
      margin-top: -1em;
      left: 12px;
      text-shadow: 0 2px 3px #000, 0 0 6px #000;
      font-weight: bold;
      color: #fff;
    }

    .UiInput__body {
      filter: blur(0.33rem);
      opacity: 0.66;
      position: relative;
    }
  }
}

.BlockScaffold--window-open .InputFace__dummy > span {
  display: none;
}
</style>