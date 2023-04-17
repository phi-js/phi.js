<!-- eslint-disable max-len -->
<script setup>
import { ref, watch } from 'vue'

import CssUnit from '../values/unit.vue'

const props = defineProps({
  /*
  CSS Object (already sanitized.  i.e. property names are dashed-case):
  {
    "font-family": 'MyFontWhatever, sans-serif',
    "color": "#fff",
    "text-shadow": "1px 1px 1px #000",
    ... every CSS property (yeah)

    This block will edit:
    "margin": "10px",
    "margin-top": "50px",
    "margin-XXX": "50px",

    "padding": "10px 33px",
    "padding-top": "50px",
    "padding-XXX": "50px",

    "width": "100%",
    "height": "100%",
  }
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})

const emit = defineEmits(['update:modelValue'])

/*
A parsed, standarized representation of spacing values
{
  margin: {
    top: '24px',
    right: '24px',
    bottom: '50%',
    left: '24px',
  },
  padding: {
    top: '24px',
    right: '24px',
    bottom: '50%',
    left: '24px',
  },

  width: '50%',
  height: '33vh',
}
*/
const innerValue = ref({
  margin: {
    top: null,
    right: null,
    bottom: null,
    left: null,
  },
  padding: {
    top: null,
    right: null,
    bottom: null,
    left: null,
  },
  width: null,
  height: null,
})

watch(
  () => props.modelValue,
  () => {
    innerValue.value.margin = parseString(props.modelValue.margin, 'auto')
    innerValue.value.padding = parseString(props.modelValue.padding, '0')

    innerValue.value.width = props.modelValue.width || 'auto'
    innerValue.value.height = props.modelValue.height || 'auto'

    // ... sigh
    if (props.modelValue['margin-top']) {
      innerValue.value.margin.top = props.modelValue['margin-top'] || 'auto'
    }
    if (props.modelValue['margin-right']) {
      innerValue.value.margin.right = props.modelValue['margin-right'] || 'auto'
    }
    if (props.modelValue['margin-bottom']) {
      innerValue.value.margin.bottom = props.modelValue['margin-bottom'] || 'auto'
    }
    if (props.modelValue['margin-left']) {
      innerValue.value.margin.left = props.modelValue['margin-left'] || 'auto'
    }
  },
  { immediate: true },
)


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
function parseString(str, emptyValue = '') {
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
  retval.top = parts?.[0] || emptyValue
  retval.right = parts?.[1] || emptyValue
  retval.bottom = parts?.[2] || retval.top
  retval.left = parts?.[3] || retval.bottom

  return retval
}

function emitUpdate() {
  emit('update:modelValue', {
    ...props.modelValue,
    ...toCssObject(innerValue.value),
  })
}

function toCssObject(obj) {
  const retval = {}

  if (!isDimensionEmpty(obj.margin)) {
    retval.margin = `${obj.margin.top || 'auto'} ${obj.margin.right || 'auto'} ${obj.margin.bottom || 'auto'} ${obj.margin.left || 'auto'}`
  }

  if (!isDimensionEmpty(obj.padding)) {
    retval.padding = `${obj.padding.top || 0} ${obj.padding.right || 0} ${obj.padding.bottom || 0} ${obj.padding.left || 0}`
  }

  if (obj.width) {
    retval.width = obj.width
  }

  if (obj.height) {
    retval.height = obj.height
  }

  return retval
}


function isDimensionEmpty(obj) {
  if (!obj) {
    return true
  }

  return obj?.top == null
    && obj?.right == null
    && obj?.bottom == null
    && obj?.left == null
}

</script>

<template>
  <div class="CssSpacing">
    <div class="SpacingBox SpacingBox--margin">
      <div class="SpacingBox__top">
        <CssUnit
          v-model="innerValue.margin.top"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="SpacingBox__right">
        <CssUnit
          v-model="innerValue.margin.right"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="SpacingBox__bottom">
        <CssUnit
          v-model="innerValue.margin.bottom"
          @update:model-value="emitUpdate"
        />
      </div>
      <div class="SpacingBox__left">
        <CssUnit
          v-model="innerValue.margin.left"
          @update:model-value="emitUpdate"
        />
      </div>

      <div class="SpacingBox__slot">
        <div class="SpacingBox SpacingBox--padding">
          <div class="SpacingBox__top">
            <CssUnit
              v-model="innerValue.padding.top"
              @update:model-value="emitUpdate"
            />
          </div>
          <div class="SpacingBox__right">
            <CssUnit
              v-model="innerValue.padding.right"
              @update:model-value="emitUpdate"
            />
          </div>
          <div class="SpacingBox__bottom">
            <CssUnit
              v-model="innerValue.padding.bottom"
              @update:model-value="emitUpdate"
            />
          </div>
          <div class="SpacingBox__left">
            <CssUnit
              v-model="innerValue.padding.left"
              @update:model-value="emitUpdate"
            />
          </div>

          <div class="SpacingBox__slot">
            <div class="SpacingBox SpacingBox--dimensions">
              <CssUnit
                v-model="innerValue.width"
                label="Width"
                class="SpacingBox__width"
                @update:model-value="emitUpdate"
              />
              <CssUnit
                v-model="innerValue.height"
                label="Height"
                class="SpacingBox__height"
                @update:model-value="emitUpdate"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.CssSpacing {
  overflow-x: auto;
}

.SpacingBox {
  --box-frame-width: 80px;
  --box-frame-height: 56px;
  min-width: fit-content;

  color: #000;

  position: relative;
  padding: var(--box-frame-height) var(--box-frame-width);
  border-radius: 3px;

  input {
    width: 3.5em;
    min-width: 3.5em;
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    padding: 12px;
    font-size: 11px;
    font-weight: bold;
    opacity: 0.7;
  }

  &--margin {
    background-color: #add8e655;
    &::before {
      content: 'Margin';
    }
  }

  &--padding {
    border: 1px solid rgba(0,0,0, 0.5);
    background-color: #ffffe0cf;
    &::before {
      content: 'Padding';
    }
  }

  &--dimensions {
    border: 1px solid rgba(0,0,0, 0.2);
    padding: 18px;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 12px;

    background-color: var(--ui-color-background);

    input {
      width: 4em;
    }
  }

  &__top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  &__bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }

  &__left {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
  }

  &__right {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
  }

  &__top,
  &__right,
  &__bottom,
  &__left {
    min-width: var(--box-frame-width);
    min-height: var(--box-frame-height);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .CssUnit {
    border-radius: 4px;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }

    &__face {
      font-weight: bold;
      font-size: 9pt;
    }
  }
}
</style>