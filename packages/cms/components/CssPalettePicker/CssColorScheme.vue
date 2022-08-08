<script setup>
import { computed } from 'vue'

const props = defineProps({
  /*
  Displays a Color scheme object
  {
    '--ui-color-background': '#d7c6c6',
    '--ui-color-foreground': '#a68282',
    '--ui-color-primary': '#55a581',
  }
  */
  scheme: {
    type: Object,
    required: false,
    default: null,
  },
})

const arrColors = computed(() => {
  return [
    props.scheme?.['--ui-color-primary'],
    props.scheme?.['--ui-color-background'],
    props.scheme?.['--ui-color-foreground'],
  ]
})
</script>

<template>
  <div class="CssColorScheme">
    <div
      v-for="schemeColor in arrColors"
      :key="schemeColor"
      class="CssColorScheme__color"
      :style="{'--palette-color': schemeColor}"
    />
  </div>
</template>

<style lang="scss">
.CssColorScheme {
  display: flex;
  flex-wrap: nowrap;

  &__color {
    flex: 1;
    height: 30px;
    min-width: 20px;
    background-color: var(--palette-color);
  }
}
</style>