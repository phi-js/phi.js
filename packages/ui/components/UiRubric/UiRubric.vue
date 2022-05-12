<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },

  columns: {
    type: Array,
    required: true,
  },

  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['click-row', 'click-column', 'click-cell'])

/** Values as an associative object (hash):
values?.[rowId]?.[columnId]
*/
const values = computed(() => {
  const retval = {}
  props.rows.forEach((row) => {
    if (!retval[row.id]) {
      retval[row.id] = {}
    }

    props.columns.forEach((column) => {
      const curValue = props.modelValue.find((vp) => vp.row == row.id && vp.column == column.id)
      retval[row.id][column.id] = curValue?.value
    })
  })

  return retval
})
</script>

<template>
  <table class="UiRubric">
    <thead>
      <tr>
        <th><slot name="corner" /></th>
        <th
          v-for="column in columns"
          :key="column.id"
          @click="emit('click-column', column)"
        >
          <slot
            name="column"
            :column="column"
          >
            {{ column.text }}
          </slot>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="row in rows"
        :key="row.id"
      >
        <td @click="emit('click-row', row)">
          <slot
            name="row"
            :row="row"
          >
            {{ row.text }}
          </slot>
        </td>
        <td
          v-for="column in columns"
          :key="column.id"
          @click="emit('click-cell', {row, column, value: values?.[row.id]?.[column.id]})"
        >
          <slot
            name="value"
            :row="row"
            :column="column"
            :value="values?.[row.id]?.[column.id]"
          >
            {{ values?.[row.id]?.[column.id] }}
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
.UiRubric {
  width: 100%;
}
</style>