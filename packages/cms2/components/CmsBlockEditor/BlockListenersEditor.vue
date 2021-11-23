<script setup>
import { ref, watch } from 'vue'
import { VmStatement } from '../../../vm/components'
import { UiInput } from '../../../ui/components'

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
    <div
      v-for="(event, i) in events"
      :key="i"
    >
      <label class="ui-label">{{ event.name }}</label>
      <VmStatement
        v-model="events[i].stmt"
        @update:modelValue="emitUpdate"
      />
    </div>
    <UiInput
      v-model="newEventName"
      type="text"
      placeholder="Evento"
      @keypress.enter="addEvent()"
    />
  </div>
</template>