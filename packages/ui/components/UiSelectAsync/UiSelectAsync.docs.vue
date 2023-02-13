<script setup>
import { ref } from 'vue'
import UiSelectAsync from './UiSelectAsync.vue'

// const selectValue = ref()
const selectValue = ref(['f1:toma ya mismo! perro'])

// const options = [
//   { value: 'value1', text: 'Option 1' },
//   { value: 'value2', text: 'Option 2' },
//   { value: 'value3', text: 'Option 3' },
// ]

// async function hydrateValues(values) {
//   return options.filter((option) => values.includes(option.value))
// }


async function options(searchString = null) {
  if (!searchString) {
    return [
      { value: 'none', text: 'Valor predeterminado' },
    ]
  }

  return [
    { value: `f1:${searchString}`, text: `TEXTO F1 PARA ${searchString}` },
    { value: `f2:${searchString}`, text: `TEXTO F2 PARA ${searchString}` },
  ]
}

async function hydrateValues(values) {
  // return options.filter((option) => values.includes(option.value))
  return values.map((valId) => {
    const parts = valId.split(':')
    return {
      value: valId,
      text: `Hydrated: ${parts[0]} :: ${parts[1]}`,
    }
  })
}

</script>

<template>
  <h1>UiSelectAsync</h1>

  <div>
    <p>This component is a Vue.js component that implements a type-ahead search input with dynamic suggestion options. The component is a drop-in replacement for a standard <code>&lt;select&gt;</code> element, but with the added ability to retrieve options asynchronously.</p>
    <p>The component takes in several props:</p>
    <ul>
      <li><code>modelValue</code>: the value of the component. This can be an array of values, a single string or number.</li>
      <li><code>options</code>: an array of options or a function that returns a promise that resolves with an array of options.</li>
      <li><code>hydrate</code>: a function that is used to fetch additional information for each selected item when they are selected.</li>
    </ul>
    <p>The component uses reactive properties to store the current value, the options, and the search term entered by the user. The component also uses <code>watch</code> statements to trigger re-computation of these properties whenever they change.</p>
    <p>The component has several key components:</p>
    <ul>
      <li>A chip component, <code>UiItem</code>, that represents the selected value and displays it as a tag</li>
      <li>An input component, <code>UiInput</code>, that is used to enter the search term</li>
      <li>A popover component, <code>UiPopover</code>, that displays the list of options as a drop-down</li>
      <li>A close icon component, <code>UiIcon</code>, that is used to remove a selected item from the list</li>
    </ul>
    <p>The component implements the type-ahead search by first fetching the options and then filtering the options as the user types. The component also allows for the option to be hydrated, which means fetching additional</p>
  </div>

  <UiSelectAsync
    v-model="selectValue"
    :options="options"
    :hydrate="hydrateValues"
    placeholder="Choose options"
    debounce="0"
  />

  <pre>selectValue: {{ selectValue }}</pre>
</template>