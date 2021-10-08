<script setup>
import { reactive } from 'vue'
import UiItem from './UiItem.vue'

const item = reactive({
  icon: 'mdi:account',
  text: 'Hello world',
  subtext: '',
})
</script>

<template>
  <h1>UiItem</h1>
  <form>
    <select
      v-model="item.icon"
      class="ui-native"
    >
      <option value="mdi:account">
        mdi:account
      </option>
      <option value="mdi:android">
        mdi:android
      </option>
      <option value="mdi:close">
        mdi:close
      </option>
      <option value="mdi:delete">
        mdi:delete
      </option>
      <option value="mdi:star">
        mdi:star
      </option>
    </select>
    <input
      v-model="item.text"
      class="ui-native"
      type="text"
      placeholder="text"
    >
    <input
      v-model="item.subtext"
      class="ui-native"
      type="text"
      placeholder="subtext"
    >
    <input
      v-model="item.badge"
      class="ui-native"
      type="text"
      placeholder="badge"
    >
  </form>

  <UiItem
    class="ui-clickable"
    v-bind="item"
  />
  <UiItem
    class="ui-clickable ui-item--inline"
    v-bind="item"
  />
  <UiItem
    class="ui-clickable ui-item--inline"
    v-bind="item"
  />
  <UiItem
    class="ui-clickable ui-item--inline"
    v-bind="item"
  />
  <UiItem
    class="ui-clickable ui-item--inline"
    v-bind="item"
  />
  <UiItem
    class="ui-clickable ui-item--inline"
    v-bind="item"
  />

  <hr>

  <UiItem
    class="ui-item--inline"
    v-bind="item"
    style="font-size: 0.8em"
  />
  <UiItem
    class="ui-item--inline"
    v-bind="item"
    style="font-size: 1em"
  />
  <UiItem
    class="ui-item--inline"
    v-bind="item"
    style="font-size: 1.5em"
  />
  <UiItem
    class="ui-item--inline"
    v-bind="item"
    style="font-size: 2em"
  />
  <UiItem
    class="ui-item--inline"
    v-bind="item"
    style="font-size: 3em"
  />
</template>
