<script setup>
/*
DUMB component to display sections in a grid
*/

import { UiItem } from '../UiItem'
import { UiDialog } from '../UiDialog'

defineProps({
  /*
  An array of sanitized, filter, SECTION objects
  */
  sections: {
    type: Array,
    required: false,
    default: () => [],
  },
})
</script>

<template>
  <div class="UiFolderGrid">
    <section
      v-for="(section, s) in sections"
      :key="s"
      class="UiFolderGrid__section"
      :class="`UiFolderGrid__section--${section.match?.type}`"
    >
      <label
        v-if="section.text"
        class="UiFolderGrid__sectionLabel"
      >{{ section.text }}</label>

      <div class="UiFolderGrid__sectionBody">
        <!-- Adder item -->
        <div
          v-if="section.creator?.component"
          class="UiFolderGrid__item UiFolderGrid__item--adder"
        >
          <UiDialog>
            <template #trigger>
              <UiItem
                class="UiFolderGrid__uiItem"
                :icon="section.creator.icon || 'mdi:plus'"
                :text="section.creator.label || 'Create'"
              />
            </template>
            <template #default="{ close }">
              <div class="UiFolderGrid__dialogBody">
                <Component
                  :is="section.creator.component"
                  v-bind="section.creator.props"
                  @input="close()"
                  @cancel="close()"
                />
              </div>
            </template>
            <template #footer>
              <span />
            </template>
          </UiDialog>
        </div>

        <slot
          v-for="(item, i) in section.items"
          :key="item.path + i"
          name="item"
          :item="item"
        >
          <a
            class="UiFolderGrid__item"
            :class="item.class"
            :href="item.data?.href"
            :target="item.data?.target"
          >
            <UiItem
              class="UiFolderGrid__uiItem"
              v-bind="item.data"
              subtext=""
              href=""
              target=""
            >
              <template #actions>
                <slot
                  name="actions"
                  :item="item"
                />
              </template>
            </UiItem>
            <div
              v-if="item.data?.thumbnail"
              class="UiFolderGrid__itemThumbnail"
            >
              <img
                :src="item.data?.thumbnail"
                :alt="item.data?.text"
              >
            </div>
          </a>
        </slot>
      </div>
    </section>
  </div>
</template>

<style lang="scss">
.UiFolderGrid {
  &__section {
    margin-bottom: 38px;
  }

  &__sectionLabel {
    position: sticky;
    top: 0;
    z-index: 2;
    background-color: var(--ui-color-background);
  }

  &__sectionBody {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: repeat(auto-fill,minmax(220px,1fr));
  }

  &__item {
    background-color: var(--ui-color-hover);
    border-radius: 4px;
    border: 2px solid transparent;
    color: inherit;

    display: flex;
    flex-direction: column;
    max-height: 190px;

    &--adder {
      border: 2px dashed var(--ui-color-hover);
      background-color: transparent;

      cursor: pointer;
      &:hover {
        background-color: var(--ui-color-hover);
      }
    }
  }

  &__uiItem {
    --ui-item-padding: 2px;

    .UiItem__body:first-child { // item body when NO icon is set
      padding-left: 8px;
    }

    .UiItem__text {
      font-size: 0.9rem;
      font-weight: bold;
    }

    .UiItem__icon {
      color: var(--ui-color-primary);
      width: 36px;
      height: 36px;
    }
  }

  &__itemThumbnail {
    overflow: hidden;
    margin: 4px;
    border-radius: 4px;

    img {
      max-width: 100%;
    }
  }

  &__item--adder {
    .UiDialog,
    .UiDialog__trigger,
    .UiDialog__trigger .UiItem {
      height: 100%;
    }
  }

  &__section--interface {
    .UiDialog__trigger .UiItem {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      min-height: 110px;

      &__body {
        flex: none;
      }

      &__icon {
        font-size: 28px;
        padding: 10px;
      }
    }
  }
}
</style>