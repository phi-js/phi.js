<script setup>
import { ref, shallowRef, watch, inject } from 'vue'
import { UiIcon, UiItem, UiInputWedge, UiWindow, UiPopover, UiTabs, UiTab } from '../../../ui/components'
import EditorAction from './EditorAction.vue'
import { getBlockEditors } from '../../composables'

const props = defineProps({
  block: {
    type: Object,
    required: false,
    default: null,
  },

  focused: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emit = defineEmits(['update:block', 'delete'])

const blockDefinition = inject('$_phi_block_definition', null)

const blockValue = ref(null)
watch(
  () => props.block,
  (newValue) => blockValue.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true, deep: true },
)

function accept() {
  emit('update:block', JSON.parse(JSON.stringify(blockValue.value)))
  return true
}

function cancel() {
  blockValue.value = JSON.parse(JSON.stringify(props.block))
  return true
}

const isWindowOpen = ref(false)
const currentActionIndex = ref(null)
const availableActions = shallowRef([])

getBlockEditors(props.block, inject('$_cms_settings')).then((r) => availableActions.value = r?.actions || [])

function openAction(targetActionIndex = null) {
  currentActionIndex.value = targetActionIndex
  isWindowOpen.value = true
  return true
}

function deleteBlock() {
  emit('delete')
  return true
}

const isPopoverOpen = ref(false)

function onClickEye() {
  const ifActionIndex = availableActions.value.findIndex((action) => action['v-model'] == 'block.v-if')
  openAction(ifActionIndex)
}
</script>

<template>
  <div
    class="BlockEditorLayout"
    :class="{
      'BlockEditorLayout--focused': props.focused || isPopoverOpen,
      'BlockEditorLayout--open': isWindowOpen,
    }"
  >
    <div class="BlockEditorLayout__toolbar ui-toolbar ui-theme-dark">
      <UiItem
        class="BlockEditorLayout__handle ui--clickable SlotEditor__handle"
        icon="mdi:cursor-move"
        :text="blockDefinition?.title || ''"
      />

      <slot name="toolbar" />

      <div
        class="BlockEditorLayout__spacer"
        style="flex:1"
      />

      <UiInputWedge
        v-if="blockValue['v-model'] !== undefined"
        v-model="blockValue['v-model']"
        :color="blockValue['v-model'] ? 'var(--ui-color-primary)' : undefined"
        placeholder="Variable"
        @update:modelValue="accept()"
      />

      <UiIcon
        title="Visibility"
        class="ui--clickable"
        :src="blockValue['v-if'] ? 'mdi:eye' : 'mdi:eye-outline'"
        :style="{color: blockValue['v-if'] ? 'var(--ui-color-primary)' : undefined}"
        @click="onClickEye"
      />

      <!-- dropdown options -->
      <UiPopover
        v-model:open="isPopoverOpen"
        class="BlockPopover"
        placement="bottom-end"
      >
        <template #trigger>
          <UiIcon
            class="ui--clickable"
            src="mdi:dots-vertical"
          />
        </template>
        <template #contents="{close}">
          <UiItem
            v-for="(action,i) in availableActions"
            :key="i"
            :text="action.title"
            :icon="action.icon"
            class="BlockPopover__item BlockPopover__item--action"
            @click="openAction(i) && close()"
          />

          <UiItem
            text="Delete"
            icon="mdi:close"
            class="BlockPopover__item BlockPopover__item--delete"
            @click="deleteBlock() && close()"
          />
        </template>
      </UiPopover>
    </div>

    <div class="BlockEditorLayout__face">
      <slot :block-value="blockValue" />
    </div>

    <UiWindow
      v-if="isWindowOpen"
      v-model:open="isWindowOpen"
      name="block-settings"
      class="ui-theme-dark"
    >
      <UiTabs
        v-model="currentActionIndex"
        class="Action__picker--tabs"
      >
        <UiTab
          v-for="(action, i) in availableActions"
          :key="i"
          :value="i"
          :text="action.title"
          :icon="action.icon || 'mdi:star'"
        />
      </UiTabs>
      <div
        :key="currentActionIndex"
        class="Tab__contents"
      >
        <EditorAction
          v-model:block="blockValue"
          :action="availableActions[currentActionIndex]"
        />
      </div>

      <template #footer="{close}">
        <button
          type="button"
          class="ui__button ui__button--main"
          @click="accept() && close()"
          v-text="'Aceptar'"
        />
        <button
          type="button"
          class="ui__button ui__button--cancel"
          @click="cancel() && close()"
          v-text="'Cancelar'"
        />
      </template>
    </UiWindow>
  </div>
</template>

<style lang="scss">
.Tab {
  &__contents {
    padding: var(--ui-padding);
  }
}

.BlockPopover {
  .tippy-content {
    padding: 0;
  }

  &__item {
    padding: 4px 24px 4px var(--ui-padding-horizontal);
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}

.BlockEditorLayout {
  position: relative;
  border: 1px solid transparent;

  &__toolbar {
    position: absolute;
    bottom: 100%;
    min-width: 100%;
    left: -8px;
    right: -8px;
    margin-bottom: -3px;

    transition: opacity var(--ui-duration-snap);
    opacity: 0;
    pointer-events: none;

    z-index: 4;

    flex-wrap: nowrap;
    width: max-content; // No soportado en IE ni EDGE !!!
  }

  &__handle {
    color: var(--ui-color-fg);
    padding: 0;
    padding-right: var(--ui-padding-horizontal);
    margin-right: var(--ui-breathe);

    &:hover {
      background-color: var(--ui-color-bg-muted);
    }
  }

  &--open,
  &--focused,
  &:hover {
    border: 1px solid var(--ui-color-primary);

    .BlockEditorLayout__toolbar {
      opacity: 1;
      pointer-events: initial;
    }
  }

  &__handle {
    cursor: move !important;
  }
}
</style>