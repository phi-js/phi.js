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
      block.value.props.style = Object.assign(
        block.value.props?.style || {},
        {
          'display': 'flex',
          'flex-direction': 'row',
        },
      )
    } else {
      block.value.props.style = Object.assign(
        block.value.props?.style || {},
        {
          'display': 'flex',
          'flex-direction': 'column',
        },
      )
    }

    block.value.props.direction = newValue || 'column'
    emitUpdate()
  },
})

const alignItems = computed({
  get() {
    return block.value.props?.style?.['align-items']
  },

  set(newValue) {
    block.value.props.style = Object.assign(block.value.props?.style || {}, { 'align-items': newValue })
    emitUpdate()
  },
})
</script>

<template>
  <div class="LayoutGroupSettings UiForm">
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

    <template v-if="block.props.direction == 'row'">
      <UiInput
        v-model="alignItems"
        class="LayoutGroupSettings__input"
        type="select-buttons"
        :label="i18n.t('LayoutGroupSettings.AlignItems')"
        :options="[
          { value: 'flex-start', text: 'flex-start', icon:'mdi:align-vertical-top' },
          { value: 'center', text: 'center', icon: 'mdi:align-vertical-center' },
          { value: 'flex-end', text: 'flex-end', icon: 'mdi:align-vertical-bottom' },
        ]"
      />
    </template>
    <template v-else-if="block.props.direction == 'column'">
      <UiInput
        v-model="alignItems"
        class="LayoutGroupSettings__input"
        type="select-buttons"
        :label="i18n.t('LayoutGroupSettings.AlignItems')"
        :options="[
          { value: 'flex-start', text: 'flex-start', icon:'mdi:align-horizontal-left' },
          { value: 'center', text: 'center', icon: 'mdi:align-horizontal-center' },
          { value: 'flex-end', text: 'flex-end', icon: 'mdi:align-horizontal-right' },
        ]"
      />
    </template>
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