<script setup>
import { ref, toRef, unref, computed, watch } from 'vue'

import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'
import { UiPopover } from '../UiPopover'

import useOptionsManager from './composables/useOptionsManager.js'
import useSelectionManager from './composables/useSelectionManager.js'

import useFocusItem from './composables/useFocusItem.js'

const emit = defineEmits(['update:modelValue', 'focus', 'blur'])
const props = defineProps({
  multiple: {
    type: Boolean,
    required: false,
    default: false,
  },

  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

  placeholder: {
    type: String,
    required: false,
    default: '',
  },

  /**
   * An array of arbitrary objects to be uased as a source for options
   */
  options: {
    type: Array,
    required: false,
    default: () => [],
  },

  /**
   * A JSON PATH string pointing to the item property
   * to be used as a scalar VALUE identifier
   *
   * @default '$.value'
   */
  optionValue: {
    type: String,
    required: false,
    default: null,
  },

  /**
   * A JSON PATH string pointing to the item property
   * to be used as a scalar TEXT identifier
   *
   * @default '$.text'
   */
  optionText: {
    type: String,
    required: false,
    default: null,
  },

  /**
   * A JSON PATH (or Array of JSON paths)
   * Listing the property values to be indexed for searching
   *
   * @default '$.text'
   */
  optionSearch: {
    type: [String, Array],
    required: false,
    default: null,
  },
})

// Option list manager: Converts arbitrary array to Option array,
// and provides a reactive searchQuery
const { options, searchQuery, filteredOptions } = useOptionsManager(
  toRef(props, 'options'),
  {
    optionText: props.optionText,
    optionValue: props.optionValue,
    optionSearch: props.optionSearch,
  },
)

// Manage selected value
const { selection, isSelected, select, toggle } = useSelectionManager(
  toRef(props, 'modelValue'),
  toRef(props, 'multiple'),
  (newValue) => {
    emit('update:modelValue', newValue)
    if (!props.multiple) {
      close()
    }
    root.value.dispatchEvent(new Event('change', { bubbles: true }))
  },
)

const selectedOptions = computed(() =>
  options.value.filter((option) => isSelected(option.value)))

// Option toggling functions
function clickOption(objOption) {
  if (!objOption) {
    return
  }

  if (props.multiple) {
    toggle(objOption.value)
    searchElem.value.select()
  } else {
    select(objOption.value)
  }
  close()
}

const listedOptions = filteredOptions

// Manage focused option
const elOptionsContainer = ref(null)

const { setFocus, focusNext, focusPrevious, focusedItem } = useFocusItem(
  listedOptions,
  elOptionsContainer,
)

// reset focus when search changes
watch(searchQuery, () => setFocus(0))

// Nice tidy list of listed options
const parsedOptions = computed(() =>
  listedOptions.value.map((option) => ({
    ...option,
    isSelected: isSelected(option.value),
    isFocused: option === focusedItem.value,
  })))

// open/closed state
const root = ref(false)
const searchElem = ref(null)
const isOpen = ref(false)

function toggleDialog() {
  return isOpen.value ? close() : open()
}

async function open(setFocusedIndex = null) {
  isOpen.value = true
  searchQuery.value = ''

  if (setFocusedIndex !== null) {
    setFocus(setFocusedIndex)
  } else {
    if (props.multiple) {
      setFocus(0)
    } else {
      // Focus the first selected option when opening a single-value picker
      setFocus(Math.max(
        listedOptions.value.findIndex((opt) => opt.value === selection.value?.[0]),
        0,
      ))
    }
  }

  setTimeout(() => searchElem.value.focus(), 22)
  emit('focus')
}

function close() {
  isOpen.value = false
  root.value.focus()
  emit('blur')
}

// CHIP management
const maxFaceItems = ref(3) // Cantidad de chips + EL AGREGADOR  que seran visibles.  i.e. la cantidad de elementos que quedan visibles en el face

const visibleChips = computed(() => {
  if (!props.multiple) {
    return []
  }

  if (maxFaceItems.value <= 0) {
    return []
  }

  return selectedOptions.value.length <= maxFaceItems.value
    ? selectedOptions.value
    : selectedOptions.value.slice(0, maxFaceItems.value - 1)
})

const hiddenChips = computed(() => {
  if (!props.multiple) {
    return []
  }

  if (maxFaceItems.value <= 0) {
    return selectedOptions.value
  }

  return selectedOptions.value.length <= maxFaceItems.value
    ? []
    : selectedOptions.value.slice(maxFaceItems.value - 1)
})

function clickChip(option) {
  if (isOpen.value && unref(focusedItem).value === option.value) {
    return close()
  }
  return open(listedOptions.value.indexOf(option))
}

const placeholderOption = computed(() => {
  if (props.multiple) {
    return { text: selectedOptions.value.length ? '' : props.placeholder }
  }

  if (selectedOptions.value.length) {
    return selectedOptions.value[0]
  }

  return { text: props.placeholder }
})
</script>
<template>
  <div
    ref="root"
    class="UiSelect"
    tabindex="0"
    :class="{ 'UiSelect--open': isOpen, 'UiSelect--closed': !isOpen }"
    @keydown.enter="open()"
  >
    <UiPopover
      v-model:open="isOpen"
      :tippy="{ theme: 'light-border' }"
      placement="bottom-start"
      trigger
      @close="close()"
    >
      <template #trigger>
        <div class="UiSelect__face">
          <template
            v-for="option in visibleChips"
            :key="option.value"
          >
            <slot
              name="chip"
              :option="option"
            >
              <UiItem
                v-bind="option"
                class="UiChip"
                @click="clickChip(option)"
              >
                <template #actions>
                  <div
                    class="UiChip__btn-close"
                    @click.stop="clickOption(option)"
                    @mouseenter="
                      $event.target
                        .closest('.UiChip')
                        .classList.add('UiChip--threatened')
                    "
                    @mouseleave="
                      $event.target
                        .closest('.UiChip')
                        .classList.remove('UiChip--threatened')
                    "
                  >
                    &times;
                  </div>
                </template>
              </UiItem>
            </slot>
          </template>

          <div
            class="UiSelect__aggregator"
            style="flex: 1; display: flex; align-items: center"
            @click="toggleDialog"
          >
            <slot
              v-if="hiddenChips.length"
              name="aggregator"
              :options="hiddenChips"
            >
              ... {{ hiddenChips.length }} more
            </slot>
            <slot
              v-else
              name="placeholder"
            >
              <UiItem
                style="flex: 1"
                v-bind="placeholderOption"
              />
            </slot>
            <UiIcon
              :src="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            />
          </div>
        </div>
      </template>

      <template #contents>
        <div
          ref="elPopoverContents"
          class="UiSelect__popover"
        >
          <input
            ref="searchElem"
            v-model="searchQuery"
            type="search"
            class="UiSelect__search-input"
            :placeholder="focusedItem?.text"
            @keydown.arrow-up.prevent="focusPrevious()"
            @keydown.arrow-down.prevent="focusNext()"
            @keydown.enter.stop="clickOption(focusedItem)"
          >

          <div
            ref="elOptionsContainer"
            class="UiSelect__options"
          >
            <div
              v-for="option in parsedOptions"
              :key="option.value"
              class="UiOption"
              :class="{
                'UiOption--focused': option.isFocused,
                'UiOption--selected': option.isSelected
              }"
            >
              <slot
                name="option"
                v-bind="option"
              >
                <UiItem
                  class="UiOption"
                  v-bind="option"
                  @click="clickOption(option)"
                />
              </slot>
            </div>
          </div>
        </div>
      </template>
    </UiPopover>
  </div>
</template>