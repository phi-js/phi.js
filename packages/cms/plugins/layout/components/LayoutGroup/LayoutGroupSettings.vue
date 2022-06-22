<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'

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

const i18n = useI18n({
  en: {
    'LayoutGroupSettings.GroupName': 'Group name',
    'LayoutGroupSettings.ContentDirection': 'Content direction',
    'LayoutGroupSettings.DirectionColumn': 'Column',
    'LayoutGroupSettings.DirectionRow': 'Row',
    'LayoutGroupSettings.AlignItems': 'Align items',
  },
  es: {
    'LayoutGroupSettings.GroupName': 'Nombre del grupo',
    'LayoutGroupSettings.ContentDirection': 'Dirección del contenido',
    'LayoutGroupSettings.DirectionColumn': 'Columna',
    'LayoutGroupSettings.DirectionRow': 'Fila',
    'LayoutGroupSettings.AlignItems': 'Alinear',
  },
})

</script>

<template>
  <div class="LayoutGroupSettings">
    <UiInput
      v-model="block.title"
      class="LayoutGroupSettings__input"
      type="text"
      :label="i18n.t('LayoutGroupSettings.GroupName')"
      @update:model-value="emitUpdate"
    />
    <UiInput
      v-model="block.props.direction"
      class="LayoutGroupSettings__input"
      type="select-list"
      :label="i18n.t('LayoutGroupSettings.ContentDirection')"
      :options="[
        { value: 'column', text: i18n.t('LayoutGroupSettings.DirectionColumn') },
        { value: 'row', text: i18n.t('LayoutGroupSettings.DirectionRow') },
      ]"
      @update:model-value="emitUpdate"
    />

    <UiInput
      v-show="block.props.direction == 'row'"
      v-model="block.props.alignItems"
      type="select-buttons"
      class="LayoutGroupSettings__input"
      :label="i18n.t('LayoutGroupSettings.AlignItems')"
      :options="[
        { value: 'flex-start', icon: 'mdi:align-vertical-top', title: 'flex-start' },
        { value: 'center', icon: 'mdi:align-vertical-center', title: 'center' },
        { value: 'flex-end', icon: 'mdi:align-vertical-bottom', title: 'flex-end' },
      ]"
      @update:model-value="emitUpdate"
    />

    <!-- <UiInput
      v-model="block.props.justifyContent"
      class="LayoutGroupSettings__input"
      type="text"
      label="justifyContent"
      @update:model-value="emitUpdate"
    /> -->
  </div>
</template>

<style lang="scss">
.LayoutGroupSettings {
  padding: 8px 12px;

  &__input {
    margin-bottom: 16px;
    --ui-item-padding: 4px 8px;
  }
}
</style>