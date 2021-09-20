<template>
  <span class="ui-icon" :style="styles" @click="$emit('click', $event)">
    <component
      :is="provider.component"
      v-if="provider"
      :value="provider.value"
      :full-value="sanitizedSrc"
      :color="color"
    ></component>
    <span v-else :title="sanitizedSrc">�</span>
    <slot></slot>
  </span>
</template>

<script>
import aliases from './aliases.js'
import providers from './providers.js'

export default {
  name: 'UiIcon',
  props: {
    src: {
      type: String,
      required: false,
      default: '�'
    },

    color: {
      type: String,
      required: false,
      default: null
    }
  },

  emits: ['click'],

  computed: {
    sanitizedSrc() {
      return aliases?.[this.src] || this.src
    },

    styles() {
      return {
        color: this.color || undefined
      }
    },

    provider() {
      if (!this.sanitizedSrc || typeof this.sanitizedSrc.split == 'undefined') {
        return null
      }

      if (
        this.sanitizedSrc.substr(0, 1) == '/' ||
        this.sanitizedSrc.substr(0, 2) == './' ||
        this.sanitizedSrc.substr(0, 3) == '../'
      ) {
        return {
          key: this.sanitizedSrc,
          component: providers.file,
          value: this.sanitizedSrc
        }
      }

      let [providerName, iconValue] = this.sanitizedSrc.split(':', 2)
      if (!providers?.[providerName]) {
        return null
      }
      return {
        key: providerName,
        component: providers[providerName],
        value: iconValue
      }
    }
  }
}
</script>

<style lang="scss">
.ui-icon {
  font-size: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
