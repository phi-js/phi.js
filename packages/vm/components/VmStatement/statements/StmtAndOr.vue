<script>
import { defineAsyncComponent } from 'vue'
const VmStatement = defineAsyncComponent(() => import('../VmStatement.vue'))

import { UiDetails } from '@/packages/ui'
import VmStatementPicker from '../VmStatementPicker.vue'
import useVmI18n from '../../../i18n'

let globalCounter = 0

export default {
  name: 'StmtAndOr',
  components: { VmStatement, VmStatementPicker, UiDetails },

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

    return {
      i18n,
      uid: globalCounter++,
    }
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

      // Focus the first found input field
      setTimeout(() => {
        const childItems = this.$el.querySelectorAll('.StmtAndOr__item')
        const newlyCreatedChild = childItems?.[childItems.length - 1]
        if (newlyCreatedChild?.querySelector) {
          newlyCreatedChild.querySelector('input')?.focus?.()
        }
      }, 77)
    },

    emitInput() {
      let res = { [this.innerModel.operator]: this.innerModel.list }
      this.$emit('update:modelValue', JSON.parse(JSON.stringify(res)))
    },
  },
}
</script>

<template>
  <UiDetails
    class="StmtAndOr"
    open
  >
    <template #summary>
      <div class="StmtAndOr__header">
        <select
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
      </div>
    </template>

    <template #default>
      <div class="StmtAndOr__body">
        <div
          v-for="(_, i) in innerModel.list"
          :key="i"
          class="StmtAndOr__item"
        >
          <VmStatement
            v-model="innerModel.list[i]"
            :group="`StmtAndOr-${uid}`"
            @update:model-value="emitInput"
            @delete="removeCondition(i)"
          />
        </div>

        <VmStatementPicker
          type="operator"
          label="Add condition"
          @input="pushOperator"
        />
      </div>
    </template>
  </UiDetails>
</template>