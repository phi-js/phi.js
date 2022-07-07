<script setup>
import { ref, watch } from 'vue'
import { UiDrawer, UiItem } from '@/packages/ui'
import draggable from 'vuedraggable'
import DbColumnEditor from './DbColumnEditor.vue'

const props = defineProps({
  /*
  Array of available columns
  [
    {
      ... column object
      The column object is a JSON SCHEMA, with an added "property" property
      and an added "enabled" property

      "title": "Fecha"
      "type": "integer",
      "format": "date",

      "property": "objrecord.date",
      "enabled": true
    }
  ]
  */
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const innerColumns = ref([])

watch(
  () => props.modelValue,
  (newValue) => {
    innerColumns.value = JSON.parse(JSON.stringify(newValue))
    innerColumns.value.forEach((column) => {
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
  emit('update:modelValue', innerColumns.value)
  return true
}
</script>

<template>
  <div class="DbColumnManager">
    <div class="DbColumnManager__container">
      <draggable
        v-model="innerColumns"
        item-key="index"
        handle=".UiItem__icon"
        @update:model-value="emitUpdate"
      >
        <template #item="{ element, index }">
          <UiDrawer>
            <template #trigger>
              <UiItem
                icon="mdi:drag-vertical"
                class="DbColumnManager__item"
              >
                <template #default>
                  <input
                    v-model="innerColumns[index].enabled"
                    type="checkbox"
                    @update:model-value="emitUpdate()"
                    @click.stop="() => false"
                  >
                  <div class="DbColumnManager__itemInfo">
                    <h3>{{ element.title }}</h3>
                    <span>{{ element.property }}</span>
                  </div>
                </template>
              </UiItem>
            </template>
            <template #contents="{ close }">
              <DbColumnEditor
                v-model="innerColumns[index]"
                class="DbColumnManager__form"
                @accept="emitUpdate() && close()"
                @cancel="close()"
              />
            </template>
          </UiDrawer>
        </template>
      </draggable>
    </div>
  </div>
</template>

<style lang="scss">
.DbColumnManager {
  &__item {
    margin: 0.3rem 0;
    align-items: flex-start;

    .UiItem__slot {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
    }

    input[type=checkbox] {
      margin-top: 0.4rem;
    }
  }

  &__itemInfo {
    h3 {
      font-size: 1em;
      margin: 0;
    }
    span {
      display: block;
      font-size: 10pt;
      color: #666;
    }
  }
}
</style>