<script setup>
import { ref, watchEffect } from 'vue'
import { UiInput } from '../../../ui'
import { VmStatement } from '../../../vm/components'

const props = defineProps({
  /* BLOCK object */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const rules = ref()
const requiredRule = ref({
  isEnabled: false,
  message: '',
})
const otherRules = ref([])

watchEffect(() => {
  rules.value = props.modelValue.rules?.length ? props.modelValue.rules : []

  const foundRequiredRule = rules.value.find((r) => r.required)
  requiredRule.value.isEnabled = !!foundRequiredRule
  requiredRule.value.message = foundRequiredRule?.message || requiredRule.value.message

  otherRules.value = rules.value.filter((r) => !r.required)
})

function toggleRequired() {
  requiredRule.value.isEnabled = !requiredRule.value.isEnabled
  emitUpdate()
}

function appendRule(ruleType) {
  if (!ruleType) {
    return
  }

  switch (ruleType) {
  case 'regex':
    otherRules.value.push({
      regex: '',
      message: '',
    })
    break

  case 'vm':
    otherRules.value.push({
      eval: { chain: [] },
      message: '',
    })
    break
  }
}

function removeRule(rule) {
  otherRules.value = otherRules.value.filter((r) => r !== rule)
  emitUpdate()
}


function emitUpdate() {
  let blockRules = []
  if (requiredRule.value.isEnabled) {
    blockRules.push({
      required: true,
      message: requiredRule.value.message,
    })
  }

  emit('update:modelValue', {
    ...props.modelValue,
    rules: blockRules.concat(otherRules.value),
  })
}
</script>

<template>
  <div class="BlockValidationEditor UiForm">
    <fieldset>
      <legend>
        <label>
          Required
          <input
            type="checkbox"
            :checked="requiredRule.isEnabled"
            @change="toggleRequired()"
          >
        </label>
      </legend>
      <UiInput
        v-model="requiredRule.message"
        type="text"
        label="Mensaje de error"
        :disabled="!requiredRule.isEnabled"
        @update:modelValue="emitUpdate()"
      />
    </fieldset>

    <fieldset
      v-for="(rule, k) in otherRules"
      :key="k"
      class="ValidationRule"
    >
      <template v-if="rule.regex !== undefined">
        <legend>RegEx</legend>
        <UiInput
          v-model="rule.regex"
          type="text"
          label="Expresion regular"
          @update:modelValue="emitUpdate()"
        />
        <UiInput
          v-model="rule.message"
          type="text"
          label="Mensaje de error"
          @update:modelValue="emitUpdate()"
        />
      </template>
      <template v-else-if="rule.eval !== undefined">
        <legend>VM</legend>
        <VmStatement
          v-model="rule.eval"
          @update:modelValue="emitUpdate()"
        />
        <UiInput
          v-model="rule.message"
          label="Mensaje de error"
          @update:modelValue="emitUpdate()"
        />
      </template>

      <div
        class="ValidationRule__delete"
        @click="removeRule(rule)"
      >
        &times;
      </div>
    </fieldset>

    <select
      class="UiInput"
      @change="appendRule($event.target.value); $event.target.value = ''"
    >
      <option value="">
        Agregar regla ...
      </option>

      <option value="regex">
        RegEx
      </option>
      <option value="vm">
        Expresión
      </option>
    </select>
  </div>
</template>

<style lang="scss">
.ValidationRule {
  position: relative;

  &__delete {
    cursor: pointer;

    position: absolute;
    top: -12px;
    right: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    width: 32px;
    height: 32px;
  }
}
</style>