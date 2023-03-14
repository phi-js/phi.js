<script setup>
import { computed, ref, watch } from 'vue'
import { UiInput, UiDrawer, UiItem } from '@/packages/ui/components'
import { VmStatement } from '..'

import useVmI18n from '../../../i18n'
const i18n = useVmI18n()

const props = defineProps({
  modelValue: {
    required: false,
    default: null,
    validator: () => true,
  },
})

const emit = defineEmits(['update:modelValue'])
function emitUpdate() {
  emit('update:modelValue', JSON.parse(JSON.stringify(statement.value)))
}

const statement = ref({})
watch(
  () => props.modelValue,
  (newValue) => {
    let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue
    statement.value = Object.assign(
      {
        assign: null,
        stmt: null,
      }
      , clone,
    )
  },
  { immediate: true },
)

const faceItemProps = computed(() => {
  const stmtInfo = statement.value.info || statement.value.stmt?.info
  return {
    text: i18n.t('StmtAssign.assign'),
    ...stmtInfo,
    subtext: statement.value.assign,
  }
})
</script>

<template>
  <UiDrawer class="StmtAssign">
    <template #trigger>
      <UiItem
        class="StmtAssign__item"
        v-bind="faceItemProps"
      />
    </template>
    <template #contents="{ close }">
      <div class="StmtAssign__contents">
        <VmStatement
          v-model="statement.stmt"
          class="StmtAssign__statement"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="StmtAssign__footer">
        <UiInput
          v-model="statement.assign"
          :label="i18n.t('StmtAssign.assign')"
          type="text"
          @update:model-value="emitUpdate"
        />
        <UiInput
          class="UiButton--cancel"
          type="button"
          :label="i18n.t('Close')"
          @click="close"
        />
      </div>
    </template>
  </UiDrawer>
</template>