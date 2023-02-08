<script setup>
import { computed, ref, shallowRef, watch } from 'vue'
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
</script>

<template>
  <UiWindow
    name="phi"
    class="BlockWindow"
    @cancel="cancel"
  >
    <template #header>
      <UiItem
        class="BlockWindow__headerItem"
        :icon="definition?.icon"
        :text="(innerBlock?.title || definition?.title)"
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
              @click="emit('update:action-id', action.id); close();"
            />
          </div>
        </template>
      </UiDropdown>
    </template>

    <template #default>
      <div class="BlockWindow__contents">
        <EditorAction
          v-if="currentAction"
          v-model:block="innerBlock"
          :class="['BlockWindow__action', `BlockWindow__action--${currentAction.id}`]"
          :action="currentAction"
          @update:block="emitUpdate()"
        />
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
</template>

<style lang="scss">
@import '@/packages/ui/themes/base/modifiers/clickable.scss';

.BlockWindow {
  // --window-ridge-color: black;
  --window-ridge-color: #99999966;

  .UiWindow {
    &__header {
      border-bottom: 1px solid var(--window-ridge-color);
      padding-bottom: 0;
    }
  }


  &__headerItem {
    --ui-item-padding: 6px 12px;
    font-size: 0.8rem;
    font-weight: bold;
  }

  &__contents {
    padding: 0.6em;
  }

  &__pickerItem {
    @extend .ui--clickable;
    --ui-item-padding: 6px 12px;

    margin-right: 1em;
    margin-bottom: -1px;
    padding-top: 7px;

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
}
</style>