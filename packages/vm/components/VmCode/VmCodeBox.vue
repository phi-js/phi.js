<script setup>
import { ref } from 'vue'
import { UiIcon } from '@/packages/ui'

const props = defineProps({
  open: {
    type: [Boolean, Number, String],
    required: false,
    default: false,
  },

  onDelete: {
    type: Function,
    required: false,
    default: null,
  },
})

const isOpen = ref(props.open)
const inEndangered = ref(false)
</script>

<template>
  <div
    class="VmCodeBox"
    :class="{'VmCodeBox--open': isOpen, 'VmCodeBox--endangered': inEndangered}"
  >
    <div
      class="VmCodeBox__left"
      @click="isOpen = !isOpen"
    >
      <UiIcon
        class="VmCodeBox__icon"
        :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'"
      />
    </div>

    <div class="VmCodeBox__body">
      <div class="VmCodeBox__box">
        <div
          class="VmCodeBox__summary"
          @click="isOpen = !isOpen"
        >
          <slot name="face">
            <div class="VmCodeBox__text">
              {{ $attrs.text }}
            </div>
          </slot>

          <div class="VmCodeBox__actions">
            <slot name="actions" />
            <UiIcon
              v-if="props.onDelete"
              class="VmCodeBox__delete"
              src="mdi:close"
              @click="props.onDelete()"
              @mouseenter="inEndangered = true"
              @mouseleave="inEndangered = false"
            />
          </div>
        </div>

        <div class="VmCodeBox__slot">
          <slot name="default" />
        </div>
      </div>
    </div>
  </div>
</template>