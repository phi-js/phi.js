<script setup>
import { TranslationInput } from '@/packages/i18n'
</script>

<template>
  <div class="PropInputDictionary">
    <TranslationInput
      class="UiInput__element"
      v-bind="$attrs"
    />
  </div>
</template>

<style lang="scss">
.PropInputDictionary {
  .TranslationInput {
    display: block;
  }
}
</style>