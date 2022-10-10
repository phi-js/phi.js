<script setup>
import { ref, shallowRef, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiWindow, UiDrawerStack, UiTab, UiItem } from '@/packages/ui'
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
    innerBlock.value = { ...initialValue.value }

    definition.value = getBlockDefinition(newBlock)
    availableEditors.value = getBlockEditors(newBlock, { allowSource: true })

    if (!currentActionId.value) {
      currentActionId.value = availableEditors.value?.actions?.[0]?.id
    }
  },
  { immediate: true },
)

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
  innerBlock.value = initialValue.value
  emit('update:block', initialValue.value)
  emit('cancel', initialValue.value)
  return true
}
</script>

<template>
  <UiWindow
    name="phi_block"
    class="BlockWindow"
    @cancel="cancel"
  >
    <template #header>
      <UiItem
        class="BlockWindow__header"
        :icon="definition?.icon"
        :text="innerBlock?.title || definition?.title"
      />
    </template>

    <template #default>
      <div class="BlockWindow__contents">
        <UiDrawerStack
          v-model="currentActionId"
          class="BlockWindow__tabs"
          @update:model-value="emit('update:action-id', $event)"
        >
          <UiTab
            v-for="(action) in availableEditors.actions"
            :key="action.id"
            :value="action.id"
            :text="i18n.t(`BlockScaffold.action.${action.id}`, null, action.title)"
            :icon="action.icon || 'mdi:star'"
          >
            <EditorAction
              v-model:block="innerBlock"
              :class="['BlockWindow__action', `BlockWindow__action--${action.id}`]"
              :action="action"
              @update:block="emitUpdate()"
            />
          </UiTab>
        </UiDrawerStack>
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