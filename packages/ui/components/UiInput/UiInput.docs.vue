<script setup>
import { ref } from 'vue'
import { UiInput } from './index.js'

const options = [
  { value: 0, text: 'Cero' },
  { value: 1, text: 'Uno' },
  { value: false, text: 'false' },
  { value: 2, text: 'Dos' },
  { value: 3, text: 'Tres' },
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
    baz: [1, 2, 3],
  },

  files: {
    one: null,
    several: [],
  },
})

const themes = [
  { value: 'my-theme-wide', text: 'Wide' },
  { value: 'my-theme-material', text: 'Material' },
  { value: 'my-theme-terminal', text: 'Terminal' },
]

const curTheme = ref('my-theme-wide')
// const curTheme = ref('my-theme-material')
const testUrl = ref('http://v4.local/1/cms/pages/test/files')

</script>

<template>
  <h1>UiInput</h1>
  <UiInput
    v-model="curTheme"
    :value="curTheme"
    type="select-buttons"
    label="Theme"
    :options="themes"
    @input="curTheme = $event"
  />

  <hr>

  <div
    class="docs-page ui-row --top"
    style="position: relative"
  >
    <div
      class="themed-form"
      :class="curTheme"
      style="margin-right: var(--ui-breathe)"
    >
      <section>
        <h2>Native types</h2>
        <UiInput
          v-model="modelValue.string"
          type="text"
          label="text"
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
          label="checkbox"
          placeholder="Acepto tal cosa"
        />
        <UiInput
          v-model="modelValue.number"
          type="number"
          label="number"
        />
        <UiInput
          v-model="modelValue.string"
          type="search"
          label="search"
        />
        <UiInput
          v-model="modelValue.date"
          type="date"
          label="date"
        />
        <UiInput
          v-model="modelValue.time"
          type="time"
          label="time"
        />
        <UiInput
          v-model="modelValue.date"
          type="date-time"
          label="date-time"
        />
        <UiInput
          v-model="modelValue.color"
          type="color"
          label="color"
        />
        <UiInput
          type="button"
          label="button"
        />
      </section>

      <section>
        <h2>select (single value)</h2>
        <UiInput
          v-model="modelValue.single"
          type="select"
          label="select"
          placeholder="Escoge una cosa"
          :options="options"
        />
        <UiInput
          v-model="modelValue.single"
          type="select-native"
          label="select-native"
          placeholder="Escoge una cosa"
          :options="options"
        />
        <UiInput
          v-model="modelValue.single"
          type="select-buttons"
          label="select-buttons"
          placeholder="Escoge una cosa"
          :options="options"
        />
        <UiInput
          v-model="modelValue.single"
          type="select-list"
          label="select-list"
          placeholder="Escoge una cosa"
          :options="options"
        />
      </section>

      <section>
        <h2>select (multiple)</h2>
        <UiInput
          v-model="modelValue.multiple"
          type="select"
          multiple
          :options="options"
          label="select(m)"
          placeholder="Escoge varias cosas"
        />
        <UiInput
          v-model="modelValue.multiple"
          type="select-native"
          multiple
          :options="options"
          label="select-native(m)"
          placeholder="Escoge varias cosas"
        />
        <UiInput
          v-model="modelValue.multiple"
          type="select-buttons"
          multiple
          :options="options"
          label="select-buttons(m)"
          placeholder="Escoge varias cosas"
        />
        <UiInput
          v-model="modelValue.multiple"
          type="select-list"
          multiple
          :options="options"
          label="select-list(m)"
          placeholder="Escoge varias cosas"
        />
      </section>

      <section>
        <h2>Upload</h2>
        <UiInput
          v-model="testUrl"
          label="Test URL"
          type="text"
        />

        <UiInput
          v-model="modelValue.files.one"
          type="upload"
          :endpoint="testUrl"
          label="upload"
          placeholder="Sube un archivo"
        />

        <UiInput
          v-model="modelValue.files.several"
          type="upload"
          :endpoint="testUrl"
          multiple
          label="upload (multiple)"
          placeholder="Sube varios archivos"
        />

        <UiInput
          v-model="modelValue.files.one"
          type="upload"
          inline
          :endpoint="testUrl"
          label="upload (inline)"
          placeholder="Sube un archivo"
        />

        <UiInput
          v-model="modelValue.files.several"
          type="upload"
          :endpoint="testUrl"
          inline
          multiple
          label="upload (inline, multiple)"
          placeholder="Sube varios archivos"
        />
      </section>

      <section>
        <h2>Custom types</h2>
        <UiInput
          v-model="modelValue.url"
          type="url"
          label="url"
          placeholder="Escribe URL aqui"
          :endpoint="testUrl"
        />

        <UiInput
          v-model="modelValue"
          type="json"
          label="json"
          placeholder="Escribe JSON aqui"
        />

        <UiInput
          v-model="modelValue.code"
          type="code"
          label="code"
          placeholder="Escribe JavaScript aqui"
        />
      </section>
    </div>
    <div style="position: sticky; top: 0">
      <pre>modelValue: {{ modelValue }}</pre>
    </div>
  </div>
</template>

<style lang="scss">
.themed-form {
  --ui-breathe: 32px;
}

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
      top: 0;
      left: 0;
      padding: var(--ui-padding);
      font-weight: bold;
    }
  }
}

.my-theme-terminal {
  padding: 12px;
  color: green;
  position: relative;

  background-color: black;
  background-image: radial-gradient(rgba(0, 150, 0, 0.25), black 120%);

  &::after {
    pointer-events: none;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      rgba(black, 0.15),
      rgba(black, 0.15) 1px,
      transparent 1px,
      transparent 2px
    );
  }

  & > * {
    // color: green !important;
    color: white;
    font: 1rem Inconsolata, monospace;
    text-shadow: 0 0 5px #c8c8c8;
  }

  --ui-font-primary: monospace;
  --ui-font-secondary: monospace;

  .ui-input {
    display: flex;
    align-items: stretch;

    border: 1px solid transparent;
    &:hover {
      border: 1px dashed green;
    }

    &__body {
      flex: 1;
    }

    &__label {
      display: flex;
      align-items: center;
      padding-right: 12px;
      font-weight: bold;

      &::after {
        content: ' > ';
      }
    }

    &__elem {
      display: block;
      width: 100%;
      outline: none;
      background: transparent;

      border: 0;
      border-radius: unset;
      margin: 0;
      padding: 0;

      color: white;
      text-shadow: 0 0 5px #c8c8c8;
    }

    .ui-button,
    .ui-inset,
    .ui-native {
      border: 0;
      background: transparent;
      border-radius: 0;

      color: white;
      text-shadow: 0 0 5px #c8c8c8;

      &.UiSelectButtons__button--selected {
        font-weight: bold;
        &::before {
          content: ' *';
        }
        &::after {
          content: '* ';
        }
      }
    }
  }
}

.my-theme-material {
  --label-transition-duration: 0.17s;
  max-width: 320px;

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

    &--type-select-buttons,
    &--type-checkbox {
      .ui-input__body {
        border: 0;
        &::after {
          content: unset;
        }
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
