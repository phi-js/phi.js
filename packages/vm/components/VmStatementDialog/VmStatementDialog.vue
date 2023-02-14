<script setup>
import { useI18n } from '@/packages/i18n'
import { UiDialog, UiInput } from '@/packages/ui'
import VmStatement from '../VmStatement/VmStatement.vue'
import FieldCondition from './FieldCondition.vue'

const i18n = useI18n()

defineProps({
  /*
  Current statement
  {
    "search": {
      "string": "Pedro",
      "fields": [....]
    }
  }
  or
  {
    "and": [
      {"field": "$person.firstname", "op": "like", "args": "pepe"},
      {"field": "$person.lastname", "op": "like", "args": "pere"},
    ]
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  /*
  Field schema (same column object used in UiDataTable)
  */
  field: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

function emitUpdate(newValue) {
  emit('update:modelValue', newValue)
  return true
}
</script>

<template>
  <UiDialog
    class="VmStatementDialog"
    :open="true"
  >
    <template #contents="{ close }">
      <form @submit.prevent="emitUpdate(_tmp) && close()">
        <VmStatement
          v-if="field.filter"
          :model-value="modelValue || field.filter"
          open
          @update:model-value="_tmp = $event"
        />
        <FieldCondition
          v-else
          class="VmStatementDialog__content"
          :model-value="modelValue"
          :schema="field"
          @update:model-value="_tmp = $event"
        />
        <footer class="VmStatementDialog__footer">
          <UiInput
            type="submit"
            :label="i18n.t('Accept')"
          />
          <UiInput
            class="UiButton--cancel"
            type="button"
            :label="i18n.t('Cancel')"
            @click="close()"
          />
          <UiInput
            :disabled="!modelValue"
            class="UiButton--danger"
            type="button"
            :label="i18n.t('Clear')"
            @click="emitUpdate(null) && close()"
          />
        </footer>
      </form>
    </template>
  </UiDialog>
</template>

<style lang="scss">
.VmStatementDialog {
  &__content {
    padding: 8px;

    input[type=search] {
      width: 100%;
    }
  }

  &__footer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    gap: 8px;
    padding: 8px;

    .UiButton--danger {
      margin-left: auto;
    }
  }

  .UiDialog__footer {
    display: none;
  }
}
</style>