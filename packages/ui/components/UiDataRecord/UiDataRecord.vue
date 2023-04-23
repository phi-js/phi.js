<script setup>
import { computed } from 'vue'
import { UiOutput } from '../'
import { getProperty } from '../../helpers'

const props = defineProps({
  /* Arbitrary JSON object */
  value: {
    type: Object,
    required: true,
  },

  /* List of fields to display */
  fields: {
    type: Array,
    required: false,
    default: null,
  },
})

const visibleFields = computed(() => {
  return props.fields.map((field) => ({
    ...field,
    value: field.children || !field.value
      ? null
      : getProperty(props.value, field.value),
    isEmpty: isFieldEmpty(field),
  }))
})

function isFieldEmpty(field) {
  if (field.children) {
    return field.children.every((child) => isFieldEmpty(child))
  }
  if (!field.value) {
    return true
  }
  return !getProperty(props.value, field.value)
}
</script>

<template>
  <div class="UiDataRecord">
    <template
      v-for="(field,i) in visibleFields"
      :key="i"
    >
      <details
        v-if="field.children"
        class="UiDataRecord__group"
        :class="{'UiDataRecord__group--empty': field.isEmpty}"
        :open="field.open"
      >
        <summary v-text="field.title" />

        <UiDataRecord
          :value="props.value"
          :fields="field.children"
        />
      </details>

      <div
        v-else
        class="UiDataRecord__field"
        :class="{'UiDataRecord__field--empty': field.isEmpty}"
      >
        <div
          class="UiDataRecord__label"
          v-text="field.title"
        />
        <div class="UiDataRecord__output">
          <UiOutput v-bind="field" />
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.UiDataRecord {
  &__field {
    display: flex;
    flex-wrap: wrap;

    border-bottom: 1px solid rgba(0,0,0, 0.1);
  }

  &__label {
    width: 25%;
    min-width: 100px;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;

    font-weight: bold;
    background-color: rgba(0,0,0, 0.03);

    padding: 0.7em;
  }

  &__output {
    flex: 1;
    min-width: 180px;
    padding: 0.7em;
  }


  &__group {
    & > .UiDataRecord {
      // margin: 1em;
      // margin: 0 0 1em 1em;

      .UiDataRecord__label {
        padding-left: 2em;
      }
    }

    summary {
      padding: 0.7em;
      background-color: rgba(0,0,0, 0.02);
      font-weight: bold;
      border-bottom: 1px solid rgba(0,0,0, 0.1);

      cursor: pointer;
    }

    &[open] summary,
    summary:hover {
      background-color: rgba(0,0,0, 0.03);
    }
  }
}
</style>