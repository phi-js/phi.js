<script setup>
import { ref } from 'vue'
import { UiItem } from '@/packages/ui/components'
import GraphNodeForm from './GraphNodeForm.vue'

const emit = defineEmits(['create'])
const isFormOpen = ref(false)
</script>

<template>
  <div class="GraphNodeCreator">
    <UiItem
      v-show="!isFormOpen"
      class="GraphNodeCreator__item"
      icon="mdi:plus"
      @click="isFormOpen = true"
      title="Create new page"
    />
    <GraphNodeForm
      class="GraphNodeCreator__form"
      v-if="isFormOpen"
      @update:node="emit('create', $event); isFormOpen = false;"
      @cancel="isFormOpen = false"
    />
  </div>
</template>

<style lang="scss">
.GraphNodeCreator {
  &__item {
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    background-color: #f4f4f4;

    white-space: nowrap;
    width: 38px;

    &:hover {
      background-color: #ffffaa;
    }
  }
}
</style>