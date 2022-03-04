<script setup>
import { ref, watch, computed } from 'vue'
import { VmStatement } from '../../../vm/components'
import { UiInput } from '../../../ui/components'
import { getBlockDefinition } from '../../functions';

const props = defineProps({
  /**
   * @model Block object
   */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
const events = ref([])

const availableEvents = ref([])
getBlockDefinition(props.modelValue).then((blockDefinition) => {
  if (blockDefinition?.emits?.length) {
    availableEvents.value = blockDefinition.emits
  }
})

const fixedEvents = [
  { event: 'click', text: 'Click on the item' },
  { event: 'custom', text: 'Custom event' },
]

watch(
  () => props.modelValue,
  (newValue) => {
    let vOn = newValue?.['v-on'] || {}
    events.value = Object.keys(vOn).map((eventName) => ({
      name: eventName,
      stmt: vOn[eventName] || { chain: [] },
    }))
  },
  { immediate: true },
)

function emitUpdate() {
  let vOn = {}
  events.value.forEach((event) => vOn[event.name] = event.stmt)

  emit('update:modelValue', { ...props.modelValue, 'v-on': vOn })
}

function addEvent(eventName) {
  if (!eventName) {
    return
  }

  if (eventName == 'custom') {
    eventName = window.prompt('Enter an event name')
    if (!eventName) {
      return
    }
  }

  events.value.push({
    name: eventName,
    stmt: { chain: [] },
  })
  emitUpdate()
}

function removeEvent(eventIndex) {
  if (!confirm('Remove this event listener?')) {
    return
  }

  events.value.splice(eventIndex, 1)
  emitUpdate()
}


// List of all not-used events
const eventPickerOptions = computed(() => {
  return availableEvents.value
    .concat(fixedEvents)
    .filter(e => !events.value.find(usedEvent => usedEvent.name === e.event))
    .map(e => ({
      value: e.event,
      text: e.text
    }))
})
</script>

<template>
  <div class="BlockListenersEditor UiForm">
    <fieldset v-for="(event, i) in events" :key="i">
      <div class="BlockListenersEditor__delete" @click="removeEvent(i)">&times;</div>
      <legend>{{ event.name }}</legend>
      <VmStatement v-model="events[i].stmt" @update:modelValue="emitUpdate" />
    </fieldset>
    <UiInput
      v-if="eventPickerOptions.length"
      type="select-native"
      :options="eventPickerOptions"
      placeholder="Cuando ..."
      @update:modelValue="addEvent($event)"
    />
  </div>
</template>

<style lang="scss">
.BlockListenersEditor {
  & > fieldset {
    position: relative;
  }

  &__delete {
    position: absolute;
    top: -14px;
    right: -6px;

    cursor: pointer;
    display: block;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;

    &:hover {
      background-color: rgb(255, 255, 255, 0.1);
      color: var(--ui-color-danger);
    }
  }
}
</style>