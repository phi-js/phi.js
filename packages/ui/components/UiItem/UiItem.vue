<template>
  <div
    class="ui-item"
    @click="$emit('click', $event)"
  >
    <div
      v-if="badge != null"
      class="ui-item__badge"
      v-text="badge"
    />

    <div
      v-if="hasSlot('icon')"
      class="ui-item__icon"
      @click="$emit('click-icon', $event)"
    >
      <slot name="icon" />
    </div>
    <UiIcon
      v-else-if="icon"
      class="ui-item__icon"
      :src="icon"
      :color="iconColor"
      @click="$emit('click-icon', $event)"
    />

    <div
      v-if="hasSlot('default') || text || subtext"
      class="ui-item__body"
      @click="$emit('click-body', $event)"
    >
      <slot name="default">
        <h1
          class="ui-item__text"
          v-text="text"
        />
        <p
          class="ui-item__subtext"
          v-text="subtext"
        />
      </slot>
    </div>

    <div
      v-if="hasSlot('actions')"
      class="ui-item__actions"
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
      default: 'rgba(0, 0, 0, 0.54)',
    },

    badge: {
      type: [String, Number],
      required: false,
      default: null,
    },
  },
  emits: ['click', 'click-icon', 'click-body'],

  methods: {
    hasSlot(slotName) {
      return !!this.$slots[slotName]
    },
  },
}
</script>

<style lang="scss">
.ui-item {
  position: relative;  // para posicionar el badge
  display: flex;
  align-items: stretch;
  padding: var(--ui-padding);

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
    margin-right: var(--ui-breathe);
    &:last-child {
      margin-right: 0;
    }
  }

  &__actions {
    margin-left: var(--ui-padding-horizontal);
    display: flex;
    align-items: stretch;
  }

  &__body {
    flex: 1;
    min-width: 0; // Allows correct cropping of overflown texts (see https://css-tricks.com/flexbox-truncated-text/)
    display: flex;
    flex-direction: column;
    justify-content: center;
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
    .ui-item {
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
