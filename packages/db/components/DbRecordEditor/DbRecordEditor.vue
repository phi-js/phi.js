<script setup>
import { useApi } from '@/packages/api'
import { UiButton } from '@/packages/ui'
import { ref, watch } from 'vue'
import apiDB from '../../api/db.js'

const props = defineProps({
  table: {
    type: String,
    required: true,
  },

  /* The plain record obejct */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue', 'accept', 'cancel'])

const api = useApi(apiDB)
const isLoading = ref(false)

let initialValue = {}
watch(
  () => props.modelValue,
  () => {
    initialValue = JSON.parse(JSON.stringify(props.modelValue))
  },
  { immediate: true },
)

async function accept() {
  isLoading.value = true
  const response = await api.insert(props.table, props.modelValue)
  isLoading.value = false
  const modifiedRecord = response?.[0]
  initialValue = modifiedRecord
  emit('update:modelValue', { ...initialValue })
  emit('accept', modifiedRecord)
}

function cancel() {
  // awful, awful machete: !!!
  Object.assign(props.modelValue, initialValue)

  emit('update:modelValue', { ...initialValue })
  emit('cancel')
}
</script>

<template>
  <div class="PhiDbRecordEditor">
    <div class="PhiDbRecordEditor__slot">
      <slot name="default" />
    </div>

    <footer class="PhiDbRecordEditor__footer">
      <UiButton
        label="Guardar"
        :is-loading="isLoading"
        loading-label="Guardando ...."
        @click="accept()"
      />

      <UiButton
        label="Cancelar"
        class="UiButton--cancel"
        @click="cancel()"
      />
    </footer>
  </div>
</template>