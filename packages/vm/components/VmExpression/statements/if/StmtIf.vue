<template>
  <div class="StmtIf">
    <UiDataDialog
      v-model="innerModel"
      @input="emitInput"
    >
      <template #trigger>
        <UiItem
          class="ui-clickable ui-outset"
          v-bind="itemAttrs"
        >
          <template #right>
            <button
              type="button"
              @mousedown.stop="doify()"
            >&times;</button>
          </template>
        </UiItem>
      </template>
      <template #contents="dialog">
        <VmExpressionInternal v-model="dialog.innerModel.if" />
      </template>
    </UiDataDialog>

    <div class="stmt-if-contents">
      <div class="stmt-path stmt-then">
        <label class="ui-label">Then</label>
        <VmExpressionInternal
          v-model="innerModel.then"
          @input="emitInput"
        />
      </div>

      <div class="stmt-path stmt-else">
        <label class="ui-label">Else</label>
        <VmExpressionInternal
          v-model="innerModel.else"
          @input="emitInput"
        />
      </div>
    </div>

  </div>
</template>

<script>
import VmExpressionInternal from '../../VmExpressionInternal.vue';
import { UiItem, UiDataDialog } from '../../../../../ui';

export default {
  name: 'StmtIf',
  components: { UiItem, UiDataDialog, VmExpressionInternal },

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
        this.innerModel = Object.assign(
          {
            if: null,
            then: null,
            else: null,
            info: null,
          },
          clone
        );
      },
    },
  },

  computed: {
    itemAttrs() {
      return Object.assign(
        {
          icon: 'mdi:help-rhombus',
          text: 'If ...',
        },
        this.innerModel.info
      );
    },

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

    doify() {
      if (!this.isEmpty && !confirm('Eliminar esta condicion ?')) {
        return;
      }

      this.innerModel = this.innerModel.then;
      this.emitInput();
    },
  },
};
</script>

<style lang="scss">
.StmtIf {
  .stmt-if-contents {
    padding: var(--ui-breathe);
    padding-left: 42px;
  }

  // .stmt-path {
  //   margin: var(--ui-breathe) 0;
  // }
}
</style>