<script setup>
const props = defineProps({
  personId: {
    type: String,
    required: true
  }
})

async function getMessages() {

}
</script>

<template>
  <div class="PersonInbox">
    <h1>Bandeja de entrada</h1>
    <div class="ui-card ui--padded">
      <pre>personId: {{ personId }}</pre>
      <p>asdkljf ashdflkjsahfdlkjas dfhklasdjfh sdlakjf hsalkdfjhaslkdjfh dklsjfhkajlsdh fkljasdh flaksjdfh aksjldfh slakjdf hsa</p>
      <p>asdkljf ashdflkjsahfdlkjas dfhklasdjfh sdlakjf hsalkdfjhaslkdjfh dklsjfhkajlsdh fkljasdh flaksjdfh aksjldfh slakjdf hsa</p>
      <p>asdkljf ashdflkjsahfdlkjas dfhklasdjfh sdlakjf hsalkdfjhaslkdjfh dklsjfhkajlsdh fkljasdh flaksjdfh aksjldfh slakjdf hsa</p>
    </div>
  </div>
</template>