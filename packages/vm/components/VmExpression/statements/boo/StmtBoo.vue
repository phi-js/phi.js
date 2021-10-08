<template>
  <div class="StmtBoo">
    <select
      v-model="innerModel.operator"
      class="stmt-boo-operator-select"
      @change="emitInput"
    >
      <option value="and">
        Todas las siguientes
      </option>
      <option value="or">
        Cualquiera de las siguientes
      </option>
    </select>

    <div class="stmt-do-body">
      <div class="stmt-boo-list">
        <div
          v-for="(expr, i) in innerModel.list"
          :key="i"
          class="stmt-boo-item"
          :class="{'--endangered': endangeredIndex == i}"
        >
          <VmExpressionInternal
            v-model="innerModel.list[i]"
            @update:modelValue="emitInput"
          />

          <div style="flex:none">
            <UiIcon
              src="mdi:close"
              class="ui-clickable boo-deleter"
              @mouseover="onDeleterMouseover(i)"
              @mouseout="onDeleterMouseout"
              @click="removeCondition(i)"
            />
          </div>
        </div>
      </div>

      <div class="stmt-boo-adder">
        <BooLauncher @input="pushCondition" />
      </div>
    </div>
  </div>
</template>

<script>
import BooLauncher from './BooLauncher.vue'
import VmExpressionInternal from '../../VmExpressionInternal.vue'
import { UiIcon } from '/packages/ui/components'

export default {
  name: 'StmtBoo',
  components: { BooLauncher, VmExpressionInternal, UiIcon },

  props: {
    modelValue: {
      type: Object,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  data() {
    return {
      innerModel: null,
      endangeredIndex: -1,
    }
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newValue) {
        let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue

        if (Array.isArray(clone.and)) {
          this.innerModel = { operator: 'and', list: clone.and }
        } else if (Array.isArray(clone.or)) {
          this.innerModel = { operator: 'or', list: clone.or }
        } else {
          this.innerModel = { operator: 'and', list: [] }
        }
      },
    },
  },

  methods: {
    removeCondition(index) {
      this.innerModel.list.splice(index, 1)
      this.emitInput()
    },

    pushCondition(incoming) {
      if (incoming) {
        this.innerModel.list.push(incoming)
      } else {
        this.innerModel.list.push({ op: null })
      }
      this.emitInput()
      this.endangeredIndex = -1
    },

    emitInput() {
      let res = { [this.innerModel.operator]: this.innerModel.list }
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(res)))
    },

    onDeleterMouseover(index) {
      this.endangeredIndex = index
    },

    onDeleterMouseout() {
      this.endangeredIndex = -1
    },
  },
}
</script>

<style lang="scss">
.StmtBoo {
  .stmt-boo-operator-select {
    padding: var(--ui-padding);
    border: 0;
    background: transparent;
    font-family: var(--ui-font-secondary);
    font-weight: bold;
  }

  .stmt-boo-adder {
    margin-bottom: 28px;
  }

  .stmt-do-body {
    padding-left: 24px;
  }

  .stmt-boo-item {
    padding: 3px;
    margin-bottom: 12px;
    position: relative;

    .boo-deleter {
      position: absolute;
      top: 8px;
      right: 6px;
      z-index: 2;

      &:hover {
        // color: #fff;
        color: var(--ui-color-danger);
        opacity: 0.7;
      }
    }

    &.--endangered {
      // background-color: var(--ui-color-danger);
      // opacity: 0.3;
      background-color: #ea545512;
    }
  }

  // borde redondeado a la izquierda
  .stmt-boo-item,
  .stmt-boo-adder {
    border-radius: var(--ui-radius);
    padding-left: 8px;
    border-left: 2px solid var(--ui-color-primary);
  }
}
</style>