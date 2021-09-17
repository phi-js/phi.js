<script setup>
import { reactive } from 'vue';
import UiItem from './UiItem.vue';

const item = reactive({
  icon: 'mdi:account',
  text: 'Hello world',
  secondary: '',
});
</script>

<template>
  <h1>UiItem</h1>
  <form>
    <select class="ui-native" v-model="item.icon">
      <option value="mdi:account">mdi:account</option>
      <option value="mdi:close">mdi:close</option>
      <option value="mdi:android">mdi:android</option>
      <option value="mdi:delete">mdi:delete</option>
    </select>
    <input class="ui-native" type="text" v-model="item.text" placeholder="text" />
    <input class="ui-native" type="text" v-model="item.secondary" placeholder="secondary" />
  </form>
  <UiItem class="ui-clickable" v-bind="item"></UiItem>
</template>