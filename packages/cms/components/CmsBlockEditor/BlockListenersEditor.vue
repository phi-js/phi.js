<script setup>
import { ref, watch } from 'vue'
import { VmStatement } from '../../../vm/components'
import { UiInput, UiItem } from '../../../ui/components'
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

const newEventName = ref('')
function addEvent() {
  events.value.push({
    name: newEventName.value,
    stmt: { chain: [] },
  })
  emitUpdate()
  newEventName.value = ''
}
</script>

<template>
  <div class="BlockListenersEditor">
    <div class="BlockListenersEditor__available">
      <UiItem v-for="event in availableEvents" :key="event.event" :text="event.text" />
    </div>

    <div v-for="(event, i) in events" :key="i">
      <label>{{ event.name }}</label>
      <VmStatement v-model="events[i].stmt" @update:modelValue="emitUpdate" />
    </div>
    <UiInput v-model="newEventName" type="text" placeholder="Evento" @keypress.enter="addEvent()" />
  </div>
</template>