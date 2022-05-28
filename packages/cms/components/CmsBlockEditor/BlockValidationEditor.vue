<script setup>
import { ref, watchEffect, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput } from '@/packages/ui'
import { VmStatement } from '@/packages/vm'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const rules = ref()

watchEffect(() => {
  rules.value = props.modelValue.rules?.length ? props.modelValue.rules.concat() : []
})

function appendRule(ruleType) {
  if (!ruleType) {
    return
  }

  switch (ruleType) {
  case 'required':
    rules.value.push({
      required: true,
      message: '',
    })
    break

  case 'regex':
    rules.value.push({
      regex: '',
      message: '',
    })
    break

  case 'vm':
    rules.value.push({
      eval: { chain: [] },
      message: '',
    })
    break
  }
}

function removeRule(rule) {
  rules.value = rules.value.filter((r) => r !== rule)
  emitUpdate()
}

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    rules: rules.value.concat(),
  })
}


const i18n = useI18n({
  en: {
    'BlockValidationEditor.Required': 'Required',
    'BlockValidationEditor.RegEx': 'RegEx',
    'BlockValidationEditor.RegularExpression': 'Regular expression',
    'BlockValidationEditor.ErrorMessage': 'Error message',
    'BlockValidationEditor.Expression': 'Expression',
    'BlockValidationEditor.AddRule': 'Add rule',
  },
  es: {
    'BlockValidationEditor.Required': 'Requerido',
    'BlockValidationEditor.RegEx': 'RegEx',
    'BlockValidationEditor.RegularExpression': 'Expresión regular',
    'BlockValidationEditor.ErrorMessage': 'Mensaje de error',
    'BlockValidationEditor.Expression': 'Expresión',
    'BlockValidationEditor.AddRule': 'Agregar regla',
  },
})

const hasRequiredRule = computed(() => rules.value.find((r) => !!r.required))
</script>

<template>
  <div class="BlockValidationEditor UiForm">
    <details
      v-for="(rule, k) in rules"
      :key="k"
      class="ValidationRule"
    >
      <summary>
        <span v-if="rule.regex !== undefined">{{ i18n.t('BlockValidationEditor.RegEx') }}</span>
        <span v-else-if="rule.eval !== undefined">{{ i18n.t('BlockValidationEditor.Expression') }}</span>
        <span v-else-if="rule.required">{{ i18n.t('BlockValidationEditor.Required') }}</span>
        <div
          class="ValidationRule__delete"
          @click="removeRule(rule)"
        >
          &times;
        </div>
      </summary>

      <section v-if="rule.required">
        <UiInput
          v-model="rule.message"
          type="text"
          :label="i18n.t('BlockValidationEditor.ErrorMessage')"
          @update:model-value="emitUpdate()"
        />
      </section>

      <section v-else-if="rule.regex !== undefined">
        <UiInput
          v-model="rule.regex"
          type="text"
          :label="i18n.t('BlockValidationEditor.RegularExpression')"
          @update:model-value="emitUpdate()"
        />
        <UiInput
          v-model="rule.message"
          type="text"
          :label="i18n.t('BlockValidationEditor.ErrorMessage')"
          @update:model-value="emitUpdate()"
        />
      </section>

      <section v-else-if="rule.eval !== undefined">
        <VmStatement
          v-model="rule.eval"
          @update:model-value="emitUpdate()"
        />
        <UiInput
          v-model="rule.message"
          :label="i18n.t('BlockValidationEditor.ErrorMessage')"
          @update:model-value="emitUpdate()"
        />
      </section>
    </details>

    <select
      class="BlockValidationEditor__adder UiInput"
      @change="appendRule($event.target.value); $event.target.value = ''"
    >
      <option
        value=""
        v-text="i18n.t('BlockValidationEditor.AddRule')"
      />
      <option
        v-if="!hasRequiredRule"
        value="required"
        v-text="i18n.t('BlockValidationEditor.Required')"
      />
      <option
        value="regex"
        v-text="i18n.t('BlockValidationEditor.RegEx')"
      />
      <option
        value="vm"
        v-text="i18n.t('BlockValidationEditor.Expression')"
      />
    </select>
  </div>
</template>

<style lang="scss">
@import '@/packages/ui/themes/base/modifiers/clickable.scss';

.ValidationRule {
  position: relative;

  summary {
    position: relative;
  }

  &__delete {
    @extend .ui--clickable;

    position: absolute;
    top: 0;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 40px;
    height: 40px;
  }
}
</style>