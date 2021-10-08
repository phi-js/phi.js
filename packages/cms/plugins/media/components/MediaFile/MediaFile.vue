<template>
  <a
    class="media-file"
    :href="href"
    target="_system"
  >
    <UiItem
      class="ui-clickable"
      :text="text"
      :secondary="secondary"
      :icon="icon"
    />
  </a>
</template>

<script>
import { UiItem } from '../../../../../ui';

export default {
  name: 'MediaFile',
  components: { UiItem },
  props: {
    href: {
      type: String,
      required: false,
      default: '#',
    },
    text: {
      type: String,
      required: false,
      default: 'Sin título',
    },
    secondary: {
      type: String,
      required: false,
      default: '',
    },
    icon: {
      type: String,
      required: false,
      default: 'mdi:file',
    },
  },
};
</script>

<style lang="scss">
.media-file {
  display: block;
}
</style>