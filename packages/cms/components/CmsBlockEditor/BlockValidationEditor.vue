<script setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiInput, UiDrawer, UiItem } from '@/packages/ui'
import CmsPropInput from '../CmsPropInput/CmsPropInput.vue'

/*
Manage block.rules property
[
  {
    type: 'required',
    message: 'You must type a name',
    breaking: true | false  // Do not check further rules if this one fails
  },
  {
    type: 'minlength',
    value: 6,
    message: 'Word be at least 6 characters',
    breaking: false
  },
  {
    type: 'maxlength',
    value: 30,
    message: 'Don\'t go over 30 characters',
    breaking: false
  },
  {
    type: 'pattern',
    value: 'some|pattern|here',
    message: 'This doesnt really match whatever',
    breaking: false
  }
]
*/

const i18n = useI18n({
  en: {
    'BlockValidationEditor.Required': 'Required',
    'BlockValidationEditor.MinLength': 'Min. length',
    'BlockValidationEditor.MaxLength': 'Max. length',
    'BlockValidationEditor.RegularExpression': 'Regular expression',
    'BlockValidationEditor.Pattern': 'Pattern',
    'BlockValidationEditor.ErrorMessage': 'Error message',
  },
  es: {
    'BlockValidationEditor.Required': 'Requerido',
    'BlockValidationEditor.MinLength': 'Longitud mínima',
    'BlockValidationEditor.MaxLength': 'Longitud máxima',
    'BlockValidationEditor.RegularExpression': 'Expresión regular',
    'BlockValidationEditor.Pattern': 'Patrón',
    'BlockValidationEditor.ErrorMessage': 'Mensaje de error',
  },
})



const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const rules = ref([
  {
    text: i18n.t('BlockValidationEditor.Required'),
    type: 'required',
    message: null,
    isEnabled: false,
  },
  {
    text: i18n.t('BlockValidationEditor.MinLength'),
    type: 'minlength',
    message: null,
    isEnabled: false,
  },
  {
    text: i18n.t('BlockValidationEditor.MaxLength'),
    type: 'maxlength',
    message: null,
    isEnabled: false,
  },
  {
    text: i18n.t('BlockValidationEditor.RegularExpression'),
    type: 'pattern',
    message: null,
    isEnabled: false,
  },
])

const availableRules = computed(() => {

  if (!props.modelValue?.props?.type) {
    return rules.value
  }

  const showPattern = [
    'text',
    'number',
    'search',
    'password',
    'email',
    'tel',
    'url',
  ].includes(props.modelValue.props.type)

  // eslint-disable-next-line max-len
  const showMinMax = typeof props.modelValue.props?.type == 'string'
    ? [
      'text',
      'textarea',
      'search',
      'password',
      'email',
      'tel',
      'url',
      'upload',
    ].includes(props.modelValue.props.type) // || props.modelValue.props.type.startsWith('select')
    : true

  return rules.value.filter((r) => {
    if (r.type == 'pattern') {
      return showPattern
    }
    if (r.type == 'minlength' || r.type == 'maxlength') {
      return showMinMax
    }
    return true
  })
})

watch(
  () => props.modelValue?.rules,
  (incomingRules) => {
    if (!Array.isArray(incomingRules)) {
      return
    }

    incomingRules.forEach((rule) => {
      const matchingRule = rules.value.find((r) => r.type == rule.type)
      if (!matchingRule) {
        // incoming value of unknown type
        return
      }
      Object.assign(matchingRule, rule)
      matchingRule.isEnabled = true
    })
  },
  { immediate: true },
)

function emitUpdate() {
  const targetValue = rules.value
    .filter((r) => r.isEnabled)
    .map((r) => ({
      type: r.type,
      message: r.message,
      value: r.value,
    }))

  emit('update:modelValue', {
    ...props.modelValue,
    rules: targetValue?.length ? targetValue : null,
  })
}
</script>

<template>
  <div class="BlockValidationEditor">
    <div
      v-for="(rule, k) in availableRules"
      :key="k"
      class="BlockValidationEditor__rule"
      :class="{'BlockValidationEditor__rule--open': rule.isEnabled}"
    >
      <UiItem
        class="BlockValidationEditor__ruleItem"
        :text="rule.text"
        :icon="rule.isEnabled ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
        @click="rule.isEnabled = !rule.isEnabled; emitUpdate()"
      />

      <UiDrawer :open="rule.isEnabled">
        <div
          v-if="rule.isEnabled"
          class="BlockValidationEditor__ruleBody"
        >
          <UiInput
            v-if="rule.type == 'pattern'"
            v-model="rule.value"
            type="text"
            :label="i18n.t('BlockValidationEditor.Pattern')"
            required
            @update:model-value="emitUpdate()"
          />
          <UiInput
            v-else-if="rule.type == 'minlength' || rule.type == 'maxlength'"
            v-model="rule.value"
            type="number"
            required
            @update:model-value="emitUpdate()"
          />

          <CmsPropInput
            v-model="rule.message"
            :block="props.modelValue"
            class="BlockValidationEditor__ruleMessage"
            type="text"
            :label="i18n.t('BlockValidationEditor.ErrorMessage')"
            @update:model-value="emitUpdate()"
          />
        </div>
      </UiDrawer>
    </div>
  </div>
</template>