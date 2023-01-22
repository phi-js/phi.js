<script setup>
import { ref, watch } from 'vue'
import VmStatement from '../VmStatement.vue'
import useVmI18n from '../../../i18n'

const i18n = useVmI18n()

const props = defineProps({
  /*
  STATEMENT object
  {
    "if": "...",
    "then": "...",
    "else": "..."
  }
  */
  modelValue: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerValue = ref({})

watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = JSON.parse(JSON.stringify(newValue))
  },
  { immediate: true },
)

function accept() {
  emit('update:modelValue', JSON.parse(JSON.stringify(innerValue.value)))
}
</script>

<template>
  <div class="StmtIf">
    <div class="StmtIf__if">
      <label>{{ i18n.t('StmtIf.if') }}</label>
      <VmStatement
        v-model="innerValue.if"
        :default="{and: []}"
        @update:model-value="accept()"
      />
    </div>

    <div class="StmtIf__then">
      <label>{{ i18n.t('StmtIf.then') }}</label>
      <VmStatement
        v-model="innerValue.then"
        :default="{chain: []}"
        @update:model-value="accept()"
      />
    </div>

    <div class="StmtIf__else">
      <label>{{ i18n.t('StmtIf.else') }}</label>

      <VmStatement
        v-model="innerValue.else"
        :default="{chain: []}"
        @update:model-value="accept()"
      />
    </div>
  </div>
</template>