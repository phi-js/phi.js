<script setup>
const props = defineProps({
  personId: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="PersonHome">
    <h1>Home</h1>
    <div class="ui-card ui--padded">
      <pre>props: {{ props }}</pre>
      <p>Lorem asdkljf ashdflkjsahfdlkjas dfhklasdjfh sdlakjf hsalkdfjhaslkdjfh dklsjfhkajlsdh fkljasdh flaksjdfh aksjldfh slakjdf hsa</p>
    </div>
  </div>
</template>