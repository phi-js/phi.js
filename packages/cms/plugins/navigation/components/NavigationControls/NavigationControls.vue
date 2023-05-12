<script setup>
import { inject } from 'vue'

import { useI18n } from '@/packages/i18n'
import InputButton from '../../../input/components/InputButton/InputButton.vue'
const $nav = inject('$_cms_navigation', null)

const i18n = useI18n({
  en: { 'NavigationControls.labelBack': 'Back' },
  es: { 'NavigationControls.labelBack': 'Regresar' },
  de: { 'NavigationControls.labelBack': 'zurückgehen' },
})

const props = defineProps({
  labelBack: {
    type: String,
    required: false,
    default: null,
  },
})
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
        :label="props.labelBack || i18n.t('NavigationControls.labelBack')"
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