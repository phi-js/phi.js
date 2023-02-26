<script setup>
import { UiIcon } from '@/packages/ui'
import availableTemplates from './templates'
const emit = defineEmits(['input'])

function selectTemplate(template) {
  emit('input', JSON.parse(JSON.stringify(template)))
}
</script>

<template>
  <div class="StoryTemplatePicker">
    <div class="StoryTemplatePicker__list">
      <div
        v-for="(template,i) in availableTemplates"
        :key="i"
        class="StoryTemplate"
        @click="selectTemplate(template)"
      >
        <UiIcon :src="template.icon" />
        <h1 v-text="template.title" />
        <p
          v-if="template.subtext"
          v-text="template.subtext"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.StoryTemplatePicker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding: 12vh 8px;

  &__list {
    display: flex;
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