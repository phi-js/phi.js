<script setup>
import { UiIcon } from '@/packages/ui'
</script>

<template>
  <div class="UiCodeLine">
    <div class="UiCodeLine__left">
      <UiIcon
        v-if="$attrs.icon"
        class="UiCodeLine__icon"
        :src="$attrs.icon"
      />
    </div>

    <div class="UiCodeLine__body">
      <slot name="default">
        <div class="UiCodeLine__text">
          {{ $attrs.text }}
        </div>
      </slot>
    </div>
  </div>
</template>