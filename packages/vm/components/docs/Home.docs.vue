<script setup>
import { ref } from 'vue'
import { VM } from '@/packages/vm'
import { UiInput } from '@/packages/ui/components'

const model = ref({
  id: 21,
  firstName: 'Santiago',
  lastName: 'Cortés',
  limit: 2,
})

const myVM = new VM(model.value)

// const __stmt = ref({
//   userId: '{{id}}',
//   msg: 'Hello {{lastName}}, {{firstName}}',
//   special: {
//     if: 0,
//     then: 'yes',
//     else: 'no',
//   },
//   another: {
//     if: {
//       field: 'firstName',
//       op: 'eq',
//       args: 'Santiago',
//     },
//     then: 'Hello Santiago!',
//     else: null,
//   },
// })

const stmt = ref({
  msg: 'Hello Mr. {{lastName}}',
  allUsers: {
    call: 'fetch',
    args: { url: 'https://jsonplaceholder.typicode.com/users?_limit={{limit}}' },
    // then: {
    //   call: 'window.alert',
    //   args: 'Done!',
    // },
  },
  allPosts: {
    call: 'fetch',
    args: { url: 'https://jsonplaceholder.typicode.com/posts?_limit={{limit}}' },
  },
})

const result = ref()

async function vmEval(stmt) {
  result.value = await myVM.eval(stmt, model.value)
}

</script>

<template>
  <div class="docs-page">
    <h1>VM</h1>

    <pre><code>asd asdsa</code></pre>

    <UiInput
      v-model="model"
      type="json"
      label="model"
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
  </div>
</template>