<script setup>
import { ref } from 'vue'
import { UiIcon } from '@/packages/ui'
import UiCodeLine from './UiCodeLine.vue'

const props = defineProps({
  open: {
    type: [Boolean, Number, String],
    required: false,
    default: false,
  },
})

const isOpen = ref(props.open)
</script>

<template>
  <div
    class="UiCodeGroup"
    :class="{'UiCodeGroup--open': isOpen}"
  >
    <div
      class="UiCodeGroup__face"
      @click="isOpen = !isOpen"
    >
      <div class="UiCodeGroup__left">
        <UiIcon
          class="UiCodeGroup__icon"
          :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'"
        />
      </div>
      <div class="UiCodeGroup__body">
        <slot
          name="face"
          :is-open="isOpen"
        >
          <div class="UiCodeGroup__text">
            <strong>{{ $attrs.text }}</strong>
          &nbsp;
            <small>{{ $attrs.subtext }}</small>
          </div>
        </slot>
      </div>
    </div>
    <div class="UiCodeGroup__slot">
      <slot name="default" />
      <UiCodeLine
        v-show="isOpen"
        class="UiCodeGroup__spacer"
      />
    </div>
  </div>
</template>