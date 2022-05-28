<script>
let lastUsedView = 'text'
</script>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import draggable from 'vuedraggable'
import { UiItem, UiIcon, UiInput } from '@/packages/ui/components'

// import { normalize } from '@/packages/ui/helpers'

// Store default option values AS IS.
function normalize(str) {
  return str
}


const props = defineProps({
  /* Arreglo de OPTIONS
  [
    {
      text: 'xxxx',
      value: 'yyyy'
    }
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

/*
A \n delimited string with all innerOption TEXTs
*/
const stringValue = computed({
  get() {
    return innerOptions.value
      .map((opt) => opt.text)
      .join('\n')
  },

  set(newValue) {
    const newOptions = []
    const lines = newValue.trim().split('\n')
    lines.forEach((strLine) => {
      newOptions.push({
        text: strLine,
        value: strLine,
      })
    })

    innerOptions.value = newOptions
    emitUpdate()
  },
})

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

const currentView = ref(lastUsedView) // list | text

function onViewChange() {
  lastUsedView = currentView.value
}
</script>

<template>
  <div
    ref="refRoot"
    class="OptionsEditor"
  >
    <div class="OptionsEditor__body">
      <div
        v-if="currentView == 'list'"
        class="OptionsEditor__list"
      >
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
                <input
                  :value="innerOptions[index].text"
                  type="text"
                  class="OptionEditor__text"
                  placeholder="Texto"
                  @input="setOptionText(innerOptions[index], $event.target.value)"
                  @keypress.enter="pushOption"
                  @keydown.backspace="!innerOptions[index].text && deleteOption(index)"
                  @keydown.delete="!innerOptions[index].text && deleteOption(index)"
                >
                <input
                  v-model="innerOptions[index].value"
                  type="text"
                  class="OptionEditor__value"
                  placeholder="Valor"
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

        <UiItem
          tabindex="0"
          text="Agregar opción"
          icon="mdi:plus"
          @click="pushOption"
          @keypress.enter="pushOption"
        />
      </div>

      <div
        v-if="currentView == 'text'"
        class="OptionsEditor__text"
      >
        <UiInput
          v-model="stringValue"
          type="textarea"
          placeholder="Escribe una opción por línea"
        />
      </div>
    </div>

    <div class="OptionsEditor__viewPicker">
      <label>
        <input
          v-model="currentView"
          type="radio"
          value="text"
          @change="onViewChange()"
        >Texto
      </label>
      <label>
        <input
          v-model="currentView"
          type="radio"
          value="list"
          @change="onViewChange()"
        >Lista
      </label>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/packages/ui/themes/base/modifiers/clickable.scss';

.OptionsEditor {
  position: relative;

  &__viewPicker {
    text-align: right;

    label {
      font-size: 12px;
      font-weight: bold;
      user-select: none;

      display: inline-flex;
      align-items: center;
      margin-left: 2px;

      padding: 4px 6px;
      border-radius: 4px;

      @extend .ui--clickable;
    }

    input {
      padding: 0;
      margin: 0 2px 0 0;
      cursor: pointer;
    }
  }

  &__text {
    textarea {
      width: 100%;
      min-width: 300px;
      min-height: 100px !important;
    }
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
    border: 0;
    border-radius: 3px;
    padding: 4px 12px;
    background-color: rgba(255, 255, 255, 0.1);
  }

  &__text {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &__value {
    background-color: rgba(255, 255, 255, 0.05);
  }
}
</style>