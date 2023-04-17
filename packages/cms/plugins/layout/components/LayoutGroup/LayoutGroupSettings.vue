<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

const i18n = useI18n({
  en: {
    'LayoutGroupSettings.GroupName': 'Group name',
    'LayoutGroupSettings.ContentDirection': 'Content direction',
    'LayoutGroupSettings.DirectionColumn': 'Column',
    'LayoutGroupSettings.DirectionRow': 'Row',
  },
  es: {
    'LayoutGroupSettings.GroupName': 'Nombre del grupo',
    'LayoutGroupSettings.ContentDirection': 'Dirección del contenido',
    'LayoutGroupSettings.DirectionColumn': 'Columna',
    'LayoutGroupSettings.DirectionRow': 'Fila',
  },
})

const props = defineProps({
  /* Block object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits([['update:modelValue']])

const block = ref()
watch(
  () => props.modelValue,
  (newValue) => block.value = Object.assign({ props: {} }, newValue),
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', block.value)
}

const styleSelectValue = computed({
  get() {
    return block.value.props?.direction || 'column'
  },
  set(newValue) {
    if (newValue == 'row') {
      block.value.props.style = Object.assign(block.value.props?.style || {}, { display: 'flex' })
    } else {
      block.value.props.style = Object.assign(block.value.props?.style || {}, { display: 'block' })
    }

    block.value.props.direction = newValue || 'column'
    emitUpdate()
  },
})
</script>

<template>
  <div class="LayoutGroupSettings UiForm UiForm--wide">
    <UiInput
      v-model="block.title"
      class="LayoutGroupSettings__input"
      type="text"
      :label="i18n.t('LayoutGroupSettings.GroupName')"
      @update:model-value="emitUpdate"
    />
    <UiInput
      v-model="styleSelectValue"
      class="LayoutGroupSettings__input"
      type="select-buttons"
      :label="i18n.t('LayoutGroupSettings.ContentDirection')"
      :options="[
        { value: 'column', text: i18n.t('LayoutGroupSettings.DirectionColumn'), icon:'mdi:view-agenda' },
        { value: 'row', text: i18n.t('LayoutGroupSettings.DirectionRow'), icon: 'mdi:view-column' },
      ]"
    />
  </div>
</template>

<style lang="scss">
.LayoutGroupSettings {
  .UiSelectButtons {
    &__button {
      width: 100px;
      flex-direction: column;
      align-items: center;

      .UiItem__icon {
        font-size: 20px;
      }
    }
  }
}
</style>