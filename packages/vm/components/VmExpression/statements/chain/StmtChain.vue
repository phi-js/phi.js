<template>
  <div
    class="StmtChain"
    :class="{'--dragging':damnDragbus.isDragging}"
  >
    <div class="chain-drag-container">
      <Draggable
        v-model="innerModel.chain"
        @input="emitInput"
        handle=".chain-item-item .ui-icon"
        group="stmt-chain"
        :swap-threshold="0.25"
        :animation="150"
        @start="onDragEvent('start', $event)"
        @end="onDragEvent('end', $event)"
      >
        <div
          class="chain-item"
          v-for="(link,i) in innerModel.chain"
          :key="i"
        >
          <StmtChainLink
            v-model="innerModel.chain[i]"
            @input="emitInput"
            @delete="removeLink(i)"
          />
        </div>
      </Draggable>
    </div>

    <div
      class="chain-staging"
      v-if="stagedItem"
    >
      <StmtChainLink
        open
        :value="stagedItem"
        @input="onStageAccept"
        @cancel="onStageCancel"
      />
    </div>

    <VmExpressionPicker
      class="chain-expression-picker"
      @input="onPickerInput"
    />
  </div>
</template>

<script>
var damnDragbus = {
  isDragging: false,
};

// import Draggable from 'vuedraggable';
const Draggable = null; //DUMMY

import StmtChainLink from '../../statements/chain/StmtChainLink.vue';
import VmExpressionPicker from '../../VmExpressionPicker.vue';

export default {
  name: 'StmtChain',
  components: { Draggable, StmtChainLink, VmExpressionPicker },

  props: {
    value: {
      required: false,
      default: null,
    },
  },

  data() {
    return {
      damnDragbus,

      innerModel: null,
      stagedItem: null,
      isDragging: false,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        let clone = newValue
          ? JSON.parse(JSON.stringify(newValue))
          : { chain: [] };

        if (!clone.chain || !clone.chain.length) {
          clone.chain = [];
        }

        this.innerModel = clone;
      },
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)));
    },

    removeLink(index) {
      this.innerModel.chain.splice(index, 1);
      this.emitInput();
    },

    onPickerInput({ expression, definition }) {
      if (expression.if) {
        expression.then = { chain: [] };
        expression.else = { chain: [] };
      }

      let chainItem = {
        info: {
          text: definition.text,
          icon: definition.icon,
          secondary: definition.secondary,
        },
        do: expression,
        assign: null,
      };

      this.stagedItem = chainItem;
    },

    onStageAccept(chainItem) {
      this.innerModel.chain.push(chainItem);
      this.stagedItem = null;
      this.emitInput();
    },

    onStageCancel() {
      this.stagedItem = null;
    },

    onDragEvent(eventName) {
      // console.log('onDragEvent', eventName, $event);
      // let itemValue = $event.item.children[0].__vue__.value;
      // itemValue = JSON.parse(JSON.stringify(itemValue));
      // console.log('onDragEvent', eventName, itemValue);

      // if (eventName == 'add') {
      //   // Primero ocurre el add, y DESPUES ocurre el "remove" del container desde el que
      //   // se sacó el elemento.
      //   // Al recibir un "add", esperamos el "remove" correspondiente antes de modificar el modelo
      //   damnDragbus.afterNextRemove = (evt, vueInstance) => {
      //     console.log('Ya vi el remove de:', evt, vueInstance);
      //     console.log('y ahora voi a insertar en', $event.newIndex, itemValue);
      //     this.innerModel.chain.splice($event.newIndex, 0, itemValue);
      //     this.emitInput();
      //   };

      //   return;
      // }

      // if (eventName == 'remove') {
      //   console.log('removing item', $event.oldIndex);
      //   this.innerModel.chain.splice($event.oldIndex, 1);
      //   this.emitInput();

      //   if (damnDragbus.afterNextRemove) {
      //     damnDragbus.afterNextRemove($event, this);
      //     damnDragbus.afterNextRemove = null;
      //   }

      //   return;
      // }

      if (eventName == 'start') {
        damnDragbus.isDragging = true;
      } else if (eventName == 'end') {
        damnDragbus.isDragging = false;
      }
    },
  },
};
</script>

<style lang="scss">
.StmtChain {
  &.--dragging {
    .chain-drag-container {
      border-radius: var(--ui-radius);
      border: 2px dashed var(--ui-color-primary);
      min-height: 24px;
    }
  }
}
</style>