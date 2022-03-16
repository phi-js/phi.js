<template>
  <div class="ChargeItemEditor" :class="{ '--has-children': hasChildren }">
    <div class="payment-item-row" :class="{ 'ui--clickable': !charge.fixed }">
      <!-- expand/collapse icon -->
      <UiIcon
        class="icon-expand ui--clickable"
        v-if="expandIcon"
        :src="expandIcon"
        @click="charge.expanded = !charge.expanded"
      />
      <div v-else class="icon-expand"></div>

      <div class="item-contents">
        <UiItem
          class="row-item"
          :icon="checkboxIcon"
          @click-icon="onCheckboxInput()"
          @click-body="onCheckboxInput()"
          :text="charge.text"
          :secondary="charge.secondary"
        >
          <template #tertiary>
            <span
              class="row-currency"
              :class="{ '--empty': !charge.value, '--partial': charge.value > 0 && charge.value < charge.max }"
            >{{ currencyValue }}</span>
          </template>
        </UiItem>

        <div class="value-input">
          <input
            v-if="charge.allowPartial && !(hasChildren) && !charge.fixed"
            type="number"
            class="UiInput"
            :min="charge.min"
            :max="charge.max"
            :step="charge.step"
            :value="charge.value"
            @input="onValueInput($event.target.value)"
            @click.stop="() => { }"
          />
        </div>
      </div>
    </div>

    <div v-if="hasChildren" class="children-container">
      <UiDrawer :open="charge.expanded">
        <ChargeItemEditor
          v-for="(child, i) in charge.items"
          :key="i"
          :modelValue="charge.items[i]"
          @item-changed="$emit('item-changed', $event)"
        />
      </UiDrawer>
    </div>
  </div>
</template>

<script>
import { useI18n } from '../../../i18n';
import { UiItem, UiIcon, UiDrawer } from '../../../ui';

export default {
  name: 'ChargeItemEditor',
  components: { UiItem, UiIcon, UiDrawer },

  setup() {
    const i18n = useI18n()
    return { i18n }
  },

  props: {
    /**
     * Objeto EditableCHARGE sanitizado
     * {
     *   "text": "Bla",
     *   "secondary": "Ble",
     *   "icon": "mdi:circle",
     *   "value": 10000,
     *   "items": [ ChargeItem1, ChargeItem2, ... ],
     *
     *   "id": "xx1",
     *   "min": 0,
     *   "max": 25000,
     *   "step": 1000,
     *   "currency": "COP",
     *   "allowPartial": true
     *   "requires": [....],
     *   "fixed": false,
     *   "expanded": false
     * }
     */
    modelValue: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      charge: {},
    };
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        this.charge = newValue;
      },
    },
  },

  computed: {
    hasChildren() {
      return this.charge?.items?.length > 0;
    },

    expandIcon() {
      if (!this.hasChildren) {
        return null;
      }

      return this.modelValue.expanded ? 'mdi:chevron-down' : 'mdi:chevron-right';
    },

    checkboxIcon() {
      if (this.charge.fixed) {
        return 'mdi:circle-medium';
      }

      if (this.charge.value == 0) {
        return 'mdi:checkbox-blank-outline';
      }

      if (this.charge.value == this.charge.max) {
        return 'mdi:checkbox-marked';
      }

      return 'mdi:checkbox-marked-outline';
    },

    currencyValue() {
      return i18n.$(
        this.charge.value > 0 ? this.charge.value : this.charge.max,
        this.charge.currency
      );
    },
  },

  methods: {
    emitInput() {
      this.$emit('update:modelValue', this.charge);
    },

    onCheckboxInput() {
      if (this.charge.fixed) {
        return;
      }

      this.setValue(this.charge, this.charge.value > 0 ? 0 : this.charge.max);
    },

    onValueInput(newValue) {
      this.setValue(this.charge, newValue);
    },

    setValue(targetCharge, value) {
      targetCharge.value = Math.max(
        0,
        Math.min(parseFloat(value), targetCharge.max)
      );
      this.$emit('item-changed', targetCharge);
    },
  },
};
</script>

<style lang="scss">
.ChargeItemEditor {
  padding-bottom: var(--ui-breathe);

  & > .payment-item-row {
    display: flex;
    flex-wrap: nowrap;

    .icon-expand {
      display: flex;
      width: 32px;
      height: 46px;
      color: rgba(0, 0, 0, 0.6);
    }

    .item-contents {
      flex: 1;
      display: flex;
      flex-wrap: wrap;

      .row-item {
        flex: 1;
      }

      .value-input {
        margin-left: 30px;
        padding: var(--ui-padding);
      }

      input {
        width: 140px;
        text-align: right;
      }
    }
  }

  & > .children-container {
    padding-left: 22px;
  }

  .row-currency {
    font-family: var(--ui-font-secondary);
    color: var(--ui-color-success);
    font-weight: bold;
    font-size: 1em;

    &.--empty {
      color: rgba(0, 0, 0, 0.55);
    }

    &.--partial {
      color: var(--ui-color-warning);
    }

    &.--balance {
      color: rgba(0, 0, 0, 0.5);
    }
  }
}

// Dibujar guias
// .ChargeItemEditor {
//   position: relative;

//   &.--has-children::before,
//   &::after {
//     pointer-events: none;
//     content: '';
//     display: block;
//     position: absolute;
//     opacity: 0.3;

//     border: 0 solid var(--ui-color-primary);
//   }

//   &.--has-children::before {
//     border-left-width: 1px;
//     top: 32px;
//     left: 23px;
//     bottom: 58px;
//     width: 30px;
//   }

//   &::after {
//     border-top-width: 1px;
//     top: 22px;
//     left: -16px;
//     width: 31px;
//     height: 30px;
//   }
// }

// .PaymentEditor > .ChargeItemEditor {
//   &::after {
//     display: none;
//   }
// }
</style>