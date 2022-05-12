<script>
import { defineAsyncComponent } from 'vue'
const VmStatement = defineAsyncComponent(() => import('../VmStatement.vue'))

import VmOperatorPicker from '../VmOperatorPicker.vue'
import { UiIcon } from '@/packages/ui/components'
import { useI18n } from '@/packages/i18n'

export default {
  name: 'StmtAndOr',
  components: { VmStatement, VmOperatorPicker, UiIcon },

  props: {
    modelValue: {
      type: Object,
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue'],

  setup() {
    const i18n = useI18n({
      en: {
        'StmtAndOr.allOf': 'All of the following',
        'StmtAndOr.anyOf': 'Any of the following',
      },
      es: {
        'StmtAndOr.allOf': 'Todas las siguientes',
        'StmtAndOr.anyOf': 'Cualquiera de las siguientes',
      },
    })

    return { i18n }
  },

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

    redact(condition) {
      return 'duhh' + JSON.stringify(condition)
    },
  },
}
</script>

<template>
  <fieldset class="StmtAndOr">
    <legend>
      <select
        v-model="innerModel.operator"
        class="StmtAndOr__select"
        @change="emitInput"
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
    </legend>

    <div class="StmtAndOr__body">
      <div
        v-for="(_, i) in innerModel.list"
        :key="i"
        class="StmtAndOr__item"
        :class="{'StmtAndOr__item--endangered': endangeredIndex == i}"
      >
        <VmStatement
          v-model="innerModel.list[i]"
          @update:model-value="emitInput"
        />

        <UiIcon
          src="mdi:close"
          class="StmtAndOr__deleter"
          @mouseover="endangeredIndex = i"
          @mouseout="endangeredIndex = -1"
          @click="removeCondition(i)"
        />
      </div>

      <VmOperatorPicker
        class="StmtAndOr__adder"
        @input="pushOperator"
      />
    </div>
  </fieldset>
</template>