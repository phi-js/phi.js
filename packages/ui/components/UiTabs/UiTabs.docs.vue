<script setup>
import { ref } from 'vue'
import { UiTabs, UiTab } from './index.js'

const tabValue = ref('1')
</script>

<template>
  <UiTabs v-model="tabValue">
    <UiTab
      icon="mdi:star"
      value="1"
      text="Tab 1"
    />

    <UiTab
      icon="mdi:star"
      value="2"
      text="Tab 2"
    >
      <h1>Contenido del tab 2</h1>
      <p>The ajkhdfg akjsdhfg kajsdhgf askjdf haskljfh salkfh as;diklf haskdf haslkdfj halsdkfhasdjk</p>
    </UiTab>

    <UiTab value="3">
      <template #tab="{select}">
        <h1>JEJEJE</h1>
        <small
          class="ui--clickable"
          @click="select()"
        >select me</small>
      </template>
    </UiTab>

    <UiTab
      icon="mdi:star"
      value="4"
      text="Tab 4"
      color="green"
    />

    <UiTab
      icon="mdi:vuejs"
      value="5"
      text="Tab 5"
    />

    <UiTab
      v-for="n in [1,2,3,4,5,6]"
      :key="n"
      icon="mdi:vuejs"
      :value="n + 5"
      :text="`Tab ${n + 5}`"
    >
      <!-- <template #tab="{select}">
        <h3 @click="select()">
          Teehee {{ n + 5 }}
        </h3>
      </template> -->
      <template #contents>
        <h1>Well hello!</h1>
        <p>Welcome to tab {{ n + 5 }}</p>
      </template>
    </UiTab>
  </UiTabs>
</template>