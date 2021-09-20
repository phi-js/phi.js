<script setup>
import { ref } from 'vue'
import { UiInput } from './index.js'

const options = [
  { value: 0, text: 'Cero' },
  { value: 1, text: 'Uno' },
  { value: 2, text: 'Dos' },
  { value: 3, text: 'Tres' }
]

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

  <hr />

  <div :class="curTheme">
    <UiInput
      type="text"
      label="Un texto"
      placeholder="Escribe cualquier cosa"
    />
    <UiInput
      type="textarea"
      label="textarea"
      placeholder="Escribe cualquier cosa"
    />
    <UiInput type="checkbox" placeholder="Acepto tal cosa" />
    <UiInput type="number" label="number" />
    <UiInput type="search" label="search" />
    <UiInput type="date" label="date" />
    <UiInput type="time" label="time" />
    <UiInput type="date-time" label="date-time" />
    <UiInput type="color" label="color" />
    <UiInput
      type="select"
      label="select"
      placeholder="Escoge una cosa"
      :options="options"
    />
    <UiInput
      type="select"
      multiple
      :options="options"
      label="select(m)"
      placeholder="Escoge varias cosas"
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
  }

  .ui-native {
    &::placeholder {
      color: transparent;
    }
  }

  .ui-input--type-date,
  .ui-input--type-time,
  .ui-input--type-color,
  .ui-input--type-select {
    .ui-input__label {
      opacity: 0 !important;
    }
  }

  input.ui-native,
  textarea.ui-native {
    border: 0;
    background: transparent;
    // border-bottom: 1px solid var(--ui-color-primary);
    border-radius: 0;
  }

  button.ui-native {
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
