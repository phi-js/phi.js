<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiItem, UiIcon, UiDropdown } from '@/packages/ui'
import { getBlockEditors } from '../../functions'

const i18n = useI18n({
  en: { 'StoryPageToolbar.Delete': 'Delete' },
  es: { 'StoryPageToolbar.Delete': 'Eliminar' },
})

const props = defineProps({
  /*
  Block object (for the page.  i.e. {component: LayoutPage})
  */
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['click', 'delete', 'click-action'])

const blockEditors = computed(() => getBlockEditors(props.modelValue, { allowSource: true }))

const shortcuts = computed(() => blockEditors.value.actions.filter((a) => a.hasData))

const innerBlock = ref()
watch(
  () => props.modelValue,
  (newValue) => innerBlock.value = newValue,
  { immediate: true },
)

function onClickAction(action) {
  emit('click-action', action.id)
}
</script>

<template>
  <div class="StoryPageToolbar">
    <!-- shortcut icons -->
    <UiIcon
      v-for="action in shortcuts"
      :key="action.id"
      :src="action.icon"
      :title="action.description"
      :class="`BlockScaffold__shortcut BlockScaffold__action--${action.id}`"
      @click.stop="onClickAction(action)"
    />

    <UiDropdown>
      <template #trigger>
        <UiIcon
          src="mdi:dots-vertical"
          class="CmsStoryBuilder__controlItem"
        />
      </template>
      <template #default="{ close }">
        <div class="BlockScaffold__actionList color-scheme-dark">
          <UiItem
            v-for="action in blockEditors.actions"
            :key="action.id"
            :text="action.title"
            :icon="action.icon"
            :class="`BlockScaffold__action BlockScaffold__action--${action.id}`"
            @click="close(); onClickAction(action);"
          />
          <UiItem
            class="BlockScaffold__action BlockScaffold__action--delete"
            icon="mdi:close"
            :text="i18n.t('StoryPageToolbar.Delete')"
            @click="close(); emit('delete');"
          />
        </div>
      </template>
    </UiDropdown>
  </div>
</template>

<style lang="scss">
.StoryPageToolbar {
  display: flex;
  align-items: stretch;

  &__face {
    border-right: 1px solid var(--ui-color-ridge-right, #ccc);
  }

  .UiDropdown__trigger {
    border-right: 1px solid var(--ui-color-ridge-right, #ccc);
    height: 100%;
  }
}
</style>