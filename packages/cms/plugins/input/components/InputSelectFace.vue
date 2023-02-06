<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from '../../../../i18n'
import { UiInput } from '@/packages/ui/components'
import OptionsEditor from '@/packages/ui/components/UiInputEditor/editors/OptionsEditor.vue'

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

const emit = defineEmits(['update:modelValue'])

const options = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    options.value = Array.isArray(newValue?.props?.options)
      ? newValue.props.options
      : []
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    props: {
      ...props.modelValue.props,
      options: options.value,
    },
  })
}

const i18n = useI18n()
const translatedProps = computed(() => {
  return i18n.obj({
    ...props.modelValue?.props,
    class: undefined,
    style: undefined,
  })
})
</script>

<template>
  <div
    class="InputSelectFace CmsBlock"
    :class="{'InputSelectFace--empty': !options.length}"
  >
    <UiInput
      v-bind="translatedProps"
      class="InputSelectFace__editor"
    >
      <OptionsEditor
        v-model="options"
        @update:model-value="emitUpdate()"
      />
    </UiInput>
    <UiInput
      v-bind="translatedProps"
      class="InputSelectFace__preview"
    />
  </div>
</template>

<style lang="scss">
// .InputSelectFace {
//   position: relative;

//   &__editor {
//     position: absolute;
//     top: 0;
//     left: 0;
//     opacity: 0.5;
//     border: 1px dashed red;
//   }
//   &__preview {
//     display: block;
//     pointer-events: none;
//   }
// }


.InputSelectFace {
  &__editor {
    display: none;
  }
  &__preview {
    display: block;
    pointer-events: none;
  }
}

.BlockScaffold--selected,
.InputSelectFace--empty {
  .InputSelectFace {
    &__editor {
      display: block;
    }
    &__preview {
      display: none;
    }
  }
}
</style>