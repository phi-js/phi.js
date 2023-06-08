<script setup>
import { ref } from 'vue'
import UiSelectAsync from './UiSelectAsync.vue'

const singleValue = ref(7)
const multipleValue = ref([7, 1, 7, 2])

const cachedRequests = {}

async function options(searchString = null) {
  if (cachedRequests['posts']) {
    return cachedRequests['posts']
  }

  cachedRequests['posts'] = fetch('https://jsonplaceholder.typicode.com/posts')
    .then((response) => response.json())
    .then((posts) => posts.map((post) => ({
      value: post.id,
      text: post.title,
      // subtext: post.body,
    })))

  return cachedRequests['posts']
}

async function hydrateValues(values) {
  const responses = await Promise.all(values.map((postId) => {
    if (cachedRequests[`post-${postId}`]) {
      return cachedRequests[`post-${postId}`]
    }

    cachedRequests[`post-${postId}`] = fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
      .then((response) => response.json())
      .then((objPost) => ({
        value: objPost.id,
        text: objPost.title,
        // subtext: objPost.body,
      }))

    return cachedRequests[`post-${postId}`]
  }))

  return responses
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

  <fieldset>
    <legend>Single</legend>
    <UiSelectAsync
      v-model="singleValue"
      :options="options"
      :hydrate="hydrateValues"
      placeholder="Choose options"
      debounce="0"
    />
    <pre>singleValue: {{ singleValue }}</pre>
  </fieldset>

  <fieldset>
    <legend>Multiple</legend>
    <UiSelectAsync
      v-model="multipleValue"
      :multiple="true"
      :options="options"
      :hydrate="hydrateValues"
      placeholder="Choose options"
      debounce="0"
    />
    <pre>multipleValue: {{ multipleValue }}</pre>
  </fieldset>
</template>