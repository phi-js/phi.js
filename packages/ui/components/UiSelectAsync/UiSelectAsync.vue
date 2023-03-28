<script setup>
import { ref, watch } from 'vue'

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

const innerValue = ref([])

watch(
  () => props.modelValue,
  (newValue) => {
    if (Array.isArray(newValue)) {
      innerValue.value = newValue.concat([])
    } else {
      innerValue.value = newValue !== null && newValue !== undefined ? [innerValue.value] : []
    }
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', innerValue.value.concat([]))
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
    props.options(searchString).then((incomingOptions) => innerOptions.value = incomingOptions)
  } else {
    innerOptions.value = Array.isArray(props.options)
      ? props.options.concat([])
      : []
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
      results.forEach((hydratedOption) => hydratedValues.value[hydratedOption.value] = hydratedOption)
    }
  },
  { immediate: true },
)


const isPopoverOpen = ref(false)
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
        v-model:open="isPopoverOpen"
        trigger="manual"
        placement="bottom-start"
      >
        <template #trigger>
          <UiInput
            ref="refSearch"
            v-model="search"
            type="search"
            class="UiSelectAsync__search"
            :debounce="props.debounce"
            :placeholder="$attrs.placeholder"
            @focus="isPopoverOpen = true"
          />
        </template>
        <template #default>
          <div class="UiSelectAsync__options">
            <UiItem
              v-for="(option) in innerOptions"
              :key="option.value"
              class="UiSelectAsync__option"
              :class="{'UiSelectAsync__option--selected': innerValue.includes(option.value)}"
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

  &__options {
    max-height: 400px;
    overflow: auto;

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
}
</style>