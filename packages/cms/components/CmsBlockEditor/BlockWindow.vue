<script setup>
import { computed, onMounted, ref, shallowRef, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiWindow, UiItem, UiDropdown } from '@/packages/ui'
import EditorAction from './EditorAction.vue'
import { getBlockDefinition, getBlockEditors } from '../../functions'

const i18n = useI18n()

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },

  actionId: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:block', 'accept', 'cancel', 'update:action-id'])

const currentActionId = ref()
watch(
  () => props.actionId,
  (actionId) => currentActionId.value = actionId,
  { immediate: true },
)

const innerBlock = ref()
const initialValue = ref()

const definition = shallowRef()
const availableEditors = shallowRef()
let _ignoreNextUpdate = false
watch(
  () => props.block,
  (newBlock) => {
    if (_ignoreNextUpdate) {
      _ignoreNextUpdate = false
      return
    }

    initialValue.value = JSON.parse(JSON.stringify(newBlock))
    innerBlock.value = JSON.parse(JSON.stringify(newBlock))

    definition.value = getBlockDefinition(newBlock)
    availableEditors.value = getBlockEditors(newBlock, { allowSource: true })

    if (!currentActionId.value) {
      currentActionId.value = availableEditors.value?.actions?.[0]?.id
    }
  },
  { immediate: true },
)

const currentAction = computed(() => {
  if (!availableEditors.value?.actions?.length) {
    return null
  }

  return availableEditors.value.actions.find((a) => a.id == currentActionId.value)
})

function emitUpdate() {
  _ignoreNextUpdate = true
  emit('update:block', innerBlock.value)
}

function accept() {
  emitUpdate()
  emit('accept', innerBlock.value)
  return true
}

function cancel() {
  innerBlock.value = { ...initialValue.value }
  emit('update:block', initialValue.value)
  emit('cancel', initialValue.value)
  return true
}

// Imitate <dialog> behavior:  focus first found input field
const refContents = ref()

onMounted(() => {
  if (!refContents.value) {
    return
  }
  // const foundInput = refContents.value.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  const foundInput = refContents.value.querySelector('.UiInput__element')
  if (foundInput) {
    foundInput.focus()
  }
})

const windowTitle = computed(() => {
  return i18n.obj(innerBlock.value?.title) || definition.value?.title
})
</script>

<template>
  <UiWindow
    name="phi"
    class="BlockWindow"
    @cancel="cancel"
    @submit.prevent="accept"
  >
    <template #header>
      <UiItem
        class="BlockWindow__headerItem"
        :icon="definition?.icon"
        :text="windowTitle"
      />
    </template>

    <template #controls>
      <UiDropdown>
        <template #trigger>
          <UiItem
            class="BlockWindow__pickerItem"
            :text="currentAction.title"
            icon="mdi:dots-vertical"
          />
        </template>
        <template #default="{ close }">
          <div class="BlockScaffold__actionList color-scheme-dark">
            <UiItem
              v-for="action in availableEditors.actions"
              :key="action.id"
              :text="action.title"
              :icon="action.icon"
              @click="currentActionId = action.id; emit('update:action-id', action.id); close();"
            />
          </div>
        </template>
      </UiDropdown>
    </template>

    <template #default>
      <div
        ref="refContents"
        class="BlockWindow__contents"
        :class="`BlockWindow__contents--${currentActionId}`"
      >
        <EditorAction
          v-if="currentAction"
          v-model:block="innerBlock"
          :action="currentAction"
          @update:block="emitUpdate()"
        />
      </div>
    </template>

    <template #footer="{ close }">
      <button
        type="submit"
        class="UiButton UiButton--main"
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
</template>

<style lang="scss">
@import '@/packages/ui/themes/base/modifiers/clickable.scss';

.BlockWindow {
  // --window-ridge-color: black;
  --window-ridge-color: #99999966;

  .UiWindow {
    &__header {
      border-bottom: 1px solid var(--window-ridge-color);
    }
  }

  &__headerItem {
    --ui-item-padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  &__contents {
    padding: 0.6em;
    height: 100%;
  }

  &__pickerItem {
    @extend .ui--clickable;
    --ui-item-padding: 6px 16px;

    margin-right: 0.5em;
    margin-bottom: -1px;
    padding-top: 8px;
    padding-bottom: 10px;
    margin-bottom: -5px;

    font-size: 0.8rem;
    font-weight: bold;

    border: 1px solid var(--window-ridge-color);
    border-bottom: 1px solid var(--ui-color-z2); // match .UiWindow__box background color

    border-radius: 5px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .UiIcon {
      order: 1;
    }
  }

  // Make sure the source editor stretches to the full window content
  .BlockWindow__contents--MediaHtmlCode,
  .BlockWindow__contents--BlockSource {
    padding: 0;
    .UiInputJson {
      height: 100%;
    }
    .UiInputCode {
      flex: 1;
      height: 100%;
      overflow: auto;
      & > div { //cm-editor
        height: 100%;
      }
    }
  }
}

// Disabled submit buttons on invalid forms
.BlockWindow:invalid {
  .UiWindow__footer {
    input[type=submit],
    button[type=submit] {
      opacity: 0.6;
    }
  }
}

</style>