<script setup>
const props = defineProps({
  // Card image URL
  image: {
    type: String,
    required: false,
    default: null,
  },

  // same as UiItem
  text: {
    type: [String, Number],
    required: false,
    default: null,
  },

  subtext: {
    type: [String, Number],
    required: false,
    default: '',
  },

  icon: {
    type: [String, Number],
    required: false,
    default: null,
  },

  badge: {
    type: [String, Number],
    required: false,
    default: null,
  },

  /* LINK <a> attributes */
  href: {
    type: String,
    required: false,
    default: null,
  },

  /*
    Additional base BEM name
    will add classes FOO__icon, FOO__body, FOO__text, etc,
    */
  bem: {
    type: String,
    required: false,
    default: null,
  },

  onDelete: {
    type: Function,
    required: false,
    default: null,
  },
})
</script>

<template>
  <Component
    :is="href ? 'a' : 'div'"
    :href="href"
    class="UiCard UiCard__container"
  >
    <img
      class="UiCard__image"
      :src="props.image"
    >
    <h2
      class="UiCard__headline"
      v-text="props.text"
    />
    <h3
      class="UiCard__subhead"
      v-text="props.subtext"
    />
    <p
      class="UiCard__text"
      v-text="props.description"
    />
    <div class="UiCard__slot">
      <slot name="default" />
    </div>
  </Component>
</template>

<style lang="scss">
.UiCard {
  &__container {
    display: block;
    border-radius: 4px;
    padding: 4px;
    background-color: var(--ui-color-z1);
    margin: 8px;
  }

  &__image {
    display: block;
    width: 100%;
    max-height: 150px;
    object-fit: cover;

    border-radius: 4px;
  }

  &__headline,
  &__subhead,
  &__text {
    margin: 0;
  }
}
</style>