<script setup>
import { ref, inject, shallowRef, watch, computed, nextTick, getCurrentInstance } from 'vue'
import { useI18n } from '@/packages/i18n'
import UiDrawerStack from '@/packages/ui/components/UiDrawerStack/UiDrawerStack.vue'

import { parseTranslations } from '../../functions'
import dictionary from './BlockScaffold.i18n.js'
import { getBlockEditors, getBlockDefinition } from '../../functions'
import EditorAction from './EditorAction.vue'
import {
  UiItem,
  UiIcon,
  UiPopover,
  UiWindow,
  UiTabs,
  UiTab,
} from '@/packages/ui/components'

import activeUid from '../CmsSlotEditor/activeUid.js'

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

const emit = defineEmits(['update:block', 'cancel', 'delete'])

const i18n = useI18n(dictionary)

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



// Keep a "snapshot" of the entire story stylesheets
// and revert changes on cancel (This is to aid BlockCssCasses and should be done in a proper way instead)
const injectedStoryEditor = inject('$_cms_story_builder', {})
const injectedStory = shallowRef(injectedStoryEditor.story)
let initialStylesheets = null


function cancel() {
  innerBlock.value = JSON.parse(JSON.stringify(props.block))

  if (initialStylesheets) {
    injectedStory.value.stylesheets = JSON.parse(JSON.stringify(initialStylesheets))
    initialStylesheets = null
  }

  emit('cancel')
  return true
}

function emitDelete() {
  emit('delete')
  return true
}

// Available block editors
const editors = shallowRef({})
const definition = shallowRef({})
const isDefinitionLoaded = ref(false)

watch(
  () => props.block?.component,
  () => {
    definition.value = getBlockDefinition(props.block)
    getBlockEditors(props.block)
      .then((e) => {
        editors.value = e
        isDefinitionLoaded.value = true
      })
  },
  { immediate: true },
)

const availableActions = computed(() => editors.value?.actions || [])
const currentActionIndex = ref(null)

const elWindowContents = ref()

function openAction(actionIndex) {
  currentActionIndex.value = actionIndex

  // focus first input in newly opened UiWindow
  // (check 2 ticks ahead! UiWindow of newly created blocks is not fully done after first tick, apparently)
  nextTick(() => {
    if (!elWindowContents.value) {
      nextTick(() => elWindowContents.value?.querySelector?.('input[type=text], textarea')?.focus?.())
      return
    }
    elWindowContents.value.querySelector('input[type=text], textarea')?.focus?.()
  })

  // Keep a "snapshot" of the entire story object to revert on cancel
  initialStylesheets = JSON.parse(JSON.stringify(injectedStory.value.stylesheets))

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

const hasEvents = computed(() => {
  return innerBlock.value['v-on'] && Object.keys(innerBlock.value['v-on']).length
})



const popupIsOpen = ref(false)

const windowIsOpen = computed(() => !!availableActions.value[currentActionIndex.value])

const isFocused = computed(() => {
  return props.focused
    || popupIsOpen.value
})

function getWidth(coords) {
  return parseInt(coords?.width)
}

// function renameVModel() {
//   let res = window.prompt(i18n.t('BlockScaffold.SetVariableName'), innerBlock.value['v-model'])?.trim?.()
//   if (res === undefined) { // prompt cancelled
//     return
//   }

//   res = res.replaceAll(/[^a-zA-Z0-9.]/g, '') // remove invalid characters
//   innerBlock.value['v-model'] = res
//   accept()
// }

/* Find the chain of BlockScaffold parents */
const instance = getCurrentInstance()
const ancestry = []
const descendants = []

let parent = instance
while (parent.parent) {
  parent = parent.parent
  if (parent.exposed?.isBlockScaffold) {
    ancestry.unshift(parent.vnode.props.block)
    parent.exposed.descendants.push({ ...props.block })
  }
}


const defaultFaceProps = computed(() => {
  return parseTranslations({ ...innerBlock.value.props }, i18n.locale, innerBlock.value.i18n)
})

defineExpose({
  isBlockScaffold: true,
  descendants,
  openAction,
  openActionId,
})
</script>

<template>
  <div
    v-if="isDefinitionLoaded"
    :class="[
      'BlockScaffold',
      `BlockScaffold--${innerBlock.component}`,
      {
        'BlockScaffold--focused': isFocused,
        'BlockScaffold--window-open': windowIsOpen,
      }
    ]"
  >
    <div class="BlockScaffold__toolbar-container">
      <div class="BlockScaffold__toolbar-stick">
        <div
          v-if="ancestry.length"
          class="BlockScaffold__ancestry"
        >
          <UiIcon
            v-for="parentBlock in ancestry"
            :key="parentBlock._uid"
            class="BlockScaffold__ancestryIcon BlockScaffold__ancestryIcon--up"
            :title="`Select parent block (${parentBlock.title || parentBlock.component})`"
            src="mdi:chevron-up"
            @click.stop.prevent="activeUid = parentBlock._uid"
          />
        </div>

        <div class="BlockScaffold__toolbar">
          <UiItem
            class="BlockScaffold__toolbar-title Block__drag-handle"
            icon="mdi:drag"
            :text="innerBlock?.title || definition?.title || ''"
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
          <UiIcon
            v-if="innerBlock['v-model'] !== undefined"
            :title="innerBlock['v-model']
              ? innerBlock['v-model']
              : i18n.t('BlockScaffold.NoVariableSet')
            "
            class="BlockScaffold__toolbar-icon BlockScaffold__toolbar-icon--variable"
            src="mdi:code-json"
            @click="openActionId('data')"
          />

          <UiIcon
            v-if="innerBlock?.rules?.length"
            :title="i18n.t('BlockScaffold.quickButton.validation')"
            class="BlockScaffold__toolbar-icon BlockScaffold__toolbar-icon--validation"
            src="mdi:message-alert"
            @click="openActionId('validation')"
          />

          <UiIcon
            v-if="innerBlock?.props?.class || innerBlock?.props?.style"
            :title="i18n.t('BlockScaffold.quickButton.css')"
            class="BlockScaffold__toolbar-icon BlockScaffold__toolbar-icon--css"
            src="mdi:water"
            @click="openActionId('css')"
          />

          <UiIcon
            v-if="innerBlock['v-if']"
            :title="i18n.t('BlockScaffold.quickButton.visibility')"
            class="BlockScaffold__toolbar-icon BlockScaffold__toolbar-icon--visibility"
            src="mdi:eye"
            @click="openActionId('visibility')"
          />

          <UiIcon
            v-if="hasEvents"
            :title="i18n.t('BlockScaffold.quickButton.event')"
            class="BlockScaffold__toolbar-icon BlockScaffold__toolbar-icon--events"
            src="mdi:gesture-tap"
            @click="openActionId('events')"
          />

          <UiIcon
            v-if="innerBlock['v-for']"
            :title="i18n.t('BlockScaffold.quickButton.repeat')"
            class="BlockScaffold__toolbar-icon BlockScaffold__toolbar-icon--repeat"
            src="mdi:repeat-variant"
            @click="openActionId('repeat')"
          />
          <!-- /quick access buttons -->

          <!-- Block actions popover -->
          <UiPopover
            v-model:open="popupIsOpen"
            class="BlockPopover"
            placement="bottom-end"
          >
            <template #trigger>
              <UiIcon
                class="BlockScaffold__toolbar-icon BlockScaffold__toolbar-icon--trigger"
                src="mdi:dots-vertical"
              />
            </template>
            <template #contents="{ close }">
              <slot
                name="dropdown"
                :close="close"
              />

              <UiItem
                v-for="(action, i) in availableActions"
                :key="i"
                :text="i18n.t(`BlockScaffold.action.${action.id}`, null, action.title)"
                :icon="action.icon"
                class="BlockPopover__item BlockPopover__item--action"
                @click="openAction(i) && close()"
              />

              <UiItem
                :text="i18n.t('BlockScaffold.action.delete')"
                icon="mdi:close"
                class="BlockPopover__item BlockPopover__item--delete"
                @click="emitDelete() && close()"
              />
            </template>
          </UiPopover>
        </div>

        <div
          v-if="descendants.length"
          class="BlockScaffold__descendants"
        >
          <UiIcon
            class="BlockScaffold__ancestryIcon BlockScaffold__ancestryIcon--down"
            :title="`Select child block (${descendants[0].title || descendants[0].component})`"
            src="mdi:chevron-down"
            @click.stop.prevent="activeUid = descendants[0]._uid"
          />
        </div>
      </div>
    </div>

    <div class="BlockScaffold__face">
      <slot
        name="default"
        :innerBlock="innerBlock"
      >
        <EditorAction
          v-if="editors.face"
          v-model:block="innerBlock"
          :action="editors.face"
          :class="innerBlock?.props?.class"
          :style="innerBlock?.props?.style"
          :open-action="openActionId"
          @update:block="accept()"
          @delete="emitDelete()"
        />

        <!-- No editor.face defined. Use block component as face -->
        <div
          v-else-if="definition?.block?.component"
          class="BlockScaffold__defaultFace"
        >
          <Component
            :is="definition.block.component"
            v-bind="defaultFaceProps"
            :class="innerBlock?.props?.class"
            :style="innerBlock?.props?.style"
          />
        </div>
      </slot>
    </div>

    <UiWindow
      v-if="windowIsOpen"
      name="phi"
      :open="windowIsOpen"
      class="BlockScaffold__window"
      @update:open="currentActionIndex = null"
      @cancel="cancel"
    >
      <template #header>
        <UiItem
          class="BlockScaffold__window-header"
          :icon="definition.icon"
          :text="innerBlock?.title || definition?.title"
        />
      </template>

      <template #default="{ coords }">
        <div
          ref="elWindowContents"
          class="WindowContents"
        >
          <Component
            :is="UiDrawerStack"
            v-model="currentActionIndex"
            xxxx-is="getWidth(coords) < 650 ? UiDrawerStack : UiTabs"
            class="WindowContents__tabs"
          >
            <UiTab
              v-for="(action, i) in availableActions"
              :key="i"
              :value="i"
              :text="i18n.t(`BlockScaffold.action.${action.id}`, null, action.title)"
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
          v-text="i18n.t('Accept')"
        />
        <button
          type="button"
          class="UiButton UiButton--cancel"
          @click="cancel() && close()"
          v-text="i18n.t('Cancel')"
        />
      </template>
    </UiWindow>
  </div>
</template>