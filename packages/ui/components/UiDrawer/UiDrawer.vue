<template>
  <div
    class="ui-drawer"
    :class="{ 'ui-drawer--open': isOpen, 'ui-drawer--closed': !isOpen }"
  >
    <div
      v-if="$slots.trigger"
      class="ui-drawer__trigger"
      @mousedown="onTriggerMousedown"
      @click="onTriggerClick"
    >
      <slot
        name="trigger"
        :toggle="toggle"
        :open="doOpen"
        :close="doClose"
        :isOpen="isOpen"
      ></slot>
    </div>

    <div class="ui-drawer__contents">
      <slot
        v-if="componentLoaded"
        name="contents"
        :toggle="toggle"
        :open="doOpen"
        :close="doClose"
        :isOpen="isOpen"
      >
        <!-- Si no hay slot contents, usar el slot default -->
        <slot name="default"></slot>
      </slot>
    </div>
  </div>
</template>

<script>
import Velocity from 'velocity-animate'

var DrawerGroups = {}

export default {
  name: 'UiDrawer',

  props: {
    open: Boolean,

    slideDown: {
      type: Object,
      default: () => ({
        duration: 620,
        easing: [500, 30]
      })
    },

    slideUp: {
      type: Object,
      default: () => ({
        duration: 420,
        easing: [0.42, 0, 0.2, 1]
      })
    },

    linear: {
      type: Boolean,
      default: true
    },

    drawerGroup: {
      type: String,
      required: false,
      default: null
    },

    triggerEvent: {
      type: String,
      required: false,
      default: 'mousedown'
    }
  },

  data() {
    return {
      componentLoaded: false,
      isOpen: this.open,
      element: null
    }
  },

  computed: {
    velocityOptions() {
      return {
        up: this.linear ? { duration: 240 } : this.slideUp,
        down: this.linear ? { duration: 240 } : this.slideDown
      }
    }
  },

  watch: {
    open() {
      this.set(this.open)
    }
  },

  mounted() {
    this.isOpen = this.open
    this.element = this.$el.querySelector('.ui-drawer__contents')
    this.element.style.display = this.isOpen ? 'block' : 'none'

    if (this.drawerGroup) {
      if (typeof DrawerGroups[this.drawerGroup] == 'undefined') {
        DrawerGroups[this.drawerGroup] = []
      }
      DrawerGroups[this.drawerGroup].push(this)
    }

    if (this.isOpen) {
      this.componentLoaded = true
    }
  },

  unmounted() {
    if (this.drawerGroup) {
      DrawerGroups[this.drawerGroup].splice(
        DrawerGroups[this.drawerGroup].indexOf(this),
        1
      )
    }
  },

  methods: {
    onTriggerMousedown() {
      if (this.triggerEvent != 'mousedown') {
        return
      }

      return this.toggle()
    },

    onTriggerClick() {
      if (this.triggerEvent != 'click') {
        return
      }

      return this.toggle()
    },

    doOpen() {
      this.set(true)
    },

    doClose() {
      this.set(false)
    },

    toggle() {
      this.set(!this.isOpen)
    },

    set(isVisible) {
      let doAnimation = this.isOpen != isVisible
      this.isOpen = isVisible
      this.$emit('update:open', this.isOpen)

      if (doAnimation) {
        if (isVisible) {
          if (!this.componentLoaded) {
            this.componentLoaded = true
            this.$nextTick(() => {
              Velocity(
                this.element,
                'slideDown',
                this.velocityOptions.down
              ).then(() => this.$emit('animation-done'))
            })
          } else {
            Velocity(this.element, 'slideDown', this.velocityOptions.down).then(
              () => this.$emit('animation-done')
            )
          }
        } else {
          Velocity(this.element, 'slideUp', this.velocityOptions.up).then(() =>
            this.$emit('animation-done')
          )
        }
      }

      /* Close all other drawers in the group (if group is present) */
      if (this.drawerGroup && this.isOpen) {
        DrawerGroups[this.drawerGroup].forEach((otherDrawer) => {
          if (otherDrawer != this) {
            otherDrawer.set(false)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.ui-drawer__contents {
  // Esto arregla un bug de "snap" al hacer slideUp
  border: 1px solid transparent;
  border-left: 0;
  border-right: 0;
}
</style>
