<script setup>
import { ref } from 'vue'
import { UiInput } from './index.js'
import { availableThemes, currentTheme } from '../../../../dev/theme-utils.js'

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
  dateTime: '2022-08-25T16:20',
  week: '',
  month: '',
  dateRange: ['2000-01-01', '2000-12-31'],
  timestamp: 1675886203,
  negStamp: -9842357059,

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

const testUrl = ref('http://v4.local/1/cms/pages/test/files')
</script>

<template>
  <div class="Docs UiInputDocs">
    <h1>UiInput</h1>
    <UiInput
      v-model="testUrl"
      type="text"
      label="Upload URL"
    />
    <!-- <UiInput
    v-model="currentTheme"
    type="select-buttons"
    label="Theme"
    :options="availableThemes"
  />
  <hr> -->

    <div class="--stickme">
      <div class="UiInputDocs__data">
        <pre>modelValue: {{ modelValue }}</pre>
      </div>
    </div>

    <div class="UiInputDocs__list">
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
          v-model="modelValue.color"
          type="color"
          label="color"
        />
        <UiInput
          v-model="modelValue.color"
          type="color-css"
          label="color-css"
        />
        <UiInput
          v-model="modelValue.color"
          type="text"
          label="color-css"
        />
        <UiInput
          type="button"
          label="button"
        />
        <UiInput
          type="submit"
          label="submit"
        />
      </section>

      <section>
        <h2>Date inputs</h2>
        <UiInput
          v-model="modelValue.date"
          type="date"
          label="date"
        />

        <UiInput
          v-model="modelValue.timestamp"
          type="date"
          format="timestamp"
          label="date (con valor timestamp)"
        />

        <UiInput
          v-model="modelValue.negStamp"
          type="datetime-local"
          format="timestamp"
          label="date (con valor negStamp)"
        />

        <UiInput
          v-model="modelValue.time"
          type="time"
          label="time"
        />
        <UiInput
          v-model="modelValue.dateTime"
          type="datetime-local"
          label="datetime-local"
        />

        <UiInput
          v-model="modelValue.dateTime"
          type="datetime-local-select"
          label="datetime-local-select"
          time-min="08:21"
          time-max="17:40"
          time-step="16"
          subtext="time-min: 09:00, time-max: 17:15, time-step: 15"
        />

        <UiInput
          v-model="modelValue.week"
          type="week"
          label="week"
        />
        <UiInput
          v-model="modelValue.month"
          type="month"
          label="month"
        />

        <UiInput
          v-model="modelValue.dateRange"
          type="date-range"
          label="date-range"
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
  </div>
</template>

<style lang="scss">
.UiInputDocs {
  position: relative;

  section {
    margin-bottom: 3rem;
  }

  .--stickme {
    position: sticky; // not working
    top: 0;
    right: 0;
    z-index: 2;
  }

  &__list {
    margin-right: 300px;
  }

  &__data {
    position: absolute;
    top: 0;
    right: 0;

    background-color: rgba(0,0,0, 0.75);
    color: #fff;
    padding: 12px;
    border-radius: 4px;
    margin: 8px;
  }
}
</style>