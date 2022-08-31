<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const i18n = useI18n()

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  acceptLabel: {
    type: String,
    required: false,
    default: '',
  },

  cancelLabel: {
    type: String,
    required: false,
    default: '',
  },

  deleteLabel: {
    type: String,
    required: false,
    default: '',
  },

  deleteConfirm: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'accept', 'cancel', 'delete', 'done'])

const initialValue = ref()

let _halt = false

watch(
  () => props.modelValue,
  (newValue) => {
    if (_halt) {
      _halt = false
      return
    }

    if (!initialValue.value) {
      initialValue.value = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue
    }
  },
  { immediate: true },
)

function accept() {
  emit('update:modelValue', props.modelValue)
  emit('accept')
  emit('done')
  initialValue.value = null
}

function cancel() {
  _halt = true

  Object.assign(props.modelValue, { ...initialValue.value }) // !!! Machete: modify the initial reference (so it reactively shows initial values before the reference is overwritten by update:modelValue)
  emit('update:modelValue', JSON.parse(JSON.stringify(initialValue.value)))
  emit('cancel')
  emit('done')
  initialValue.value = null
}

function emitDelete() {
  if (props.deleteConfirm && !confirm(props.deleteConfirm)) {
    return
  }

  emit('delete')
  emit('done')
  initialValue.value = null
}
</script>

<template>
  <form
    v-if="modelValue"
    class="UiDataForm"
    method="dialog"
    @submit.prevent="accept()"
  >
    <div class="UiDataForm__body">
      <slot name="default" />
    </div>

    <footer class="UiDataForm__footer">
      <UiInput
        type="submit"
        :label="acceptLabel || i18n.t('Accept')"
      />
      <UiInput
        type="button"
        :label="cancelLabel || i18n.t('Cancel')"
        class="UiButton--cancel"
        @click="cancel()"
      />
      <UiInput
        type="button"
        :label="deleteLabel || i18n.t('Delete')"
        class="UiButton--danger"
        @click="emitDelete()"
      />
    </footer>
  </form>
</template>

<style lang="scss">
.UiDataForm {
  &__body {
    padding: 5px;
  }

  &__footer {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 5px;
    padding: 5px;

    .UiButton--danger {
      margin-left: auto;
    }
  }
}

</style>