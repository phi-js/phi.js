<script>
let lastNavigationScrollLeft = 0
</script>

<script setup>
// https://www.designencyclopedia.io/element/walkthrough
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { UiItem } from '@/packages/ui'

const $nav = inject('$_cms_navigation')

const steps = computed(() => {
  const currentIndex = $nav.trail.value.findIndex((n) => n.id == $nav.currentPageId.value)
  return $nav.trail.value.map((item, i) => ({
    ...item,
    href: $nav.getPageHref(item.id),
    isCurrent: $nav.currentPageId.value == item.id,
    isVisited: $nav.history.value.findIndex((n) => n.pageId == item.id) > -1,
    dude: $nav.history.value.findIndex((n) => n.pageId == item.id),
    isPast: i < currentIndex,
  }))
})

const refEl = ref()

watch(
  $nav.currentPageId,
  () => {
    nextTick(() => {
      if (!refEl.value) {
        return
      }

      const currentItemRef = refEl.value.querySelector('.NavigationProgress__step--current')
      if (!currentItemRef?.scrollIntoView) {
        return
      }
      currentItemRef.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
      })
    })
  },
  { immediate: true },
)

// Remember previous scrollLeft
onBeforeUnmount(() => lastNavigationScrollLeft = refEl.value.scrollLeft)
onMounted(() => refEl.value.scrollLeft = lastNavigationScrollLeft)
</script>

<template>
  <nav
    ref="refEl"
    class="NavigationProgress"
  >
    <UiItem
      v-for="page in steps"
      :key="page.id"
      class="NavigationProgress__step"
      :class="{
        'NavigationProgress__step--current': page.isCurrent,
        'NavigationProgress__step--past': page.isPast,
        'NavigationProgress__step--future': !page.isPast,
        'NavigationProgress__step--seen': page.isVisited,
        'NavigationProgress__step--unseen': !page.isVisited,
      }"
      :href="page.href"
      :text="page.title"
      :title="page.title"
      :icon="page.isPast ? 'mdi:check' : 'mdi:circle'"
    />
  </nav>
</template>

<style lang="scss">
.NavigationProgress {
  --progress-icon-size: 24px;
  --progress-line-width: 6px;
  --progress-color-done: var(--ui-color-primary);
  --progress-color-pending: #ccc;

  position: relative;
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-end;

  padding: 8px 0;
  overflow-x: auto;

  &__step {
    min-width: 100px;

    flex: 1;
    color: inherit;
    font-size: 10pt;
    font-weight: bold;

    display: flex;
    flex-direction: column;
    align-items: center;

    padding: 8px;
    border-radius: 5px;

    .UiItem__body {
      width: 100%;
      text-align: center;
      padding: 0 12%;
    }

    .UiItem__icon {
      margin-bottom: 6px;
      width: var(--progress-icon-size);
      height: var(--progress-icon-size);
      border-radius: 50%;

      border: 3px solid var(--ui-color-primary);
      background: var(--ui-color-primary);
      color: #fff;

      z-index: 1;
    }

    // left/right lines
    &::before,
    &::after {
      content: '';
      position: absolute;
      display: block;
      width: 50%;
      height: var(--progress-line-width);
      top: calc(var(--progress-icon-size)/2 - var(--progress-line-width)/2 + 8px);
    }

    &::before {
      left: 0;
    }
    &::after {
      right: 0;
    }

    &:first-child::before {
      display: none;
    }
    &:last-child::after {
      display: none;
    }

    &:hover {
      background-color: var(--ui-color-hover);
    }

    &--past {
      &::before, &::after {
        background: var(--progress-color-done);
      }
    }

    &--future {
      .UiItem__icon {
        background-color: var(--progress-color-pending);
        border-color: var(--progress-color-pending);
        color: var(--ui-color-background);
      }

      &::before, &::after {
        background: var(--progress-color-pending);
      }
    }

    &--current {
      .UiItem__icon {
        background-color: var(--ui-color-background);
        border-color: var(--progress-color-done);
        color: var(--progress-color-done);
      }

      &::before {
        background: var(--progress-color-done);
      }
      &::after {
        background: var(--progress-color-pending);
      }
    }

    /* enable/disable according to history */
    &--unseen {
      pointer-events: none;
    }

    &--seen {
      .UiItem__icon {
        color: var(--progress-color-done);
      }
    }
  }
}
</style>