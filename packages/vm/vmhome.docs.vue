<script setup>
import { ref } from 'vue'
import { VM } from '/packages/vm'
import { UiInput } from '/packages/ui/components'

const myVM = new VM()

const scope = ref({
  id: 21,
  firstName: 'Santiago',
  lastName: 'Cortés',
  limit: 2,
})

const __stmt = ref({
  userId: '{{id}}',
  msg: 'Hello {{lastName}}, {{firstName}}',
  special: {
    if: 0,
    then: 'yes',
    else: 'no',
  },
  another: {
    if: {
      field: 'firstName',
      op: 'eq',
      args: 'Santiago',
    },
    then: 'Hello Santiago!',
    else: null,
  },
})

const stmt = ref({
  msg: 'Hello Mr. {{lastName}}',
  allUsers: {
    call: 'fetch',
    args: { url: 'https://jsonplaceholder.typicode.com/users?_limit={{limit}}' },
    then: {
      call: 'window.alert',
      args: 'Done!',
    },
  },
  allPosts: {
    call: 'fetch',
    args: { url: 'https://jsonplaceholder.typicode.com/posts?_limit={{limit}}' },
  },
})

const result = ref()

async function vmEval(stmt) {
  result.value = await myVM.eval(stmt, scope.value)
}

</script>

<template>
  <h1>VM</h1>
  <UiInput
    v-model="scope"
    type="json"
    label="scope"
  />
  <UiInput
    v-model="stmt"
    type="json"
    label="statement"
  />
  <UiInput
    type="button"
    label="Eval"
    @click="vmEval(stmt)"
  />

  <pre>result: {{ result }}</pre>
</template>