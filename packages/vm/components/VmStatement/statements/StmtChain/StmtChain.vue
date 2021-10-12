<script setup>
import { ref, watch } from 'vue'
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

function onPickerInput({ expression, definition }) {
  if (expression.if) {
    expression.then = { chain: [] }
    expression.else = { chain: [] }
  }

  const chainItem = {
    info: {
      text: definition.text,
      icon: definition.icon,
      secondary: definition.secondary,
    },
    do: expression,
    assign: null,
  }

  innerValue.value.chain.push(chainItem)
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
    <div class="StmtChain__items">
      <StmtChainItem
        v-for="(item, i) in innerValue.chain"
        :key="i"
        v-model="innerValue.chain[i]"
        @update:modelValue="emitUpdate()"
      >
        <template #actions>
          <UiIcon
            v-if="!item?.do?.if"
            class="item-action-icon ui-clickable"
            src="mdi:help-rhombus"
            title="IFify"
            @click.stop="ifify(item, i)"
          />
          <UiIcon
            v-else
            class="item-action-icon ui-clickable"
            src="mdi:close-network"
            title="de-IFify"
            @click.stop="deifify(item, i)"
          />
          <UiIcon
            src="mdi:close"
            class="ui-clickable"
            @click.stop="removeItem(i)"
          />
        </template>
      </StmtChainItem>
    </div>

    <div class="StmtChain__adder">
      <VmExpressionPicker
        class="chain-expression-picker"
        @input="onPickerInput"
      />
    </div>
  </div>
</template>