<script setup>
import { ref, watch } from 'vue'
// import draggable from 'vuedraggable/src/vuedraggable'
import draggable from 'vuedraggable'

import StmtChainItem from './StmtChainItem.vue'
import VmExpressionPicker from '../../VmExpressionPicker.vue'
import { UiIcon } from '../../../../../ui'

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
</script>

<template>
  <div class="StmtChain">
    <draggable
      v-model="innerValue.chain"
      class="StmtChain__items"
      item-key="nun"
      handle=".StmtChainItem__face"
      group="StmtChain__items"
      @update:modelValue="emitUpdate()"
    >
      <template #item="{ element, index }">
        <StmtChainItem
          v-model="innerValue.chain[index]"
          :open="latestAddedIndexes.includes(index)"
          @update:modelValue="emitUpdate()"
        >
          <template #actions>
            <UiIcon
              v-if="!element?.do?.if"
              class="item-action-icon ui--clickable"
              src="mdi:directions-fork"
              title="Wrap in conditional"
              @click.stop="ifify(element, index)"
            />
            <UiIcon
              v-else
              class="item-action-icon ui--clickable"
              src="mdi:minus-network"
              title="Remove conditional"
              @click.stop="deifify(element, index)"
            />
            <UiIcon src="mdi:close" class="ui--clickable" @click.stop="removeItem(index)" />
          </template>
        </StmtChainItem>
      </template>
    </draggable>

    <div class="StmtChain__adder">
      <VmExpressionPicker class="chain-expression-picker" @input="onPickerInput" />
    </div>
  </div>
</template>