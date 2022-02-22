<script setup>
const props = defineProps({
  title: {
    type: String,
    required: false,
    default: 'Dummy module'
  }
})
</script>

<template>
  <div class="PersonHome">
    <h1>{{ props.title }}</h1>
    <div class="ui-card ui--padded">
      <p>Lorem asdkljf ashdflkjsahfdlkjas dfhklasdjfh sdlakjf hsalkdfjhaslkdjfh dklsjfhkajlsdh fkljasdh flaksjdfh aksjldfh slakjdf hsa</p>
    </div>
  </div>
</template>

<style lang="scss">
.PersonHome {
  h1 {
    color: #fff;
    text-shadow: 0 2px 3px #000;
    min-width: 0;
    margin: 0;
    padding: 0;
  }
}
</style>