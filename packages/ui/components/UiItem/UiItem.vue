<template>
  <div
    class="ui-item"
    @click="$emit('click', $event)"
  >
    <div
      v-if="badge"
      class="item-badge ui-noselect"
      :style="{backgroundColor: badgeColor ? badgeColor : undefined}"
    >{{ badge }}</div>

    <div
      v-if="hasSlot('icon')"
      class="item-icon"
      @click="$emit('click-icon', $event)"
    >
      <slot name="icon"></slot>
    </div>
    <UiIcon
      v-else-if="icon"
      class="item-icon"
      :value="icon"
      :size="iconSize"
      :color="iconColor"
      @click="$emit('click-icon', $event)"
    />

    <div
      class="item-slot"
      @click="$emit('click-body', $event)"
    >
      <div class="item-body">
        <slot name="text">
          <h1
            class="text-primary"
            v-text="text"
          ></h1>
        </slot>

        <div
          v-if="hasSlot('secondary')"
          class="text-secondary"
        >
          <slot name="secondary"></slot>
        </div>
        <p
          v-else-if="secondary"
          class="text-secondary"
          v-text="secondary"
        ></p>

        <div
          v-if="hasSlot('tertiary')"
          class="text-tertiary"
        >
          <slot name="tertiary"></slot>
        </div>
        <p
          v-else-if="tertiary"
          class="text-tertiary"
          v-text="tertiary"
        ></p>

        <slot name="default"></slot>
      </div>
    </div>

    <div
      v-if="hasSlot('right') || $attrs.onDelete"
      class="item-right"
    >
      <slot name="right">
        <div class="item-delete-icon">
          <UiIcon
            value="g:delete_forever"
            @mousedown.stop="$emit('delete')"
          />
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
import { UiIcon } from '../UiIcon';

export default {
  name: 'UiItem',
  components: { UiIcon },

  props: {
    text: {
      type: [String, Number],
      required: false,
      default: null,
    },

    icon: {
      type: String,
      required: false,
      default: null,
    },

    iconSize: {
      type: [Number, String],
      required: false,
      default: '24',
    },

    iconColor: {
      type: String,
      required: false,
      default: 'rgba(0, 0, 0, 0.54)',
    },

    secondary: {
      type: [String, Number],
      required: false,
      default: null,
    },

    tertiary: {
      type: [String, Number],
      required: false,
      default: null,
    },

    badge: {
      type: [String, Number],
      required: false,
      default: null,
    },

    badgeColor: {
      type: String,
      required: false,
      default: null,
    },
  },

  methods: {
    hasSlot(slotName) {
      return !!this.$slots[slotName];
    },
  },
};
</script>

<style lang="scss">
.ui-item {
  --item-icon-width: 48px;

  position: relative;
  display: flex;

  .item-badge {
    background-color: var(--ui-color-danger);
    color: #fff;
    z-index: 1;

    position: absolute;
    top: 16px;
    left: -3px;

    border-radius: 50%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 8px;
    font-weight: bold;
    width: 16px;
    height: 16px;
    line-height: 16px;
  }

  .item-slot {
    flex: 1;
    display: flex;
    min-width: 0; // Allows correct cropping of overflown text-secondary and text-tertiary (see https://css-tricks.com/flexbox-truncated-text/)
  }

  .item-body {
    flex: 1;

    padding: var(--ui-breathe);
    min-width: 0; // Allows correct cropping of overflown text-secondary and text-tertiary (see https://css-tricks.com/flexbox-truncated-text/)

    // Correct vertical alignment when only text-primary is present
    display: flex;
    flex-direction: column;
    justify-content: center;

    .text-primary,
    .text-secondary,
    .text-tertiary {
      margin: 0;
    }

    .text-primary {
      font-family: var(--ui-font-secondary);
      font-size: 1em;
      font-weight: inherit;

      overflow: hidden;
      text-overflow: ellipsis;
    }

    .text-secondary {
      opacity: 0.8;
      font-size: 0.82em;
    }

    .text-tertiary {
      opacity: 0.6;
      font-size: 0.82em;
    }
  }

  .item-icon {
    display: flex;
    align-self: baseline;
    align-items: center;
    justify-content: center;

    min-width: var(--item-icon-width);
    min-height: var(--item-icon-width);
  }

  .item-delete-icon {
    cursor: pointer;
    min-width: 42px;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    color: rgba(0, 0, 0, 0.4);

    &:hover {
      color: crimson;
    }
  }

  .item-right {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
  }
}

// hide overflow in secondary and tertiary texts
.ui-item.--nowrap {
  .text-primary {
    white-space: nowrap;
  }

  .text-secondary,
  .text-tertiary {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.ui-item.--inline {
  display: inline-flex;
}
</style>