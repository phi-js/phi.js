<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'

import StmtChainItem from './StmtChainItem.vue'
import VmExpressionPicker from '../../VmExpressionPicker.vue'
import { useI18n } from '@/packages/i18n'
import { UiIcon } from '@/packages/ui'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerValue = ref({})
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = newValue ? JSON.parse(JSON.stringify(newValue)) : { chain: [] },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerValue.value)))
}

function removeItem(index) {
  innerValue.value.chain.splice(index, 1)
  emitUpdate()
}


const latestAddedIndexes = ref([]) // used to open drawers of newly created items

function onPickerInput({ expression, definition }) {
  if (expression.if) {
    expression.then = { chain: [] }
    expression.else = { chain: [] }
  }

  let newItem = {
    info: {
      text: definition.text,
      icon: definition.icon,
      secondary: definition.secondary,
    },
    do: expression,
    assign: null,
  }

  innerValue.value.chain.push(newItem)
  latestAddedIndexes.value.push(innerValue.value.chain.length - 1)
  emitUpdate()
}

function ifify(item, i) {
  const ifItem = {
    info: {
      text: 'IF ...',
      icon: 'mdi:directions-fork',
    },
    do: {
      if: { and: [] },
      then: { chain: [item] },
      else: { chain: [] },
    },
    assign: null,
  }

  innerValue.value.chain.splice(i, 1, ifItem)
  emitUpdate()
}

function deifify(item, i) {
  innerValue.value.chain.splice(i, 1, ...item.do.then.chain)
  emitUpdate()
}

const i18n = useI18n({
  en: {
    'StmtChain.ifify': 'Wrap in conditional',
    'StmtChain.deifify': 'Remove conditional',
    'StmtChain.deleteItem': 'Delete action',
  },
  es: {
    'StmtChain.ifify': 'Insertar en condicional',
    'StmtChain.deifify': 'Remover condicional',
    'StmtChain.deleteItem': 'Eliminar acción',
  },
})

const endangeredIndex = ref(-1)
</script>

<template>
  <div class="StmtChain">
    <draggable
      v-model="innerValue.chain"
      class="StmtChain__items"
      item-key="nun"
      handle=".StmtChainItem__face"
      group="StmtChain__items"
      @update:model-value="emitUpdate()"
    >
      <template #item="{ element, index }">
        <StmtChainItem
          v-model="innerValue.chain[index]"
          :class="{'StmtChainItem--endangered': endangeredIndex == index}"
          :open="latestAddedIndexes.includes(index)"
          @update:model-value="emitUpdate()"
        >
          <template #actions>
            <UiIcon
              v-if="!element?.do?.if"
              class="StmtChainItem__actionIcon"
              src="mdi:directions-fork"
              :title="i18n.t('StmtChain.ifify')"
              @click.stop="ifify(element, index)"
            />
            <UiIcon
              v-else
              class="StmtChainItem__actionIcon"
              src="mdi:minus-network"
              :title="i18n.t('StmtChain.deifify')"
              @click.stop="deifify(element, index)"
            />
            <UiIcon
              class="StmtChainItem__actionIcon"
              src="mdi:close"
              :title="i18n.t('StmtChain.deleteItem')"
              @click.stop="removeItem(index)"
              @mouseenter="endangeredIndex = index"
              @mouseleave="endangeredIndex = -1"
            />
          </template>
        </StmtChainItem>
      </template>
    </draggable>

    <VmExpressionPicker
      class="StmtChain__adder"
      @input="onPickerInput"
    />
  </div>
</template>