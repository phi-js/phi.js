<script setup>
import { defineAsyncComponent, ref, watch } from 'vue'
import { UiDrawer, UiItem } from '../'
import ColumnEditor from './ColumnEditor.vue'
// import draggable from 'vuedraggable'
const draggable = defineAsyncComponent(() => import('vuedraggable'))

const props = defineProps({
  /*
  Array of COLUMNS
  */
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const columns = ref([])

watch(
  () => props.modelValue,
  (newValue) => {
    columns.value = JSON.parse(JSON.stringify(newValue))
    columns.value.forEach((column) => {
      if (typeof column.enabled === 'undefined') {
        column.enabled = true
      }
    })
  },
  {
    immediate: true,
    deep: true,
  },
)

function emitUpdate() {
  emit('update:modelValue', columns.value.concat([]))
  return true
}
</script>

<template>
  <draggable
    v-model="columns"
    class="ColumnManager"
    item-key="index"
    handle=".UiItem__icon"
    @update:model-value="emitUpdate"
  >
    <template #item="{ element, index }">
      <UiDrawer
        class="ColumnManager__column"
        :class="{'ColumnManager__column--disabled': !columns[index].enabled}"
        drawer-group="ColumnManager"
      >
        <template #trigger>
          <UiItem
            icon="mdi:drag"
            class="ColumnManager__item"
            :text="element.title"
          >
            <template #actions>
              <div @click.stop.prevent="columns[index].enabled = !columns[index].enabled; emitUpdate();">
                <input
                  :checked="columns[index].enabled"
                  type="checkbox"
                  style="pointer-events: none"
                >
              </div>
            </template>
          </UiItem>
        </template>
        <template #contents>
          <ColumnEditor
            v-model="columns[index]"
            class="ColumnManager__editor"
            @update:model-value="emitUpdate()"
          />
        </template>
      </UiDrawer>
    </template>
  </draggable>
</template>

<style lang="scss">
.ColumnManager {
  &__column {
    border-bottom: 1px solid #ccc;

    &--disabled {
      opacity: 0.6;
    }
  }

  &__item {
    position: relative;
    --ui-item-padding: 12px;
    user-select: none;
    font-weight: bold;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }

    .UiIcon {
      cursor: move;
    }

    .UiItem__actions {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: 42px;
      padding: 12px;

      input {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }

  &__editor {
    margin: 0 12px 2rem 12px;
  }
}
</style>