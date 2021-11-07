<script setup>
import { ref, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'
import { UiItem, UiIcon, UiInput } from '/packages/ui/components'
import OptionEditor from './OptionEditor.vue'

const props = defineProps({
  /* Objeto PROPS del bloque:
  {
    options: [] // arreglo de opciones
    multiple: true/false
    type: 'select' | 'select-native' | 'select-list', | 'select-buttons'
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerOptions = ref([])
watch(
  () => props.modelValue?.options,
  (newValue) => innerOptions.value = Array.isArray(newValue) ? newValue : [],
  { immediate: true, deep: true },
)

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    options: [...innerOptions.value],
  })
}

const refBody = ref()
async function pushOption() {
  innerOptions.value.push({ text: '', value: '' })
  await nextTick()
  const targetInput = refBody.value.querySelector('.SelectEditor__option-item:last-child input')
  if (targetInput) {
    targetInput.focus()
  }
}

function deleteOption(index) {
  innerOptions.value.splice(index, 1)
  emitUpdate()
}
</script>

<template>
  <div
    class="SelectEditor"
    :class="`SelectEditor--type-${modelValue.type}`"
  >
    <UiInput
      v-if="modelValue.type != 'select-list'"
      class="SelectEditor__preview"
      v-bind="modelValue"
      :options="innerOptions"
      label=""
    />

    <div
      ref="refBody"
      class="SelectEditor__body"
    >
      <draggable
        v-model="innerOptions"
        class="SelectEditor__options"
        group="select-block"
        :item-key="(foo) => innerOptions.indexOf(foo)"
        handle=".ui-item__icon"
        @update:modelValue="emitUpdate"
      >
        <template #item="{ index }">
          <UiItem
            class="SelectEditor__option-item"
            :icon="modelValue.type == 'select-list'
              ? (modelValue.multiple ? 'mdi:checkbox-blank-outline' : 'mdi:radiobox-blank')
              : 'mdi:drag-vertical'"
          >
            <OptionEditor
              v-model:option="innerOptions[index]"
              @update:option="emitUpdate()"
            />
            <template #actions>
              <UiIcon
                src="mdi:close"
                class="ui--clickable"
                @click="deleteOption(index)"
              />
            </template>
          </UiItem>
        </template>
      </draggable>

      <UiItem
        tabindex="0"
        text="Agregar opción"
        icon="mdi:plus"
        class="ui--clickable"
        @click="pushOption"
        @keypress.enter="pushOption"
      />
    </div>
  </div>
</template>

<style lang="scss">
.SelectEditor {
  &__option-item {
    .ui-item__icon {
      cursor: move;
    }
  }

  &--type-select,
  &--type-select-native {
    .SelectEditor__body {
      max-width: 440px;

      // Estilos de tippy-box
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.4;
      white-space: normal;
      outline: 0;
      transition-property: transform,visibility,opacity;
      background-color: #fff;
      background-clip: padding-box;
      border: 1px solid rgba(0,8,16,.15);
      color: #333;
      box-shadow: 0 4px 14px -2px rgb(0 8 16 / 8%);
    }
  }
}

.OptionEditor {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &__input-text {
    border: 0;
    background: transparent;
    font-size: inherit;
  }

  &__input-value {
    border: 0;
    border-radius: 3px;
    padding: 4px 12px;
    background-color: rgba(0, 0, 0, 0.06);
  }
}
</style>