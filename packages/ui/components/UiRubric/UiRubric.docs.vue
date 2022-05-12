<script setup>
import { ref } from 'vue'

import UiRubric from './UiRubric.vue'
import sampleRubric from './rubric'

const rubric = ref(sampleRubric)

function setChecked(rowId, columnId, newValue) {
  // Only allow one isChecked per row
  rubric.value.value.forEach((vp) => {
    if (vp.row == rowId) {
      vp.value.isChecked = false
    }
  })

  const foundValue = rubric.value.value.find((vp) => vp.row == rowId && vp.column == columnId)
  if (foundValue) {
    foundValue.value.isChecked = newValue
    return
  }

  rubric.value.value.push({
    row: rowId,
    column: columnId,
    value: { isChecked: newValue },
  })

  return newValue
}
</script>

<template>
  <!-- <fieldset>
    <legend>default</legend>
    <UiRubric
      v-model="rubric.value"
      :rows="rubric.rows"
      :columns="rubric.columns"
    />
  </fieldset> -->

  <fieldset>
    <legend>Bool :)</legend>
    <UiRubric
      v-model="rubric.value"
      :rows="rubric.rows"
      :columns="rubric.columns"
    >
      <template #corner>
        Bool :)
      </template>

      <template #row="{ row }">
        <strong>Row:</strong>
        <span>{{ row.text }}</span>
      </template>

      <template #column="{ column }">
        <strong>col </strong>
        <span>{{ column.text }}</span>
      </template>

      <template #value="{ row, column, value }">
        <label style="user-select:none">
          <input
            type="checkbox"
            :checked="!!value?.isChecked"
            @change="setChecked(row.id, column.id, !!$event.target.checked)"
          >
          {{ value?.haiku || `No hay texto row:${row.id} col:${column.id}` }}
        </label>
      </template>
    </UiRubric>
  </fieldset>
</template>
