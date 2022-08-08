<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed } from 'vue'
import MediaImage from './MediaImage.vue'
import { UiResizable } from '../../../../../ui'

const props = defineProps({
  /* objeto PROPS para MediaImage:
    src: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    align: 'center',
    width: 'auto',
    href: 'https://phidias.co',
    height: '130px'
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])
const isEmpty = computed(() => !props.modelValue?.src?.trim?.())

function toggleHeightAuto(setAuto = true) {
  emit('update:modelValue', { ...props.modelValue, height: setAuto ? 'auto' : undefined })
}

function onInputChange($event, coords) {
  emit('update:modelValue', { ...props.modelValue, height: $event.target.value + 'px' })
  coords.height = parseInt($event.target.value)
}

function incrementHeight(bigIncrement = false, coords) {
  coords.height = parseInt(props.modelValue.height) + (bigIncrement ? 20 : 1)
  emit('update:modelValue', { ...props.modelValue, height: coords.height + 'px' })
}

function decrementHeight(bigIncrement = false, coords) {
  coords.height = parseInt(props.modelValue.height) - (bigIncrement ? 20 : 1)
  emit('update:modelValue', { ...props.modelValue, height: coords.height + 'px' })
}

function onImageResize(coords) {
  emit('update:modelValue', { ...props.modelValue, height: `${coords.height}px` })
}
</script>

<template>
  <div
    class="MediaImageFace"
    :class="{ 'MediaImageFace--empty': isEmpty, 'MediaImageFace--notempty': !isEmpty }"
  >
    <UiResizable
      v-slot="{ coords, reset }"
      :enabled="['s']"
      :min-height="100"
      @end="onImageResize"
    >
      <MediaImage
        class="MediaImageFace__image"
        v-bind="{ ...$attrs, ...modelValue }"
        :height="coords?.height ? coords.height + 'px' : modelValue.height"
      />

      <div class="MediaImageFace__infobox">
        <div
          v-if="!isEmpty"
          class="MediaImageFace__heightenator"
        >
          <label>
            <input
              type="checkbox"
              :checked="modelValue.height == 'auto'"
              @change="toggleHeightAuto($event.target.checked); reset();"
            >
            auto
          </label>
          <input
            type="number"
            step="1"
            min="100"
            :value="coords.height"
            @keydown.exact.down.prevent="incrementHeight(true, coords)"
            @keydown.exact.up.prevent="decrementHeight(true, coords)"
            @keydown.shift.down.prevent="incrementHeight(false, coords)"
            @keydown.shift.up.prevent="decrementHeight(false, coords)"
            @input="onInputChange($event, coords)"
          >
          <span>px</span>
        </div>
      </div>
    </UiResizable>
  </div>
</template>

<style lang="scss">

// &--empty,
// &:hover {
.SlotItem--active > .BlockScaffold > .BlockScaffold__face > .MediaImageFace {
  .MediaImageFace__infobox {
    opacity: 1;
  }

  .UiResizable__hotzone {
    display: block;
  }
}

.MediaImageFace {
  position: relative;
  --imageface-resizer-size: 30px;

  margin-bottom: 16px; // make room for the content adder at the bottom of the block

  &__infobox {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    opacity: 0;
  }

  .UiResizable__hotzone {
    display: none;

    min-width: 0;
    min-height: 0;
    width: var(--imageface-resizer-size);
    height: var(--imageface-resizer-size);

    top: auto;
    right: 0;
    bottom: 0;
    left: auto;

    // pure CSS diagonal lines
    &::after {
      content: '';
      display: block;
      position: absolute;
      bottom: 0;
      right: 0;
      pointer-events: none;

      width: 0px;
      height: 0px;
      border-top: 6px solid var(--ui-color-primary);
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid transparent;
      transform: rotate(-45deg);
    }
  }

  &__heightenator {
    position: absolute;
    bottom: 0;
    right: var(--imageface-resizer-size);

    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    user-select: none;

    & > label {
      margin-right: 1rem;
      font-size: 12px;
      display: flex;
      align-items: center;
      cursor: pointer;
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }

      input {
        cursor: pointer;
      }
    }

    & > input {
      width: 4rem;
      border-radius: 4px;
      border: 1px solid #999;
    }

    & > span {
      font-size: 12px;
    }
  }
}
</style>