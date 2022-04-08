<template>
  <fieldset class="StmtAndOr">
    <legend>
      {{ label }}
      <select
        v-model="innerModel.operator"
        class="StmtAndOr__select"
        @change="emitInput"
      >
        <option value="and">
          todas las siguientes
        </option>
        <option value="or">
          cualquiera de las siguientes
        </option>
      </select>
    </legend>

    <div class="StmtAndOr__body">
      <div class="StmtAndOr__list">
        <div
          v-for="(_, i) in innerModel.list"
          :key="i"
          class="StmtAndOr__item"
          :class="{'--endangered': endangeredIndex == i}"
        >
          <VmStatement
            v-model="innerModel.list[i]"
            @update:modelValue="emitInput"
          />

          <div style="flex:none">
            <UiIcon
              src="mdi:close"
              class="ui--clickable StmtAndOr__deleter"
              @mouseover="onDeleterMouseover(i)"
              @mouseout="onDeleterMouseout"
              @click="removeCondition(i)"
            />
          </div>
        </div>
      </div>

      <div class="stmt-boo-adder">
        <VmOperatorPicker @input="pushOperator" />
      </div>
    </div>
  </fieldset>
</template>

<script>
import { defineAsyncComponent } from 'vue'
const VmStatement = defineAsyncComponent(() => import('../VmStatement.vue'))

import VmOperatorPicker from '../VmOperatorPicker.vue'
import { UiIcon } from '@/packages/ui/components'

export default {
  name: 'StmtAndOr',
  components: { VmStatement, VmOperatorPicker, UiIcon },

  props: {
    modelValue: {
      type: Object,
      required: false,
      default: null,
    },

    label: {
      type: String,
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

    pushOperator(incoming) {
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
.StmtAndOr {
  border: 1px inset #666;
  padding: 0 20px 0 0px;

  & > legend {
    margin-left: 8px;
  }

  .StmtAndOr__select {
    border: 0;
    background: transparent;
    // margin-bottom: 6px;
    padding: 3px 6px;
  }

  .stmt-boo-adder {
    margin-bottom: 28px;
  }

  .StmtAndOr__body {
    padding-left: 8px;
  }

  .StmtAndOr__item {
    padding: 3px;
    margin-bottom: 12px;
    position: relative;

    .StmtAndOr__deleter {
      position: absolute;
      top: 0;
      right: -16px;
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
  .StmtAndOr__item,
  .stmt-boo-adder {
    padding-left: 8px;
    border-left: 2px solid var(--ui-color-primary);
  }
}
</style>