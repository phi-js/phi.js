<script setup>
import { computed } from 'vue'
import { useI18n } from '../../../../i18n'
import { parseTranslations } from '../../../functions'
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

const isButton = computed(() =>
  props.modelValue?.props?.type
  && ['button', 'submit', 'cancel'].includes(props.modelValue.props.type))


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

function onClickFace() {
  if (!props.openAction) {
    return
  }

  props.openAction(isSelect.value ? 'InputSelectSettings' : 'InputSettings')
}
</script>

<template>
  <div
    class="InputFace CmsBlock UiInput"
    @click="onClickFace"
  >
    <!-- stand-in for empty Select fields -->
    <div
      v-if="isSelect && !Array.isArray(translatedProps?.options)"
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
      :style="!isButton ? 'pointer-events: none;' : null"
      v-bind="translatedProps"
    />
  </div>
</template>

<style lang="scss">
.InputFace {
  cursor: pointer;
  pointer-events: none;

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

.SlotItem--active {
  .InputFace {
    cursor: initial;
    pointer-events: initial;
  }
}
</style>