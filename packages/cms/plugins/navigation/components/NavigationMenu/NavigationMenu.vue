<script setup>
import { inject, computed } from 'vue'

const $nav = inject('$_cms_navigation', null)

const props = defineProps({
  /*
  Array of navigation items:
  {
    href: '', (required)
    text: '',

    ... all attributes to be bound to <a>
    target: '',
    title: '',
    ...
  }
  */
  items: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const sanitizedItems = computed(() => {
  const retval = props.items?.length
    ? props.items
    : $nav.graph.value.nodes.map((node) => ({
      pageId: node.id,
      text: node.title,
    }))

  return retval.map((item) => ({
    ...item,
    href: $nav.getPageHref(item.pageId),
    isActive: $nav.currentPageId.value == item.pageId,
  }))
})
</script>

<template>
  <nav class="NavigationMenu">
    <div v-if="!sanitizedItems.length">
      No hay items
    </div>
    <template
      v-for="(item, k) in sanitizedItems"
      :key="k"
    >
      <a
        v-if="item.href"
        class="NavigationMenu__item"
        :class="{'NavigationMenu__item--active': item.isActive}"
        v-bind="item"
        v-text="item.text"
      />
      <a
        v-else
        :href="`#/${item.pageId}`"
        class="NavigationMenu__item"
        :class="{'NavigationMenu__item--active': item.isActive}"
        @click.prevent="$nav.goTo(item.pageId)"
        v-text="item.text"
      />
    </template>
  </nav>
</template>

<style lang="scss">
.NavigationMenu {
  user-select: none;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: inherit;

  overflow-x: auto;
  padding-bottom: 4px;

  &__item {
    white-space: nowrap;

    display: block;
    padding: 8px 16px;
    color: inherit;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }

    &--active {
      color: var(--ui-color-primary);

      position: relative;
      &::after {
        content: '';
        display: block;
        width: 40px;
        height: 0;
        border: 2px solid var(--ui-color-primary);
        border-radius: 2px;

        position: absolute;
        bottom: 0;
        left: calc(50% - 22px);
      }
    }
  }
}
</style>