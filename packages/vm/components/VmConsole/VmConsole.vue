<script setup>
import { ref, watch } from 'vue'
import VM from '../../lib/VM.js'
import { UiInput, UiItem, UiTab, UiTabs } from '../../../ui/components'
import VmStatement from '../VmStatement/VmStatement.vue'

const props = defineProps({
  /**
   * La expresion a ejecutar
   */
  statement: {
    required: false,
    default: null,
    validator: () => true,
  },

  modelValue: {
    required: false,
    default: null,
    validator: () => true,
  },
})
const emit = defineEmits(['update:modelValue'])

const innerStmt = ref()
watch(
  () => props.statement,
  (newValue) => innerStmt.value = newValue,
  { immediate: true },
)

const vm = new VM()
vm.onModelSet = (varName, value, scope) => {
  emit('update:modelValue', scope)
}

const result = ref()
async function exec() {
  result.value = await vm.eval(innerStmt.value, props.modelValue)
  // console.log('%cphi >', 'background: blue; color: #bada55', result.value)
}
</script>

<template>
  <div class="VmConsole">
    <div class="console-body">
      <UiTabs model-value="editor">
        <UiTab
          value="editor"
          text="Instrucciones"
          icon="mdi:format-list-bulleted-type"
        >
          <VmStatement v-model="innerStmt" />
        </UiTab>

        <!-- <UiTab
          value="model"
          text="Datos"
          secondary="Modelo de datos"
          icon="mdi:variable"
        />
        <template #content-model>
          <UiInput v-model="model" />
        </template> -->

        <UiTab
          value="code"
          text="Código"
          icon="mdi:code-json"
        >
          <UiInput
            v-model="innerStmt"
            type="json"
          />
        </UiTab>
      </UiTabs>
    </div>

    <UiItem
      class="ui-button --main"
      icon="mdi:play"
      icon-color="white"
      text="Run"
      @click="exec"
    />

    <UiInput
      type="json"
      label="Resultados"
      :model-value="result"
    />
  </div>
</template>