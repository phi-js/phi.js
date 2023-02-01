<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from '@/packages/i18n'
import { UiItem, UiIcon, UiDropdown } from '@/packages/ui'
import { getBlockEditors } from '../../functions'

const i18n = useI18n({
  en: { 'StoryPageItem.Delete': 'Delete' },
  es: { 'StoryPageItem.Delete': 'Eliminar' },
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
  <div class="StoryPageItem">
    <UiItem
      class="CmsStoryBuilder__clickable"
      icon="mdi:file"
      :text="innerBlock.title || innerBlock.hash || innerBlock.id"
      @click="emit('click', $event)"
    >
      <template #actions>
        <UiIcon
          src="mdi:chevron-down"
          @click="emit('click', $event)"
        />
      </template>
    </UiItem>

    <UiDropdown>
      <template #trigger>
        <UiIcon
          src="mdi:dots-vertical"
          class="CmsStoryBuilder__controlItem"
        />
      </template>
      <template #default="{ close }">
        <div class="BlockScaffold__popover color-scheme-dark">
          <UiItem
            v-for="action in blockEditors.actions"
            :key="action.id"
            :text="action.title"
            :icon="action.icon"
            @click="close(); onClickAction(action);"
          />
          <UiItem
            icon="mdi:close"
            :text="i18n.t('StoryPageItem.Delete')"
            @click="close(); emit('delete');"
          />
        </div>
      </template>
    </UiDropdown>
  </div>
</template>

<style lang="scss">
.StoryPageItem {
  display: inline-flex;
  align-items: stretch;

  .UiDropdown__trigger {
    border-left: 1px solid var(--ui-color-ridge-left, #cccccc77);
    border-right: 1px solid var(--ui-color-ridge-right, #ccc);

    height: 100%;
  }
}
</style>