<script>
import { UiIcon } from '../UiIcon'

export default {
  name: 'UiItem',
  components: { UiIcon },

  props: {
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
  },

  emits: ['click', 'click-icon', 'click-body', 'click-actions'],

  data() {
    return { isEndangered: false }
  },

  methods: {
    hasSlot(slotName) {
      return !!this.$slots[slotName]
    },

    doDelete() {
      this.$emit('delete')
    },
  },
}
</script>

<template>
  <Component
    :is="href ? 'a' : 'div'"
    :href="href"
    class="UiItem"
    :class="{'UiItem--endangered': isEndangered}"
    @click="$emit('click', $event)"
  >
    <div
      v-if="hasSlot('icon')"
      :class="'UiItem__icon' + (bem ? ` ${bem}__icon` : '')"
      @click="$emit('click-icon', $event)"
    >
      <slot name="icon" />
    </div>
    <UiIcon
      v-else-if="icon"
      :class="'UiItem__icon' + (bem ? ` ${bem}__icon` : '')"
      :src="icon"
      @click="$emit('click-icon', $event)"
    />

    <div
      v-if="hasSlot('default') || text || subtext"
      :class="'UiItem__body' + (bem ? ` ${bem}__body` : '')"
      @click="$emit('click-body', $event)"
    >
      <h1
        v-if="text"
        :class="'UiItem__text' + (bem ? ` ${bem}__text` : '')"
        v-text="text"
      />
      <p
        v-if="subtext"
        :class="'UiItem__subtext' + (bem ? ` ${bem}__subtext` : '')"
        v-text="subtext"
      />
      <div
        v-if="hasSlot('default')"
        :class="'UiItem__slot' + (bem ? ` ${bem}__slot` : '')"
      >
        <slot name="default" />
      </div>
    </div>
    <div
      v-if="hasSlot('actions')"
      :class="'UiItem__actions' + (bem ? ` ${bem}__actions` : '')"
      @click.stop.prevent="$emit('click-actions', $event)"
    >
      <slot name="actions" />
    </div>
    <div
      v-else-if="onDelete"
      :class="'UiItem__actions' + (bem ? ` ${bem}__actions` : '')"
    >
      <UiIcon
        class="UiItem__deleter ui--clickable"
        src="mdi:close"
        @click="doDelete()"
        @pointerenter="isEndangered = true"
        @pointerleave="isEndangered = false"
      />
    </div>

    <div
      v-if="badge"
      :class="'UiItem__badge' + (bem ? ` ${bem}__badge` : '')"
      v-text="badge"
    />
  </Component>
</template>

<style lang="scss">
.UiItem {
  min-width: 0; // Allows correct cropping of overflown texts (see https://css-tricks.com/flexbox-truncated-text/)
  // --ui-item-padding: inherit; // why?  this is messing up styles, as it takes priority
  --ui-item-badge-color: #ea5455;

  position: relative;
  display: flex;
  align-items: stretch;

  padding: var(--ui-item-padding);
  gap: var(--ui-item-padding);

  // color: inherit; // messes up UiItems inside UiButton

  &--endangered {
    // background-color: var(--ui-color-danger, #ea5455) !important;
    background-color: #ea545555 !important;
  }

  &__icon,
  &__body,
  &__badge {
    box-sizing: border-box;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0; // Allows correct cropping of overflown texts (see https://css-tricks.com/flexbox-truncated-text/)
  }

  &__text {
    margin: 0;
    font-size: 1em;
    font-weight: inherit;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtext {
    margin: 0;
    // opacity: 0.8; // fails lighthouse contrast test
    font-size: 0.8em;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: var(--ui-item-padding);
    // padding-left: 0;
  }

  &__badge {
    background-color: var(--ui-item-badge-color);
    color: #fff;
    font-size: min(0.6em, 26px);
    width: 0.9rem;
    height: 0.9rem;

    position: absolute;
    top: 0.6rem;
    left: 0;

    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__deleter {
    height: 100%;
    min-width: 32px;
    border-radius: 5px;
  }
}
</style>