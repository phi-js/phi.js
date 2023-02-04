<script setup>
import { ref, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'
import { useI18n, TranslationInput } from '@/packages/i18n'
import { UiItem, UiIcon, UiDialog, UiInput } from '@/packages/ui/components'

const i18n = useI18n({
  en: {
    'OptionsEditor.ImportText': 'Import text',
    'OptionsEditor.AddOption': 'Add option',
    'OptionsEditor.List': 'List',
    'OptionsEditor.Text': 'Text',
    'OptionsEditor.Value': 'Value',
    'OptionsEditor.TextareaPlaceholder': 'Write one option per line',
  },
  es: {
    'OptionsEditor.ImportText': 'Importar texto',
    'OptionsEditor.AddOption': 'Agregar opción',
    'OptionsEditor.List': 'Lista',
    'OptionsEditor.Text': 'Texto',
    'OptionsEditor.Value': 'Valor',
    'OptionsEditor.TextareaPlaceholder': 'Escribe una opción por linea',
  },
})

// import { normalize } from '@/packages/ui/helpers'
// Store default option values AS IS.
function normalize(str) {
  if (str?.$i18n) {
    return Object.values(str.$i18n)[0]
  }

  return str
}

const props = defineProps({
  /* Arreglo de OPTIONS
  [
    { text: 'xxxx', value: 'yyyy' }
  ]
  */
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
})
const emit = defineEmits(['update:modelValue'])

const innerOptions = ref([])
watch(
  () => props.modelValue,
  (newValue) => innerOptions.value = Array.isArray(newValue) ? newValue : [],
  { immediate: true, deep: true },
)

function emitUpdate() {
  emit('update:modelValue', [...innerOptions.value])
}

const refRoot = ref()
async function pushOption() {
  innerOptions.value.push({ text: '', value: '' })
  await nextTick()
  const targetInput = refRoot.value.querySelector('.OptionsEditor__option-item:last-child input')
  if (targetInput) {
    targetInput.focus()
  }
}

function deleteOption(index) {
  innerOptions.value.splice(index, 1)
  emitUpdate()
}

function setOptionText(option, newValue) {
  if (option.value === normalize(option.text)) {
    option.value = normalize(newValue)
  }
  option.text = newValue
  emitUpdate()
}

function onDialogAccept(textareaValue) {
  const incomingOptions = textareaValue
    .trim()
    .split('\n')
    .map((strLine) => strLine.trim())
    .filter((strLine) => !!strLine)
    .map((strLine) => ({
      text: strLine,
      value: strLine,
    }))

  if (incomingOptions.length) {
    innerOptions.value.push(...incomingOptions)
    emitUpdate()
  }
}

</script>

<template>
  <div
    ref="refRoot"
    class="OptionsEditor"
  >
    <div class="OptionsEditor__body">
      <draggable
        v-model="innerOptions"
        group="select-block"
        :item-key="(foo) => innerOptions.indexOf(foo)"
        handle=".UiItem__icon"
        @update:model-value="emitUpdate"
      >
        <template #item="{ index }">
          <UiItem
            class="OptionsEditor__option-item"
            :icon="modelValue.type == 'select-list'
              ? (modelValue.multiple ? 'mdi:checkbox-blank-outline' : 'mdi:radiobox-blank')
              : 'mdi:drag-vertical'"
          >
            <div class="OptionEditor">
              <TranslationInput
                :model-value="innerOptions[index].text"
                type="text"
                class="OptionEditor__text"
                :placeholder="i18n.t('OptionsEditor.Text')"
                @update:model-value="setOptionText(innerOptions[index], $event)"
                @keypress.enter="pushOption"
                @keydown.backspace="!innerOptions?.[index]?.text && deleteOption(index)"
                @keydown.delete="!innerOptions?.[index]?.text && deleteOption(index)"
              />

              <input
                v-model="innerOptions[index].value"
                type="text"
                class="OptionEditor__value"
                :placeholder="i18n.t('OptionsEditor.Value')"
                @input="emitUpdate"
                @keypress.enter="pushOption"
              >
            </div>
            <template #actions>
              <UiIcon
                src="mdi:close"
                @click="deleteOption(index)"
              />
            </template>
          </UiItem>
        </template>
      </draggable>

      <div class="OptionsEditor__addBar">
        <UiItem
          class="OptionsEditor__adder"
          tabindex="0"
          :text="i18n.t('OptionsEditor.AddOption')"
          icon="mdi:plus"
          @click="pushOption"
          @keypress.enter="pushOption"
        />

        <UiDialog
          show-close-button
          @accept="onDialogAccept(_tmp)"
        >
          <template #trigger>
            <UiItem
              class="OptionsEditor__adder"
              :text="i18n.t('OptionsEditor.ImportText')"
              icon="mdi:text-box-plus-outline"
            />
          </template>
          <template #contents>
            <UiInput
              type="textarea"
              :placeholder="i18n.t('OptionsEditor.TextareaPlaceholder')"
              @update:model-value="_tmp = $event"
            />
          </template>
        </UiDialog>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/packages/ui/themes/base/modifiers/clickable.scss';

.OptionsEditor {
  position: relative;

  &__addBar {
    border-radius: 5px;
    border: 2px dashed rgba(153, 153, 153, 0.5333333333);
    margin-top: 0.5rem;

    display: flex;
    & > :first-child {
      flex: 1;
      border-right: 1px solid var(--ui-color-ridge-right);
    }
  }

  &__adder {
    @extend .ui--clickable;
    --ui-item-padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  &__option-item {
    --ui-item-padding: 4px 0;
    .UiItem__icon {
      cursor: move;
    }
  }
}

.OptionEditor {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &__text,
  &__value {
    font-size: inherit;
    color: inherit;
    padding: 4px 12px;
    border: 1px solid var(--ui-color-ridge-right);
  }

  &__value {
    border-left: 1px solid var(--ui-color-ridge-left);
  }

  .TranslationInput {
    flex: 1;
    border-right: 0;
    input {
      width: 100%;
    }
  }
}
</style>