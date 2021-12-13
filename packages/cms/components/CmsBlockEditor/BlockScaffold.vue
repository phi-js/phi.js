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
const $settings = inject('$_cms_settings', {})
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
  const ifActionIndex = availableActions.value.findIndex((action) => action.id == 'visibility')
  openAction(ifActionIndex)
}

const isFocused = ref(false)

</script>

<template>
  <div
    class="BlockScaffold"
    :class="{'BlockScaffold--focused': isFocused}"
  >
    <div class="BlockScaffold__toolbar-container">
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

        <div
          class="Toolbar__spacer"
          style="flex:1"
        />

        <UiInputWedge
          v-if="innerBlock['v-model'] !== undefined"
          v-model="innerBlock['v-model']"
          :color="innerBlock['v-model'] ? 'var(--ui-color-primary)' : undefined"
          placeholder="Variable"
          @update:modelValue="accept()"
        />
        <UiIcon
          v-if="innerBlock['v-if'] || innerBlock['v-for']"
          title="Visibility"
          class="BlockScaffold__toolbar-icon ui--clickable"
          src="mdi:eye"
          @click="onClickEye"
        />

        <!-- dropdown options -->
        <UiPopover
          class="BlockPopover"
          placement="bottom-end"
          @update:open="isFocused = $event"
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


    <UiWindow
      name="block-scaffold"
      :open="!!availableActions[currentActionIndex]"
      @update:open="currentActionIndex = null"
    >
      <div class="WindowContents">
        <UiTabs
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
        </UiTabs>
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
.Block__drag-handle {
  cursor: move;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.WindowContents {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__body {
    flex: 1;
    padding: var(--ui-padding);
    overflow: auto;
  }

  &--id-source {
    padding: 0;

    .UiInputJson {
      height: 100%;
    }

    .UiInputJson__textarea {
      resize: none;
      min-height: 0;
    }
  }
}

.BlockScaffold {
  position: relative;
  border: 1px solid transparent;

  &__toolbar {
    display: inline-flex;
    align-items: stretch;
    background-color: #313131;
    border-radius: var(--ui-radius);

    color: rgba(255, 255, 255, 0.5);
  }


  // Estilos "default":  toolbar posicionado absolutamente encima del bloque
  &--default &__toolbar-container {
    position: absolute;
    bottom: 100%;
    left: 0;

    transition: opacity var(--ui-duration-snap);
    opacity: 0;
    // pointer-events: none;
  }

  // Toolbar visible on hover or focused
  &--focused > &__toolbar-container,
  &--default:hover > &__toolbar-container {
    opacity: 1;
    // pointer-events: initial;
  }

  &--default &__toolbar {
    flex-wrap: nowrap;
    width: max-content; // No soportado en IE ni EDGE !!!
    max-width: 600px;

    // Catch-all para todo tipo de item dentro del toolbar
    .UiIcon,
    .ui-icon,
    .UiSelectNative,
    button {
      color: rgba(255, 255, 255, 0.5);
      flex: none;
      padding: 0 10px;
      border: 0;
      background: transparent;

      outline: none;
      display: block;

      min-width: 12px;

      display: flex;
      align-items: center;
      justify-content: center;

      transition: background-color var(--ui-duration-snap);

      &.--active {
        color: #fff;
      }

      &:hover {
        background-color: rgba(255, 255, 255, 0.2);
      }
    }

    .UiItem {
      .ui-icon {
        padding: 0;

        &:hover {
          background-color: transparent;
        }
      }
    }

    .ui__input {
      background: transparent;
      border: 0;
      border-radius: 0;

      font-family: var(--ui-font-secondary);
      color: rgba(255, 255, 255, 0.5);
      outline: none;

      option {
        color: initial;
      }
    }

    input[type=text].ui__input {
      background-color: rgba(255, 255, 255, 0.1);
      margin: 0 2px;
    }
  }

  &__toolbar-icon {
    width: 40px;
    min-height: 40px;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}


/* __outline.   Visible unicamente para --default.  */
.BlockScaffold {
  &--default {
    &::before {
      content: '';
      display: block;
      position: absolute;
      top: -1px;
      left: -4px;
      right: -4px;
      bottom: -2px;

      border-radius: var(--ui-radius);
      border: 1px solid rgba(0, 0, 0, 0.5);

      transition: all var(--ui-duration-snap);
      opacity: 0;
      pointer-events: none;
    }
  }

  &--default:hover {
    &::before {
      opacity: 1;
    }
  }
}

.BlockPopover {
  .tippy-content {
    padding: 0;
  }

  &__item {
    padding: var(--ui-padding);
    cursor: pointer;
    color: #ccc;

    &:hover {
      color: #fff;
      background-color: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>