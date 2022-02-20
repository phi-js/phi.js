<template>
  <div class="UiItem" @click="$emit('click', $event)">
    <div v-if="badge != null" class="UiItem__badge" v-text="badge" />
    <div v-if="hasSlot('icon')" class="UiItem__icon" @click="$emit('click-icon', $event)">
      <slot name="icon" />
    </div>
    <UiIcon
      v-else-if="icon"
      class="UiItem__icon"
      :src="icon"
      :color="iconColor"
      @click="$emit('click-icon', $event)"
    />

    <div
      v-if="hasSlot('default') || text || subtext"
      class="UiItem__body"
      @click="$emit('click-body', $event)"
    >
      <slot name="default">
        <h1 class="UiItem__text" v-text="text" />
        <p v-if="subtext" class="UiItem__subtext" v-text="subtext" />
      </slot>
    </div>

    <div
      v-if="hasSlot('actions')"
      class="UiItem__actions"
      @click.stop="$emit('click-actions', $event)"
    >
      <slot name="actions" />
    </div>
  </div>
</template>

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

    iconColor: {
      type: String,
      required: false,
      default: 'inherit',
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

<style lang="scss">
.UiItem {
  position: relative; // para posicionar el badge
  display: flex;
  align-items: stretch;

  &__badge {
    background-color: var(--ui-color-danger);
    color: #fff;

    position: absolute;
    top: 12px;
    left: -4px;
    width: 16px;
    height: 16px;
    line-height: 16px;

    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    font-weight: bold;
  }

  &__icon {
    padding: var(--ui-padding);
    &:last-child {
      padding-right: 0;
    }
  }

  &__actions {
    display: flex;
    align-items: stretch;
  }

  &__body {
    flex: 1;
    min-width: 0; // Allows correct cropping of overflown texts (see https://css-tricks.com/flexbox-truncated-text/)
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: var(--ui-padding);

    padding-left: 0;
    &:first-child {
      padding-left: var(--ui-padding-horizontal);
    }
  }

  &__text {
    margin: 0;
    font-family: var(--ui-font-secondary);
    font-size: 1em;
    font-weight: inherit;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__subtext {
    margin: 0;
    opacity: 0.8;
    font-size: 0.82em;
  }

  &--inline {
    display: inline-flex;
  }

  &--nowrap {
    .UiItem {
      &__text,
      &__subtext {
        white-space: nowrap;
      }

      &__subtext {
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
