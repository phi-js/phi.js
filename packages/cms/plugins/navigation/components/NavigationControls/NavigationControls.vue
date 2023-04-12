<script setup>
import { inject } from 'vue'
import InputButton from '../../../input/components/InputButton/InputButton.vue'

const $nav = inject('$_cms_navigation', null)
</script>

<template>
  <nav class="NavigationControls">
    <div
      v-if="$nav.previousPages.value.length"
      class="NavigationControls__back"
    >
      <InputButton
        class="UiButton UiButton--cancel"
        name="story-goto"
        value="back"
        label="Regresar"
      />
    </div>

    <div
      v-if="$nav.nextPages.value.length"
      class="NavigationControls__next"
    >
      <InputButton
        v-for="page in $nav.nextPages.value"
        :key="page.id"
        name="story-goto"
        :value="page.id"
        :label="page.label || page.title"
        type="submit"
      />
    </div>
  </nav>
</template>

<style lang="scss">
.NavigationControls {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>