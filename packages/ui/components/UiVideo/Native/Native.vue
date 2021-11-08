<template>
  <video
    class="UiVideoNative"
    width="100%"
    height="100%"
    controls
    :src="url"
    v-bind="$attrs"
    style="min-width: 300px; height: auto;"
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
  },

  emits: ['play', 'pause', 'timeupdate', 'update:modelValue'],

  data() {
    return {
      videoData: {
        isPlaying: false,
        time: null,
      },
    }
  },

  methods: {
    onVideoPlay(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000)
      this.videoData.isPlaying = true

      this.$emit('play', this.videoData)
      this.$emit('update:modelValue', this.videoData)
    },

    onVideoPause(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000)
      this.videoData.isPlaying = false

      this.$emit('pause', this.videoData)
      this.$emit('update:modelValue', this.videoData)
    },

    onVideoTimeupdate(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000)

      this.$emit('timeupdate', this.videoData)
      this.$emit('update:modelValue', this.videoData)
    },

    play() {
      this.$el && this.$el.play()
    },

    pause() {
      this.$el && this.$el.pause()
    },

    stop() {
      if (!this.$el) {
        return
      }

      this.$el.pause()
      this.$el.currentTime = 0
    },

    // Tiempo del video en milisegundos
    async getCurrentTime() {
      return this.$el ? Math.floor(this.$el.currentTime * 1000) : null
    },
  },
}
</script>