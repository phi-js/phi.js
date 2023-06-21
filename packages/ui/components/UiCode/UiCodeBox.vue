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
    class="UiCodeBox"
    :class="{'UiCodeBox--open': isOpen, 'UiCodeBox--endangered': inEndangered}"
  >
    <div
      class="UiCodeBox__left"
      @click="isOpen = !isOpen"
    >
      <UiIcon
        class="UiCodeBox__icon"
        :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'"
      />
    </div>

    <div class="UiCodeBox__body">
      <div class="UiCodeBox__box">
        <div
          class="UiCodeBox__summary"
          @click="isOpen = !isOpen"
        >
          <slot
            name="face"
            :is-open="isOpen"
          >
            <div class="UiCodeBox__text">
              {{ $attrs.text }}
            </div>
          </slot>

          <div class="UiCodeBox__actions">
            <slot name="actions" />
            <UiIcon
              v-if="props.onDelete"
              class="UiCodeBox__delete"
              src="mdi:close"
              @click="props.onDelete()"
              @mouseenter="inEndangered = true"
              @mouseleave="inEndangered = false"
            />
          </div>
        </div>

        <div class="UiCodeBox__slot">
          <slot name="default" />
        </div>
      </div>
    </div>
  </div>
</template>