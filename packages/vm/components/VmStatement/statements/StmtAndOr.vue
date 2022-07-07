<script>
import { defineAsyncComponent } from 'vue'
const VmStatement = defineAsyncComponent(() => import('../VmStatement.vue'))

import VmOperatorPicker from '../VmOperatorPicker.vue'
import { useI18n } from '@/packages/i18n'
import { UiDetails } from '@/packages/ui'

let globalCounter = 0

export default {
  name: 'StmtAndOr',
  components: { UiDetails, VmStatement, VmOperatorPicker },

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
      de: {
        'StmtAndOr.allOf': 'Alles',
        'StmtAndOr.anyOf': 'Irgendein',
      },
    })

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
    <template #summary="{ isOpen }">
      <select
        v-if="isOpen"
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
      <span v-else>{{ innerModel.operator == 'and' ? i18n.t('StmtAndOr.allOf') : i18n.t('StmtAndOr.anyOf') }}</span>
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
            :open="false"
            @update:model-value="emitInput"
            @delete="removeCondition(i)"
          />
        </div>

        <VmOperatorPicker
          class="StmtAndOr__adder"
          @input="pushOperator"
        />
      </div>
    </template>
  </UiDetails>
</template>