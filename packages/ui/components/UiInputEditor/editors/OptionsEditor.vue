<script setup>
import { ref, watch, nextTick } from 'vue'
import draggable from 'vuedraggable'
import { UiItem, UiIcon } from '@/packages/ui/components'
import { normalize } from '@/packages/ui/helpers'

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
</script>

<template>
  <div
    ref="refRoot"
    class="OptionsEditor"
  >
    <draggable
      v-model="innerOptions"
      group="select-block"
      :item-key="(foo) => innerOptions.indexOf(foo)"
      handle=".UiItem__icon"
      @update:modelValue="emitUpdate"
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
            >
            <input
              v-model="innerOptions[index].value"
              type="text"
              class="OptionEditor__value"
              placeholder="Valor"
              @input="emitUpdate"
            >
          </div>
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
</template>

<style lang="scss">
.OptionsEditor {
  &__option-item {
    .UiItem__icon {
      cursor: move;
    }
  }
}

.OptionEditor {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &__text {
    border: 0;
    background: transparent;
    font-size: inherit;
    color: inherit;
  }

  &__value {
    flex: 1;
    border: 0;
    border-radius: 3px;
    padding: 4px 12px;
    background-color: rgba(0, 0, 0, 0.06);
    color: inherit;
  }
}

</style>