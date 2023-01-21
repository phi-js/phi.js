<script setup>
import { computed, inject } from 'vue'
import useVmI18n from '../../i18n'
import { UiInput } from '@/packages/ui'

const emit = defineEmits(['input'])

const i18n = useVmI18n()
// const availableFields = inject('$_vm_fields')
const availableStatements = inject('$_vm_available_statements')

/*
A list of available statements.  It can have a 1 level "children" array
*/
const allStatements = computed(() => {

  const retval = [
    // ...(availableFields?.value || []),
    ...(availableStatements?.value || []),
    {
      text: i18n.t('VmOperatorPicker.Conditions'),
      children: [
        {
          text: i18n.t('VmOperatorPicker.allOf'),
          stmt: { and: [] },
        },
        {
          text: i18n.t('VmOperatorPicker.anyOf'),
          stmt: { or: [] },
        },
      ],
    },
  ]

  setId(retval)
  return retval
})

let _uid = 1
const stmtIndex = {}

function setId(arrStatements) {
  arrStatements.forEach((stmt) => {
    if (stmt.children?.length) {
      setId(stmt.children)
    } else {
      stmt.id = _uid++
      stmtIndex[stmt.id] = stmt
    }
  })
}

function onSelectChange(val) {
  if (stmtIndex?.[val]?.stmt) {
    emit('input', { ...stmtIndex[val].stmt })
  }
}
</script>

<template>
  <div>
    <!-- <pre>allStatements: {{ allStatements }}</pre> -->
    <UiInput
      type="select-native"
      :options="allStatements"
      option-value="$.id"
      class="VmOperatorPicker"
      :placeholder="i18n.t('VmOperatorPicker.AddContition')"
      @update:model-value="onSelectChange"
    />
  </div>
</template>