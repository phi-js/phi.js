<script>
var _CssInput_counter = 0
</script>

<script setup>
import { defineAsyncComponent, nextTick, onMounted, ref, shallowRef, watch, watchEffect } from 'vue'
import UiIcon from '../UiIcon/UiIcon.vue'

const props = defineProps({
  modelValue: {
    type: String,
    required: false,
    default: '',
  },

  type: {
    type: String,
    required: false,
    default: '',
  },

  onDelete: {
    type: Function,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const helperComponent = shallowRef()
watchEffect(() => {
  helperComponent.value = props.type
    ? defineAsyncComponent(() => import(`./types/${props.type}.vue`))
    : null
})

const uid = ref('CssInput' + (++_CssInput_counter))
const isEndangered = ref(false)
const isInputVisible = ref(false)

watch(
  isInputVisible,
  (newValue) => {
    if (newValue) {
      nextTick(() => document.getElementById(uid.value)?.select?.())
    }

    if (!helperComponent.value) {
      isInputVisible.value = false
    }
  },
)

onMounted(() => {
  if (props.modelValue === null) {
    isInputVisible.value = true
    nextTick(() => document.getElementById(uid.value)?.scrollIntoView?.({ block: 'center', inline: 'nearest' }))
  }
})
</script>

<template>
  <div
    class="CssInput"
    :class="{'CssInput--endangered': isEndangered}"
  >
    <UiIcon
      v-if="props.onDelete"
      class="CssInput__deleter"
      src="mdi:close"
      @click="$event => props.onDelete()"
      @pointerenter="isEndangered = true"
      @pointerleave="isEndangered = false"
    />

    <label
      :for="uid"
      class="CssInput__label"
    >{{ $attrs.label }}</label>

    <UiIcon
      class="CssInput__helperTrigger"
      :src="isInputVisible ? 'mdi:check-bold' : 'mdi:pencil'"
      @click="() => isInputVisible = !isInputVisible"
    />

    <div class="CssInput__inset UiInput__element">
      <div
        v-show="isInputVisible || !helperComponent"
        class="CssInput__input"
      >
        <input
          :id="uid"
          class="CssInput__element"
          type="text"
          :value="modelValue"
          @input="emit('update:modelValue', $event.target.value)"
        >
      </div>

      <div
        v-if="helperComponent"
        class="CssInput__helper"
      >
        <Component
          :is="helperComponent"
          :model-value="modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.CssInput {
  background-color: var(--ui-color-hover);

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;

  border-radius: 4px;
  padding: 4px;

  gap: 4px;


  &__label {
    font-size: 10pt;
    font-weight: bold;
    padding: 7px;
    user-select: none;

    flex: 1;
    white-space: nowrap;
    min-width: 170px;
  }

  &__inset {
    min-width: 300px;

    flex: 3;
    padding: 0;
    min-height: 0;
  }

  &__deleter {
    width: 32px;
    height: 32px;
    cursor: pointer;
    user-select: none;
  }

  &__helperTrigger {
    width: 32px;
    height: 32px;
    user-select: none;

    border-radius: 4px;
    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }
  }


  &__input {
    flex: 1;
    align-self: stretch;
    position: relative;
  }

  &__helper {
    padding: 4px;
  }

  &__element {
    min-width: 200px;
    width: 100%;

    padding: 12px 14px;
    // padding-right: 62px; // make room for __helperTrigger.  width + 2*margin
    background: transparent;
    border: 0;
  }

  &--endangered {
    background-color: var(--ui-color-danger) !important;
    opacity: 0.7;

    .CssInput__label,
    .CssInput__deleter {
      color: #fff;
    }
  }

  // OVERRIDES OF DEFAULT BLOCK CLASSES !!!
  .UiGroup {
    flex-wrap: wrap;
  }
}
</style>