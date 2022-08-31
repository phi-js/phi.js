<script setup>
import { ref } from 'vue'

import { UiInput } from '../UiInput'
import UiDataForm from './UiDataForm.vue'

const record = ref({
  id: 1,
  foo: 'Foo',
  comments: 'About Foo',
})
</script>

<template>
  <div class="UiDataForm-docs">
    <h1>UiDataForm</h1>

    <UiDataForm v-model="record">
      <h2>This is a UiDataForm</h2>
      <p>It's basically a &lt;TempValue&gt;</p>

      <fieldset>
        <legend>Things</legend>
        <UiInput
          v-model="record.foo"
          type="text"
        />
        <UiInput
          v-model="record.comments"
          type="textarea"
        />
      </fieldset>
    </UiDataForm>

    <pre>record: {{ record }}</pre>
  </div>
</template>