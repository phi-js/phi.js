<script>
import { defineAsyncComponent } from 'vue'
const VmStatement = defineAsyncComponent(() => import('../VmStatement.vue')) // prevent component recursion

import { UiCodeGroup } from '@/packages/ui'
import VmStatementPicker from '../VmStatementPicker.vue'
import useVmI18n from '../../../i18n'


export default {
  name: 'StmtAndOr',
  components: {
    VmStatement,
    VmStatementPicker,
    UiCodeGroup,
  },

  props: {
    modelValue: {
      type: Object,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  setup() {
    const i18n = useVmI18n()
    return { i18n }
  },

  data() {
    return { innerModel: null }
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
    },

    emitInput() {
      let res = { [this.innerModel.operator]: this.innerModel.list }
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(res)))
    },
  },
}
</script>

<template>
  <UiCodeGroup
    class="StmtAndOr"
    :text="innerModel.operator"
    open
  >
    <template #face="{ isOpen }">
      <div
        v-if="!isOpen"
        class="StmtAndOr__text"
      >
        {{ innerModel.operator == 'and' ? i18n.t('StmtAndOr.allOf') : i18n.t('StmtAndOr.anyOf') }} ...
      </div>
      <select
        v-else
        v-model="innerModel.operator"
        class="StmtAndOr__select"
        @change="emitInput"
        @click.prevent.stop="()=>1"
      >
        <option
          value="and"
          v-text="i18n.t('StmtAndOr.allOf')"
        />
        <option
          value="or"
          v-text="i18n.t('StmtAndOr.anyOf')"
        />
      </select>
    </template>

    <template #default>
      <VmStatement
        v-for="(_, i) in innerModel.list"
        :key="i"
        v-model="innerModel.list[i]"
        class="StmtAndOr__item"
        @update:model-value="emitInput"
        @delete="removeCondition(i)"
      />

      <VmStatementPicker
        type="operator"
        :text="i18n.t('StmtAndOr.addCondition')"
        icon="mdi:plus"
        @input="pushOperator"
      />
    </template>
  </UiCodeGroup>
</template>

<style lang="scss">
.StmtAndOr {
  &__select,
  &__text {
    font-size: 0.8rem;
    padding: 3px 6px;
    margin: 5px 3px;
  }

  &__select {
    font-family: inherit;
    background: transparent;
    border: none;

    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }

    option {
      color: black;
    }
  }
}
</style>