<script setup>
import useModelSchema from './useModelSchema.js'
const modelSchema = useModelSchema()

const emit = defineEmits(['input'])
function onSelectChange($evt) {
  let val = $evt.target.value
  $evt.target.value = ''

  if (val == 'and') {
    return emit('input', { and: [] })
  }

  if (val == 'or') {
    return emit('input', { or: [] })
  }

  if (val == 'prop:custom') {
    return emit('input', { op: null, field: null, args: null })
  }

  if (val == 'function:custom') {
    return emit('input', { call: null, args: null })
  }

  let parts = val.split(':', 2)
  if (parts[0] == 'function') {
    return emit('input', { call: parts[1], args: null })
  }

  if (parts[0] == 'prop') {
    return emit('input', { field: parts[1], op: null, args: null })
  }

  emit('input', {})
}
</script>

<template>
  <select
    class="VmOperatorPicker"
    @change="onSelectChange"
  >
    <option value="">
      + Agregar condición
    </option>

    <!-- Schema properties -->
    <optgroup
      v-if="modelSchema"
      label="Propiedades"
    >
      <option
        v-for="(propDef, propName) in modelSchema.properties"
        :key="propName"
        :value="'prop:' + propName"
      >
        {{ propDef.text || propDef.title || propName }}
      </option>

      <option value="prop:custom">
        Otra ...
      </option>
    </optgroup>

    <optgroup label="Otras">
      <option value="stmt">
        Expresión
      </option>
    </optgroup>

    <!-- availableStatements ? -->
    <optgroup label="Condiciones">
      <option value="and">
        Todas las siguientes ...
      </option>
      <option value="or">
        Cualquiera de las siguientes ...
      </option>
    </optgroup>
  </select>
</template>

<style lang="scss">
.VmOperatorPicker {
  border: 0;
  background: transparent;
  font-family: var(--ui-font-secondary);
  font-size: 13px;
  max-width: 100%;

  cursor: pointer;
  padding: var(--ui-padding);
}
</style>