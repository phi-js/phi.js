<script setup>
import { ref } from 'vue'
import { UiInputNumberSlide } from '.'
import UiInput from '../UiInput/UiInput.vue'
const num = ref()
</script>

<template>
  <fieldset>
    <legend>step: default (1), stepWidth: default (4)}</legend>
    <UiInputNumberSlide
      v-model="num"
    />
  </fieldset>

  <fieldset>
    <legend>step: 17, stepWidth: default (4)</legend>
    <UiInputNumberSlide
      v-model="num"
      step="17"
    />
  </fieldset>

  <fieldset>
    <legend>step: default (1), stepWidth: 50}</legend>
    <UiInputNumberSlide
      v-model="num"
      step-width="50"
    />
    <br>
    <small>increments step every 50px</small>
  </fieldset>

  <fieldset>
    <legend>UiInput[type=number-slide]</legend>
    <UiInput
      v-model="num"
      type="number-slide"
      step="50"
      step-width="50"
    />
  </fieldset>

  <pre>num: {{ num }}</pre>
</template>