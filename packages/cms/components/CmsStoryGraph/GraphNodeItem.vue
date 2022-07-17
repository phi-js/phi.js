<script setup>
import { ref } from 'vue'
import { UiItem, UiIcon, UiPopover } from '@/packages/ui/components'
import GraphNodeForm from './GraphNodeForm.vue'

const props = defineProps({
  /*
  Node object
  {
    id: '',
    hash: '',
    info: {
      text: ''
    }
  }
  */
  node: {
    type: Object,
    required: true,
  },

  active: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['update:node', 'click', 'startPath', 'delete'])

const isFormOpen = ref(false)

function deleteNode() {
  if (!confirm(`Delete page '${props.node.text}'?\n2DO`)) {
    return
  }

  emit('delete')
}
</script>

<template>
  <div
    class="GraphNodeItem"
    :class="{ 'GraphNodeItem--active': props.active }"
  >
    <UiItem
      v-show="!isFormOpen"
      class="GraphNodeItem__item"
      :text="node.info.text"
      @click="emit('click')"
    >
      <template #actions>
        <UiPopover>
          <template #trigger>
            <UiIcon
              src="mdi:dots-vertical"
              class="GraphNodeItem__trigger"
            />
          </template>
          <template #contents="{ close }">
            <div class="GraphNodeItem__menu">
              <UiItem
                text="Rename"
                icon="mdi:pencil"
                @click="close(); isFormOpen = true;"
              />
              <UiItem
                text="Add path to ..."
                icon="mdi:arrow-right-thick"
                @click="close(); emit('startPath');"
              />
              <UiItem
                text="Delete"
                icon="mdi:delete"
                @click="close(); deleteNode();"
              />
            </div>
          </template>
        </UiPopover>
      </template>
    </UiItem>

    <GraphNodeForm
      v-if="isFormOpen"
      class="GraphNodeItem__form"
      label="Rename"
      :node="props.node"
      @update:node="emit('update:node', $event); isFormOpen = false"
      @cancel="isFormOpen = false"
    />
  </div>
</template>

<style lang="scss">
.GraphNodeItem {
  user-select: none;

  &__item {
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;

    background-color: #f4f4f4;
    color: #333;

    white-space: nowrap;
    max-width: 200px;

    border-radius: 5px;
    --ui-item-padding: 8px 12px;

    &:hover {
      background-color: #ffffaa;
    }

    .UiItem__subtext {
      font-weight: normal;
    }
  }

  &__form {
    z-index: 1;
  }

  &--active {
    .GraphNodeItem {
      &__item {
        background-color: var(--ui-color-primary);
        color: #fff;

        &:hover {
          background-color: var(--ui-color-hover);
          opacity: 1;
        }
      }
    }
  }

  &__menu {
    .UiItem {
      --ui-item-padding: 8px 12px;
      &:hover {
        background-color: var(--ui-color-hover);
      }
    }
  }
}
</style>