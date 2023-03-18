<script setup>
import { ref, watch } from 'vue'

import { UiButton } from '@/packages/ui'
import CmsSlotEditor from '@/packages/cms/components/CmsSlotEditor/CmsSlotEditor.vue'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const successSlot = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    successSlot.value = Array.isArray(newValue?.slots?.success) ? newValue.slots.success : []
  },
  { immediate: true },
)

function onSlotUpdate() {
  emit('update:modelValue', { ...props.modelValue, slots: { success: successSlot } })
}
</script>

<template>
  <div class="StripeFace">
    <UiButton
      class="StripeFace__button Stripe__button"
    >
      {{ props.modelValue?.props?.label || 'Pay' }}
    </UiButton>

    <CmsSlotEditor
      v-model:slot="successSlot"
      class="StripeFace__slot"
      xxxlabel="props.modelValue?.title"
      @update:slot="onSlotUpdate"
    >
      <template #header>
        <label class="StripeFace__label">On success</label>
      </template>
    </CmsSlotEditor>
  </div>
</template>

<style lang="scss">
.StripeFace {
  &__slot {
    position: relative;
    padding: 4px;
    padding-top: 24px;

    border-radius: 4px;
    border: 1px solid #99999966;

    margin: 5px 0;
  }

  &__label {
    position: absolute;
    top: -3px;
    left: 0;
    font-size: 8pt;
    font-weight: bold;
    border-radius: 4px;
    opacity: 0.5;
    padding: 4px;
  }
}
</style>