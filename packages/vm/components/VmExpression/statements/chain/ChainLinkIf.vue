<template>
  <ChainLinkBase
    class="ChainLinkIf"
    v-bind="$attrs"
    v-model="innerModel"
    @input="emitInput"
    @cancel="$emit('cancel')"
  >
    <template #dialog="{innerModel}">
      <VmExpressionInternal v-model="innerModel.do.if" />
    </template>

    <template #toolbar>
      <slot name="toolbar"></slot>
    </template>

    <template #default>
      <div class="chain-link-if-contents">
        <div class="if-path path-then">
          <label class="ui-label">Then</label>
          <VmExpressionInternal
            v-model="innerModel.do.then"
            @input="emitInput"
          />
        </div>

        <div class="if-path path-else">
          <label class="ui-label">Else</label>
          <VmExpressionInternal
            v-model="innerModel.do.else"
            @input="emitInput"
          />
        </div>
      </div>
    </template>

  </ChainLinkBase>
</template>

<script>
import ChainLinkBase from './ChainLinkBase.vue';
import VmExpressionInternal from '../../VmExpressionInternal.vue';

export default {
  name: 'ChainLinkIf',
  components: { VmExpressionInternal, ChainLinkBase },

  props: {
    value: {
      required: false,
      default: null,
    },
  },

  data() {
    return {
      innerModel: null,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue;
        this.innerModel = Object.assign({}, clone);
      },
    },
  },

  computed: {
    isEmpty() {
      return (
        !this.innerModel ||
        !this.innerModel.if ||
        (this.innerModel.if.and && !this.innerModel.if.and.length) ||
        (this.innerModel.if.or && !this.innerModel.if.or.length)
      );
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)));
    },
  },
};
</script>

<style lang="scss">
.ChainLinkIf {
  .chain-link-if-contents {
    padding: var(--ui-breathe);
    padding-left: 56px;
  }
}
</style>