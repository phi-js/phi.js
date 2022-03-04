<script setup>
/*
This blocks edits a STRING in the format
"0px 0px"  (string) top right bottom left
*/
import { ref, watchEffect } from 'vue'
import { UiInput } from '@/packages/ui'

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: ''
  },
})

const emit = defineEmits(['update:modelValue'])

const dimensions = ref({
  top: { value: null, units: null },
  right: { value: null, units: null },
  bottom: { value: null, units: null },
  left: { value: null, units: null },
})

watchEffect(() => {
  dimensions.value = parseString(props.modelValue)
})

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
    top: { value: 'auto', units: null },
    right: { value: 'auto', units: null },
    bottom: { value: 'auto', units: null },
    left: { value: 'auto', units: null },
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
  const value = parseInt(part)

  if (isNaN(value)) {
    return { value: part, units: null }
  }

  const units = part.replace(value, '')
  return { value, units }
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
    dimensions.value.top,
    dimensions.value.right,
    dimensions.value.bottom,
    dimensions.value.left,
  ]
    .map(objUnits => objUnits.value == 'auto' ? 'auto' : `${objUnits.value || '0'}${(objUnits.units || 'px')}`)
    .join(' ')

  emit('update:modelValue', strDimensions)
}

function setAuto(objDimension, doSet) {
  if (doSet) {
    objDimension.value = 'auto'
    objDimension.units = null
  } else {
    objDimension.value = 0
    objDimension.units = null
  }
  emitUpdate()
}
</script>

<template>
  <div class="SpacingEditor">
    <template v-for="position in ['top', 'right', 'bottom', 'left']" :key="position">
      <UiInput :label="position">
        <div class="UiGroup">
          <UiInput
            v-model="dimensions[position].value"
            @update:modelValue="emitUpdate()"
            type="number-slide"
            min="0"
            max="100"
            placeholder="auto"
          />
          <UiInput
            type="checkbox"
            title="auto"
            :modelValue="dimensions[position].value != 'auto'"
            @update:modelValue="setAuto(dimensions[position], !$event)"
          />
        </div>
      </UiInput>
    </template>
  </div>
</template>