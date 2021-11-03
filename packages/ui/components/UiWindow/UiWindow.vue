<script>
import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'
import { UiPopover } from '../UiPopover'
import openWindow from './popup.js'
import PopupBridge from './PopupBridge.vue'

export default {
  name: 'UiWindow',
  components: { UiItem, UiIcon, UiPopover, PopupBridge },

  props: {
    dock: {
      type: String,
      required: false,
      default: null,
      validator: (value) =>
        ['top', 'right', 'bottom', 'left', 'popup', null].includes(value),
    },

    open: {
      type: Boolean,
      required: false,
      default: false,
    },

    icon: {
      type: String,
      required: false,
      default: null,
    },

    text: {
      type: String,
      required: false,
      default: null,
    },
  },

  emits: ['update:open', 'update:dock', 'close', 'popup'],

  data() {
    return {
      inner: {
        dock: null,
        open: false,
        icon: null,
        text: null,
      },

      isDragging: false,
      zone: null,
      bounds: {
        top: 10,
        left: 10,
        width: 800,
        height: 600,
      },

      start: {
        x: null,
        y: null,
      },

      newBounds: {
        top: null,
        left: null,
        width: null,
        height: null,
      },

      dropTarget: null,
    }
  },

  computed: {
    contentsStyle() {
      let bounds = this.isDragging ? this.newBounds : this.bounds

      let retval = {
        top: bounds.top + 'px',
        left: bounds.left + 'px',
        width: bounds.width + 'px',
        height: bounds.height + 'px',
      }

      switch (this.inner.dock) {
      case 'top':
        retval.top = 0
        retval.right = 0
        retval.bottom = null
        retval.left = 0
        retval.width = null
        break

      case 'right':
        retval.top = 0
        retval.right = 0
        retval.bottom = 0
        retval.left = null
        retval.height = null
        break

      case 'bottom':
        retval.top = null
        retval.right = 0
        retval.bottom = 0
        retval.left = 0
        retval.width = null
        break

      case 'left':
        retval.top = 0
        retval.right = null
        retval.bottom = 0
        retval.left = 0
        retval.height = null
        break
      }

      return retval
    },
  },

  watch: {
    dock: {
      immediate: true,
      handler(newValue) {
        this.inner.dock = newValue
      },
    },

    open: {
      immediate: true,
      handler(newValue) {
        this.inner.open = newValue
        this.inner.open && this.setDock(this.inner.dock) // resize <body>
      },
    },

    icon: {
      immediate: true,
      handler(newValue) {
        this.inner.icon = newValue
      },
    },

    text: {
      immediate: true,
      handler(newValue) {
        this.inner.text = newValue
      },
    },
  },

  methods: {
    show() {
      this.inner.open = true
      this.$emit('update:open', this.inner.open)

      this.setDock(this.inner.dock) // resize <body>
    },

    hide() {
      this.inner.open = false
      this.$emit('update:open', this.inner.open)

      /// !!! resize <body>
      document.body.style.setProperty('margin-top', 'initial')
      document.body.style.setProperty('margin-right', 'initial')
      document.body.style.setProperty('margin-bottom', 'initial')
      document.body.style.setProperty('margin-left', 'initial')
    },

    close() {
      this.inner.open = false
      this.$emit('update:open', this.inner.open)
      this.$emit('close')

      /// !!! resize <body>
      document.body.style.setProperty('margin-top', 'initial')
      document.body.style.setProperty('margin-right', 'initial')
      document.body.style.setProperty('margin-bottom', 'initial')
      document.body.style.setProperty('margin-left', 'initial')
    },

    onResizerStart(evt, zone) {
      if (!zone) {
        return
      }

      evt.preventDefault()
      let pointer = evt.type == 'touchstart' ? evt.touches[0] : evt

      this.isDragging = true
      this.zone = zone
      this.start.x = pointer.clientX
      this.start.y = pointer.clientY
      this.newBounds = { ...this.bounds }
    },

    onResizerMove(evt) {
      if (!this.isDragging) {
        return
      }

      evt.preventDefault()
      let pointer = evt.type == 'touchmove' ? evt.touches[0] : evt
      let diff = {
        x: pointer.clientX - this.start.x,
        y: pointer.clientY - this.start.y,
      }

      switch (this.zone) {
      case 'move':
        this.newBounds.top = this.bounds.top + diff.y
        this.newBounds.left = this.bounds.left + diff.x
        break

      case 'n':
        this.newBounds.top = this.bounds.top + diff.y
        this.newBounds.height = this.bounds.height - diff.y
        break

      case 'ne':
        this.newBounds.top = this.bounds.top + diff.y
        this.newBounds.height = this.bounds.height - diff.y

        this.newBounds.width = this.bounds.width + diff.x
        break

      case 'e':
        this.newBounds.width = this.bounds.width + diff.x
        break

      case 'se':
        this.newBounds.width = this.bounds.width + diff.x
        this.newBounds.height = this.bounds.height + diff.y
        break

      case 's':
        this.newBounds.height = this.bounds.height + diff.y
        break

      case 'sw':
        this.newBounds.height = this.bounds.height + diff.y

        this.newBounds.left = this.bounds.left + diff.x
        this.newBounds.width = this.bounds.width - diff.x
        break

      case 'w':
        this.newBounds.left = this.bounds.left + diff.x
        this.newBounds.width = this.bounds.width - diff.x
        break

      case 'nw':
        this.newBounds.top = this.bounds.top + diff.y
        this.newBounds.height = this.bounds.height - diff.y

        this.newBounds.left = this.bounds.left + diff.x
        this.newBounds.width = this.bounds.width - diff.x
        break
      }

      /// !!! resize <body>
      if (this.inner.dock) {
        switch (this.inner.dock) {
        case 'top':
        case 'bottom':
          document.body.style.setProperty(`margin-${this.inner.dock}`, `${this.newBounds.height}px`)
          break
        case 'left':
        case 'right':
          document.body.style.setProperty(`margin-${this.inner.dock}`, `${this.newBounds.width}px`)
          break
        }
      }
    },

    onResizerEnd(evt) {
      if (!this.isDragging) {
        return
      }
      evt.preventDefault()
      this.isDragging = false
      this.bounds = { ...this.newBounds }

      if (this.dropTarget) {
        this.setDock(this.dropTarget)
        this.dropTarget = null
      }
    },

    setDock(newPosition) {
      if (this.inner.dock != newPosition) {
        this.inner.dock = newPosition
        this.$emit('update:dock', this.inner.dock)
        if (newPosition == 'popup') {
          this.$emit('popup')
          openWindow(this, () => {
            this.setDock(null)
            this.close()
          })
        }
      }

      /// !!! resize <body>
      document.body.style.setProperty('margin-top', 'initial')
      document.body.style.setProperty('margin-right', 'initial')
      document.body.style.setProperty('margin-bottom', 'initial')
      document.body.style.setProperty('margin-left', 'initial')

      if (this.inner.dock) {
        switch (this.inner.dock) {
        case 'top':
        case 'bottom':
          document.body.style.setProperty(`margin-${this.inner.dock}`, `${this.bounds.height}px`)
          break
        case 'left':
        case 'right':
          document.body.style.setProperty(`margin-${this.inner.dock}`, `${this.bounds.width}px`)
          break
        }
      }
    },
  },
}
</script>

<template>
  <div
    v-show="inner.open"
    class="UiWindow"
    :class="{
      'UiWindow--dragging': isDragging,
      '--open': inner.open,
      '--closed': !inner.open,
      '--docked': !!inner.dock,
      '--external': inner.dock == 'popup'
    }"
    @mousemove="onResizerMove($event)"
    @mouseup="onResizerEnd($event)"
    @touchmove="onResizerMove($event)"
    @touchend="onResizerEnd($event)"
  >
    <div
      class="UiWindow__container"
      :class="dock ? `--dock-${inner.dock}` : null"
    >
      <div
        class="UiWindow__dropzone UiWindow__dropzone--top"
        @mouseenter="dropTarget = 'top'"
        @mouseleave="dropTarget = null"
      />
      <div
        class="UiWindow__dropzone UiWindow__dropzone--bottom"
        @mouseenter="dropTarget = 'bottom'"
        @mouseleave="dropTarget = null"
      />
      <div
        class="UiWindow__dropzone UiWindow__dropzone--left"
        @mouseenter="dropTarget = 'left'"
        @mouseleave="dropTarget = null"
      />
      <div
        class="UiWindow__dropzone UiWindow__dropzone--right"
        @mouseenter="dropTarget = 'right'"
        @mouseleave="dropTarget = null"
      />

      <div
        class="UiWindow__contents ui__box ui--z"
        :style="contentsStyle"
      >
        <div
          class="hotzone --n"
          @mousedown="onResizerStart($event, 'n')"
          @touchstart="onResizerStart($event, 'n')"
        />
        <div
          class="hotzone --e"
          @mousedown="onResizerStart($event, 'e')"
          @touchstart="onResizerStart($event, 'e')"
        />
        <div
          class="hotzone --s"
          @mousedown="onResizerStart($event, 's')"
          @touchstart="onResizerStart($event, 's')"
        />
        <div
          class="hotzone --w"
          @mousedown="onResizerStart($event, 'w')"
          @touchstart="onResizerStart($event, 'w')"
        />
        <div
          class="hotzone --ne"
          @mousedown="onResizerStart($event, 'ne')"
          @touchstart="onResizerStart($event, 'ne')"
        />
        <div
          class="hotzone --nw"
          @mousedown="onResizerStart($event, 'nw')"
          @touchstart="onResizerStart($event, 'nw')"
        />
        <div
          class="hotzone --se"
          @mousedown="onResizerStart($event, 'se')"
          @touchstart="onResizerStart($event, 'se')"
        />
        <div
          class="hotzone --sw"
          @mousedown="onResizerStart($event, 'sw')"
          @touchstart="onResizerStart($event, 'sw')"
        />

        <div class="UiWindow__header">
          <slot name="header">
            <UiItem
              class="header-item"
              :text="inner.text || 'Ventana'"
              :icon="inner.icon || 'mdi:rectangle-outline'"
              @mousedown="onResizerStart($event, 'move')"
              @touchstart="onResizerStart($event, 'move')"
            />
          </slot>

          <div
            style="flex:1; align-self: stretch;"
            @mousedown="onResizerStart($event, 'move')"
            @touchstart="onResizerStart($event, 'move')"
          />

          <UiPopover>
            <template #trigger>
              <UiIcon
                :src="inner.dock
                  ? (inner.dock == 'popup' ? 'mdi:window-restore' : `mdi:dock-${inner.dock}`)
                  : 'mdi:card-outline'"
                class="ui--clickable"
                :class="{'--active': !inner.dock}"
              />
            </template>
            <template #contents="popover">
              <div @click="popover.close()">
                <UiIcon
                  src="mdi:card-outline"
                  class="ui--clickable"
                  :class="{'--active': !inner.dock}"
                  @click="setDock(null)"
                />

                <UiIcon
                  src="mdi:dock-bottom"
                  class="ui--clickable"
                  :class="{'--active': inner.dock == 'bottom'}"
                  @click="setDock('bottom')"
                />

                <UiIcon
                  src="mdi:dock-top"
                  class="ui--clickable"
                  :class="{'--active': inner.dock == 'top'}"
                  @click="setDock('top')"
                />

                <UiIcon
                  src="mdi:dock-left"
                  class="ui--clickable"
                  :class="{'--active': inner.dock == 'left'}"
                  @click="setDock('left')"
                />

                <UiIcon
                  src="mdi:dock-right"
                  class="ui--clickable"
                  :class="{'--active': inner.dock == 'right'}"
                  @click="setDock('right')"
                />

                <UiIcon
                  src="mdi:window-restore"
                  class="ui--clickable"
                  :class="{'--active': inner.dock == 'popup'}"
                  @click="setDock('popup')"
                />
              </div>
            </template>
          </UiPopover>

          <UiIcon
            src="mdi:close"
            class="ui--clickable window-close"
            @click="hide(); close()"
          />
        </div>

        <PopupBridge ref="refBridge">
          <template #default>
            <div class="UiWindow__body">
              <slot
                name="contents"
                :close="close"
              >
                <slot
                  name="default"
                  :close="close"
                />
              </slot>
            </div>
          </template>
          <template #footer>
            <footer class="UiWindow__footer ui-footer">
              <slot
                name="footer"
                :close="close"
              />
            </footer>
          </template>
        </PopupBridge>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.UiWindow {
  $hotzone-size: 14px;
  $hotzone-offset: 12px; // distancia a desplazar el hotzone hacia afuera de la ventana

  &.--external {
    // display: none;
    opacity: 0.4;
    pointer-events: none;
  }

  &.--docked {
    .UiWindow__contents {
      border-radius: 0;
    }
  }

  &--dragging {
    .UiWindow__container {
      pointer-events: initial !important;
    }
  }

  &__container {
    background-color: rgba(0, 0, 0, 0.04); // SCRIM
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;

    display: flex;
    flex-wrap: wrap;

    pointer-events: none;
  }

  &__dropzone {
    position: absolute;
    z-index: 3;

    &:hover {
      background-color: var(--ui-color-primary);
      opacity: 0.2;
    }

    &--top {
      top: 0;
      left: 0;
      right: 0;
      height: 72px;
    }

    &--bottom {
      bottom: 0;
      left: 0;
      right: 0;
      height: 72px;
    }

    &--right {
      right: 0;
      top: 0;
      bottom: 0;
      width: 128px;
    }

    &--left {
      left: 0;
      top: 0;
      bottom: 0;
      width: 128px;
    }
  }

  &__contents {
    pointer-events: initial;
    display: flex;
    flex-direction: column;
  }

  &__body {
    flex: 1;
    overflow: auto;
  }

  &__header,
  &__footer {
    cursor: move;
    overflow: hidden;
    flex-wrap: nowrap;
  }

  &__header {
    display: flex;
    align-items: center;
    background-color: transparent;

    .ui--clickable {
      min-width: 32px;
      min-height: 32px;
    }

    .header-item {
      flex: 1;

      .item-body {
        padding: 0;
      }

      h1 {
        justify-content: left;
      }
    }
  }

  &__contents {
    position: absolute;
    min-width: 200px;
    min-height: 200px;

    // // background-color: var(--ui-color-background);
    // // background-color: #fff;
    // background-color: #2f2f2f;
    // color: rgb(255 255 255 / 70%);
    // border-radius: var(--ui-radius);

    .hotzone {
      position: absolute;
      min-width: $hotzone-size;
      min-height: $hotzone-size;

      &.--n,
      &.--s {
        left: 0;
        right: 0;

        cursor: ns-resize;
      }

      &.--e,
      &.--w {
        top: 0;
        bottom: 0;

        cursor: ew-resize;
      }

      &.--ne,
      &.--nw,
      &.--n {
        top: -$hotzone-offset;
      }

      &.--se,
      &.--sw,
      &.--s {
        bottom: -$hotzone-offset;
      }

      &.--nw,
      &.--sw,
      &.--w {
        left: -$hotzone-offset;
      }

      &.--ne,
      &.--se,
      &.--e {
        right: -$hotzone-offset;
      }

      &.--n,
      &.--e,
      &.--s,
      &.--w {
        z-index: 1;
      }

      &.--nw,
      &.--se {
        cursor: nwse-resize;
      }

      &.--ne,
      &.--sw {
        cursor: nesw-resize;
      }

      &.--ne,
      &.--nw,
      &.--se,
      &.--sw {
        z-index: 2;

        min-width: $hotzone-size + $hotzone-offset;
        min-height: $hotzone-size + $hotzone-offset;
      }
    }
  }
}
</style>