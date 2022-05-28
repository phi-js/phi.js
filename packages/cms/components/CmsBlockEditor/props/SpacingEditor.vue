<script setup>
/*
This blocks edits a STRING in the format
"0px 0px 0px 0px"  (string) top right bottom left
*/
import { ref, watch, onMounted } from 'vue'
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
    default: '0',
  },
})

const emit = defineEmits(['update:modelValue'])

const dimensions = ref({
  top: { value: null, units: null },
  right: { value: null, units: null },
  bottom: { value: null, units: null },
  left: { value: null, units: null },
})

const links = ref({
  tb: false, // top-bottom
  lr: false, // left-right
  all: false, // all linked
})

function areEqual(valueA, valueB) {
  return valueA.value == valueB.value && valueA.units == valueB.units
}

onMounted(() => {
  dimensions.value = parseString(props.modelValue)

  if (areEqual(dimensions.value.top, dimensions.value.bottom)
    && areEqual(dimensions.value.top, dimensions.value.left)
    && areEqual(dimensions.value.top, dimensions.value.right)) {
    links.value.all = true
  } else {
    if (areEqual(dimensions.value.top, dimensions.value.bottom)) {
      links.value.tb = true
    }

    if (areEqual(dimensions.value.left, dimensions.value.right)) {
      links.value.lr = true
    }
  }
})

watch(
  () => props.modelValue,
  () => dimensions.value = parseString(props.modelValue),
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
    .map((objUnits) => objUnits.value == null
      ? props.emptyValue
      : `${objUnits.value || '0'}${(objUnits.units || 'px')}`)
    .join(' ')

  emit('update:modelValue', strDimensions)
}

function setEmpty(objDimension, doSet, position) {
  if (doSet) {
    objDimension.value = null
    objDimension.units = null
  } else {
    objDimension.value = 0
    objDimension.units = null
  }

  onDimensionChange(position)
}

function onDimensionChange(position) { // top | right | bottom | left
  const newValue = dimensions.value[position].value

  if (links.value.all) {
    dimensions.value.top.value = newValue
    dimensions.value.right.value = newValue
    dimensions.value.bottom.value = newValue
    dimensions.value.left.value = newValue
  } else {
    if (links.value.tb && (position == 'top' || position == 'bottom')) {
      dimensions.value.top.value = newValue
      dimensions.value.bottom.value = newValue
    }

    if (links.value.lr && (position == 'left' || position == 'right')) {
      dimensions.value.left.value = newValue
      dimensions.value.right.value = newValue
    }
  }

  emitUpdate()
}

function toggleLinker(linkerName) {
  links.value[linkerName] = !links.value[linkerName]

  if (linkerName == 'all' && links.value[linkerName]) {
    links.value.tb = false
    links.value.lr = false
  }

  if (linkerName != 'all' && links.value[linkerName]) {
    links.value.all = false
  }
}
</script>

<template>
  <div class="SpacingEditor">
    <div
      class="SpacingEditor__linker SpacingEditor__linker--all"
      :class="{'SpacingEditor__linker--active': !!links.all}"
    >
      <UiIcon
        :src="links.all ? 'mdi:link' : 'mdi:link-off'"
        @click="toggleLinker('all')"
      />
    </div>

    <div
      class="SpacingEditor__group SpacingEditor__group--tb"
    >
      <div
        class="SpacingEditor__linker SpacingEditor__linker--tb"
        :class="{'SpacingEditor__linker--active': !!links.tb}"
      >
        <UiIcon
          :src="links.tb ? 'mdi:link' : 'mdi:link-off'"
          @click="toggleLinker('tb')"
        />
      </div>

      <template
        v-for="position in ['top', 'bottom']"
        :key="position"
      >
        <UiInput :label="position">
          <div class="SpacingEditor__input">
            <UiInput
              v-model="dimensions[position].value"
              type="number-slide"
              min="0"
              max="100"
              :placeholder="props.emptyValue"
              @update:model-value="onDimensionChange(position)"
            />
            <UiInput
              type="checkbox"
              :model-value="dimensions[position].value != null"
              @update:model-value="setEmpty(dimensions[position], !$event, position)"
            />
          </div>
        </UiInput>
      </template>
    </div>

    <div
      class="SpacingEditor__group SpacingEditor__group--lr"
    >
      <div
        class="SpacingEditor__linker SpacingEditor__linker--lr"
        :class="{'SpacingEditor__linker--active': !!links.lr}"
      >
        <UiIcon
          :src="links.lr ? 'mdi:link' : 'mdi:link-off'"
          @click="toggleLinker('lr')"
        />
      </div>

      <template
        v-for="position in ['left', 'right']"
        :key="position"
      >
        <UiInput :label="position">
          <div class="SpacingEditor__input">
            <UiInput
              v-model="dimensions[position].value"
              type="number-slide"
              min="0"
              max="100"
              :placeholder="props.emptyValue"
              @update:model-value="onDimensionChange(position)"
            />
            <UiInput
              type="checkbox"
              :model-value="dimensions[position].value !== null"
              @update:model-value="setEmpty(dimensions[position], !$event, position)"
            />
          </div>
        </UiInput>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/packages/ui/themes/base/modifiers/clickable.scss';

.SpacingEditor {
  position: relative;
  padding-right: 80px; // room for the linker + more

  &__input {
    display: flex;
    align-items: center;
  }

  &__group {
    position: relative;
    margin: 12px 0;
  }

  &__linker {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    width: 40px;

    display: flex;
    align-items: center;
    justify-content: center;

    z-index: 2;

    &--all {
      z-index: 3;
    }

    &::after {
      content: '';

      position: absolute;
      top: 0;
      bottom: 0;
      right: 100%;

      width: 22px;

      border-radius: 10px;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;

      border: 2px solid #555;
      border-left: 0;
    }

    &--active {
      &::after {
        border: 2px solid var(--ui-color-primary);
        border-left: 0;
      }

      .UiIcon {
        color: var(--ui-color-primary);
      }
    }

    .UiIcon {
      @extend .ui--clickable;
      width: 40px;
      height: 40px;
    }
  }
}
</style>