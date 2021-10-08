<template>
  <div class="BooLauncher">
    <select
      class="ui-native"
      @change="onSelectChange"
    >
      <option value="">
        + Agregar condición
      </option>

      <!-- Schema properties -->
      <optgroup
        v-if="VmExpressionRoot.schema"
        label="Propiedades"
      >
        <option
          v-for="(propDef, propName) in VmExpressionRoot.schema.properties"
          :key="propName"
          :value="'prop:' + propName"
        >
          {{ propDef.text || propDef.title || propName }}
        </option>

        <option value="prop:custom">
          Otra ...
        </option>
      </optgroup>

      <!-- functions -->
      <!-- !!! Deshabilitado mientras se termina  -->
      <!-- <optgroup label="Funciones">
        <option
          v-for="(fnDef, fnName) in VmExpressionRoot.functions"
          :key="fnName"
          :value="'function:' + fnName"
        >{{ fnDef.text }}</option>
        <option value="function:custom">Otra ...</option>
      </optgroup> -->

      <!-- availableStatements ? -->
      <optgroup label="Condiciones">
        <option value="and">
          Todas las siguientes ...
        </option>
        <option value="or">
          Cualquiera de las siguientes ...
        </option>
      </optgroup>

      <!-- condicion a la medida -->
      <!-- <optgroup label="Otros">
        <option value="custom">Custom</option>
      </optgroup> -->
    </select>
  </div>
</template>

<script>
export default {
  name: 'BooLauncher',
  inject: ['VmExpressionRoot'],

  props: {
    value: {
      validator: () => true,
      required: false,
      default: null,
    },
  },

  emits: ['input'],

  data() {
    return { innerModel: null }
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerModel = newValue
          ? JSON.parse(JSON.stringify(newValue))
          : newValue
      },
    },
  },

  methods: {
    onSelectChange($evt) {
      let val = $evt.target.value
      $evt.target.value = ''

      if (val == 'and') {
        return this.$emit('input', { and: [] })
      }

      if (val == 'or') {
        return this.$emit('input', { or: [] })
      }

      if (val == 'prop:custom') {
        return this.$emit('input', { op: null, field: null, args: null })
      }

      if (val == 'function:custom') {
        return this.$emit('input', { call: null, args: null })
      }

      let parts = val.split(':', 2)
      if (parts[0] == 'function') {
        return this.$emit('input', { call: parts[1], args: null })
      }

      if (parts[0] == 'prop') {
        return this.$emit('input', { field: parts[1], op: null, args: '' })
      }

      this.$emit('input', {})
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)))
    },
  },
}
</script>

<style lang="scss">
.BooLauncher {
  select {
    border: 0;
    background: transparent;
    font-family: var(--ui-font-secondary);
    font-size: 13px;
    font-weight: bold;
    max-width: 100%;

    cursor: pointer;
    padding: var(--ui-padding);
  }
}
</style>