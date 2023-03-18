<script setup>
import { computed } from 'vue'

const props = defineProps({
  value: {
    type: String,
    required: false,
    default: null,
  },
})

const htmlValue = computed(() => typeof props.value == 'string'
  ? props.value
  : '')
</script>

<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="MediaHtml story-html"
    :class="{'MediaHtml--empty': htmlValue === '' || props.value === null}"
    v-html="htmlValue"
  />
</template>

<style lang="scss">
.MediaHtml {
  word-break: break-word;
}

.BlockScaffold--MediaHtmlCode {
  .MediaHtml--empty {
    min-height: 3em;
    display: flex;
    align-items: center;
    justify-content: center;
    &::after {
      content: 'Empty HTML block';
      font-size: 9pt;
      opacity: 0.7;
    }
  }
}
</style>