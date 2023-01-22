<script setup>
import { ref, watch } from 'vue'
import { UiInput, UiDetails, UiItem } from '@/packages/ui/components'
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

const statement = ref(null)
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
</script>

<template>
  <UiDetails class="StmtAssign">
    <template #summary>
      <UiItem
        class="StmtAssign__item"
        v-bind="statement"
        :subtext="statement.assign"
      />
    </template>
    <template #contents>
      <div class="StmtAssign__contents">
        <VmStatement
          v-model="statement.stmt"
          class="StmtAssign__statement"
          @update:model-value="emitUpdate"
        />

        <div class="StmtAssign__footer">
          <UiInput
            v-model="statement.assign"
            :label="i18n.t('StmtAssign.assign')"
            type="text"
            @update:model-value="emitUpdate"
          />
        </div>
      </div>
    </template>
  </UiDetails>
</template>