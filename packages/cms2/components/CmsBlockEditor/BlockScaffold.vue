<script setup>
import { ref, shallowRef, watch, inject, computed } from 'vue'
import { getBlockEditors, getBlockDefinition } from '../../functions'
import EditorAction from './EditorAction.vue'
import {
  UiInput,
  UiItem,
  UiInputWedge,
  UiIcon,
  UiPopover,
  UiWindow,
  UiTabs,
  UiTab,
} from '/packages/ui/components'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:block', 'delete'])

// Internal value manager (innerBlock)
const innerBlock = ref()
watch(
  () => props.block,
  (newValue) => innerBlock.value = JSON.parse(JSON.stringify(newValue)),
  { immediate: true },
)

function accept() {
  emit('update:block', JSON.parse(JSON.stringify(innerBlock.value)))
  return true
}

function cancel() {
  innerBlock.value = JSON.parse(JSON.stringify(props.block))
  return true
}

function emitDelete() {
  emit('delete')
  return true
}


// Available block editors
const $settings = inject('$_cms_settings')
const editors = shallowRef({})
const definition = ref({})
watch(
  () => props.block?.component,
  () => {
    getBlockEditors(props.block, $settings).then((e) => editors.value = e)
    getBlockDefinition(props.block).then((d) => definition.value = d)
  },
  { immediate: true },
)

const availableActions = computed(() => editors.value?.actions || [])
const currentActionIndex = ref(null)

function openAction(actionIndex) {
  currentActionIndex.value = actionIndex
  return true
}

function onClickEye() {
  const ifActionIndex = availableActions.value.findIndex((action) => action['v-model'] == 'block.v-if')
  openAction(ifActionIndex)
}

</script>

<template>
  <div class="BlockScaffold">
    <div class="BlockScaffold__toolbar ui--noselect">
      <UiItem
        class="Block__drag-handle ui--clickable"
        icon="mdi:cursor-move"
        :text="definition?.title || ''"
      />
      <slot name="toolbar">
        <EditorAction
          v-if="editors.toolbar"
          v-model:block="innerBlock"
          :action="editors.toolbar"
          @update:block="accept"
        />
      </slot>

      <div style="flex:1" />

      <UiInputWedge
        v-if="innerBlock['v-model'] !== undefined"
        v-model="innerBlock['v-model']"
        :color="innerBlock['v-model'] ? 'var(--ui-color-primary)' : undefined"
        placeholder="Variable"
        @update:modelValue="accept()"
      />
      <UiIcon
        title="Visibility"
        class="BlockScaffold__toolbar-icon ui--clickable"
        :src="innerBlock['v-if'] ? 'mdi:eye' : 'mdi:eye-outline'"
        :style="{color: innerBlock['v-if'] ? 'var(--ui-color-primary)' : undefined}"
        @click="onClickEye"
      />

      <!-- dropdown options -->
      <UiPopover
        class="BlockPopover"
        placement="bottom-end"
      >
        <template #trigger>
          <UiIcon
            class="ui--clickable BlockScaffold__toolbar-icon"
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
            @click="emitDelete() && close()"
          />
        </template>
      </UiPopover>
    </div>

    <div class="BlockScaffold__face">
      <slot name="default">
        <EditorAction
          v-if="editors.face"
          v-model:block="innerBlock"
          :action="editors.face"
          v-bind="innerBlock?.props"
          tabindex="0"
          @update:block="accept()"
        />
        <UiInput
          v-else
          v-model="innerBlock"
          type="json"
          @update:modelValue="accept()"
        />
      </slot>
    </div>

    <div class="BlockScaffold__window">
      <UiWindow
        name="block-scaffold"
        :open="!!availableActions[currentActionIndex]"
        @update:open="currentActionIndex = null"
      >
        <UiTabs v-model="currentActionIndex">
          <UiTab
            v-for="(action, i) in availableActions"
            :key="i"
            :value="i"
            :text="action.title"
            :icon="action.icon || 'mdi:star'"
          />
        </UiTabs>
        <div
          v-if="availableActions[currentActionIndex]"
          :key="currentActionIndex"
        >
          <EditorAction
            v-model:block="innerBlock"
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
  </div>
</template>

<style lang="scss">
.Block__drag-handle {
  cursor: move;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.BlockScaffold {
  position: relative;
  border: 1px solid transparent;

  /*
  &__toolbar {
    position: absolute;
    bottom: 100%;
    min-width: 100%;
    left: 0;
    right: 0;

    transition: opacity var(--ui-duration-snap);
    opacity: 0;
    pointer-events: none;

    z-index: 4;

    flex-wrap: nowrap;
    width: max-content; // No soportado en IE ni EDGE !!!
  }

  &--open,
  &--focused,
  &:hover {
    // border: 1px solid var(--ui-color-primary);
    .BlockScaffold__toolbar {
      opacity: 1;
      pointer-events: initial;
    }
  }
  */

  &__toolbar {
    display: inline-flex;
    align-items: stretch;
    background-color: #313131;
    color: rgba(255, 255, 255, 0.5);
    border-radius: var(--ui-radius);
  }


  // Estilos "default":  toolbar posicionado absolutamente encima del bloque
  &--default &__toolbar {
    position: absolute;
    bottom: 100%;
    min-width: 100%;
    left: 0;
    right: 0;
    z-index: 4;
    flex-wrap: nowrap;
    width: max-content; // No soportado en IE ni EDGE !!!

    transition: opacity var(--ui-duration-snap);
    opacity: 0;
    pointer-events: none;
  }

  &--default:hover &__toolbar {
    opacity: 1;
    pointer-events: initial;
  }

  &__toolbar-icon {
    width: 40px;
    min-height: 40px;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}
</style>