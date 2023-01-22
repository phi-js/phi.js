<script setup>
import { ref, watch } from 'vue'
import { UiInput } from '@/packages/ui/components'

import { VM } from '@/packages/vm'
import VmStatement from './components/VmStatement/VmStatement.vue'

const model = ref({
  id: 21,
  firstName: 'Santiago',
  lastName: 'Cortés',
  limit: 2,
})


const fields = [
  { value: 'firstName', type: 'string', text: 'First name (root)' },
  { value: 'lastName', type: 'string', text: 'Last name (root)' },
  { value: 'limit', type: 'number', text: 'Limite' },

  {
    text: 'Author',
    children: [
      { value: 'author.firstname', type: 'string', text: 'First name' },
      { value: 'author.lastname', type: 'string', text: 'Last name' },
      {
        value: 'author.gender',
        text: 'Gender',
        type: 'string',
        enum: [
          { value: 0, text: 'Female' },
          { value: 1, text: 'Male' },
        ],
      },
    ],
  },

  {
    text: 'Teacher',
    children: [
      { value: 'group_teacher.firstname', type: 'string', text: 'First name' },
      { value: 'group_teacher.lastname', type: 'string', text: 'Last name' },
      {
        value: 'group_teacher.gender',
        text: 'Gender',
        type: 'string',
        enum: [
          { value: 0, text: 'Female' },
          { value: 1, text: 'Male' },
        ],
      },
    ],
  },
]

const stmt = ref({ chain: [] })

const _stmt = ref({
  chain: [
    {
      if: { and: [] },
      then: {
        call: 'window.alert',
        args: { message: 'Hola mundo' },
      },
    },

    {
      text: 'Equivalente de modelValue.myPlaceholder = \'Some literal\'',
      assign: 'myPlaceholder',
      stmt: 'Guest',
    },
    {
      text: 'Preguntar nombre',
      assign: 'nombre', // also $.nombre
      stmt: {
        call: 'window.prompt', // Esta function debe estar "declarada" para el VM
        args: {
          message: 'Hola! Como te llamas?',
          placeholder: '{{myPlaceholder}}',
        },
      },
    },
    {
      text: 'Establecer titulo',
      assign: 'message', // also $.nombre
      stmt: 'Hola Mr. {{nombre}}',
    },

    {
      text: 'Preguntar limite',
      assign: 'limit',
      stmt: {
        call: 'window.prompt', // Esta function debe estar "declarada" para el VM
        args: {
          message: 'Elige un limite',
          placeholder: 5,
        },
      },
    },

    {
      text: 'Fetch users',
      assign: 'users',
      stmt: {
        call: 'fetch',
        args: { url: 'https://jsonplaceholder.typicode.com/users?_limit={{ limit }}' },
      },
    },

    {
      text: 'Fetch posts',
      assign: 'posts',
      stmt: {
        call: 'fetch',
        args: { url: 'https://jsonplaceholder.typicode.com/posts?_limit={{ limit }}' },
      },
    },
  ],
})

const myVM = new VM()
myVM.onModelSet = function(propName, propValue) {
  console.log('VM.docs onModelSet', propName, propValue)
}

const result = ref()

async function onClickEval() {
  result.value = await myVM.eval(stmt.value, model.value)
  // result.value = myVM.eval(stmt.value, model.value)
}

watch(
  model,
  (newValue) => {
    console.log('VM.docs watch:model', newValue)
  },
  { deep: true },
)
</script>

<template>
  <div class="docs-page">
    <h1>VM</h1>

    <p>VM (ó JSONVM) es una función que dado un modelo de datos ("dataModel"), y una sentencia a ejecutar ("statement")</p>
    <p>Evalua la sentencia a ejecutar, paso a paso.</p>

    <h2>Ejemplo</h2>
    <p>Dado el siguiente modelo de datos:</p>

    <details>
      <summary>dataModel</summary>
      <UiInput
        v-model="model"
        type="json"
        label="dataModel"
      />
    </details>

    <p>Quiero expresar en JSON el equivalente a:</p>
    <pre><code>
modelValue.myPlaceholder = 'Some literal'

modelValue.nombre = prompt('Hola! Como te llamas?', modelValue.myPlaceholder)
modelValue.message = `Hola Mr. ${modelValue.nombre}`
modelValue.limit = prompt('Elige un limite', 5)

modelValue.users = await fetch("https://jsonplaceholder.typicode.com/users?_limit={ { limit }}")
modelValue.posts = await fetch("https://jsonplaceholder.typicode.com/posts?_limit={ { limit }}")

// Y si los quiero ejecutar en paralelo ?
fetch("https://jsonplaceholder.typicode.com/users?_limit={ { limit }}")
      .then((response) => modelValue.users = response)

fetch("https://jsonplaceholder.typicode.com/posts?_limit={ { limit }}")
      .then((response) => modelValue.posts = response)
    </code></pre>

    <p>Definimos la siguiente sintaxis:</p>
    <ul>
      <li>La unidad basica de ejecucion se llama un <em>statement</em></li>
      <li>Todo <em>statement</em> produce un <em>output</em></li>
    </ul>

    <details>
      <summary>Statement</summary>
      <UiInput
        v-model="stmt"
        type="json"
        label="statement"
      />
    </details>

    <p>Que visualmente se edita asi:</p>

    <VmStatement
      v-model="stmt"
      :fields="fields"
    />

    <UiInput
      type="button"
      label="Eval"
      @click="onClickEval"
    />

    <pre>result: {{ result }}</pre>
  </div>
</template>