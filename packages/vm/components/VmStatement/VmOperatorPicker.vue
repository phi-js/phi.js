<script setup>
import { computed } from 'vue'

import useVmI18n from '../../i18n'
const i18n = useVmI18n()

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

function getPropertiesArray(schema, retval = [], prefix = '') {
  if (!schema?.type) {
    return []
  }

  if (schema.type == 'object' && typeof schema.properties == 'object') {
    for (const [propertyName, propertySchema] of Object.entries(schema.properties)) {
      getPropertiesArray(propertySchema, retval, (prefix ? prefix + '.' : '') + propertyName)
    }
    return retval
  }

  retval.push({
    ...schema,
    name: prefix,
  })

  return retval
}

const schemaPropertiesList = computed(() => {
  return getPropertiesArray(modelSchema.value)
})
</script>

<template>
  <select
    class="VmOperatorPicker"
    @change="onSelectChange"
  >
    <option
      value=""
      v-text="' + &nbsp;&nbsp;' + i18n.t('VmOperatorPicker.AddContition')"
    />
    <optgroup
      :label="i18n.t('VmOperatorPicker.Variables')"
    >
      <template v-if="modelSchema">
        <option
          v-for="prop in schemaPropertiesList"
          :key="prop.name"
          :value="'prop:' + prop.name"
        >
          {{ prop.title || prop.name }}
        </option>
      </template>

      <!-- <option
        value="prop:custom"
        v-text="i18n.t('VmOperatorPicker.Other')"
      /> -->
    </optgroup>

    <optgroup :label="i18n.t('VmOperatorPicker.Conditions')">
      <option
        value="and"
        v-text="i18n.t('VmOperatorPicker.allOf')"
      />
      <option
        value="or"
        v-text="i18n.t('VmOperatorPicker.anyOf')"
      />
    </optgroup>
  </select>
</template>