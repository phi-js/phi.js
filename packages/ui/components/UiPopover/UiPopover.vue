<template>
  <div class="ui-popover">
    <div
      class="ui-popover-trigger"
      @click.stop="onClickTrigger"
    >
      <slot
        name="trigger"
        :isOpen="isOpen"
        :open="doOpen"
        :close="doClose"
        :toggle="toggle"
      />
    </div>

    <div
      class="ui-popover-contents"
      :data-show="isOpen || undefined"
    >
      <slot
        v-if="isLoaded"
        name="contents"
        :isOpen="isOpen"
        :open="doOpen"
        :close="doClose"
        :toggle="toggle"
      >
        <slot
          name="default"
          :isOpen="isOpen"
          :open="doOpen"
          :close="doClose"
          :toggle="toggle"
        />
      </slot>

      <div
        v-if="showArrow"
        class="ui-popover-arrow"
        data-popper-arrow
      />
    </div>
  </div>
</template>

<script>
import { createPopper } from '@popperjs/core'

export default {
  name: 'UiPopover',

  props: {
    open: {
      type: Boolean,
      required: false,
      default: false,
    },

    /**
     * Posicion del popover
     * @see {@link https://popper.js.org/docs/v2/constructors/#placement}
     */
    placement: {
      type: String,
      required: false,
      default: 'bottom',
    },

    trigger: {
      type: String,
      required: false,
      default: 'click',
    },

    autoload: {
      type: Boolean,
      required: false,
      default: false,
    },

    showArrow: {
      type: Boolean,
      required: false,
      default: false,
    },

    strategy: {
      type: String,
      required: false,
      default: 'fixed', // absolute | fixed;
    },
  },

  emits: ['update:open', 'open', 'close'],

  data() {
    return {
      popperInstance: null,

      isOpen: this.open,
      isLoaded: this.autoload,
    }
  },

  watch: {
    open: {
      immediate: true,
      handler(newValue) {
        if (this.isOpen == newValue) {
          return
        }

        newValue ? this.doOpen() : this.doClose()
      },
    },
  },

  mounted() {
    // this.$nextTick(() => this.initPopperInstance());
    setTimeout(() => this.initPopperInstance(), 100)
  },

  unmounted() {
    if (this.popperInstance) {
      this.popperInstance.destroy()
      this.popperInstance = null
    }
  },

  methods: {
    initPopperInstance() {
      if (this.popperInstance) {
        this.popperInstance.destroy()
        this.popperInstance = null
      }

      this.popperInstance = createPopper(
        this.$el.querySelector('.ui-popover-trigger'),
        this.$el.querySelector('.ui-popover-contents'),
        {
          strategy: this.strategy,
          placement: this.placement,
          modifiers: this.showArrow
            ? [
              {
                name: 'offset',
                options: { offset: [0, 12] },
              },
            ]
            : [],
        },
      )
    },

    doOpen() {
      this.isLoaded = true
      if (this.isOpen) {
        return
      }
      this.isOpen = true

      // window.addEventListener('click', this.outsideClickListener);  // El event click se esta disparando de inmediato cuando doOpen fue disparado a su vez desde un @click
      // this.$nextTick(() => window.addEventListener('click', this.outsideClickListener));
      setTimeout(
        () => window.addEventListener('click', this.outsideClickListener, true),
        100,
      )
      document.addEventListener('keydown', this.keydownListener, true)

      this.$emit('update:open', true)
      this.$emit('open')

      this.popperInstance.update()
    },

    doClose() {
      if (!this.isOpen) {
        return
      }
      this.isOpen = false

      window.removeEventListener('click', this.outsideClickListener, true)
      document.removeEventListener('keydown', this.keydownListener, true)

      this.$emit('update:open', false)
      this.$emit('close')
    },

    toggle() {
      this.isOpen ? this.doClose() : this.doOpen()
    },

    onClickTrigger() {
      if (this.trigger == 'click') {
        this.toggle()
      }
    },

    // listen for outside click (click outside click - comentario para ayudar a buscar "click outside" en el codigo :))
    outsideClickListener(event) {
      if (!this.$el.contains(event.target)) {
        event.stopPropagation() // importante detener el evento, sobre todo si se ha cambiado la propiedad "open" haciendo click en un elemento "outside"
        event.preventDefault()
        this.doClose()
      }
    },

    // listen for ESC key press
    keydownListener(event) {
      switch (event.key) {
      case 'Escape':
        this.doClose()
        break
      }
    },
  },
}
</script>

<style lang="scss">
.ui-popover {
  .ui-popover-contents {
    background-color: #fff;
    border: 1px solid #ccc;

    z-index: 20;
    display: none;

    &[data-show] {
      display: block;
    }
  }

  // https://popper.js.org/docs/v2/tutorial/#arrow
  .ui-popover-contents {
    & > .ui-popover-arrow {
      visibility: hidden;

      &,
      &::before {
        position: absolute;
        width: 8px;
        height: 8px;
        background: inherit;
      }

      &::before {
        visibility: visible;
        content: '';
        transform: rotate(45deg);
      }
    }

    &[data-popper-placement^='top'] > .ui-popover-arrow {
      bottom: -4px;
    }

    &[data-popper-placement^='bottom'] > .ui-popover-arrow {
      top: -4px;
    }

    &[data-popper-placement^='left'] > .ui-popover-arrow {
      right: -4px;
    }

    &[data-popper-placement^='right'] > .ui-popover-arrow {
      left: -4px;
    }
  }
}
</style>