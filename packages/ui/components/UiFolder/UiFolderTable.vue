<script setup>
/*
DUMB component to display sections in a table
*/
import { computed, ref } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiItem } from '../UiItem'
import { UiDialog } from '../UiDialog'

const i18n = useI18n()

const props = defineProps({
  /*
  An array of sanitized, filtered, and ordered SECTION objects
  */
  sections: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const itemCount = computed(() => {
  return props.sections.map((section) => section.items.filter((i) => i.type == 'interface').length)
})
</script>

<template>
  <table
    class="UiFolderTable"
    cellspacing="0"
    cellpadding="0"
  >
    <tbody>
      <template
        v-for="(section, s) in sections"
        :key="s"
      >
        <!-- Section label -->
        <tr
          v-if="section.text"
          class="UiFolderTable__sectionRow"
        >
          <td>
            <label class="UiFolderTable__sectionLabel">{{ section.text }}</label>
          </td>
          <td><span v-if="itemCount[s]">{{ i18n.t('UiFolder.dateModified') }}</span></td>
          <td />
        </tr>

        <!-- Adder item -->
        <tr
          v-if="section.creator?.component"
          class="UiFolderTable__adderRow"
        >
          <td>
            <UiDialog>
              <template #trigger>
                <UiItem
                  class="UiFolderTable__item UiFolderTable__item--adder"
                  :icon="section.creator.icon || 'mdi:plus'"
                  :text="section.creator.label || 'Create'"
                />
              </template>
              <template #default="{ close }">
                <div class="UiFolderTable__dialogBody">
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
          </td>
          <td />
          <td />
        </tr>

        <tr
          v-for="(item, i) in section.items"
          :key="`${item.path}${i}`"
          class="UiFolderTable__itemRow"
          :class="item.class"
        >
          <td>
            <UiItem
              class="UiFolderTable__item"
              :class="`UiFolderTable__item--${item.type}`"
              v-bind="item.data"
              :icon="item.data.thumbnail || item.data.icon"
              subtext=""
            />
          </td>
          <td>
            {{ item.data.dateModified
              ? i18n.date(item.data.dateModified, {month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})
              : (item.type == 'interface' ? '---' : '')
            }}
          </td>
          <td class="UiFolderTable__actionsCell">
            <slot
              name="actions"
              :item="item"
            />
          </td>
        </tr>

        <tr class="UiFolderTable__sectionBottomRow">
          <td colspan="3" />
        </tr>
      </template>
    </tbody>
  </table>
</template>

<style lang="scss">
.UiFolderTable {
  --ui-item-padding: 8px 10px;
  width: 100%;
  font-weight: bold;

  thead {
    position: sticky;
    top: 0;
  }

  th {
    text-align: left;
    padding: 4px;
    font-size: 0.9rem;
  }

  td {
    border-bottom: 1px solid var(--ui-color-hover);
  }

  &__itemRow:hover {
    background-color: var(--ui-color-hover);
  }

  &__sectionRow {
    position: sticky;
    top: 0;
    background-color: var(--ui-color-background);
    z-index: 2;

    td {
      border: 0;
      // padding: 0.6rem 0;
    }
  }

  &__sectionBottomRow {
    td {
      height: 32px;
      border: 0;
    }
  }

  &__actionsCell {
    width: 10px;
    padding: 6px;
  }

  &__item--interface {
    .UiItem__icon {
      width: 100px;
      height: 55px;
      border-radius: 4px;
      overflow: hidden;

      .UiIcon__image {
        background-size: cover !important;
      }
    }
  }

  &__adderRow {
    td {
      border: 0;
      padding-bottom: 6px;
    }
  }

  &__item--adder {
    display: inline-flex;
    user-select: none;
    background-color: transparent;
    border: 2px dashed var(--ui-color-hover);
    border-radius: 5px;

    min-width: 275px;
    --ui-item-padding: 2px;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }

    .UiItem__text {
      font-size: 0.9rem;
    }

    .UiItem__icon {
      color: var(--ui-color-primary);
      width: 36px;
      height: 36px;
    }
  }

}
</style>