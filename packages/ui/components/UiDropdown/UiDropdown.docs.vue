<script setup>
import { ref } from 'vue'
import { UiDropdown } from './index.js'
const isOpen = ref(false)
</script>

<template>
  <div class="UiDropdown-docs">
    <h1>UiDropdown</h1>
    <pre>isOpen: {{ isOpen }}</pre>
    <UiDropdown v-model:open="isOpen">
      <template #trigger>
        Hover me
      </template>
      <template #default>
        <div class="UiDropdown-docs__contents">
          <h1>Hello!</h1>
          <p>... dropdown contents</p>
        </div>
      </template>
    </UiDropdown>
  </div>
</template>

<style lang="scss">
.UiDropdown-docs {
  &__contents {
    min-width: 300px;

    margin: 12px;
    margin-left: -24px;

    padding: 12px;
    border-radius: 8px;
    background-color: #fff;
    box-shadow: rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px;
  }
}
</style>