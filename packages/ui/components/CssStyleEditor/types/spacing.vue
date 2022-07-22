<script setup>
/*
This blocks edits a STRING in the format
"0px 0px 0px 0px"  (string) top right bottom left
*/
import { ref, watch, computed } from 'vue'
import { UiInput, UiDetails } from '@/packages/ui'

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },

  /*
  The value to use when a dimension is marked as "empty"

  i.e.
  emptyValue = "auto"
  {top: 0, right: null, bottom: 123, left: null}  -_> "0 auto 123 auto"

  emptyValue = "0"
  {top: 0, right: null, bottom: 123, left: null}  -_> "0 0 123 0"
  */
  emptyValue: {
    type: String,
    required: false,
    default: '0',
  },
})

const emit = defineEmits(['update:modelValue'])

const innerValue = ref({
  top: { value: null, units: null },
  right: { value: null, units: null },
  bottom: { value: null, units: null },
  left: { value: null, units: null },
})

watch(
  () => props.modelValue,
  () => innerValue.value = parseString(props.modelValue),
  { immediate: true },
)

/*
Given a string "12px 4%"
returns an Object:
{
  top: { value: 12, units: 'px'},
  right: { value: 4, units: '%'},
  bottom: { value: 12, units: 'px'},
  left: { value: 4, units: '%'},
}
*/
function parseString(str) {
  const retval = {
    top: { value: null, units: null },
    right: { value: null, units: null },
    bottom: { value: null, units: null },
    left: { value: null, units: null },
  }

  if (!str) {
    return retval
  }

  const parts = str.split(' ')

  retval.top = parseUnits(parts?.[0])
  retval.right = parseUnits(parts?.[1])
  retval.bottom = parseUnits(parts?.[2])
  retval.left = parseUnits(parts?.[3])

  return retval
}

/*
Given a string: "12px"  || "auto"
returns
{ value: 12, units: 'px' }
*/
function parseUnits(part) {
  if (part === props.emptyValue) {
    return { value: null, units: null }
  }

  const intValue = parseInt(part)
  if (isNaN(intValue)) {
    return { value: part, units: null }
  }

  const units = part.replace(intValue, '')
  return { value: intValue, units }
}

function areEqual(dimensionA, dimensionB) {
  return dimensionA.value == dimensionB.value && dimensionA.units == dimensionB.units
}


/*
Converts the local dimensions object
{
  top: { value: 12, units: 'px'},
  right: { value: 4, units: '%'},
  bottom: { value: 12, units: 'px'},
  left: { value: 4, units: '%'},
}
into
"12px 4% 12px 4%"
*/
function emitUpdate() {
  const strDimensions = [
    innerValue.value.top,
    innerValue.value.right,
    innerValue.value.bottom,
    innerValue.value.left,
  ]
    .map((objUnits) => objUnits.value == null
      ? props.emptyValue
      : `${objUnits.value || '0'}${(objUnits.units || 'px')}`)
    .join(' ')

  emit('update:modelValue', strDimensions)
}


const vertical = computed({
  get: () => {
    return areEqual(innerValue.value.top, innerValue.value.bottom)
      ? innerValue.value.top.value
      : null
  },

  set: (newValue) => {
    innerValue.value.top.value = newValue
    innerValue.value.bottom.value = newValue
    emitUpdate()
  },
})

const horizontal = computed({
  get: () => {
    return areEqual(innerValue.value.left, innerValue.value.right)
      ? innerValue.value.left.value
      : null
  },

  set: (newValue) => {
    innerValue.value.left.value = newValue
    innerValue.value.right.value = newValue
    emitUpdate()
  },
})
</script>

<template>
  <div class="SpacingEditor">
    <UiDetails>
      <template #summary>
        <UiInput
          v-model="vertical"
          type="number"
          label="Vertical"
          :placeholder="`${innerValue.top.value || 'auto'} & ${innerValue.bottom.value || 'auto'}`"
          @click="$event.stopPropagation()"
        />
      </template>
      <template #default>
        <div class="SpacingEditor__body">
          <UiInput
            v-model="innerValue.top.value"
            type="number"
            label="Top"
            @update:model-value="emitUpdate"
          />
          <UiInput
            v-model="innerValue.bottom.value"
            type="number"
            label="Bottom"
            @update:model-value="emitUpdate"
          />
        </div>
      </template>
    </UiDetails>

    <UiDetails>
      <template #summary>
        <UiInput
          v-model="horizontal"
          type="number"
          label="Horizontal"
          :placeholder="`${innerValue.left.value || 'auto'} & ${innerValue.right.value || 'auto'}`"
          @click="$event.stopPropagation()"
        />
      </template>
      <template #default>
        <div class="SpacingEditor__body">
          <UiInput
            v-model="innerValue.left.value"
            type="number"
            label="Left"
            @update:model-value="emitUpdate"
          />
          <UiInput
            v-model="innerValue.right.value"
            type="number"
            label="Right"
            @update:model-value="emitUpdate"
          />
        </div>
      </template>
    </UiDetails>
  </div>
</template>

<style lang="scss">
.SpacingEditor {
  &__body {
    margin-left: 30px;
    margin-bottom: 12px;
  }
}
</style>