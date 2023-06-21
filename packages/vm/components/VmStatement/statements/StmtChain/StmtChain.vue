<script>
import { defineAsyncComponent, ref, watch } from 'vue'
const isDragging = ref(false)
</script>

<script setup>
import { UiIcon, UiCodeLine } from '@/packages/ui'
import useVmI18n from '../../../../i18n'
import VmStatementPicker from '../../VmStatementPicker.vue'
import VmStatement from '../../VmStatement.vue'

const draggable = defineAsyncComponent(() => import('vuedraggable'))

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
  (newValue) => {
    innerValue.value = newValue
      ? JSON.parse(JSON.stringify(newValue))
      : { chain: [] }
  },
  { immediate: true, deep: true },
)

function emitUpdate() {
  const retval = JSON.parse(JSON.stringify(innerValue.value))
  emit('update:modelValue', retval)
}

const endangeredIndex = ref(-1)
const lastAddedIndex = ref(-1)

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
      stmt: {
        ...expression,
        info: undefined,
      },
      info: expression.info,
    }
  }

  innerValue.value.chain.push(newStmt)
  emitUpdate()

  lastAddedIndex.value = innerValue.value.chain.length - 1
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
  innerValue.value.chain.splice(i, 1, ...(item.then?.chain || []))
  emitUpdate()
}
</script>

<template>
  <div
    class="StmtChain"
    :class="{'StmtChain--dragging': isDragging}"
  >
    <draggable
      v-model="innerValue.chain"
      class="StmtChain__items"
      handle=".StmtChainItem__drag"
      group="StmtChain__items"
      :item-key="chainItem => innerValue.chain.indexOf(chainItem)+2"
      @update:model-value="emitUpdate()"
      @start="isDragging = true"
      @end="isDragging = false"
    >
      <template #header>
        <UiCodeLine
          v-if="isDragging"
          class="StmtChain__dropzone"
        />
      </template>

      <template #item="{ element, index }">
        <div
          class="StmtChainItem"
          :class="{'StmtChainItem--endangered': endangeredIndex == index}"
        >
          <VmStatement
            v-model="innerValue.chain[index]"
            class="StmtChainItem__statement"
            :open="index === lastAddedIndex"
            @update:model-value="emitUpdate()"
          />
          <div class="StmtChainItem__actions">
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
            <UiIcon
              class="StmtChainItem__drag StmtChainItem__actionIcon"
              src="mdi:drag"
            />
          </div>
        </div>
      </template>
    </draggable>

    <VmStatementPicker
      icon="mdi:plus"
      :text="i18n.t('StmtChain.addAction')"
      @input="onPickerInput"
    />
  </div>
</template>