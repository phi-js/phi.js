<template>
  <span
    class="img__container"
    :style="style"
    :class="`--floating-${style.float}`"
  >
    <img
      class="img__embed"
      :src="node.attrs.src"
    >

    <div class="img__controls UiGroup">
      <UiIcon
        :class="{'--active': style.float == 'left'}"
        value="mdi:format-float-left"
        @click="toggleFloat('left')"
      />

      <UiIcon
        :class="{'--active': style.float == 'right'}"
        value="mdi:format-float-right"
        @click="toggleFloat('right')"
      />
    </div>
  </span>
</template>

<script>
import { UiIcon } from '../../../../../../ui'

export default {
  components: { UiIcon },
  props: ['node', 'updateAttrs', 'view', 'selected'],

  data() {
    return {
      style: {
        width: null,
        height: null,
        float: null,
      },
    }
  },

  watch: {
    node: {
      immediate: true,
      handler(newValue) {
        if (!newValue || !newValue.attrs) {
          return
        }

        this.style = Object.assign(
          {},
          this.style,
          this.parseStyleSting(newValue.attrs.style),
        )
      },
    },
  },

  mounted() {
    new ResizeObserver(this.onResize).observe(this.$el)
  },

  methods: {
    parseStyleSting(string) {
      let retval = {}

      if (!string) {
        return retval
      }

      let parts = string.split(';')
      parts.forEach((part) => {
        part = part.trim()
        let o = part.split(':')
        retval[o[0]] = o[1]
      })

      return retval
    },

    toggleFloat(newValue) {
      this.style.float = this.style.float == newValue ? 'none' : newValue
      this.emitChanges()
    },

    onResize(entries) {
      for (let entry of entries) {
        let width = entry.contentRect.width
        let height = entry.contentRect.height

        if (!width || !height) {
          return
        }

        this.style.width = width + 'px'
        this.style.height = height + 'px'
        this.emitChanges()
      }
    },

    emitChanges() {
      this.updateAttrs({ style: `width:${this.style.width}; height:${this.style.height}; float:${this.style.float}` })
    },
  },
}
</script>

<style lang="scss">
.img__container {
  display: inline-block;
  // display: block;
  position: relative;
  overflow-x: auto;
  overflow-y: hidden;

  resize: both;

  min-width: 100px;
  min-height: 100px;

  .img__controls {
    position: absolute;
    top: 0;
    left: 0;
  }

  img {
    width: 100%;
    height: auto;

    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  &.--floating-right {
    direction: rtl;
    * {
      direction: ltr;
    }
  }
}
</style>