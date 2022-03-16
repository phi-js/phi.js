<template>
  <div class="ChargeBuilder">
    <ValuePicker
      v-if="showTrickle && blueprint.allowPartial"
      v-model="trickleValue"
      :step="blueprint.step"
      :currency="blueprint.currency"
      :min="minPayable"
      :max="blueprint.value"
      @input="onTrickleInput"
      @step-up="stepUp"
      @step-down="stepDown"
    />

    <template v-if="spread">
      <ChargeItemEditor
        v-for="(item, i) in charge.items"
        :key="i"
        :modelValue="item"
        @item-changed="onItemChanged"
      />
    </template>
    <ChargeItemEditor v-else :modelValue="charge" @item-changed="onItemChanged" />
  </div>
</template>

<script>
import ValuePicker from './ValuePicker.vue';
import ChargeItemEditor from './ChargeItemEditor.vue';

export default {
  name: 'ChargeBuilder',
  components: { ValuePicker, ChargeItemEditor },

  props: {
    blueprint: {
      type: Object,
      required: true,
    },

    showTrickle: {
      required: false,
      default: true,
    },

    spread: {
      required: false,
      default: false,
    },
  },

  data() {
    return {
      charge: null,
      trickleValue: 0,
    };
  },

  beforeMount() {
    this.charge = this.buildChargeObject(this.blueprint);
    this.trickleValue = this.charge.value;
    this.emitInput();
  },

  watch: {
    blueprint: {
      handler(newValue) {
        this.charge = this.buildChargeObject(newValue);
        this.trickleValue = this.charge.value;
      },
    },
  },

  computed: {
    minPayable() {
      return this.getMinPayable(this.charge);
    },

    sortedItems() {
      return this.getSortedItems(this.charge);
    },
  },

  methods: {
    buildChargeObject(blueprint) {
      let retval = {
        text: blueprint?.text || '',
        secondary: blueprint?.secondary || '',
        value: blueprint?.value || 0,
        data: blueprint?.data || null,
        items: [],

        id: blueprint?.id || null,
        min: blueprint?.min || 0,
        max: blueprint?.max || 0,
        currency: blueprint?.currency || 'COP',
        step: blueprint?.step || 1000,
        allowPartial: blueprint?.allowPartial || false,
        fixed: blueprint?.fixed || false,
        optional: blueprint?.optional || false,
        expanded: blueprint?.expanded || false,
        requires: blueprint?.requires || null,
      };

      if (blueprint?.items?.length) {
        retval.value = 0;
        retval.min = 0;
        retval.max = 0;
        for (let i = 0; i < blueprint.items.length; i++) {
          let child = this.buildChargeObject({
            currency: retval.currency,
            ...blueprint.items[i],
          });

          if (!retval.allowPartial || retval.fixed) {
            child.fixed = true;
          }

          retval.items.push(child);

          retval.value += parseFloat(child.value);
          retval.min += parseFloat(child.min);
          retval.max += parseFloat(child.max);
        }
      } else {
        retval.items = [];
      }

      return retval;
    },

    onItemChanged(targetItem) {
      this.setValue(targetItem, targetItem.value);
      this.emitInput();
    },

    computeSums(chargeItem) {
      if (chargeItem?.items?.length) {
        chargeItem.value = 0;
        for (let i = 0; i < chargeItem.items.length; i++) {
          chargeItem.value += this.computeSums(chargeItem.items[i]);
        }
      }

      return parseFloat(chargeItem?.value) || 0;
    },

    findChargeId(id, haystack = null) {
      if (haystack == null) {
        haystack = this.charge;
      }

      if (id == haystack?.id) {
        return haystack;
      }

      if (haystack?.items?.length) {
        let found = null;
        for (let i = 0; i < haystack.items.length; i++) {
          found = this.findChargeId(id, haystack.items[i]);
          if (found) {
            return found;
          }
        }
      }

      return null;
    },

    findDependants(parentId, haystack = null) {
      let retval = [];

      if (haystack == null) {
        haystack = this.charge;
      }

      if (haystack?.requires?.length && haystack.requires.includes(parentId)) {
        retval.push(haystack);
      }

      if (haystack?.items?.length) {
        for (let i = 0; i < haystack.items.length; i++) {
          retval = [
            ...retval,
            ...this.findDependants(parentId, haystack.items[i]),
          ];
        }
      }

      return retval;
    },

    getSortedItems(targetCharge, retval = []) {
      if (targetCharge?.requires?.length) {
        targetCharge.requires.forEach((requiredId) => {
          let found = this.findChargeId(requiredId, targetCharge);
          if (found) {
            this.getSortedItems(found, retval);
          }
        });
      }

      if (targetCharge?.items?.length) {
        targetCharge.items.forEach((child) => {
          this.getSortedItems(child, retval);
        });
      } else if (retval.indexOf(targetCharge) == -1) {
        retval.push(targetCharge);
      }

      return retval;
    },

    setValue(targetCharge, value) {
      // Si tiene hijos, se hace un "trickle" sobre los hijos
      if (targetCharge?.items?.length) {
        targetCharge.value = 0;

        let remainder = value;
        for (let i = 0; i < targetCharge.items.length; i++) {
          let child = targetCharge.items[i];
          remainder -= this.setValue(child, remainder);
          targetCharge.value += child.value;
        }
      } else {
        targetCharge.value = Math.max(
          0,
          Math.min(parseFloat(value), targetCharge.max)
        );
      }

      // Mark required (if any)
      if (targetCharge.value > 0 && targetCharge?.requires?.length) {
        targetCharge.requires.forEach((requiredId) => {
          let requiredCharge = this.findChargeId(requiredId);
          if (requiredCharge) {
            this.setValue(requiredCharge, requiredCharge.max);
          }
        });
      }

      // Unmark dependants
      if (targetCharge.value < targetCharge.max && targetCharge?.id) {
        this.findDependants(targetCharge.id).forEach((dep) =>
          this.setValue(dep, 0)
        );
      }

      return targetCharge.value;
    },

    emitInput() {
      this.computeSums(this.charge);
      this.trickleValue = this.charge.value;

      this.$emit('update:modelValue', this.toCharge(this.charge));
    },

    toCharge(innerCharge) {
      if (!innerCharge.value) {
        return null;
      }

      let retval = {
        text: innerCharge?.text || '',
        secondary: innerCharge?.secondary || '',
        value: innerCharge?.value || 0,
        data: innerCharge?.data || null,
        items: [],
      };

      let childItems = innerCharge?.items?.length ? innerCharge.items : [];
      retval.items = childItems
        .map((child) => this.toCharge(child))
        .filter((e) => e != null);

      if (!retval.items.length) {
        retval.items = undefined;
      }

      return retval;
    },

    stepUp() {
      let unpaid = this.sortedItems.filter((i) => i.value < i.max);
      if (!unpaid.length) {
        return;
      }

      let targetItem = unpaid[0];
      this.setValue(targetItem, targetItem.max);
      this.emitInput();
    },

    stepDown() {
      let paid = this.sortedItems.filter((i) => i.value > 0);
      if (!paid.length) {
        return;
      }

      let targetItem = paid[paid.length - 1];
      this.setValue(targetItem, 0);
      this.emitInput();
    },

    onTrickleInput() {
      this.setValue(this.charge, 0);
      let remainder = this.trickleValue;
      for (let i = 0; i < this.sortedItems.length; i++) {
        let item = this.sortedItems[i];
        if (remainder < item.max && !item.allowPartial) {
          break;
        }
        remainder -= this.setValue(item, remainder);
      }

      this.emitInput();
    },

    getMinPayable(targetItem) {
      let baseMin = targetItem?.min || 0;

      // Si un item tiene dependencias, su valor minimo será su minimo + el minimo de las dependencias (!)
      if (targetItem?.requires?.length) {
        targetItem.requires.forEach((requiredId) => {
          let found = this.findChargeId(requiredId);
          if (found) {
            baseMin = Math.max(baseMin, this.getMinPayable(found));
          }
        });
      }

      if (!targetItem.allowPartial) {
        return targetItem.max + baseMin;
      }

      if (targetItem?.items?.length) {
        let childMin = Infinity;
        for (let i = 0; i < targetItem.items.length; i++) {
          childMin = Math.min(
            childMin,
            this.getMinPayable(targetItem.items[i])
          );
        }
        return childMin + baseMin;
      }

      return baseMin;
    },
  },
};
</script>