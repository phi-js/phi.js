<script setup>
const props = defineProps({
  /*
  Array of navigation items:
  {
    href: '', (required)
    text: '',

    ... all attributes to be bound to <a>
    target: '',
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
      class="NavigationMenu__item ui--clickable"
      v-bind="item"
      v-text="item.text"
    />
  </nav>
</template>

<style lang="scss">
.NavigationMenu {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;

  &__item {
    display: block;

    padding: var(--ui-padding);
    border-radius: var(--ui-radius);
    font-family: var(--ui-font-secondary);
    margin: var(--ui-breathe);

    &--important {
      color: #fff !important;
      background-color: var(--ui-color-primary);

      &:hover {
        background-color: rgba(0,0,0, 0.3);
      }
    }
  }
}
</style>