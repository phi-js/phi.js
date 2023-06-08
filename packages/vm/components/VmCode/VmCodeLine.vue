<script setup>
import { UiIcon } from '@/packages/ui'
</script>

<template>
  <div class="VmCodeLine">
    <div class="VmCodeLine__left">
      <UiIcon
        v-if="$attrs.icon"
        class="VmCodeLine__icon"
        :src="$attrs.icon"
      />
    </div>

    <div class="VmCodeLine__body">
      <slot name="default">
        <div class="VmCodeLine__text">
          {{ $attrs.text }}
        </div>
      </slot>
    </div>
  </div>
</template>