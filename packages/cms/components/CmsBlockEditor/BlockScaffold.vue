<script setup>
import { ref, shallowRef, watch, computed, provide } from 'vue'
import { getBlockEditors, getBlockDefinition, getCssObjectAttributes } from '../../functions'
import EditorAction from './EditorAction.vue'
import {
  UiItem,
  UiInputWedge,
  UiIcon,
  UiPopover,
  UiWindow,
  UiTabs,
  UiTab,
} from '@/packages/ui/components'

import UiDrawerStack from '../../../ui/components/UiDrawerStack/UiDrawerStack.vue'

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },

  focused: {
    type: [Boolean, String, Number],
    required: false,
    default: null,
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

/* Global scaffold accept catcher */
const acceptListeners = []
function registerAcceptListener(callback) {
  acceptListeners.push(callback)
  return () => acceptListeners.splice(acceptListeners.indexOf(callback), 1) // return unmount function
}
provide('$_cms_scaffold_accept', registerAcceptListener)

function accept() {
  const blockClone = JSON.parse(JSON.stringify(innerBlock.value))
  emit('update:block', blockClone)
  acceptListeners.forEach((callback) => callback(blockClone))
  return true
}

/* Global scaffold cancel catcher */
const cancelListeners = []
function registerCancelListener(callback) {
  cancelListeners.push(callback)
  return () => cancelListeners.splice(cancelListeners.indexOf(callback), 1) // return unmount function
}
provide('$_cms_scaffold_cancel', registerCancelListener)

function cancel() {
  innerBlock.value = JSON.parse(JSON.stringify(props.block))
  cancelListeners.forEach((callback) => callback(innerBlock.value))
  return true
}

function emitDelete() {
  emit('delete')
  return true
}

const blockCssAttributes = computed(() => getCssObjectAttributes(innerBlock.value?.css))

// Available block editors
const editors = shallowRef({})
const definition = shallowRef({})
const isDefinitionLoaded = ref(false)

watch(
  () => props.block?.component,
  () => {
    Promise.all([
      getBlockEditors(props.block).then((e) => editors.value = e),
      getBlockDefinition(props.block).then((d) => definition.value = d),
    ])
      .then(() => isDefinitionLoaded.value = true)
  },
  { immediate: true },
)

const availableActions = computed(() => editors.value?.actions || [])
const currentActionIndex = ref(null)

function openAction(actionIndex) {
  currentActionIndex.value = actionIndex
  return true
}

function openActionId(actionId) {
  const foundActionIndex = availableActions.value.findIndex((action) => action.id == actionId)
  if (foundActionIndex >= 0) {
    openAction(foundActionIndex)
  } else {
    console.warn('Could not find block action:', actionId)
  }
}

const isFocused = ref(false)
watch(
  () => props.focused,
  (newValue) => isFocused.value = newValue,
)

function getWidth(coords) {
  return parseInt(coords?.width)
}
</script>

<template>
  <div
    v-if="isDefinitionLoaded"
    class="BlockScaffold"
    :class="{ 'BlockScaffold--focused': isFocused }"
  >
    <div class="BlockScaffold__toolbar-container">
      <div class="BlockScaffold__toolbar">
        <UiItem
          class="BlockScaffold__toolbar-title Block__drag-handle"
          icon="mdi:drag"
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

        <div class="BlockScaffold__toolbar-spacer" />

        <!-- Quick access buttons -->
        <UiInputWedge
          v-if="innerBlock['v-model'] !== undefined"
          v-model="innerBlock['v-model']"
          :color="innerBlock['v-model'] ? 'var(--ui-color-primary)' : undefined"
          placeholder="Variable"
          @update:model-value="accept()"
        />

        <UiIcon
          v-if="innerBlock['v-if']"
          title="This block has conditional visibility"
          class="BlockScaffold__toolbar-icon"
          src="mdi:eye"
          @click="openActionId('visibility')"
        />

        <UiIcon
          v-if="innerBlock['v-for']"
          title="This block repeats"
          class="BlockScaffold__toolbar-icon"
          src="mdi:repeat-variant"
          @click="openActionId('visibility')"
        />

        <UiIcon
          v-if="innerBlock?.rules?.length"
          title="This block has validation rules"
          class="BlockScaffold__toolbar-icon"
          src="mdi:message-alert"
          @click="openActionId('validation')"
        />

        <UiIcon
          v-if="innerBlock?.css?.classes?.length || innerBlock?.css?.style"
          title="This block has CSS styles"
          class="BlockScaffold__toolbar-icon"
          src="mdi:palette-advanced"
          @click="openActionId('css')"
        />

        <!-- dropdown options -->
        <UiPopover
          class="BlockPopover"
          placement="bottom"
          @update:open="isFocused = $event"
        >
          <template #trigger>
            <UiIcon
              class="BlockScaffold__toolbar-icon"
              src="mdi:dots-vertical"
            />
          </template>
          <template #contents="{ close }">
            <UiItem
              v-for="(action, i) in availableActions"
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
    </div>

    <div class="BlockScaffold__face">
      <slot
        name="default"
        :innerBlock="innerBlock"
        :blockCssAttributes="blockCssAttributes"
      >
        <EditorAction
          v-if="editors.face"
          v-model:block="innerBlock"
          :action="editors.face"
          v-bind="{ ...innerBlock?.props, ...blockCssAttributes }"
          tabindex="0"
          :open-action="openActionId"
          @update:block="accept()"
          @delete="emitDelete()"
        />

        <!-- block component as face. Clicking will open settings window -->
        <div
          v-else-if="definition?.block?.component"
          @click="openAction(0)"
        >
          <Component
            :is="definition.block.component"
            style="pointer-events: none"
            v-bind="{ ...innerBlock?.props, ...blockCssAttributes }"
          />
        </div>
      </slot>
    </div>

    <UiWindow
      v-if="!!availableActions[currentActionIndex]"
      name="phi"
      :open="!!availableActions[currentActionIndex]"
      @update:open="currentActionIndex = null"
    >
      <template #default="{ coords }">
        <div class="WindowContents UiForm--wide">
          <Component
            :is="getWidth(coords) < 650 ? UiDrawerStack : UiTabs"
            v-model="currentActionIndex"
            class="WindowContents__tabs"
          >
            <UiTab
              v-for="(action, i) in availableActions"
              :key="i"
              :value="i"
              :text="action.title"
              :icon="action.icon || 'mdi:star'"
            >
              <div
                :class="['WindowContents__body', `WindowContents--id-${availableActions[currentActionIndex].id}`]"
              >
                <EditorAction
                  v-model:block="innerBlock"
                  :action="action"
                />
              </div>
            </UiTab>
          </Component>
        </div>
      </template>

      <template #footer="{ close }">
        <button
          type="button"
          class="UiButton UiButton--main"
          @click="accept() && close()"
          v-text="'Aceptar'"
        />
        <button
          type="button"
          class="UiButton UiButton--cancel"
          @click="cancel() && close()"
          v-text="'Cancelar'"
        />
      </template>
    </UiWindow>
  </div>
</template>