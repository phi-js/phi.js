<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const itemSlot = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    itemSlot.value = Array.isArray(newValue?.slots?.item) ? newValue.slots.item : []
  },
  { immediate: true },
)

function onSlotUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    slots: { item: itemSlot },
  })
}

const i18n = useI18n()
const translatedProps = computed(() => {
  return i18n.obj({
    ...props.modelValue?.props,
    class: undefined,
    style: undefined,
  })
})
</script>

<template>
  <div>
    <CmsSlotEditor
      v-model:slot="itemSlot"
      class="InputListFace"
      group-name="input-array"
      show-launcher
      @update:slot="onSlotUpdate"
    >
      <template #header>
        <label class="InputListFace__label">{{ modelValue.title || 'List' }}</label>
      </template>
    </CmsSlotEditor>

    <button
      class="InputList__adder UiButton"
      type="button"
      v-text="translatedProps.adderLabel || 'Add item'"
    />
  </div>
</template>

<style lang="scss">
.BlockScaffold--InputList {
  padding: 6px;
  margin-top: 6px;
  margin-bottom: 6px;

  &::after {
    opacity: 0.3;
  }

  &:hover > .InputListFace > .InputListFace__label {
    opacity: 1;
    color: var(--ui-color-primary);
  }
}


.InputListFace {
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
    flex: none !important;
  }
}
</style>