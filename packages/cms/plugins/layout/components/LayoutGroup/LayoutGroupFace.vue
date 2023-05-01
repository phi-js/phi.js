<script setup>
import { ref, watch } from 'vue'

import { UiIcon } from '@/packages/ui'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const groupSlot = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    groupSlot.value = Array.isArray(newValue?.slot) ? newValue.slot : []
  },
  { immediate: true },
)

function onSlotUpdate() {
  emit('update:modelValue', { ...props.modelValue, slot: groupSlot })
}
</script>

<template>
  <CmsSlotEditor
    v-model:slot="groupSlot"
    :label="props.modelValue?.title"
    :class="[
      `LayoutGroupFace LayoutGroupFace--${modelValue.props.direction} LayoutGroup`,
      props.modelValue.props?.class
    ]"
    :style="props.modelValue.props?.style"
    :direction="modelValue.props.direction == 'row' ? 'horizontal' : 'vertical'"
    @update:slot="onSlotUpdate"
  >
    <template #header>
      <label class="LayoutGroupFace__label">
        <UiIcon :src="modelValue.props.direction == 'row' ? 'mdi:view-column' : 'mdi:view-agenda'" />
        {{ modelValue.title || modelValue.component }}
      </label>
    </template>
  </CmsSlotEditor>
</template>

<style lang="scss">
.BlockScaffold--PersonEditor,
.BlockScaffold--LayoutGroup {
  padding: 6px;
  margin-top: 6px;
  margin-bottom: 6px;

  &::after {
    opacity: 0.3;
  }

  &:hover > .LayoutGroupFace > .LayoutGroupFace__label {
    opacity: 1;
    color: var(--ui-color-primary);
  }
}

.LayoutGroupFace {
  position: relative;
  padding-top: 18px;
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
    flex: none !important;
  }
}

.LayoutGroupFace--row {
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