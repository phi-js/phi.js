<script setup>
import { computed } from 'vue'

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
  const retval = props.items?.length ? props.items : []
  return retval.map((item) => ({
    ...item,
    isActive: window.location.toString().includes(item.href),
  }))
})
</script>

<template>
  <nav class="NavigationMenu">
    <div v-if="!sanitizedItems.length">
      No hay items
    </div>
    <a
      v-for="(item) in sanitizedItems"
      :key="item.href"
      class="NavigationMenu__item"
      :class="{'NavigationMenu__item--active': item.isActive}"
      v-bind="item"
      v-text="item.text"
    />
  </nav>
</template>

<style lang="scss">
.NavigationMenu {
  user-select: none;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

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