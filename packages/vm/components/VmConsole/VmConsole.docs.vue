<script setup>
import { ref } from 'vue'
import VmConsole from './VmConsole.vue'

const model = ref({})
const stmt = ref({
  chain: [
    {
      info: { text: 'Cargar personas' },
      do: {
        call: 'fetch',
        args: { url: 'https://jsonplaceholder.typicode.com/users' },
      },
      assign: 'users',
    },
    {
      info: { text: 'Reportar users' },
      do: {
        call: 'console.log',
        args: ['fetched users:', '{{users}}'],
      },
    },

    {
      info: { text: 'Cargar posts' },
      do: {
        call: 'fetch',
        args: { url: 'https://jsonplaceholder.typicode.com/posts' },
      },
      assign: 'posts',
    },
    {
      info: { text: 'Reportar posts' },
      do: {
        call: 'console.log',
        args: ['fetched posts:', '{{posts}}'],
      },
    },

    {
      info: { text: 'Guardar primera persona', icon: 'mdi:account' },
      do: '{{users[0]}}',
      assign: 'firstPerson',
    },

    {
      info: { text: 'Crear persona', icon: 'mdi:account-plus' },
      do: {
        call: 'fetch',
        args: {
          url: 'https://jsonplaceholder.typicode.com/users',
          options: { method: 'post' },
        },
      },
      assign: 'created',
    },

    {
      info: { text: 'EVAL :)' },
      do: { eval: 'window.alert("dude");\nconst a = 3;\nconst b = 5;\n\nreturn $scope.thing * 2' },
    },

    {
      info: { text: 'Finalizar' },
      do: {
        call: 'window.alert',
        args: 'users: {{users.length}}\nposts: {{posts.length}}\n\n{{firstPerson.id}}: {{firstPerson.name}}\n{{created}}',
      },
    },
  ],
})


</script>

<template>
  <VmConsole
    v-model="model"
    :statement="stmt"
  />
  <pre>model: {{ model }}</pre>
</template>