<script setup>
import { ref, watch } from 'vue'
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


const stagedItem = ref(null)

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
    _open: true,
  }

  // stagedItem.value = newItem
  innerValue.value.chain.push(newItem)
  emitUpdate()
}

function onStagedAccept() {
  innerValue.value.chain.push(stagedItem.value)
  stagedItem.value = null
  emitUpdate()
}

function ifify(item, i) {
  const ifItem = {
    info: {
      text: 'IF ...',
      icon: 'mdi:help-rhombus',
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
      handle=".StmtChainItem__face .ui-item__icon"
      group="StmtChain__items"
      @update:modelValue="emitUpdate()"
    >
      <template #item="{element, index}">
        <StmtChainItem
          v-model="innerValue.chain[index]"
          :open="element._open"
          @update:modelValue="emitUpdate()"
        >
          <template #actions>
            <UiIcon
              v-if="!element?.do?.if"
              class="item-action-icon ui--clickable"
              src="mdi:help-rhombus"
              title="IFify"
              @click.stop="ifify(element, index)"
            />
            <UiIcon
              v-else
              class="item-action-icon ui--clickable"
              src="mdi:close-network"
              title="de-IFify"
              @click.stop="deifify(element, index)"
            />
            <UiIcon
              src="mdi:close"
              class="ui--clickable"
              @click.stop="removeItem(index)"
            />
          </template>
        </StmtChainItem>
      </template>
    </draggable>

    <StmtChainItem
      v-if="stagedItem"
      v-model="stagedItem"
      open
      @update:modelValue="onStagedAccept()"
      @cancel="stagedItem = null"
    />

    <div class="StmtChain__adder">
      <VmExpressionPicker
        class="chain-expression-picker"
        @input="onPickerInput"
      />
    </div>
  </div>
</template>