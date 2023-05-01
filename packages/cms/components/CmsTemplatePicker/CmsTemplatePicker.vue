<script setup>
import { computed, onMounted, ref, shallowRef } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiIcon, UiDialog } from '@/packages/ui'

import { getProvidedTemplates } from '../../functions/provideTemplates.js'
import hardcodedTemplates from './templates'

const i18n = useI18n()

const emit = defineEmits(['input'])

const stagingComponent = shallowRef()
const stagingComponentProps = shallowRef()

const providedTemplates = ref([])

onMounted(async () => providedTemplates.value = await getProvidedTemplates())

const availableTemplates = computed(() => [
  ...providedTemplates.value,
  ...hardcodedTemplates,
])


function selectTemplate(template) {
  if (template.component) {
    stagingComponent.value = template.component
    stagingComponentProps.value = template.props
    return
  }

  emit('input', JSON.parse(JSON.stringify(template)))
}

function onStagingAccept($event) {
  if (Array.isArray($event?.pages)) {
    emit('input', $event)
    return
  }

  const finalStory = {
    id: 'imported',
    pages: [
      {
        component: 'LayoutPage',
        slots: { default: [$event] },
        id: 'page-1',
        title: 'page-1',
        hash: 'page-1',
      },
    ],
  }

  emit('input', finalStory)
  return true
}
</script>

<template>
  <div class="CmsTemplatePicker">
    <div class="CmsTemplatePicker__list">
      <div
        v-for="(template,i) in availableTemplates"
        :key="i"
        class="StoryTemplate"
        @click="selectTemplate(template)"
      >
        <UiIcon :src="template.icon" />
        <h1 v-text="i18n.obj(template.title)" />
        <p
          v-if="template.subtext"
          v-text="i18n.obj(template.subtext)"
        />
      </div>
    </div>

    <UiDialog
      v-if="stagingComponent"
      v-slot="{ close }"
      :open="true"
      class="CmsTemplatePicker__dialog"
      @cancel="stagingComponent = null"
    >
      <Component
        :is="stagingComponent"
        v-bind="stagingComponentProps"
        @input="onStagingAccept($event) && close()"
        @cancel="close()"
      />
    </UiDialog>
  </div>
</template>

<style lang="scss">
.CmsTemplatePicker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 4vw 12px;

  &__list {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    & > * {
      flex: 1;
      min-width: 222px;
    }
  }
}

.StoryTemplate {
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 24px;

  .UiIcon {
    display: flex;
    margin: auto;
    font-size: 2rem;
    margin: 1rem 0;
  }

  h1, p {
    margin: 0;
    text-align: center;
  }

  h1 {
    font-size: 1.2rem;
  }

  p {
    font-size: 0.8em;
  }

  cursor: pointer;
  user-select: none;
  opacity: 0.75;

  &:hover {
    background-color: var(--ui-color-hover);
    opacity: 1;
  }
}
</style>