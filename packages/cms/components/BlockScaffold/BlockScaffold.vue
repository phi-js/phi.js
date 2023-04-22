<script setup>
import { computed, inject, onBeforeUnmount, onMounted, ref } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiItem, UiIcon, UiDropdown } from '@/packages/ui'
import { getBlockDefinition, getBlockEditors } from '../../functions'

import { getPluginData } from '../../functions'
const pluginData = getPluginData()

const i18n = useI18n({
  en: {
    'BlockScaffold.Delete': 'Delete',
    'BlockScaffold.InsertBlockBefore': 'Insert block before',
    'BlockScaffold.InsertBlockAfter': 'Insert block after',
    'BlockScaffold.MoveUp': 'Move up',
    'BlockScaffold.MoveDown': 'Move down',
  },
  es: {
    'BlockScaffold.Delete': 'Eliminar',
    'BlockScaffold.InsertBlockBefore': 'Insertar bloque antes',
    'BlockScaffold.InsertBlockAfter': 'Insertar bloque después',
    'BlockScaffold.MoveUp': 'Move hacia arriba',
    'BlockScaffold.MoveDown': 'Move hacia abajo',
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

const emit = defineEmits(['select', 'delete', 'open-editor', 'insert-sibling', 'move-up', 'move-down'])

const definition = getBlockDefinition(props.block)
const availableActions = computed(() => getBlockEditors(props.block, { allowSource: true }).actions)
const shortcuts = computed(() => availableActions.value.filter((a) => a.hasData))

function emitSelect(evt) {
  evt.stopPropagation()
  if (props.selected) {
    return
  }
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


/*
Apply all basic display properties of the default slot
into the container element. (display, flex, width, height)
*/

const refSlot = ref()
const stylesInChild = ref()

function getChildStyles() {
  if (!refSlot.value) {
    return null
  }

  const elementInSlot = refSlot.value.querySelector('.BlockScaffold__toolbar-container + *') /// FIX THIS, set correct selector
  if (!elementInSlot) {
    return null
  }

  const elementStyle = getComputedStyle(elementInSlot)
  stylesInChild.value = {
    display: elementInSlot.tagName == 'IFRAME' ? 'block' : elementStyle.display,
    flex: elementStyle.flex,
    alignSelf: elementStyle.alignSelf,
    float: elementStyle.float,

    // These mess up LayoutGroup blocks:
    // alignItems: elementStyle.alignItems,
    // justifyContent: elementStyle.justifyContent,

    // ...props.block?.props?.style,
  }
}

const mutationObserver = new MutationObserver(getChildStyles)

const refToolbar = ref()

onMounted(() => {
  /// !!! Black magic.  Teleport the toolbar into CsmStoryBuilder
  document.getElementById('omg-testing').appendChild(refToolbar.value)

  getChildStyles()
  mutationObserver.observe(refSlot.value, {
    childList: true,
    attributes: true,
    subtree: false,
  })
})

onBeforeUnmount(() => {
  refToolbar.value.remove()
})
</script>

<template>
  <div
    ref="refSlot"
    class="BlockScaffold"
    :class="[
      'BlockScaffold--'+props.block.component,
      `BlockScaffold--${direction}`,
      {'BlockScaffold--selected': props.selected},
    ]"
    tabindex="0"
    :style="stylesInChild"
    @click.stop.prevent="emitSelect"
    @focus="emitSelect"
  >
    <div
      ref="refToolbar"
      class="BlockScaffold__toolbar-wrap"
    >
      <div
        v-if="selected"
        class="BlockScaffold__toolbar"
      >
        <div class="BlockScaffold__toolbarScroll">
          <UiItem
            class="BlockScaffold__titleItem"
            :icon="definition?.icon"
            :text="props.block.title || definition?.title || props.block.component"
          />
          <!-- Custom block toolbar -->
          <slot name="toolbar" />

          <!-- shortcut icons -->
          <UiIcon
            v-for="action in shortcuts"
            :key="action.id"
            :src="action.icon"
            :title="action.description"
            :class="`BlockScaffold__button BlockScaffold__button--shortcut BlockScaffold__action--${action.id}`"
            @click.stop="emit('open-editor', action.id)"
          />
        </div>

        <!-- Available actions dropdown -->
        <UiDropdown>
          <template #trigger>
            <UiIcon
              class="BlockScaffold__button"
              src="mdi:dots-vertical"
            />
          </template>
          <template #default="{close}">
            <div class="BlockScaffold__actionList color-scheme-dark">
              <UiItem
                v-for="action in availableActions"
                :key="action.id"
                :icon="action.icon"
                :text="action.title"
                :class="`BlockScaffold__action BlockScaffold__action--${action.id}`"
                @click.stop="emit('open-editor', action.id); close();"
              />

              <Component
                :is="pluginData.getSlotComponent('BlockMenu')"
                :block="props.block"
                :close="close"
              />

              <UiItem
                class="BlockScaffold__action BlockScaffold__action--delete"
                icon="mdi:close"
                :text="i18n.t('BlockScaffold.Delete')"
                @click="emit('delete'); close()"
              />
            </div>
          </template>
        </UiDropdown>


        <!-- Mode UP/DOWN buttons -->
        <UiIcon
          class="BlockScaffold__button BlockScaffold__button--move-up"
          src="mdi:arrow-up-thick"
          style="margin-left:auto"
          :title="i18n.t('BlockScaffold.MoveUp')"
          @click="emit('move-up')"
        />

        <UiIcon
          class="BlockScaffold__button  BlockScaffold__button--move-down"
          src="mdi:arrow-down-thick"
          :title="i18n.t('BlockScaffold.MoveDown')"
          @click="emit('move-down')"
        />
      </div>
    </div>

    <div
      v-if="selected"
      class="BlockScaffold__dragbar-wrap"
    >
      <div class="BlockScaffold__dragbar">
        <div class="BlockScaffold__dragItem color-scheme-dark">
          <UiItem
            class="BlockScaffold__dragHandle"
            icon="mdi:drag"
            :text="props.block.title || definition?.title || props.block.component"
          />

          <!-- shortcut icons -->
          <UiIcon
            v-for="action in shortcuts"
            :key="action.id"
            :src="action.icon"
            :title="action.description"
            :class="`BlockScaffold__button BlockScaffold__button--shortcut BlockScaffold__action--${action.id}`"
            @click.stop="emit('open-editor', action.id)"
          />

          <!-- Available actions dropdown -->
          <UiDropdown>
            <template #trigger>
              <UiIcon
                class="BlockScaffold__button"
                src="mdi:dots-vertical"
              />
            </template>
            <template #default="{close}">
              <div class="BlockScaffold__actionList color-scheme-dark">
                <UiItem
                  v-for="action in availableActions"
                  :key="action.id"
                  :icon="action.icon"
                  :text="action.title"
                  :class="`BlockScaffold__action BlockScaffold__action--${action.id}`"
                  @click.stop="emit('open-editor', action.id); close();"
                />

                <Component
                  :is="pluginData.getSlotComponent('BlockMenu')"
                  :block="props.block"
                  :close="close"
                />

                <UiItem
                  class="BlockScaffold__action BlockScaffold__action--delete"
                  icon="mdi:close"
                  :text="i18n.t('BlockScaffold.Delete')"
                  @click="emit('delete'); close()"
                />
              </div>
            </template>
          </UiDropdown>
        </div>

        <UiItem
          v-if="parent"
          class="BlockScaffold__parent"
          icon="mdi:chevron-up"
          :title="parent.innerBlock.value.title || parent.definition?.title || parent.innerBlock.value.component"
          @click.stop.prevent="parent.selectBlock()"
        />
      </div>
    </div>

    <slot />

    <div
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