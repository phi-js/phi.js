<template>
  <video
    class="UiVideoNative"
    width="100%"
    height="100%"
    controls
    :src="url"
    v-bind="$attrs"
    @play="onVideoPlay"
    @pause="onVideoPause"
    @timeupdate="onVideoTimeupdate"
  />
</template>

<script>
export default {
  name: 'UiVideoNative',
  props: {
    url: {
      type: String,
      required: true,
    },

    /* v-models */
    isPlaying: {
      type: Boolean,
      required: false,
      default: false,
    },

    currentTime: {
      type: [Number, String],
      required: false,
      default: 0,
    },

  },

  // emits: ['play', 'pause', 'timeupdate', 'update:modelValue'],
  emits: [
    'update:isPlaying',
    'update:currentTime',
    'play',
    'pause',
    'end',
  ],

  data() {
    return {
      videoData: {
        isPlaying: false,
        time: null,
      },
    }
  },

  watch: {
    isPlaying(val) {
      if (!this.$el) {
        return
      }

      val ? this.$el.play() : this.$el.pause()
    },
  },

  methods: {
    onVideoPlay(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000)
      this.videoData.isPlaying = true

      this.$emit('play')
      this.$emit('update:isPlaying', this.videoData.isPlaying)
      this.$emit('update:currentTime', this.videoData.time)
    },

    onVideoPause(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000)
      this.videoData.isPlaying = false

      this.$emit('pause')
      this.$emit('update:isPlaying', this.videoData.isPlaying)
      this.$emit('update:currentTime', this.videoData.time)
    },

    onVideoTimeupdate(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000)
      this.$emit('update:currentTime', this.videoData.time)
    },
  },
}
</script>