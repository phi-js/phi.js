<script setup>
import { nextTick, ref, watch } from 'vue'

import { UiInput, UiItem, UiIcon, UiPopover } from '@/packages/ui'

const props = defineProps({
  modelValue: {
    type: [Array, String, Number],
    required: false,
    default: null,
  },

  options: {
    type: [Array, Function],
    required: false,
    default: null,
  },

  multiple: {
    type: [Boolean, Number, String],
    required: false,
    default: false,
  },

  hydrate: {
    type: Function,
    required: false,
    default: null,
  },

  debounce: {
    type: [String, Number],
    required: false,
    default: 500,
  },
})

const emit = defineEmits(['update:modelValue'])

/* Inner value.  Is ALWAYS an ARRAY */
const innerValue = ref([])

watch(
  () => props.modelValue,
  (newValue) => {
    if (Array.isArray(newValue)) {
      innerValue.value = newValue.concat([])
    } else {
      innerValue.value = newValue !== null && newValue !== undefined
        ? [newValue]
        : []
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', props.multiple
    ? innerValue.value.concat([])
    : innerValue.value?.[0] || null)
}

function toggleValue(val) {
  const foundIndex = innerValue.value.indexOf(val)
  if (foundIndex >= 0) {
    innerValue.value.splice(foundIndex, 1)
  } else {
    innerValue.value.push(val)
  }

  emitUpdate()

  search.value = ''
}


const innerOptions = ref([])

async function fetchOptions(searchString = '') {
  if (typeof props.options === 'function') {
    const incomingOptions = await props.options(searchString)
    innerOptions.value = incomingOptions
  } else {
    innerOptions.value = Array.isArray(props.options)
      ? props.options.concat([])
      : []
  }

  if (searchString && innerOptions.value) {
    isPopoverOpen.value = true
  }
}

const search = ref('')
watch(
  search,
  (newValue) => {
    fetchOptions(newValue.trim())
  },
  { immediate: true },
)

const refSearch = ref()

function onClickOption(option) {
  hydratedValues.value[option.value] = option
  toggleValue(option.value)

  if (!props.multiple) {
    isPopoverOpen.value = false
    return
  }

  focusedIndex.value = innerOptions.value.findIndex((opt) => opt.value == option.value)
}

// Hydration
const hydratedValues = ref({})

watch(
  innerValue,
  async (newValue) => {
    if (!props.hydrate) {
      return
    }

    const missingHydrations = []
    newValue.forEach((value) => {
      if (!hydratedValues.value[value]) {
        missingHydrations.push(value)
      }
    })

    if (missingHydrations.length) {
      const results = await props.hydrate(missingHydrations)
      if (!Array.isArray(results)) {
        return
      }
      results.forEach((hydratedOption) => hydratedValues.value[hydratedOption.value] = hydratedOption)
    }
  },
  { immediate: true },
)

const isPopoverOpen = ref(false)
const focusedIndex = ref(-1)
const refOptionList = ref()

function focusNext() {
  if (!isPopoverOpen.value) {
    return
  }

  focusedIndex.value = Math.min(focusedIndex.value + 1, innerOptions.value.length - 1)
  scrollIntoFocused()
}

function focusPrev() {
  if (!isPopoverOpen.value) {
    return
  }

  focusedIndex.value = Math.max(focusedIndex.value - 1, 0)
  scrollIntoFocused()
}

function scrollIntoFocused() {
  nextTick(() => {
    const focusedItem = refOptionList.value.querySelector('.UiSelectAsync__option--focused')
    if (focusedItem) {
      // focusedItem.scrollIntoView(false)
      focusedItem.scrollIntoView({ block: 'nearest', inline: 'nearest' })
    }
  })
}

function onSearchTab(event) {
  if (!isPopoverOpen.value) {
    return
  }
  event.preventDefault()

  if (event.shiftKey) {
    focusPrev()
  } else {
    return focusNext()
  }
}

function onSearchEnter(event) {
  if (!isPopoverOpen.value) {
    return
  }
  event.preventDefault()

  if (!innerOptions.value[focusedIndex.value]) {
    return
  }

  return onClickOption(innerOptions.value[focusedIndex.value])
}

function onSearchFocus() {
  if (innerOptions.value.length) {
    isPopoverOpen.value = true
  }
}
</script>

<template>
  <div class="UiSelectAsync">
    <div class="UiSelectAsync__chips">
      <UiItem
        v-for="val in innerValue"
        :key="val"
        class="UiSelectAsync__chip"
        v-bind="hydratedValues[val] || {text:val}"
      >
        <template #actions>
          <UiIcon
            src="mdi:close"
            @click="toggleValue(val)"
          />
        </template>
      </UiItem>

      <UiPopover
        v-if="multiple || !innerValue.length"
        v-model:open="isPopoverOpen"
        trigger="manual"
        placement="bottom-start"
        @open="focusedIndex = 0"
        @close="focusedIndex = -1"
      >
        <template #trigger>
          <UiInput
            ref="refSearch"
            v-model="search"
            type="search"
            class="UiSelectAsync__search"
            :debounce="props.debounce"
            :placeholder="$attrs.placeholder"
            @focus="onSearchFocus()"
            @keydown.down="focusNext($event)"
            @keydown.up="focusPrev($event)"
            @keydown.tab="onSearchTab($event)"
            @keydown.enter="onSearchEnter($event)"
          />
        </template>
        <template #default>
          <div
            v-if="search && !innerOptions.length"
            class="UiSelectAsync__empty"
          >
            No results
          </div>
          <div
            ref="refOptionList"
            class="UiSelectAsync__options"
          >
            <UiItem
              v-for="(option, i) in innerOptions"
              :key="option.value"
              class="UiSelectAsync__option"
              :class="{
                'UiSelectAsync__option--selected': innerValue.includes(option.value),
                'UiSelectAsync__option--focused': i == focusedIndex,
              }"
              v-bind="option"
              tabindex="0"
              @click="onClickOption(option)"
              @keypress.enter="onClickOption(option)"
            >
              <template #actions>
                <UiIcon
                  v-if="innerValue.includes(option.value)"
                  src="mdi:check"
                />
              </template>
            </UiItem>
          </div>
        </template>
      </UiPopover>
    </div>
  </div>
</template>

<style lang="scss">
.UiSelectAsync {
  // max-width: 627px; // WHY? oddly specific too

  box-sizing: border-box;
  padding: 4px;

  border-radius: 5px;
  border: 1px solid rgba(0,0,0, 0.15);
  border-top: 1px solid rgba(0,0,0, .26);
  border-left: 1px solid rgba(0,0,0, .26);

  font: inherit;
  color: rgba(0, 0, 0, 0.8);
  background-color: #fcfcfc;

  &__search {
    min-width: 200px;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 6px;

    .UiPopover {
      flex: 1;

      input {
        width: 100%;
        border: 0;
        background: none;
        outline: none !important;
      }
    }
  }

  &__chip {
    --ui-item-padding: 8px 16px;
    border-radius: 4px;
    background-color: var(--ui-color-z1);
  }

  &__chip,
  &__option {
    align-items: center;
    --ui-item-padding: 6px;
    user-select: none;
    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }

    .UiIcon {
      width: 30px;
      height: 30px;
      border-radius: 5px;
      overflow: hidden;
    }
  }

  &__options {
    max-height: 400px;
    overflow: auto;
    padding: 4px;

    &::-webkit-scrollbar {
      width: 7px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(255,255,255, 0.1);
      border-radius: 6px;
    }

    &:hover::-webkit-scrollbar-thumb {
      background-color: #ccc;
    }
  }


  &__option {
    --ui-item-padding: 6px 12px;
    box-sizing: border-box;
    // min-height: 54px;
    border-radius: 4px;

    &--focused {
      background-color: rgba(255, 255, 255, 0.3) !important;
    }
  }
}
</style>