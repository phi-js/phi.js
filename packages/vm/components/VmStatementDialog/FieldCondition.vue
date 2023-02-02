<script setup>
import { ref, watch } from 'vue'

import { UiInput } from '@/packages/ui'

const props = defineProps({
  /*
  {
    "field": "$.dateCreated",
    "op": "date.between",
    "args": [
      "dd/mm/yyyy",
      "dd/mm/yyyy"
    ]
  }
  or, null
  */
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  /*
  JSON schema for the single field (same format as "column" for UiDataTable)

  {
    title: "Date",
    value: "$.dateCreated",
    type: "page"
  }
  */
  schema: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const statement = ref()

watch(
  () => props.modelValue,
  () => {
    const newValue = JSON.parse(JSON.stringify(props.modelValue))

    switch (props.schema.type) {
    case 'date':
    case 'datetime':
      statement.value = {
        field: props.schema.value,
        op: 'date.between',
        args: newValue?.args?.length ? newValue.args : [],
      }
      break

    case 'enum': {
      statement.value = {
        field: props.schema.value,
        op: 'enum.any',
        args: newValue?.args?.length ? newValue.args : [],
      }
      break
    }

    case 'object.person':
      statement.value = {
        search: {
          string: newValue?.search?.string,
          fields: [
            `${props.schema.value}.firstName`,
            `${props.schema.value}.lastName`,
          ],
        },
      }
      break

    default:
      statement.value = {
        search: {
          string: newValue?.search?.string,
          fields: [props.schema.value],
        },
      }
      break
    }

  },
  { immediate: true },
)


function emitUpdate() {
  // const curValue = JSON.parse(JSON.stringify(statement.value))
  const curValue = { ...statement.value }

  if (props.schema.type == 'date' || props.schema.type == 'datetime') {
    if (statement.value.args?.[0] && statement.value.args?.[1]) {
      emit('update:modelValue', curValue)
    }
    if (!statement.value.args?.[0] && !statement.value.args?.[1]) {
      emit('update:modelValue', null)
    }
    return
  }

  if (props.schema.type == 'enum') {
    if (statement.value?.args?.[0]) {
      emit('update:modelValue', curValue)
    } else {
      emit('update:modelValue', null)
    }
    return
  }

  if (statement.value.search) {
    if (!statement.value.search.string) {
      emit('update:modelValue', null)
    } else {
      emit('update:modelValue', curValue)
    }
  }
}
</script>

<template>
  <div class="FieldCondition">
    <template v-if="statement.op == 'date.between'">
      <UiInput
        v-model="statement.args"
        type="date-range"
        :label="schema.title"
        @update:model-value="emitUpdate"
      />
    </template>
    <template v-else-if="statement.op == 'enum.any'">
      <UiInput
        v-model="statement.args[0]"
        type="select-list"
        :label="schema.title"
        :options="schema.options"
        @update:model-value="emitUpdate"
      />
    </template>
    <template v-else-if="statement.search">
      <UiInput
        v-model="statement.search.string"
        type="search"
        :label="schema.title"
        @update:model-value="emitUpdate"
      />
    </template>
  </div>
</template>