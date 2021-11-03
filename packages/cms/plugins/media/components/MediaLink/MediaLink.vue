<template>
  <a
    class="media-link"
    :href="href"
    :target="target"
  >
    <UiItem
      class="ui--clickable"
      :text="text"
      :secondary="secondary"
      :icon="icon"
    ></UiItem>
  </a>
</template>

<script>
import { UiItem } from '../../../../../ui';

export default {
  name: 'MediaLink',
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
      default: 'mdi:open-in-new',
    },

    target: {
      type: String,
      required: false,
      default: '_system',
    },
  },
};
</script>

<style lang="scss">
.media-link {
  display: block;
}
</style>