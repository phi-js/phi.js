<script setup>
import { ref } from 'vue'
import UiInputSwitch from './UiInputSwitch.vue'

const booValue = ref(false)
</script>

<template>
  <div class="UiInputSwitch-docs">
    <h1>UiInputSwitch</h1>
    <UiInputSwitch v-model="booValue" />
    <label>
      booValue: {{ booValue }}
      <input
        v-model="booValue"
        type="checkbox"
      >
    </label>

    <section>
      <label>With icons</label>
      <UiInputSwitch
        v-model="booValue"
        icon-true="mdi:brightness-5"
        icon-false="mdi:brightness-2"
      />
    </section>
  </div>
</template>