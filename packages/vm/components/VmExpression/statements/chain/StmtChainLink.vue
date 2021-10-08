<template>
  <component
    :is="targetComponent"
    v-bind="$attrs"
    v-on="$listeners"
    :value="value"
  >
    <template #toolbar>
      <UiIcon
        v-if="!isIfStatement"
        class="item-action-icon ui-clickable"
        value="mdi:help-rhombus"
        title="IFify"
        @click="ifify"
      />
      <UiIcon
        v-else
        class="item-action-icon ui-clickable"
        value="mdi:close-network"
        title="de-IFify"
        @click="deifify"
      />

      <UiIcon
        class="item-action-icon ui-clickable"
        value="mdi:close"
        title="Eliminar"
        @click="$emit('delete')"
      />
    </template>
  </component>
</template>

<script>
import ChainLinkBase from './ChainLinkBase.vue';
import ChainLinkIf from './ChainLinkIf.vue';
import { UiIcon } from '../../../../../ui';

export default {
  name: 'StmtChainLink',
  components: { ChainLinkBase, ChainLinkIf, UiIcon },

  props: {
    value: {
      required: false,
      default: null,
    },
  },

  computed: {
    isIfStatement() {
      return (
        this.value && this.value.do && typeof this.value.do.if != 'undefined'
      );
    },

    targetComponent() {
      return this.isIfStatement ? 'ChainLinkIf' : 'ChainLinkBase';
    },
  },

  methods: {
    ifify() {
      let finalValue = {
        info: {
          text: 'if... (nuevo)',
        },
        do: {
          if: { and: [] },
          then: { chain: [this.value] },
          else: { chain: [] },
        },
      };

      this.$emit('input', JSON.parse(JSON.stringify(finalValue)));
    },

    deifify() {
      let finalValue = this.value.do.then.chain[0];
      this.$emit('input', JSON.parse(JSON.stringify(finalValue)));
    },
  },
};
</script>

<style lang="scss">
.item-action-icon {
  cursor: pointer !important;
  color: #999;
  padding: 6px;
}
</style>