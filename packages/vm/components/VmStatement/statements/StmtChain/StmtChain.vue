<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { UiIcon } from '@/packages/ui'

import useVmI18n from '../../../../i18n'
import StmtChainItem from './StmtChainItem.vue'
import VmStatementPicker from '../../VmStatementPicker.vue'

const i18n = useVmI18n()

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
  { immediate: true, deep: true },
)

function emitUpdate() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerValue.value)))
}

function removeItem(index) {
  innerValue.value.chain.splice(index, 1)
  emitUpdate()
  endangeredIndex.value = -1
}

function onPickerInput(expression) {
  let newStmt = null
  if (typeof expression.if !== 'undefined') {
    newStmt = expression
  } else if (typeof expression.assign !== 'undefined') {
    newStmt = { ...expression }
  } else {
    // Wrap everything else inside an ASSIGN statement
    newStmt = {
      assign: '',
      stmt: expression,
    }
  }

  innerValue.value.chain.push(newStmt)
  emitUpdate()
}

function ifify(item, i) {
  const ifItem = {
    if: { and: [] },
    then: { chain: [item] },
    else: { chain: [] },
  }

  innerValue.value.chain.splice(i, 1, ifItem)
  emitUpdate()
}

function deifify(item, i) {
  innerValue.value.chain.splice(i, 1, ...item.then.chain)
  emitUpdate()
}

const endangeredIndex = ref(-1)
</script>

<template>
  <div class="StmtChain">
    <draggable
      v-model="innerValue.chain"
      class="StmtChain__items"
      item-key="nun"
      handle=".StmtChainItem__handle"
      group="StmtChain__items"
      @update:model-value="emitUpdate()"
    >
      <template #item="{ element, index }">
        <StmtChainItem
          v-model="innerValue.chain[index]"
          :class="{'StmtChainItem--endangered': endangeredIndex == index}"
          @update:model-value="emitUpdate()"
        >
          <template #actions>
            <UiIcon
              v-if="!element?.if"
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

    <VmStatementPicker
      label="Add action"
      @input="onPickerInput"
    />
  </div>
</template>