<script setup>
import { ref, watchEffect } from 'vue'
import { useI18n } from '../../../i18n'
import { UiWindow, UiTabs, UiTab } from '../../../ui'
import { VmStatement } from '../../../vm/components'
import StoryDictionaryEditor from './StoryDictionaryEditor.vue'
import CssClassManager from '../CssClassManager/CssClassManager.vue'

const props = defineProps({
  /*
  STORY object
  (assert: story IS sanitized, therefore its safe to assume array story.css.classes)
  */
  story: {
    type: Object,
    required: true,
  },
})
const emit = defineEmits(['update:story', 'accept', 'cancel'])

const innerStory = ref()
watchEffect(() => innerStory.value = { ...props.story })

function emitUpdate() {
  emit('update:story', { ...innerStory.value })
}

function accept() {
  emit('accept')
  return true
}

function cancel() {
  emit('cancel')
  return true
}

const currentTab = ref()

const i18n = useI18n({
  en: {
    'CmsStoryWindow.style': 'Style',
    'CmsStoryWindow.events': 'Events',
    'CmsStoryWindow.i18n': 'Dictionary',
  },
})
</script>

<template>
  <UiWindow class="CmsStoryWindow">
    <template #default>
      <UiTabs
        v-model="currentTab"
      >
        <UiTab
          value="style"
          icon="mdi:palette-advanced"
          :text="i18n.t('CmsStoryWindow.style')"
        >
          <CssClassManager
            v-model="innerStory.css.classes"
            @update:modelValue="emitUpdate()"
          />
        </UiTab>

        <UiTab
          value="events"
          icon="mdi:gesture-tap"
          :text="i18n.t('CmsStoryWindow.events')"
        >
          <div class="UiForm">
            <fieldset>
              <legend>setup()</legend>
              <VmStatement
                v-model="innerStory.setup"
                :default="{chain:[]}"
                @update:modelValue="emitUpdate()"
              />
            </fieldset>
          </div>
        </UiTab>

        <UiTab
          value="i18n"
          icon="mdi:translate"
          :text="i18n.t('CmsStoryWindow.i18n')"
        >
          <StoryDictionaryEditor
            v-model:story="innerStory"
            @update:modelValue="emitUpdate()"
          />
        </UiTab>
      </UiTabs>
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
</template>