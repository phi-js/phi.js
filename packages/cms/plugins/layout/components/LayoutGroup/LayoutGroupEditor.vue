<script setup>
import { ref, watch } from 'vue'

import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const pageSlot = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    pageSlot.value = Array.isArray(newValue?.slot) ? newValue.slot : []
  },
  { immediate: true },
)

function onSlotUpdate() {
  emit('update:modelValue', { ...props.modelValue, slot: pageSlot })
}

</script>

<template>
  <CmsSlotEditor
    v-model:slot="pageSlot"
    :label="props.modelValue?.title"

    :class="`LayoutGroupEditor LayoutGroupEditor--${modelValue.props.direction} LayoutGroup`"
    :style="{
      display: modelValue.props.direction == 'row' ? 'flex' : 'block',
      flexDirection: modelValue.props.direction,
      flexWrap: 'wrap',
      alignItems: modelValue.props.alignItems,
      justifyContent: modelValue.props.justifyContent,
      gap: modelValue.props.gap ? `${modelValue.props.gap}px` : null
    }"
    :direction="modelValue.props.direction == 'row' ? 'horizontal' : 'vertical'"
    @update:slot="onSlotUpdate"
  >
    <template #header>
      <label class="LayoutGroupEditor__label">{{ modelValue.title || modelValue.component }}</label>
    </template>
  </CmsSlotEditor>
</template>

<style lang="scss">
.BlockScaffold--LayoutGroup {
  padding: 6px;
  margin-top: 6px;
  margin-bottom: 6px;

  &::after {
    opacity: 0.3;
  }

  &:hover > .LayoutGroupEditor > .LayoutGroupEditor__label {
    opacity: 1;
    color: var(--ui-color-primary);
  }
}


.LayoutGroupEditor {
  position: relative;
  padding-top: 16px;
  width: 100%;

  &__label {
    position: absolute;
    top: -3px;
    left: 0;
    font-size: 8pt;
    font-weight: bold;
    border-radius: 4px;
    opacity: 0.5;
  }

  & > .CmsSlotEditor__footer {
    margin: 3px;
  }
}

.LayoutGroupEditor--row {
  & > .CmsSlotEditor__footer {
    align-self: stretch;
    display: flex;
    align-items: stretch;

    .SlotBlockLauncher__trigger {
      height: 100%;
      box-sizing: border-box;
    }
  }
}
</style>