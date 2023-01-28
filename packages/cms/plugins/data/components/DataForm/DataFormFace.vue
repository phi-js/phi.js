<script setup>
import { computed } from 'vue'
import { useI18n } from '../../../../../i18n'
import { UiInput } from '../../../../../ui/components'

import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'


const props = defineProps({
  /*
  BLOCK object
  */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const i18n = useI18n()
const translatedProps = computed(() => i18n.obj({ ...props.modelValue?.props }))

const defaultSlot = computed({
  get() {
    return props.modelValue.slot || []
  },
  set(newValue) {
    emit('update:modelValue', {
      ...props.modelValue,
      slot: newValue,
    })
  },
})
</script>

<template>
  <div class="DataFormFace">
    <div class="DataFormFace__body">
      <CmsSlotEditor v-model:slot="defaultSlot" />
    </div>
    <footer class="DataFormFace__footer">
      <UiInput
        type="button"
        :label="translatedProps.acceptLabel || i18n.t('Accept')"
      />
      <UiInput
        type="button"
        :label="translatedProps.cancelLabel || i18n.t('Cancel')"
        class="UiButton--cancel"
      />
      <UiInput
        type="button"
        :label="translatedProps.deleteLabel || i18n.t('Delete')"
        class="UiButton--danger "
      />
    </footer>
  </div>
</template>

<style lang="scss">
.DataFormFace {
  &__body {
    padding: 5px;
  }

  &__footer {
    pointer-events: none;

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