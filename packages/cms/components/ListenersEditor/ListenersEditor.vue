<script setup>
import { ref, watch, computed, nextTick } from 'vue'

import { VmStatement } from '@/packages/vm'
import { UiInput, UiDetails } from '@/packages/ui'

const props = defineProps({
  /*
  Array of listeners:
  [
    {
      name: "update:modelValue",
      stmt: { ...VmStatement }
    }
  ]
  */
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },

  /*
  List of available (emitable) events:
  [
    {
      event: 'click',
      text: 'The button is clicked',
    },
    {
      event: 'mouseenter',
      text: 'Mouse enters',
    },
  ]
  */
  availableEvents: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const events = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    events.value = Array.isArray(newValue) ? newValue.concat() : []
  },
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', events.value.concat())
}


function removeEvent(eventIndex) {
  endangeredIndex.value = -1
  events.value.splice(eventIndex, 1)
  emitUpdate()
}

// List of all not-used events
const eventPickerOptions = computed(() => {
  return props.availableEvents
    .filter((e) => !events.value.find((usedEvent) => usedEvent.name === e.event))
    .concat([
      { event: 'custom', text: 'Custom event' },
    ])
    .map((e) => ({
      value: e.event,
      text: e.text,
    }))
})

const eventNames = computed(() => {
  const allNames = {}
  props.availableEvents.forEach((evt) => allNames[evt.event] = evt.text)
  return allNames
})

function addEvent(eventName) {
  if (eventName == 'custom') {
    eventName = window.prompt('Enter an event name')
  }

  if (!eventName) {
    return
  }

  events.value.push({
    name: eventName,
    stmt: { chain: [] },
  })

  emitUpdate()

  // Open the newly created <details> element
  nextTick(() => {
    el.value.querySelectorAll('details')[events.value.length - 1].setAttribute('open', true)
  })
}

const el = ref()
const endangeredIndex = ref(-1)
</script>

<template>
  <div
    ref="el"
    class="ListenersEditor"
  >
    <UiDetails
      v-for="(event, i) in events"
      :key="i"
      class="ListenersEditor__listener"
      :text="eventNames[event.name] || event.name"
      group="ListenersEditor"
      @delete="removeEvent(i)"
    >
      <VmStatement
        v-model="events[i].stmt"
        @update:model-value="emitUpdate"
      />
    </UiDetails>

    <UiInput
      v-if="eventPickerOptions.length"
      class="ListenersEditor__adder"
      type="select-native"
      :options="eventPickerOptions"
      placeholder="Cuando ..."
      @update:model-value="addEvent($event)"
    />
  </div>
</template>