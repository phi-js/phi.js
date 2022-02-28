2<script setup>
import { ref } from 'vue'
import { default as xrecords } from './records.js'

import { UiSelect } from './index.js'

const singlePerson = ref()
const manyPeople = ref([])
const records = ref(xrecords)
const testValue = ref()

function onNativeSelectScroll(event) {
  var hiddenHeight = event.target.scrollHeight - event.target.offsetHeight + event.target.scrollTop
  console.log('onNativeSelectScroll', event.target.scrollTop, event.target.offsetHeight, event.target.scrollHeight, hiddenHeight)
}

</script>
<template>
  <h1>UiSelect</h1>

  <select
    v-model="singlePerson"
    placeholder="Child options!"
    multiple
    style="min-height: 350px;"
    @scroll="onNativeSelectScroll"
  >
    <option>No value prop</option>
    <option :value="undefined">:value="undefined"</option>
    <option value="0">value="0"</option>
    <option :value="0">:value="0"</option>
    <option value="false">value="false"</option>
    <option :value="false">:value="false"</option>
    <option value="null">value="null"</option>
    <option :value="null">:value="null"</option>

    <option value="1" class="Option Option--selected">Sincere@april.biz</option>
    <option value="2" class="Option Option--selected">Shanna@melissa.tv</option>
    <option value="3">Nathan@yesenia.net</option>
    <option value="4" class="Option Option--selected">Julianne.OConner@kory.org</option>

    <optgroup label="Group 1">
      <option value="5" class="Option Option--selected">Sincere@april.biz</option>
      <option value="6">Shanna@melissa.tv</option>
      <option value="7">Nathan@yesenia.net</option>
      <option value="8">Julianne.OConner@kory.org</option>
    </optgroup>

    <!-- repeated values -->
    <option value="3">Nathan@yesenia.net</option>
    <option value="4">Julianne.OConner@kory.org</option>

    <!-- repeated group label-->
    <optgroup label="Group 1">
      <option value="9">Sincere@april.biz</option>
      <option value="10">Shanna@melissa.tv</option>
      <option value="11">Nathan@yesenia.net</option>
      <option value="12">Julianne.OConner@kory.org</option>
    </optgroup>

    <!-- Opgroup sin label-->
    <optgroup>
      <option value="9">Sincere@april.biz</option>
      <option value="10">Shanna@melissa.tv</option>
      <option value="11">Nathan@yesenia.net</option>
      <option value="12">Julianne.OConner@kory.org</option>
    </optgroup>

    <optgroup label="Group 2">
      <option value="13">Sincere@april.biz</option>
      <option value="14">Shanna@melissa.tv</option>
      <option value="15">Nathan@yesenia.net</option>
      <option value="16">Julianne.OConner@kory.org</option>
    </optgroup>

    <optgroup label="Empty"></optgroup>
  </select>

  <UiSelect v-model="singlePerson" placeholder="Child options!">
    <option>No value prop</option>
    <option value="0">value="0"</option>
    <option :value="0">:value="0"</option>
    <option value="false">value="false"</option>
    <option :value="false">:value="false"</option>
    <option value="null">value="null"</option>
    <option :value="null">:value="null"</option>

    <option value="1">Sincere@april.biz</option>
    <option value="2">Shanna@melissa.tv</option>
    <option value="3">Nathan@yesenia.net</option>
    <option value="4">Julianne.OConner@kory.org</option>

    <optgroup label="Group 1">
      <option value="5">Sincere@april.biz</option>
      <option value="6">Shanna@melissa.tv</option>
      <option value="7">Nathan@yesenia.net</option>
      <option value="8">Julianne.OConner@kory.org</option>
    </optgroup>

    <!-- repeated values -->
    <option value="3">Nathan@yesenia.net</option>
    <option value="4">Julianne.OConner@kory.org</option>

    <!-- repeated group label-->
    <optgroup label="Group 1">
      <option value="9">Sincere@april.biz</option>
      <option value="10">Shanna@melissa.tv</option>
      <option value="11">Nathan@yesenia.net</option>
      <option value="12">Julianne.OConner@kory.org</option>
    </optgroup>

    <!-- Opgroup sin label-->
    <optgroup>
      <option value="9">Sincere@april.biz</option>
      <option value="10">Shanna@melissa.tv</option>
      <option value="11">Nathan@yesenia.net</option>
      <option value="12">Julianne.OConner@kory.org</option>
    </optgroup>

    <optgroup label="Group 2">
      <option value="13">Sincere@april.biz</option>
      <option value="14">Shanna@melissa.tv</option>
      <option value="15">Nathan@yesenia.net</option>
      <option value="16">Julianne.OConner@kory.org</option>
    </optgroup>

    <optgroup label="Empty"></optgroup>
  </UiSelect>

  <hr />

  <!-- <pre class="Code--html"><code>
&lt;UiSelect
  v-model="singlePerson"
  :options="records"
  placeholder="Escoge una persona"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>-->

  <UiSelect
    v-model="testValue"
    :options="records"
    placeholder="Escoge una persona"
    option-value="$.id"
    option-text="$.email"
  />
  <pre>testValue: {{ testValue }}</pre>

  <hr />

  <p>Multiple:</p>
  <pre class="docs-code"><code>
&lt;UiSelect
  v-model="manyPeople"
  multiple
  :options="records"
  placeholder="Escoge varias personas"
  option-value="$.id"
  option-text="$.email"
/>
  </code></pre>

  <UiSelect
    v-model="manyPeople"
    multiple
    :options="records"
    placeholder="Escoge varias personas"
    option-value="$.id"
    option-text="$.email"
  />

  <section>
    <h2>Aggregator slot</h2>
    <UiSelect
      v-model="manyPeople"
      multiple
      :options="records"
      placeholder="Escoge varias personas"
      option-value="$.id"
      option-text="$.email"
    >
      <template #aggregator="{ options }">y otras {{ options.length }} personas</template>
    </UiSelect>
  </section>

  <pre>manyPeople: {{ manyPeople }}</pre>

  <pre class="docs-code"><code>const records = {{ records }}</code></pre>
</template>

<style lang="scss">
option {
  &:checked {
    background: #ffff88;
  }
}

.Option {
  &--selected {
    // background: #ffff88;
    color: var(--ui-color-primary);
  }
}
</style>