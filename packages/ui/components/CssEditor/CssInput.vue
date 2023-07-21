<script>
var _CssInput_counter = 0
</script>

<script setup>
import { defineAsyncComponent, nextTick, onMounted, ref, shallowRef, watch, watchEffect } from 'vue'
import { UiCodeBox } from '../UiCode'

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
})

const emit = defineEmits(['update:modelValue'])

const helperComponent = shallowRef()
watchEffect(() => {
  helperComponent.value = props.type
    ? defineAsyncComponent(() => import(`./types/${props.type}.vue`))
    : null
})

const uid = ref('CssInput' + (++_CssInput_counter))
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
  <UiCodeBox class="CssInput">
    <template #face="{ isOpen }">
      <div class="CssInput__face">
        <span class="CssInput__propName">{{ $attrs.label }}</span>
        <span class="CssInput__propValue">
          <template v-if="isOpen">
            <input
              :id="uid"
              class="CssInput__element UiInput__element"
              type="text"
              :value="modelValue"
              @click.stop="() => true"
              @input="emit('update:modelValue', $event.target.value)"
            >
          </template>
          <template v-else>
            <span>{{ modelValue || '&nbsp;' }}</span>
          </template>
        </span>
      </div>
    </template>

    <template #default>
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
    </template>
  </UiCodeBox>
</template>

<style lang="scss">
.CssInput {
  &__element {
    min-height: 0;
  }

  .UiCodeBox__box {
    background-color: transparent;
  }

  &.UiCodeBox--open .UiCodeBox__box {
    background-color: var(--ui-color-z2);
  }

  &.UiCodeBox--endangered .UiCodeBox__box {
    background-color: var(--ui-color-danger);
  }

  &.UiCodeBox > .UiCodeBox__left {
    padding-top: 16px;
  }

  &__face {
    font-size: 0.9rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }

  &__propName,
  &__propValue {
    // white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__propName {
    font-weight: bold;
    margin-right: 0.5em;
    &::after {
      content: ': ';
    }
  }

  &__propValue {
    white-space: nowrap;
    min-width: 0;
    max-width: 320px;

    & > span {
      display: block;
      padding: 7px 9px;
    }
  }
}
</style>