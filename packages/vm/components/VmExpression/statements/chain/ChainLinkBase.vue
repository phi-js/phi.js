<template>
  <div class="ChainLinkBase">
    <UiDataDialog
      container-class="chain-link-dialog"
      :open="open"
      v-model="innerModel"
      @input="onDialogInput"
      @cancel="onDialogCancel"
      :trigger-event="null"
    >
      <template #trigger="dialog">
        <UiItem
          class="chain-item-item ui-clickable"
          v-bind="itemAttrs"
          @click-body="dialog.open()"
        >
          <template #secondary>
            <span
              v-if="innerModel.assign"
              class="ui-tag"
            >{{innerModel.assign}}</span>
          </template>

          <template #right>
            <slot name="toolbar"></slot>
          </template>
        </UiItem>
      </template>

      <template #contents="{innerModel}">
        <div class="chain-link-header">
          <UiItemEditor v-model="innerModel.info" />
        </div>

        <div class="chain-link-dialog-contents">
          <slot
            name="dialog"
            :innerModel="innerModel"
          >
            <VmExpressionInternal v-model="innerModel.do" />
          </slot>
        </div>

        <div class="chain-link-assign">
          <input
            type="text"
            class="ui-native"
            placeholder="Resultado en..."
            v-model="innerModel.assign"
          />
          <a
            tabindex="-1"
            href="#"
            @click.prevent="innerModel.assign = null"
          >&times;</a>
        </div>
      </template>
    </UiDataDialog>

    <div class="chain-link-face">
      <slot name="default"></slot>
    </div>
  </div>
</template>

<script>
import VmExpressionInternal from '../../VmExpressionInternal.vue';
import { UiItem, UiDataDialog, UiItemEditor } from '../../../../../ui';

export default {
  name: 'ChainLinkBase',

  components: { VmExpressionInternal, UiItem, UiDataDialog, UiItemEditor },

  props: {
    value: {
      required: false,
      default: null,
    },

    open: {
      type: Boolean,
      required: false,
      default: false,
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
            info: {},
            do: null,
            assign: null,
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
          icon: 'mdi:variable',
          text: '?',
        },
        this.innerModel.info
      );
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)));
    },

    onDialogInput() {
      this.emitInput();
    },

    onDialogCancel() {
      this.$emit('cancel');
    },
  },
};
</script>

<style lang="scss">
.chain-link-dialog {
  .chain-link-assign {
    padding: var(--ui-padding);
    text-align: right;
    background-color: #f3f3f355;
  }

  /// !!! sobreescribir clase interna
  .ui-dialog-content {
    padding: 0 !important;
  }

  .chain-link-dialog-contents {
    padding: var(--ui-padding);
  }
}

.ChainLinkBase {
  .ui-tag {
    display: inline-block;
    font-size: 12px;
    line-height: 18px;
    border-radius: var(--ui-radius);
    padding: 0 12px;
    background-color: var(--ui-color-primary);
    color: #fff;
  }

  .chain-item-item {
    .ui-icon {
      cursor: move;
    }
  }
}
</style>