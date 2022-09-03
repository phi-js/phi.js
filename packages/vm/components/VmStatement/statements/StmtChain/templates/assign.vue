<script setup>
import { computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui/components'
import StmtEval from '../../StmtEval.vue'

const i18n = useI18n({
  en: {
    'StmtAssign.json': 'Constant',
    'StmtAssign.eval': 'Expression',
  },
  es: {
    'StmtAssign.json': 'Constante',
    'StmtAssign.eval': 'Expresión',
  },
})

const props = defineProps({
  /*
  CHAIN ITEM object
  {
    "do": { ...Vm Statement Object },
    "if"(?): { ... Vm Stement Object },
    "assign": ""
  }
  */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const expressionType = computed({
  get() {
    return props.modelValue?.do?.eval ? 'eval' : 'json'
  },

  set(newValue) {
    if (newValue == 'eval') {
      emit('update:modelValue', {
        ...props.modelValue,
        do: { eval: `return ${JSON.stringify(props.modelValue.do)}` },
      })
    } else {

      let jsonValue = null
      try {
        jsonValue = props.modelValue?.do?.eval
          ? JSON.parse(props.modelValue.do.eval.replace('return ', ''))
          : props.modelValue.do
      } catch (e) {
        jsonValue = ''
      }

      emit('update:modelValue', {
        ...props.modelValue,
        do: jsonValue,
      })
    }
  },
})

</script>

<template>
  <div class="StmtAssign">
    <UiInput
      type="text"
      label="Variable name"
      :model-value="props.modelValue.assign"
      @update:model-value="emit('update:modelValue', {...props.modelValue, assign: $event})"
    />

    <div class="StmtAssign__field">
      <select
        v-model="expressionType"
        class="StmtAssign__typeSelect"
      >
        <option
          value="json"
          v-text="i18n.t('StmtAssign.json')"
        />
        <option
          value="eval"
          v-text="i18n.t('StmtAssign.eval')"
        />
      </select>

      <StmtEval
        v-if="expressionType == 'eval'"
        :model-value="props.modelValue.do"
        @update:model-value="emit('update:modelValue', {...props.modelValue, do: $event})"
      />
      <UiInput
        v-else
        type="json"
        :model-value="props.modelValue.do"
        @update:model-value="emit('update:modelValue', {...props.modelValue, do: $event})"
      />
    </div>
  </div>
</template>

<style lang="scss">
.StmtAssign {
  &__field {
    margin-top: 1rem;

    & > select {
      background: transparent;
      border: 0;
      margin: 0;
      padding: 3px;
      cursor: pointer;

      font-size: 0.9em;
      font-weight: bold;

      option {
        color: #000;
      }
    }
  }
}
</style>