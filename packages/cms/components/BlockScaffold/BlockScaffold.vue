<script setup>
import { computed, inject } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiItem, UiIcon, UiDropdown } from '@/packages/ui'
import { getBlockDefinition, getBlockEditors } from '../../functions'

const i18n = useI18n({
  en: {
    'BlockScaffold.Delete': 'Delete',
    'BlockScaffold.InsertBlockBefore': 'Insert block before',
    'BlockScaffold.InsertBlockAfter': 'Insert block after',
  },
  es: {
    'BlockScaffold.Delete': 'Eliminar',
    'BlockScaffold.InsertBlockBefore': 'Insertar bloque antes',
    'BlockScaffold.InsertBlockAfter': 'Insertar bloque después',
  },
})

const props = defineProps({
  block: {
    type: Object,
    required: true,
  },

  selected: {
    type: Boolean,
    required: false,
    default: false,
  },

  direction: {
    type: String,
    required: false,
    default: 'vertical', // vertical | horizontal
  },
})

const emit = defineEmits(['select', 'delete', 'open-editor', 'insert-sibling'])

const definition = getBlockDefinition(props.block)
const availableActions = computed(() => getBlockEditors(props.block, { allowSource: true }).actions)
const shortcuts = computed(() => availableActions.value.filter((a) => a.hasData))

function emitSelect(evt) {
  evt.stopPropagation()
  emit('select')
}

/* Find the chain of SlotItem parents */
const curSlotItem = inject('_cms_SlotItem', null)
const parent = curSlotItem?.parent
// const ancestry = []
// let curParent = parentSlotItem?.parent
// while (curParent.parent) {
//   curParent = curParent.parent
//   ancestry.unshift(curParent)
// }
</script>

<template>
  <div
    class="BlockScaffold"
    :class="[
      'BlockScaffold--'+props.block.component,
      `BlockScaffold--${direction}`,
      {'BlockScaffold--selected': props.selected},
      props.block.props?.class,
    ]"
    :style="props.block.props?.style"
    tabindex="0"
    @click="emitSelect"
    @focus="emitSelect"
  >
    <div class="BlockScaffold__toolbar-container">
      <div class="BlockScaffold__label">
        {{ props.block.title || definition?.title || props.block.component }}
      </div>

      <template v-if="selected">
        <UiItem
          v-if="parent"
          class="BlockScaffold__parent"
          icon="mdi:chevron-up"
          :title="parent.innerBlock.value.title || parent.definition.title || parent.innerBlock.value.component"
          @click.stop.prevent="parent.selectBlock()"
        />

        <div class="BlockScaffold__toolbar color-scheme-dark">
          <UiItem
            class="BlockScaffold__dragHandle"
            icon="mdi:drag"
            :text="$slots.toolbar ? '' : props.block.title || definition?.title || props.block.component"
          />
          <!-- custom toolbar component -->
          <slot name="toolbar" />

          <div class="BlockScaffold__separator" />

          <!-- shortcut icons -->
          <UiIcon
            v-for="action in shortcuts"
            :key="action.id"
            :src="action.icon"
            :title="action.description"
            class="BlockScaffold__shortcut"
            @click.stop="emit('open-editor', action.id)"
          />

          <!-- Available actions dropdown -->
          <UiDropdown>
            <template #trigger>
              <UiItem
                class="BlockScaffold__menuBtn"
                icon="mdi:dots-vertical"
              />
            </template>
            <template #default="{close}">
              <div class="BlockScaffold__actionList">
                <UiItem
                  v-for="action in availableActions"
                  :key="action.id"
                  :icon="action.icon"
                  :text="action.title"
                  @click.stop="emit('open-editor', action.id); close();"
                />
                <UiItem
                  icon="mdi:close"
                  :text="i18n.t('BlockScaffold.Delete')"
                  @click="emit('delete'); close()"
                />
              </div>
            </template>
          </UiDropdown>
        </div>
      </template>

      <div
        v-if="direction == 'vertical'"
        class="BlockScaffold__launcher BlockScaffold__launcher--before"
        :title="i18n.t('BlockScaffold.InsertBlockBefore')"
        @click="emit('insert-sibling', 'before')"
      >
        +
      </div>
    </div>

    <slot />

    <div
      v-if="direction == 'horizontal'"
      class="BlockScaffold__launcher BlockScaffold__launcher--before"
      :title="i18n.t('BlockScaffold.InsertBlockBefore')"
      @click="emit('insert-sibling', 'before')"
    >
      +
    </div>

    <div
      class="BlockScaffold__launcher BlockScaffold__launcher--after"
      :title="i18n.t('BlockScaffold.InsertBlockAfter')"
      @click="emit('insert-sibling', 'after')"
    >
      +
    </div>
  </div>
</template>