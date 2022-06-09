<script setup>
import { ref } from 'vue'

import { UiItem } from '@/packages/ui'
import CmsBlockPicker from '../CmsBlockPicker/CmsBlockPicker.vue'

const props = defineProps({
  direction: {
    type: String,
    required: false,
    default: 'column',
    validator: (v) => ['row', 'column'].includes(v),
  },

  label: {
    type: String,
    required: false,
    default: 'Adding content here',
  },

  title: {
    type: String,
    required: false,
    default: null,
  },

  open: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['input'])

const isOpen = ref(props.open)
const isPopupOpen = ref(false)
const isTriggerHovered = ref(false)

function onTriggerClick() {
  isOpen.value = !isOpen.value

  setTimeout(() => {
    isPopupOpen.value = isOpen.value
  }, 200)
}
</script>

<template>
  <div
    class="SlotBlockLauncher"
    :class="[
      `SlotBlockLauncher--${props.direction}`,
      {
        'SlotBlockLauncher--open': isOpen,
        'SlotBlockLauncher--teasing': isTriggerHovered,
      }
    ]"
  >
    <div
      v-show="!isOpen"
      class="SlotBlockLauncher__trigger"
      @click="onTriggerClick"
      @mouseenter="isTriggerHovered = true"
      @mouseleave="isTriggerHovered = false"
    >
      <UiItem
        icon="mdi:plus"
        :title="title"
      />
    </div>

    <CmsBlockPicker
      v-model:open="isPopupOpen"
      @update:open="isOpen = $event || props.open"
      @input="emit('input', $event)"
    >
      <template #trigger="{ toggle }">
        <div class="SlotBlockLauncher__box">
          <div
            @click="toggle"
            v-text="props.label"
          />
        </div>
      </template>
    </CmsBlockPicker>
  </div>
</template>

<style lang="scss">
.SlotBlockLauncher {
  position: relative;

  &__trigger {
    cursor: pointer;
    position: absolute;

    padding: 3px 10px;
    padding-top: 0;

    .UiItem {
      user-select: none;
      font-size: 12px;
      font-weight: bold;

      background-color: #525659;
      color: #fff;

      border-radius: 5px;
    }

    &:hover .UiItem {
      background-color: var(--ui-color-primary);
      color: #eee;
    }
  }

  &__box {
    display: flex;
    align-items: stretch;
    justify-content: center;

    user-select: none;

    transition:
      width var(--ui-duration-snap),
      height var(--ui-duration-snap),
      opacity var(--ui-duration-snap);

    overflow: hidden;

    div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      border: 2px dashed var(--ui-color-primary);
      border-radius: 3px;

      font-weight: bold;
      font-size: 1em;

      cursor: pointer;
      &:hover {
        background-color: rgba(255,255,255, 0.1);
      }
    }
  }
}

.SlotBlockLauncher--column {
  .SlotBlockLauncher__trigger {
    top: -12px;
    left: calc(50% - 20px);
  }

  .SlotBlockLauncher__box {
    height: 0;
  }

  &.SlotBlockLauncher--open .SlotBlockLauncher__box {
    height: 60px;
  }

  &.SlotBlockLauncher--teasing {
    border-top: 4px dashed var(--ui-color-primary);
    margin-top: -4px;
  }
}


.SlotBlockLauncher--row {
  .SlotBlockLauncher__trigger {
    top: 50%;
    margin-top: -8px;
    left: -20px;
  }

  .SlotBlockLauncher__box {
    width: 0;
    height: 100%;
  }

  &.SlotBlockLauncher--open {
    flex: 1;
  }

  &.SlotBlockLauncher--open .SlotBlockLauncher__box {
    width: auto;
  }


  &.SlotBlockLauncher--teasing {
    border-left: 4px dashed var(--ui-color-primary);
    margin-left: -4px;
  }

  ///damn
  & > .CmsBlockPicker,
  & > .CmsBlockPicker > .UiPopover,
  & > .CmsBlockPicker > .UiPopover > .UiPopover__trigger {
    height: 100%;
  }
}
</style>