<script setup>
import { computed } from 'vue'
import { UiItem } from '@/packages/ui'

const props = defineProps({
  /* PERSON object
  {
    id,
    firstname | firstName,
    lastname | lastName,
    gender,
    avatar,
  }
  */
  value: {
    type: Object,
    required: false,
    default: () => ({}),
  },

  /*
  When "formal" is specified,
  names are displayed as [lastname], [firstname]
  */
  formal: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const person = computed(() => {
  const firstName = props.value.firstName || props.value.firstname
  const lastName = props.value.lastName || props.value.lastname

  return {
    ...props.value,

    firstName,
    lastName,
    gender: props.value.gender,
    avatar: props.value.avatar,

    displayName: props.formal
      ? `${lastName}, ${firstName}`
      : `${firstName} ${lastName}`,
  }
})

</script>

<template>
  <UiItem
    :icon="person.avatar || 'mdi:account'"
    :text="person.displayName"
  />
</template>