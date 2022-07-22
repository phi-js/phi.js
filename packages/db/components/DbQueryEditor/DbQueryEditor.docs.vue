<script setup>
import { ref } from 'vue'
import { schema } from '../../samples.js'
import DbQueryEditor from './DbQueryEditor.vue'

const query = ref()
</script>

<template>
  <div class="DbQueryEditor-docs">
    <h1>DbQueryEditor</h1>
    <DbQueryEditor
      v-model="query"
      :schema="schema"
    />


    <details>
      <summary>Schema</summary>
      <section>
        <pre><code>{{ schema }}</code></pre>
      </section>
    </details>

    <pre>query: {{ query }}</pre>
  </div>
</template>