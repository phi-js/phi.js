<template>
  <div class="VmConsole">
    <div class="console-body">
      <UiTabs model-value="editor">
        <UiTab
          value="editor"
          text="Instrucciones"
          icon="mdi:format-list-bulleted-type"
        >
          <VmExpression v-model="expression" />
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
            v-model="expression"
            type="json"
          />
        </UiTab>
      </UiTabs>
    </div>

    <UiItem
      class="run-button ui-button --main --inline"
      icon="mdi:play"
      icon-color="white"
      text="Run"
      @click="exec"
    />
    <!--
    <UiItem
      class="run-button ui-button --main --inline"
      icon="mdi:play"
      icon-color="white"
      text="Run"
      secondary="POST /test/vmsql"
      @click="postVmSql"
    /> -->

    <h2 class="ui-label">
      Resultados
    </h2>
    <UiInput
      v-if="result"
      type="json"
      :value="result"
    />
  </div>
</template>

<script>
import VM from '../../lib/VM.js'

import { UiInput, UiItem, UiTab, UiTabs } from '../../../ui/components'

import VmExpression from '../VmExpression/VmExpression.vue'

export default {
  name: 'VmConsole',
  components: {
    UiInput,
    UiItem,
    UiTab,
    UiTabs,
    VmExpression,
  },

  props: {
    /**
     * La expresion a ejecutar
     */
    value: {
      required: false,
      default: null,
      validator: () => true,
    },
  },

  data() {
    return {
      vm: null,
      expression: null,
      result: null,
      model: {},
    }
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.expression = newValue
          ? JSON.parse(JSON.stringify(newValue))
          : null
      },
    },
  },

  mounted() {
    this.vm = new VM()
    this.vm.onModelSet = (varName, value) =>
      this.$set(this.model, varName, value)
  },

  methods: {
    async exec() {
      this.result = await this.vm.eval(this.expression, this.model)
      this.$emit('result', this.result)

      console.log(
        '%cphi >',
        'background: blue; color: #bada55',
        this.result ? JSON.parse(JSON.stringify(this.result)) : this.result,
      )
    },

    async postVmSql() {
      this.result = await fetch('http://v4.local/test/vmsql', {
        method: 'POST',
        body: JSON.stringify(this.expression),
      }).then((res) => res.json())
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.expression)))
    },
  },
}
</script>