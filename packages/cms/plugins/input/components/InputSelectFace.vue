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

const optionsIsString = computed(() => typeof props.modelValue?.props?.options == 'string' && props.modelValue.props.options.length)
</script>

<template>
  <div
    class="InputSelectFace CmsBlock"
    :class="{'InputSelectFace--empty': !options.length}"
  >
    <template v-if="optionsIsString">
      <UiInput
        style="pointer-events:none"
        v-bind="translatedProps"
        :options="[
          {value: 0, text: modelValue.props.options}
        ]"
      />
    </template>
    <template v-else>
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
        class="InputSelectFace__preview CmsBlock"
      />
    </template>
  </div>
</template>

<style lang="scss">
.InputSelectFace {
  &__editor {
    display: none;
  }
  &__preview {
    display: block;
    pointer-events: none;
  }
}

.BlockScaffold--selected > .InputSelectFace,
.InputSelectFace--empty {
  .InputSelectFace__editor {
    display: block;
  }
  .InputSelectFace__preview {
    display: none;
  }
}
</style>