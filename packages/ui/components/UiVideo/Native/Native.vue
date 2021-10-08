<template>
  <video
    class="UiVideoNative"
    width="100%"
    height="100%"
    controls
    :src="url"
    @play="onVideoPlay"
    @pause="onVideoPause"
    @timeupdate="onVideoTimeupdate"
    v-bind="$attrs"
  ></video>
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

  data() {
    return {
      videoData: {
        isPlaying: false,
        time: null,
      },
    };
  },

  methods: {
    onVideoPlay(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000);
      this.videoData.isPlaying = true;

      this.$emit('play', this.videoData);
      this.$emit('input', this.videoData);
    },

    onVideoPause(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000);
      this.videoData.isPlaying = false;

      this.$emit('pause', this.videoData);
      this.$emit('input', this.videoData);
    },

    onVideoTimeupdate(evt) {
      this.videoData.time = Math.floor(evt.target.currentTime * 1000);

      this.$emit('timeupdate', this.videoData);
      this.$emit('input', this.videoData);
    },

    play() {
      this.$el && this.$el.play();
    },

    pause() {
      this.$el && this.$el.pause();
    },

    stop() {
      this.$el && this.$el.pause();
    },

    // Tiempo del video en milisegundos
    async getCurrentTime() {
      return this.$el ? Math.floor(this.$el.currentTime * 1000) : null;
    },
  },
};
</script>