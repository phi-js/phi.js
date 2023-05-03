<script setup>
import { ref } from 'vue'
import { UiKatex } from '.'

const math = ref('x = \\frac { -b \\pm \\sqrt{ b^2-4ac } } { 2a }')

</script>

<template>
  <div class="Docs">
    <h1>UiKatex</h1>
    <code>import { UiKatex } from '@/packages/ui'</code>
    <p>
      UiKatex is a Vue component that renders mathematical equations using the KaTeX library.
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
          <td>value</td>
          <td>The mathematical equation to render</td>
          <td>String</td>
          <td>false</td>
          <td>null</td>
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
        <!-- No events -->
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
        <!-- No slots -->
      </tbody>
    </table>

    <fieldset>
      <legend>Ejemplo (AI)</legend>

      <pre><code>
      &lt;UiKatex value="c = \pm\sqrt{a^2 + b^2}" /&gt;
      </code></pre>

      <UiKatex value="c = \pm\sqrt{a^2 + b^2}" />
    </fieldset>


    <fieldset>
      <legend>Ejemplo (humano)</legend>
      <textarea
        v-model="math"
        style="width: 500px; height: 140px"
      />
      <UiKatex :value="math" />
      <pre>math: {{ math }}</pre>
    </fieldset>
  </div>
</template>