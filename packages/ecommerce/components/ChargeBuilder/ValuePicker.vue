<template>
  <div class="ValuePicker" :class="{ '--open': trickleIsOpen }">
    <label class="ui-label">Valor a aportar</label>

    <div class="trickle-picker">
      <UiIcon
        v-show="!trickleIsOpen"
        src="mdi:minus"
        class="picker-icon ui--clickable"
        @click="stepDown"
      />
      <input
        v-show="!trickleIsOpen"
        type="text"
        class="UiInput"
        :src="i18n.$(innerValue, currency)"
        @click="openTricklerEditor()"
      />
      <UiInput
        v-show="trickleIsOpen"
        class="trickle-input"
        type="number"
        :min="min"
        :max="max"
        :step="step"
        v-model="innerValue"
        @keyup.enter="onTrickleAccept"
        @blur="onInputBlur"
      />

      <UiIcon
        v-show="!trickleIsOpen"
        src="mdi:plus"
        class="picker-icon ui--clickable"
        @click="stepUp"
      />

      <UiIcon
        v-show="trickleIsOpen"
        src="mdi:check"
        class="picker-icon ui--clickable"
        @mousedown.native="onTrickleAccept"
      />
      <UiIcon
        v-show="trickleIsOpen"
        src="mdi:close"
        class="picker-icon ui--clickable"
        @click="onTrickleCancel"
      />
    </div>

    <div class="min-warning" v-if="min">Min: {{ i18n.$(min, currency) }}</div>
  </div>
</template>

<script>
import { useI18n } from '../../../i18n';
import { UiIcon, UiInput } from '../../../ui';

export default {
  name: 'ValuePicker',
  components: { UiIcon, UiInput },

  setup() {
    const i18n = useI18n()
    return { i18n }
  },

  props: {
    modelValue: {
      required: false,
      default: 0,
    },

    currency: {
      required: false,
      default: 'COP',
    },

    step: {
      required: false,
      default: null,
    },

    min: {
      required: false,
      default: null,
    },

    max: {
      required: false,
      default: null,
    },
  },

  data() {
    return {
      innerValue: null,
      trickleIsOpen: false,
      // closeTimeout: null,
    };
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.innerValue = newValue || 0;
      },
    },
  },

  methods: {
    emitInput() {
      this.$emit('update:modelValue', this.innerValue);
    },

    openTricklerEditor() {
      this.trickleIsOpen = true;

      this.$nextTick(() => {
        let input = this.$el.querySelector('.trickle-input input');
        input.focus();
        input.select();
      });
    },

    onTrickleAccept() {
      // clearTimeout(this.closeTimeout);
      this.trickleIsOpen = false;
      this.emitInput();
    },

    onTrickleCancel() {
      this.innerValue = this.modelValue;
      this.trickleIsOpen = false;
    },

    onInputBlur() {
      // this.closeTimeout = setTimeout(() => this.onTrickleCancel(), 70);
      this.onTrickleCancel();
    },

    stepUp() {
      this.$emit('step-up');
    },

    stepDown() {
      this.$emit('step-down');
    },
  },
};
</script>

<style lang="scss">
.ValuePicker {
  .ui-label {
    display: block;
    padding: 7px 0;
  }

  .min-warning {
    font-family: var(--ui-font-secondary);
    font-size: 13px;

    visibility: hidden;
  }

  .trickle-picker {
    display: flex;

    input {
      width: 160px;
    }

    .picker-icon {
      width: 42px;
    }
  }

  &.--open {
    .min-warning {
      visibility: visible;
    }
  }
}
</style>