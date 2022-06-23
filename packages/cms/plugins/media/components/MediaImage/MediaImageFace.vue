<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, nextTick } from 'vue'
import MediaImage from './MediaImage.vue'
import { UiInput, UiResizable } from '../../../../../ui'

const props = defineProps({
  /* objeto PROPS para MediaImage:
    src: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    align: 'center',
    width: 'auto',
    href: 'https://phidias.co',
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])
const isEmpty = computed(() => !props.modelValue?.src?.trim?.())

function toggleHeightAuto(setAuto = true, refresh) {
  emit('update:modelValue', { ...props.modelValue, height: setAuto ? 'auto' : undefined })
  nextTick(() => refresh())
}

function onInputChange($event, newBounds) {
  emit('update:modelValue', { ...props.modelValue, height: $event.target.value + 'px' })
  newBounds.height = parseInt($event.target.value)
}

function incrementHeight(bigIncrement = false, newBounds) {
  newBounds.height = parseInt(props.modelValue.height) + (bigIncrement ? 20 : 1)
  emit('update:modelValue', { ...props.modelValue, height: newBounds.height + 'px' })
}

function decrementHeight(bigIncrement = false, newBounds) {
  newBounds.height = parseInt(props.modelValue.height) - (bigIncrement ? 20 : 1)
  emit('update:modelValue', { ...props.modelValue, height: newBounds.height + 'px' })
}
</script>

<template>
  <div
    class="MediaImageFace"
    :class="{ 'MediaImageFace--empty': isEmpty, 'MediaImageFace--notempty': !isEmpty }"
  >
    <UiResizable
      v-slot="{ newBounds, refresh }"
      :enabled="['s']"
      @update:coords="emit('update:modelValue', { ...modelValue, height: $event.height })"
    >
      <MediaImage
        class="MediaImageFace__image"
        v-bind="{ ...$attrs, ...modelValue }"
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
              @change="toggleHeightAuto($event.target.checked, refresh)"
            >
            auto
          </label>
          <input
            type="number"
            step="1"
            min="10"
            :value="newBounds.height"
            @keydown.exact.down.prevent="incrementHeight(true, newBounds)"
            @keydown.exact.up.prevent="decrementHeight(true, newBounds)"
            @keydown.shift.down.prevent="incrementHeight(false, newBounds)"
            @keydown.shift.up.prevent="decrementHeight(false, newBounds)"
            @input="onInputChange($event, newBounds)"
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
.SlotItem--active {
  .MediaImageFace__infobox {
    opacity: 1;
  }

  .MediaImageFace .UiResizable__hotzone {
    display: block;
  }
}

.MediaImageFace {
  position: relative;
  --imageface-resizer-size: 30px;

  &__infobox {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    padding: 8px;
    background-color: rgba(0, 0, 0, 0.5);

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
    height: var(--imageface-resizer-size);

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
      background: transparent;
      font-weight: bold;
      color: #eee;
      border: 0;

      width: 4rem;
      padding: 3px 6px;
      border-radius: 3px;
      background-color: rgba(255,255,255, 0.1);
    }

    & > span {
      font-size: 12px;
    }
  }
}
</style>