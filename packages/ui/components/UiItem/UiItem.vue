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
  },
  emits: ['click', 'click-icon', 'click-body', 'click-actions'],

  methods: {
    hasSlot(slotName) {
      return !!this.$slots[slotName]
    },
  },
}
</script>

<template>
  <div
    class="UiItem"
    @click="$emit('click', $event)"
  >
    <div
      v-if="hasSlot('icon')"
      class="UiItem__icon"
      @click="$emit('click-icon', $event)"
    >
      <slot name="icon" />
    </div>
    <UiIcon
      v-else-if="icon"
      class="UiItem__icon"
      :src="icon"
      @click="$emit('click-icon', $event)"
    />

    <div
      v-if="hasSlot('default') || text || subtext"
      class="UiItem__body"
      @click="$emit('click-body', $event)"
    >
      <h3
        v-if="text"
        class="UiItem__text"
        v-text="text"
      />
      <p
        v-if="subtext"
        class="UiItem__subtext"
        v-text="subtext"
      />
      <div
        v-if="hasSlot('default')"
        class="UiItem__slot"
      >
        <slot name="default" />
      </div>
    </div>
    <div
      v-if="hasSlot('actions')"
      class="UiItem__actions"
      @click.stop="$emit('click-actions', $event)"
    >
      <slot name="actions" />
    </div>

    <div
      v-if="badge"
      class="UiItem__badge"
      v-text="badge"
    />
  </div>
</template>

<style lang="scss">
.UiItem {
  --ui-item-padding: inherit;
  --ui-item-badge-color: #ea5455;

  position: relative;
  display: flex;
  align-items: stretch;

  &__icon,
  &__body,
  &__badge {
    box-sizing: border-box;
  }

  &__icon {
    font-size: 1.2em;
    min-width: 1.2rem;
    max-height: 2.5em;
    padding: var(--ui-item-padding);
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 0; // Allows correct cropping of overflown texts (see https://css-tricks.com/flexbox-truncated-text/)
    padding: var(--ui-item-padding);

    &:nth-child(2) {
      padding-left: 0;
    }
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
    opacity: 0.8;
    font-size: 0.82em;
  }

  &__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--ui-item-padding);
    padding-left: 0;
  }

  &__badge {
    background-color: var(--ui-item-badge-color);
    color: #fff;
    font-size: min(0.7em, 26px);
    width: 1.5em;
    height: 1.5em;

    position: absolute;
    top: 0.35em;
    left: -0.4em;

    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>