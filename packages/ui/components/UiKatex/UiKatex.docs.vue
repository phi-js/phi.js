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
      UiKatex es un componente Vue que renderiza ecuaciones matemáticas utilizando la biblioteca KaTeX.
    </p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Descripción</th>
          <th>Tipo</th>
          <th>Obligatorio</th>
          <th>Valor por defecto</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>value</td>
          <td>La ecuación matemática a renderizar</td>
          <td>String</td>
          <td>false</td>
          <td>null</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Evento</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        <!-- No hay eventos -->
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Descripción</th>
          <th>Enlaces de slot</th>
        </tr>
      </thead>
      <tbody>
        <!-- No hay slots -->
      </tbody>
    </table>

    <pre><code>
&lt;UiKatex value="c = \pm\sqrt{a^2 + b^2}" /&gt;
</code></pre>

    <UiKatex value="c = \pm\sqrt{a^2 + b^2}" />


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