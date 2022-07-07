<script setup>
import { ref, watch } from 'vue'
import { UiInput, UiIcon } from '@/packages/ui'
import DbQueryEditor from './DbQueryEditor.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

const innerProperties = ref([])

watch(
  () => props.modelValue,
  (newValue) => innerProperties.value = newValue.concat(),
  { immediate: true },
)

function emitInput() {
  emit('update:modelValue', innerProperties.value.concat())
}

function removePropertyAt(index) {
  innerProperties.value.splice(index, 1)
  emitInput()
}


/* Property adder */
const pickerOptions = ref([
  { text: 'Propiedad', value: 'property' },
  { text: 'Subquery', value: 'query' },
])

function onPickerChange(newValue) {
  if (newValue == 'property') {
    innerProperties.value.push({
      type: 'string',
      value: '',
    })
  } else if (newValue == 'query') {
    innerProperties.value.push({
      type: 'object',
      name: '',
      value: {
        from: null,
        on: {},
        single: true,
      },
    })
  }
}
</script>

<template>
  <div class="DbQueryProperties">
    <div
      v-for="(prop, i) in innerProperties"
      :key="i"
      class="DbQueryProperty"
    >
      <UiIcon
        class="DbQueryProperty__close ui--clickable"
        src="mdi:close"
        @click="removePropertyAt(i)"
      />
      <template v-if="prop.type == 'string'">
        <li>
          <input
            v-model="prop.value"
            class="UiInput"
            type="text"
            @update:model-value="emitInput"
          >
        </li>
      </template>
      <template v-else-if="prop.type == 'object'">
        <details>
          <summary>
            <input
              v-model="prop.name"
              class="UiInput"
              type="text"
              @update:model-value="emitInput"
            >
          </summary>
          <div class="details__contents">
            <select
              v-model="prop.value.single"
              @change="emitInput()"
            >
              <option :value="true">
                Uno
              </option>
              <option :value="false">
                Muchos
              </option>
            </select>

            <DbQueryEditor
              v-model="prop.value"
              :is-nested="true"
              @update:model-value="emitInput"
            />
          </div>
        </details>
      </template>
    </div>

    <UiInput
      placeholder="Agregar ..."
      type="select-native"
      :options="pickerOptions"
      :model-value="null"
      @update:model-value="onPickerChange($event)"
    />
  </div>
</template>

<style lang="scss">
.DbQueryProperty {
  position: relative;

  &__close {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
  }
}
</style>