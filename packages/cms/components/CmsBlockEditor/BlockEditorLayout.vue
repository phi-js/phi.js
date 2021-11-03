<script setup>
import { ref, shallowRef, watch, computed } from 'vue'
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

getBlockEditors(props.block).then((r) => availableActions.value = r?.actions || [])

function openAction(targetActionIndex = null) {
  currentActionIndex.value = targetActionIndex
  isWindowOpen.value = true
  return true
}

function deleteBlock() {
  // if (!confirm('Eliminar este bloque?')) {
  //   return true
  // }
  emit('delete')
  return true
}

const isPopoverOpen = ref(false)

const actionsSelectOptions = computed(() =>
  availableActions.value.map((action, i) => ({
    value: i,
    text: action.title,
  })))

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
      <UiIcon
        src="mdi:cursor-move"
        class="BlockEditorLayout__handle ui--clickable"
      />

      <UiInputWedge
        v-if="blockValue['v-model'] !== undefined"
        v-model="blockValue['v-model']"
        :color="blockValue['v-model'] ? 'var(--ui-color-primary)' : undefined"
        placeholder="Variable"
        @update:modelValue="accept()"
      />

      <slot name="toolbar" />

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
      class="ui-theme-dark"
    >
      <template #contents>
        <!-- <UiInput
          v-model="currentActionIndex"
          class="Action__picker--input"
          type="select-native"
          :options="actionsSelectOptions"
        /> -->
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
      </template>

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
  margin-left: auto;

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