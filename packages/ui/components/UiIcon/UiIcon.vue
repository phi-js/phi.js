<template>
  <span
    class="ui-icon ui-noselect"
    :style="styles"
    @click="$emit('click', $event)"
  >
    <component
      v-if="provider"
      :is="provider.component"
      :value="provider.value"
      :fullValue="filteredValue"
      :color="color"
    ></component>
    <span
      v-else
      :title="filteredValue"
    >�</span>

    <div
      v-if="$slots.default"
      class="contents-slot"
    >
      <slot></slot>
    </div>
  </span>
</template>

<script>
import AliasMime from './Alias/Mime.js';
import ProviderImage from './Provider/Image.vue';
import ProviderGoogle from './Provider/Google.vue';
import ProviderMdi from './Provider/Mdi.vue';
import ProviderText from './Provider/Text.vue';

const providers = {
  http: ProviderImage,
  https: ProviderImage,
  data: ProviderImage,
  g: ProviderGoogle,
  mdi: ProviderMdi,
  text: ProviderText,
};

export default {
  name: 'UiIcon',

  props: {
    value: {
      type: String,
      required: false,
      default: '�',
    },

    color: {
      type: String,
      required: false,
      default: null,
    },
  },

  computed: {
    filteredValue() {
      if (this.value && this.value.substring(0, 5) == 'mime:') {
        return AliasMime(this.value.substring(5));
      }
      return this.value;
    },

    styles() {
      return {
        color: this.color || undefined,
      };
    },

    provider() {
      if (
        !this.filteredValue ||
        typeof this.filteredValue.split == 'undefined'
      ) {
        return null;
      }

      let parts = this.filteredValue.split(':', 2);
      if (typeof providers[parts[0]] == 'undefined') {
        return null;
      }

      return {
        key: parts[0],
        component: providers[parts[0]],
        value: parts[1],
      };
    },

    // cssColor() {
    //   return this.reactiveEl
    //     ? window.getComputedStyle(this.reactiveEl).color
    //     : null;
    // },
  },

  // data() {
  //   return {
  //     reactiveEl: null,
  //   };
  // },

  // mounted() {
  //   this.reactiveEl = this.$el;
  // },
};
</script>

<style lang="scss">
.ui-icon {
  font-size: inherit;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  .contents-slot {
    padding-left: 4px;
    font-size: auto;
    white-space: nowrap;
    color: inherit;
  }
}
</style>