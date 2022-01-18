<script setup>
import { computed } from 'vue'
import { UiItem, UiInput } from '@/packages/ui/components'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },

  openAction: {
    type: Function,
    required: false,
    default: null,
  },
})

const isSelect = computed(() => props.modelValue?.type && props.modelValue.type.substring(0, 6) == 'select')
</script>

<template>
  <div
    class="InputFace"
    @click="openAction('InputSettings')"
  >
    <template v-if="isSelect">
      <UiInput
        v-if="modelValue?.options?.length"
        v-bind="modelValue"
        style="pointer-events: none;"
      />
      <UiItem
        v-else
        text="Add options"
        icon="mdi:form-dropdown"
        class="UiItem--inline ui-inset"
      />
    </template>
    <UiInput
      v-else
      v-bind="modelValue"
      style="pointer-events: none;"
    />
  </div>
</template>

<style lang="scss">
.InputFace {
  cursor: pointer;
  padding: var(--ui-breathe);

  &:hover {
    background-color: rgba(0,0,0, 0.05);
  }

  .UiInput {
    margin: 0;
  }
}
</style>