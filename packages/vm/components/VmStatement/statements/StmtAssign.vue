<script setup>
import { computed, ref, watch } from 'vue'
import { UiInput, UiItem } from '@/packages/ui'
import { VmStatement } from '..'
import { VmCodeBox } from '../../VmCode'

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
  return {
    ...statement.value.info,
    text: statement.value.info?.text || i18n.t('StmtAssign.assign'),
  }
})
</script>

<template>
  <VmCodeBox
    class="StmtAssign"
  >
    <template #face>
      <div class="StmtAssign__face">
        <UiItem
          class="StmtAssign__item"
          v-bind="faceItemProps"
        />
        <span
          v-if="statement.assign"
          class="StmtAssign__var"
        >{{ statement.assign }}</span>
      </div>
    </template>

    <template #default>
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
      </div>
    </template>
  </VmCodeBox>
</template>

<style lang="scss">
.StmtAssign {
  &__footer {
    background-color: rgba(0,0,0, 0.02);
    font-size: 0.9rem;
    border-radius: 4px;
    padding: 4px;
    margin-top: 1rem;
  }

  &__face {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__item {
    --ui-item-padding: 2px 3px;
    font-weight: bold;

    .UiItem__icon {
      margin-right: 8px;
    }
  }

  &__var {
    display: inline-flex;
    align-items: center;

    padding: 2px 8px;
    font-size: 0.7rem;
    background-color: var(--ui-color-primary);
    color: #fff;
    border-radius: 4px;
  }
}
</style>