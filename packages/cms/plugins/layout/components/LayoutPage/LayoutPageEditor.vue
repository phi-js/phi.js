<script setup>
import { ref, watch, computed } from 'vue'
import CmsSlotEditor from '../../../../components/CmsSlotEditor/CmsSlotEditor.vue'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:block', 'submit', 'change'])

const slots = ref({})
watch(
  () => props.block,
  (newValue) => {
    slots.value = {
      default: [],
      header: [],
      footer: [],
      ...newValue.slots,
    }
    if (newValue.slot?.length && !slots.value.default?.length) {
      slots.value.default = newValue.slot
    }
  },
  { immediate: true },
)

function onSlotUpdate() {
  emit('update:block', {
    ...props.block,
    slot: undefined,
    slots: { ...slots.value },
  })
}

const isHeaderEnabled = computed({
  get() {
    if (typeof props.block.omitHeader !== 'undefined') {
      return !props.block.omitHeader
    }
    return slots.value.header?.length > 0
  },
  set(newValue) {
    emit('update:block', {
      ...props.block,
      omitHeader: !newValue,
    })
  },
})

const isFooterEnabled = computed({
  get() {
    if (typeof props.block.omitFooter !== 'undefined') {
      return !props.block.omitFooter
    }
    return slots.value.footer?.length > 0
  },
  set(newValue) {
    emit('update:block', {
      ...props.block,
      omitFooter: !newValue,
    })
  },
})
</script>

<template>
  <form
    class="LayoutPageEditor LayoutPage"
    @submit.prevent="emit('submit', $event)"
    @change="emit('change', $event)"
  >
    <div
      class="LayoutPageEditor__header"
      :class="{
        'LayoutPageEditor__header--empty': !slots.header?.length,
        'LayoutPageEditor__header--disabled': !isHeaderEnabled
      }"
    >
      <CmsSlotEditor
        v-model:slot="slots.header"
        class="LayoutPage__header"
        @update:slot="onSlotUpdate"
      />
      <div class="LayoutPageEditor__separator">
        <label title="Toggle header for this page">
          <span>Header</span>
          <input
            v-model="isHeaderEnabled"
            type="checkbox"
          >
        </label>
      </div>
    </div>

    <CmsSlotEditor
      v-model:slot="slots.default"
      class="LayoutPageEditor__contents LayoutPage__contents"
      @update:slot="onSlotUpdate"
    />

    <div
      class="LayoutPageEditor__footer"
      :class="{
        'LayoutPageEditor__footer--empty': !slots.footer?.length,
        'LayoutPageEditor__footer--disabled': !isFooterEnabled
      }"
    >
      <div class="LayoutPageEditor__separator">
        <label title="Toggle footer for this page">
          <span>Footer</span>
          <input
            v-model="isFooterEnabled"
            type="checkbox"
          >
        </label>
      </div>

      <CmsSlotEditor
        v-model:slot="slots.footer"
        class="LayoutPage__footer"
        @update:slot="onSlotUpdate"
      />
    </div>
  </form>
</template>

<style lang="scss">
.LayoutPageEditor {
  &__header,
  &__footer {
    position: relative;

    &--disabled {
      opacity: 0.5;
      .CmsSlotEditor {
        pointer-events: none;
        &__footer {
          display: none;
        }
      }

      &.LayoutPageEditor__header--empty,
      &.LayoutPageEditor__footer--empty {
        .CmsSlotEditor {
          display: none;
        }
      }
    }

  }

  &__header {
    border-bottom: 1px dashed #525659;
  }
  &__footer {
    border-top: 1px dashed #525659;
  }

  &__separator {
    font-size: 9pt;
    font-weight: 600;
    text-align: right;

    label {
      user-select: none;

      display: inline-flex;
      align-items: center;
      gap: 6px;

      padding: 3px;
      cursor: pointer;
      input {
        cursor: pointer;
      }
      &:hover {
        background-color: var(--ui-color-hover);
      }
    }
  }
}
</style>