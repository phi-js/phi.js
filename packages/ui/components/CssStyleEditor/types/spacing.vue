<script setup>
/*
This blocks edits a STRING in the format
"0px 0px 0px 0px"  (string) top right bottom left
*/
import { onMounted, ref, watch } from 'vue'
import { UiInput, UiIcon } from '@/packages/ui'

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

const linked = ref({
  vertical: true,
  horizontal: true,
})

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
  (newValue) => {
    innerValue.value = parseString(newValue)
  },
  { immediate: true },
)

onMounted(() => {
  linked.value.vertical = innerValue.value.top == innerValue.value.bottom
  linked.value.horizontal = innerValue.value.left == innerValue.value.right
})

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
function emitUpdate(position) {
  const x = innerValue.value
  const fallBack = props.emptyValue || 0

  if (['top', 'bottom'].includes(position) && linked.value.vertical) {
    const otherPosition = position == 'top' ? 'bottom' : 'top'
    innerValue.value[otherPosition] = innerValue.value[position]
  }

  if (['left', 'right'].includes(position) && linked.value.horizontal) {
    const otherPosition = position == 'left' ? 'right' : 'left'
    innerValue.value[otherPosition] = innerValue.value[position]
  }

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

// position: vertical | horizontal
function toggleLinked(position) {
  linked.value[position] = !linked.value[position]

  if (linked.value[position]) {
    const positionA = position == 'vertical' ? 'top' : 'left'
    const positionB = position == 'vertical' ? 'bottom' : 'right'
    innerValue.value[positionB] = innerValue.value[positionA]
  }
}
</script>

<template>
  <div class="SpacingEditor">
    <div
      class="SpacingEditor__group"
      :class="{'SpacingEditor__group--linked': linked.vertical}"
    >
      <div class="SpacingEditor__linker">
        <UiIcon
          :src="linked.vertical ? 'mdi:link-variant' : 'mdi:link-variant-off'"
          @click="toggleLinked('vertical')"
        />
      </div>
      <div class="SpacingEditor__inputs">
        <UiInput
          v-model="innerValue.top"
          type="css-slider"
          min="0"
          max="300"
          label="Top"
          @update:model-value="emitUpdate('top')"
        />
        <UiInput
          v-model="innerValue.bottom"
          type="css-slider"
          min="0"
          max="300"
          label="Bottom"
          @update:model-value="emitUpdate('bottom')"
        />
      </div>
    </div>

    <div
      class="SpacingEditor__group"
      :class="{'SpacingEditor__group--linked': linked.horizontal}"
    >
      <div class="SpacingEditor__linker">
        <UiIcon
          :src="linked.horizontal ? 'mdi:link-variant' : 'mdi:link-variant-off'"
          @click="toggleLinked('horizontal')"
        />
      </div>
      <div class="SpacingEditor__inputs">
        <UiInput
          v-model="innerValue.left"
          type="css-slider"
          min="0"
          max="300"
          label="Left"
          @update:model-value="emitUpdate('left')"
        />
        <UiInput
          v-model="innerValue.right"
          type="css-slider"
          min="0"
          max="300"
          label="Right"
          @update:model-value="emitUpdate('right')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.SpacingEditor {
  &__group {
    display: flex;
    flex-wrap: nowrap;
    margin: 1rem 0;
    margin-bottom: 2rem;
  }

  &__inputs {
    flex: 1;

    & > .UiInput {
      display: flex;

      & > .UiInput__body {
        flex: 1;
      }
      & > .UiInput__label {
        width: 70px;
      }
    }
  }

  &__linker {
    // order: 1;
    display: flex;
    align-items: center;

    position: relative;
    padding-right: 6px;
    margin-right: 12px;

    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 4px;

      border-radius: 8px;
      border: 1px solid rgba(255,255,255, 0.3);
      border-right: 0;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }

    .UiIcon {
      width: 18px;
      height: 30px;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: var(--ui-color-hover);
      }
    }
  }

  &__group--linked {
    .SpacingEditor__linker {
      &:after {
        // border: 1px solid var(--ui-color-primary);
        border-color: var(--ui-color-primary);
      }

      .UiIcon {
        color: var(--ui-color-primary);
      }
    }
  }
}
</style>