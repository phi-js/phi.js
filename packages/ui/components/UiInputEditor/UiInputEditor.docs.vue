<script setup>
import { ref } from 'vue'
import { UiInputEditor } from '.'
import { UiInput } from '../UiInput'

const inputProps = ref({ type: 'text' })
const value = ref()
</script>

<template>
  <fieldset>
    <legend>UiInputEditor</legend>
    <UiInputEditor v-model="inputProps" />
  </fieldset>

  <fieldset class="ui-row --top">
    <legend>Result</legend>
    <UiInput
      v-model="value"
      v-bind="inputProps"
    />
    <div>
      <pre>inputProps: {{ inputProps }}</pre>
      <pre>value: {{ value }}</pre>
    </div>
  </fieldset>
</template>