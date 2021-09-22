<script setup>
import { ref } from 'vue'
import { UiInput } from './index.js'

const options = [
  { value: 0, text: 'Cero' },
  { value: 1, text: 'Uno' },
  { value: 2, text: 'Dos' },
  { value: 3, text: 'Tres' }
]

const modelValue = ref({
  string: '',
  boolean: true,
  number: 0,
  date: '1982-01-15',
  time: '16:20',
  color: '#ffffff',
  single: null,
  multiple: [],
  obj: {
    foo: 'foo',
    bar: 'bar',
    baz: [1, 2, 3]
  }
})

const themes = [
  { value: 'my-theme-wide', text: 'Wide' },
  { value: 'my-theme-material', text: 'Material' }
]

const curTheme = ref('my-theme-wide')
// const curTheme = ref('my-theme-material')
</script>

<template>
  <h1>UiInput</h1>
  <UiInput
    v-model="curTheme"
    :value="curTheme"
    type="select"
    label="Theme"
    :options="themes"
    @input="curTheme = $event"
  />
  <pre>modelValue: {{ modelValue }}</pre>
  <hr />

  <div :class="curTheme">
    <UiInput
      v-model="modelValue.string"
      type="text"
      label="Un texto"
      placeholder="Escribe cualquier cosa"
    />
    <UiInput
      v-model="modelValue.string"
      type="textarea"
      label="textarea"
      placeholder="Escribe cualquier cosa"
    />
    <UiInput
      v-model="modelValue.boolean"
      type="checkbox"
      placeholder="Acepto tal cosa"
    />
    <UiInput v-model="modelValue.number" type="number" label="number" />
    <UiInput v-model="modelValue.string" type="search" label="search" />
    <UiInput v-model="modelValue.date" type="date" label="date" />
    <UiInput v-model="modelValue.time" type="time" label="time" />
    <UiInput v-model="modelValue.date" type="date-time" label="date-time" />
    <UiInput v-model="modelValue.color" type="color" label="color" />
    <UiInput
      v-model="modelValue.single"
      type="select"
      label="select"
      placeholder="Escoge una cosa"
      :options="options"
    />
    <UiInput
      v-model="modelValue.multiple"
      type="select"
      multiple
      :options="options"
      label="select(m)"
      placeholder="Escoge varias cosas"
    />
    <UiInput
      v-model="modelValue"
      type="json"
      label="json"
      placeholder="Escribe JSON aqui"
    />
    <UiInput type="button" label="button" />
  </div>
</template>

<style lang="scss">
.my-theme-wide {
  --input-label-width: 250px;

  .ui-input {
    position: relative;
    padding-left: var(--input-label-width);
    padding-bottom: var(--ui-breathe);
    margin-bottom: var(--ui-breathe);
    border-bottom: 1px dotted #ccc;

    &__label {
      display: block;
      width: var(--input-label-width);
      position: absolute;
      top: var(--ui-breathe);
      left: 0;
      font-weight: bold;
    }
  }
}

.my-theme-material {
  --label-transition-duration: 0.17s;
  max-width: 300px;

  // bottom border animation on focus
  .ui-input {
    &__elem {
      display: block;
      width: 100%;
      outline: none;
    }

    &__body {
      position: relative;
      border-bottom: 1px solid #ccc;

      &::after {
        content: '';
        position: absolute;
        bottom: -1px;
        left: 0;
        width: 0;
        height: 2px;
        background-color: var(--ui-color-primary);
        transition: all var(--label-transition-duration);
      }
    }

    &--focused {
      .ui-input__body {
        &::after {
          width: 100%;
        }
      }
    }

    .ui-inset,
    .ui-native {
      border: 0;
      background: transparent;
      border-radius: 0;
      width: 100%;

      &::placeholder {
        color: transparent;
      }
    }

    &--type-date,
    &--type-time,
    &--type-color,
    &--type-select {
      .ui-input__label {
        opacity: 0 !important;
      }
    }
  }

  button.ui-native {
    border-radius: var(--ui-radius);
    background: var(--ui-color-primary) !important;
    color: #fff;
  }

  .ui-input {
    margin-bottom: var(--ui-breathe);
    position: relative;
    padding-top: 1.4em;

    &__label {
      pointer-events: none;
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      font-size: 0.8em;
      transition: all var(--label-transition-duration);
    }

    &--empty {
      .ui-input__label {
        // left: var(--ui-padding-horizontal);
        left: 5px;
        top: 30px;
        font-size: 1em;
        opacity: 1;
      }
    }

    &--focused {
      .ui-input__label {
        left: 0;
        top: 0;
        font-size: 0.8em;
        opacity: 1 !important;
      }
    }
  }
}
</style>
