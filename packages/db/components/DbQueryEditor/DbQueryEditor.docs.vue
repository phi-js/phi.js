<script setup>
import { ref } from 'vue'
import { schema } from '../../samples.js'
import DbQueryWhere from './DbQueryWhere.vue'

const where = ref()

</script>

<template>
  <div class="DbQueryEditor-docs">
    <h1>DbQueryEditor</h1>

    <details>
      <summary>Schema</summary>
      <section>
        <pre><code>{{ schema }}</code></pre>
      </section>
    </details>

    <DbQueryWhere
      v-model="where"
      :schema="schema"
    />

    <pre>where: {{ where }}</pre>
  </div>
</template>