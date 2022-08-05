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
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])


/*
Parsed input string as object:
{
  top: '0px',
  right: null,
  bottom: '10px',
  left: '3%'
}
*/
const innerValue = ref()
watch(
  () => props.modelValue,
  (newValue) => innerValue.value = parseString(newValue),
  { immediate: true },
)

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
  const x = innerValue.value
  const fallBack = props.emptyValue || 0
  emit(
    'update:modelValue',
    `${x.top || fallBack} ${x.right || fallBack} ${x.bottom || fallBack} ${x.left || fallBack}`
      .trim(),
  )
}


/*
Given a string "12px 4%"
returns an Object:
{
  top: '12px',
  right: '4%',
  bottom: '12px',
  left: '4%',
}
*/
function parseString(str) {
  const retval = {
    top: null,
    right: null,
    bottom: null,
    left: null,
  }

  if (!str) {
    return retval
  }

  const parts = str.split(' ')
  retval.top = parts?.[0] || props.emptyValue
  retval.right = parts?.[1] || props.emptyValue
  retval.bottom = parts?.[2] || retval.top
  retval.left = parts?.[3] || retval.bottom

  return retval
}





const vertical = computed({
  get: () => {
    return innerValue.value.top == innerValue.value.bottom
      ? innerValue.value.top
      : null
  },
  set: (newValue) => {
    innerValue.value.top = newValue
    innerValue.value.bottom = newValue
    emitUpdate()
  },
})

const horizontal = computed({
  get: () => {
    return innerValue.value.left == innerValue.value.right
      ? innerValue.value.left
      : null
  },
  set: (newValue) => {
    innerValue.value.left = newValue
    innerValue.value.right = newValue
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
          type="css-slider"
          min="0"
          max="300"
          label="Vertical"
          @click="$event.stopPropagation()"
        />
      </template>
      <template #default>
        <div class="SpacingEditor__body">
          <UiInput
            v-model="innerValue.top"
            type="css-slider"
            min="0"
            max="300"
            label="Top"
            @update:model-value="emitUpdate"
          />
          <UiInput
            v-model="innerValue.bottom"
            type="css-slider"
            min="0"
            max="300"
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
          type="css-slider"
          min="0"
          max="300"
          label="Horizontal"
          @click="$event.stopPropagation()"
        />
      </template>
      <template #default>
        <div class="SpacingEditor__body">
          <UiInput
            v-model="innerValue.left"
            type="css-slider"
            min="0"
            max="300"
            label="Left"
            @update:model-value="emitUpdate"
          />
          <UiInput
            v-model="innerValue.right"
            type="css-slider"
            min="0"
            max="300"
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