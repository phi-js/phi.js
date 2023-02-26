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
    rules: props.modelValue?.rules,
    class: undefined,
    style: undefined,
  })
})

const optionsIsString = computed(() => typeof props.modelValue?.props?.options == 'string' && props.modelValue.props.options.length)
</script>

<template>
  <div
    class="InputSelectFace"
    :class="{'InputSelectFace--empty': !options.length}"
  >
    <template v-if="optionsIsString">
      <UiInput
        class="CmsBlock"
        style="pointer-events: none"
        v-bind="translatedProps"
        :options="[
          {value: 0, text: modelValue.props.options}
        ]"
      />
    </template>
    <template v-else-if="modelValue.props.type != 'select-list'">
      <!-- Use frozen input as block face -->
      <UiInput
        v-bind="translatedProps"
        class="CmsBlock"
        style="pointer-events: none"
      />
    </template>
    <template v-else>
      <span class="InputSelectFace__editor">
        <UiInput
          v-bind="translatedProps"
          class="CmsBlock"
        >
          <OptionsEditor
            v-model="options"
            @update:model-value="emitUpdate()"
          />
        </UiInput>
      </span>
      <span class="InputSelectFace__preview">
        <UiInput
          v-bind="translatedProps"
          class="CmsBlock"
        />
      </span>
    </template>
  </div>
</template>

<style lang="scss">
.InputSelectFace {
  &__editor {
    display: none;
  }
  &__preview {
    display: initial;
    pointer-events: none;
  }
}

.BlockScaffold--selected > .InputSelectFace,
.InputSelectFace--empty {
  .InputSelectFace__editor {
    display: initial;
  }
  .InputSelectFace__preview {
    display: none;
  }
}
</style>