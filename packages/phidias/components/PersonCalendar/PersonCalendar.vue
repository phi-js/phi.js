<script setup>
import { UiCalendar } from '../../../ui/components/UiCalendar';

const props = defineProps({
  personId: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="PersonHome">
    <div class="ui-card ui--padded">
      <UiCalendar />
    </div>
  </div>
</template>