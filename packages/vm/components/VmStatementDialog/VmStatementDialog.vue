<script setup>
import { ref, watch } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiDialog, UiInput } from '@/packages/ui'
import VmStatement from '../VmStatement/VmStatement.vue'

const i18n = useI18n()

const props = defineProps({
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

const tmpValue = ref()

watch(
  () => props.modelValue,
  (newValue) => tmpValue.value = newValue || props.field.filter,
  { immediate: true },
)

function accept() {
  emitUpdate(tmpValue.value)
  return true
}

function cancel() {
  tmpValue.value = props.modelValue || props.field.filter
  return true
}

function clear() {
  emitUpdate(null)
  return true
}

function emitUpdate(newValue) {
  emit('update:modelValue', newValue)
}
</script>

<template>
  <UiDialog
    class="VmStatementDialog"
    :open="true"
  >
    <template #contents="{ close }">
      <form @submit.prevent="accept() && close()">
        <VmStatement
          v-model="tmpValue"
          open
          :fields="[field]"
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
            @click="cancel() && close();"
          />
          <UiInput
            :disabled="!modelValue"
            class="UiButton--danger"
            type="button"
            :label="i18n.t('Clear')"
            @click="clear() && close()"
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