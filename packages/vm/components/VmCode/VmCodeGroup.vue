<script setup>
import { ref } from 'vue'
import { UiIcon } from '@/packages/ui'

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
    class="VmCodeGroup"
    :class="{'VmCodeGroup--open': isOpen}"
  >
    <div
      class="VmCodeGroup__face"
      @click="isOpen = !isOpen"
    >
      <div class="VmCodeGroup__left">
        <UiIcon
          class="VmCodeGroup__icon"
          :src="isOpen ? 'mdi:chevron-down' : 'mdi:chevron-right'"
        />
      </div>
      <div class="VmCodeGroup__body">
        <slot
          name="face"
          :is-open="isOpen"
        >
          <div class="VmCodeGroup__text">
            <strong>{{ $attrs.text }}</strong>
          &nbsp;
            <small>{{ $attrs.subtext }}</small>
          </div>
        </slot>
      </div>
    </div>
    <div class="VmCodeGroup__slot">
      <slot name="default" />
    </div>
  </div>
</template>