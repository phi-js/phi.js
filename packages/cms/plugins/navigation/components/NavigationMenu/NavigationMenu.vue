<script setup>
const props = defineProps({
  /*
  Array of navigation items:
  {
    href: '', (required)
    text: '',

    ... all attributes to be bound to <a>
    target: '',
    titile: '',
    ...
  }
  */
  items: {
    type: Array,
    required: false,
    default: () => [],
  },
})
</script>

<template>
  <nav class="NavigationMenu">
    <div v-if="!props.items?.length">
      No hay items
    </div>
    <a
      v-for="(item) in props.items"
      :key="item.href"
      class="NavigationMenu__item"
      v-bind="item"
      v-text="item.text"
    />
  </nav>
</template>

<style lang="scss">
.NavigationMenu {
  user-select: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  &__item {
    display: block;
    color: inherit;

    cursor: pointer;
    &:hover {
      background-color: var(--ui-color-hover);
    }

    padding: 8px 16px;
  }
}
</style>