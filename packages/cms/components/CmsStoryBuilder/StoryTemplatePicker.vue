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
</template>

<style lang="scss">
.StoryTemplatePicker {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 12px;

  padding: 12vh 8px;
}

.StoryTemplate {
  border: 2px solid #ccc;
  border-radius: 5px;
  padding: 24px;

  width: 222px;
  height: 240px;

  .UiIcon {
    display: flex;
    margin: auto;
    font-size: 50px;
    margin: 2rem 0;
  }

  h1 {
    font-size: 1.3rem;
  }

  h1, p {
    margin: 0;
    text-align: center;
  }

  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: var(--ui-color-hover);
  }
}
</style>