<script setup>
import UiInputCode from './UiInputCode.vue'
import { ref } from 'vue'
const code = ref('return "hola"')
</script>

<template>
  <div class="Docs">
    <h1>UiInputCode</h1>
    <code>import { UiInputCode } from '@/packages/ui'</code>
    <p>
      A Vue component that provides an interactive code editor using the CodeMirror library. It supports multiple programming languages and emits updates when the content of the editor changes.
    </p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>modelValue</td>
          <td>Initial value of the code editor</td>
          <td>String</td>
          <td>false</td>
          <td>''</td>
        </tr>
        <tr>
          <td>lang</td>
          <td>Programming language of the code editor (javascript, json, css, html)</td>
          <td>String</td>
          <td>false</td>
          <td>'javascript'</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>update:modelValue</td>
          <td>Emitted when the content of the code editor changes</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
          <th>Slot bindings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>-</td>
          <td>No slots available for this component</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <pre><code>
&lt;UiInputCode model-value="console.log('Hello, World!');" lang="javascript" /&gt;
&lt;UiInputCode model-value="{&quot;key&quot;: &quot;value&quot;}" lang="json" /&gt;
&lt;UiInputCode model-value="body { background-color: red; }" lang="css" /&gt;
&lt;UiInputCode model-value="&lt;h1&gt;Hello, World!&lt;/h1&gt;" lang="html" /&gt;
</code></pre>

    <fieldset>
      <legend>javascript</legend>
      <UiInputCode
        model-value="console.log('Hello, World!');"
        lang="javascript"
      />
    </fieldset>

    <fieldset>
      <legend>json</legend>
      <UiInputCode
        model-value="{&quot;key&quot;: &quot;value&quot;}"
        lang="json"
      />
    </fieldset>

    <fieldset>
      <legend>css</legend>
      <UiInputCode
        model-value="body { background-color: red; }"
        lang="css"
      />
    </fieldset>

    <fieldset>
      <legend>html</legend>
      <UiInputCode
        model-value="<h1>Hello, World!</h1>"
        lang="html"
      />
    </fieldset>
  </div>

  <!-- <div class="HumanDocs">
    <UiInputCode v-model="code" />
    <UiInputCode
      v-model="code"
      lang="css"
    />
    <UiInputCode
      v-model="code"
      lang="json"
    />
    <pre>code: {{ code }}</pre>
  </div> -->
</template>