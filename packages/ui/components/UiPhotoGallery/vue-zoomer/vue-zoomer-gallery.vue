<template>
  <!-- touchmove.prevent is used to stop the page scroll elastic effects -->
  <div
    ref="root"
    :class="{
      'anim': autoSliding && !isPointerDown,
    }"
    :style="{
      'background-color': backgroundColor,
    }"
    class="vue-zoomer-gallery"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseout="onMouseUp"
    @mouseup="onMouseUp"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
    @touchmove.prevent="onTouchMove"
  >
    <v-zoomer
      v-for="(n, i) in 3"
      :ref="el => { zoomerRefs[i] = el }"
      :key="i + '-' + selIndex"
      :class="['left', 'middle', 'right'][i]"
      class="slide"
      :style="[leftStyle, middleStyle, rightStyle][i]"
      :max-scale="10"
      v-model:zoomed="currentZoomed"
      :reset-trigger="i"
      :aspect-ratio="imageAspectRatios[selIndex + i - 1] || 1"
      :pivot="pivot"
      :zooming-elastic="zoomingElastic"
      :limit-translation="limitTranslation"
      :double-click-to-zoom="doubleClickToZoom"
      :mouse-wheel-to-zoom="mouseWheelToZoom"
      @swipe="onImageSwipe"
    >
      <img
        v-if="selIndex + i - 1 > -1 && selIndex + i - 1 < list.length"
        :src="list[selIndex + i - 1]"
        draggable="false"
        style="object-fit: contain; width: 100%; height: 100%;"
        @load="onImageLoad(selIndex + i - 1, $event)"
        @dragstart="onImageDragStart"
      >
    </v-zoomer>
  </div>
</template>

<script>
const SLIDE_WIDTH_THRESH = 50 // in px
import VZoomer from './vue-zoomer.vue'

export default {
  components: { VZoomer },
  props: {
    modelValue: { type: Number, required: true },
    list: { type: Array, required: true },
    backgroundColor: { type: String, default: '#333' },
    pivot: { type: String, default: 'cursor' },
    zoomingElastic: { type: Boolean, default: true },
    limitTranslation: { type: Boolean, default: true },
    doubleClickToZoom: { type: Boolean, default: true },
    mouseWheelToZoom: { type: Boolean, default: true },
  },
  data () {
    return {
      zoomerRefs: [],
      // env states
      containerWidth: 1,
      containerHeight: 1,
      // main states
      selIndex: this.modelValue,
      animSelIndex: this.modelValue,
      currentZoomed: false,
      autoSliding: false,
      imageAspectRatios: [], // aspect ratio (width / height) of images
      // interaction states
      isPointerDown: false,
      lastPointerX: 0,
      slideOffsetX: 0,
    }
  },
  computed: {
    middleStyle () {
      return {
        left: `${ 0 + this.slideOffsetX }px`,
      }
    },
    leftStyle () {
      return {
        left: `${ -this.containerWidth + this.slideOffsetX }px`,
      }
    },
    rightStyle () {
      return {
        left: `${ this.containerWidth + this.slideOffsetX }px`,
      }
    },
    slideThresh () {
      return Math.max(SLIDE_WIDTH_THRESH, this.containerWidth * 0.1)
    },
  },
  watch: {
    modelValue (val) {
      if (val !== this.animSelIndex) {
        this.selIndex = val
        this.animSelIndex = val
      }
    },
    selIndex() {
      this.$nextTick(() => {
        this.zoomerRefs.forEach(zoomer => {
          zoomer.refreshContainerPos()
        })
      })
    },
  },
  mounted () {
    window.addEventListener('resize', this.onWindowResize)
    this.onWindowResize()
  },
  unmounted () {
    window.removeEventListener('resize', this.onWindowResize)
  },
  methods: {
    // api ---------------------------------------------------------------------
    reset () {
      this.zoomerRefs.forEach(zoomer => {
        zoomer.reset()
      })
    },
    zoomIn (scale) {
      if (this.zoomerRefs[1]) this.zoomerRefs[1].zoomIn(scale)
    },
    zoomOut (scale) {
      if (this.zoomerRefs[1]) this.zoomerRefs[1].zoomOut(scale)
    },
    // events ------------------------------------------------------------------
    onWindowResize () {
      let styles = window.getComputedStyle(this.$refs.root)
      this.containerWidth = parseFloat(styles.width)
      this.containerHeight = parseFloat(styles.height)
    },
    onPointerMove (deltaX) {
      if (this.isPointerDown && !this.currentZoomed) {
        let factor = (
          (this.selIndex === 0 && deltaX > 0 && this.slideOffsetX + deltaX > 0) ||
          (this.selIndex === this.list.length - 1 && deltaX < 0 && this.slideOffsetX + deltaX < 0)
        ) ? 0.3 : 1
        this.slideOffsetX += deltaX * factor
      }
    },
    onPointerUp () {
      if (this.slideOffsetX < -this.slideThresh) {
        // next page
        this.paginate(1)
      } else if (this.slideOffsetX > this.slideThresh) {
        // prev page
        this.paginate(-1)
      } else {
        // only apply the animation
        this.paginate(0)
      }
    },
    // Stop Firefox dragging the image
    onImageDragStart(ev) {
      ev.preventDefault();
      return false
    },
    paginate (deltaIndex) {
      let targetIndex = this.selIndex + deltaIndex
      if (targetIndex < 0 || targetIndex >= this.list.length) {
        this.slideOffsetX = 0
        return
      }

      this.slideOffsetX = this.containerWidth * -deltaIndex
      this.autoSliding = true
      // update the selIndex before the animation to remove the delay feeling
      this.$emit('update:modelValue', targetIndex)
      this.animSelIndex = targetIndex
      setTimeout(() => {
        this.selIndex = targetIndex
        this.slideOffsetX = 0
        this.autoSliding = false
      }, 400)
    },
    onMouseDown (ev) {
      this.isPointerDown = true
      this.lastPointerX = ev.clientX
    },
    onMouseUp (ev) {
      this.isPointerDown = false
      this.onPointerUp()
    },
    onMouseMove (ev) {
      if (this.isPointerDown) {
        this.onPointerMove(ev.clientX - this.lastPointerX)
        this.lastPointerX = ev.clientX
      }
    },
    onTouchStart (ev) {
      if (ev.touches.length === 1) {
        this.isPointerDown = true
        this.lastPointerX = ev.touches[0].clientX
      }
    },
    onTouchEnd (ev) {
      if (ev.touches.length === 0) {
        this.isPointerDown = false
        this.onPointerUp()
      }
    },
    onTouchMove (ev) {
      if (ev.touches.length === 1) {
        this.onPointerMove(ev.touches[0].clientX - this.lastPointerX)
        this.lastPointerX = ev.touches[0].clientX
      }
    },
    onImageLoad (index, ev) {
      let aspectRatio = ev.target.naturalWidth / ev.target.naturalHeight
      this.imageAspectRatios[index] = aspectRatio
    },
    onImageSwipe (direction) {
      this.paginate(direction == 'right' ? -1 : 1)
    },
  },
}
</script>

<style scoped>
.vue-zoomer-gallery {
  position: relative;
  overflow: hidden;
  user-select: none;
  min-width: 100px;
  min-height: 100px;
}
.vue-zoomer-gallery > * {
  display: inline-block;
}
.vue-zoomer-gallery.anim .slide {
  transition: left 0.4s;
}

.slide {
  position: absolute;
  top: 0;
  object-fit: contain;
  width: 100%;
  height: 100%;
  -webkit-user-drag: none;
}
</style>
