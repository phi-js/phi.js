<script>
export default {
  name: 'CmsMediaVideo',
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

  emits: [
    'update:isPlaying',
    'update:currentTime',
    'play',
    'pause',
    'end',
  ],

  data() {
    return {
      player: null,
      interval: null,
      ignoreChanges: false,
    }
  },

  computed: {
    iframeSrc() {
      let match = this.url.match(/^.*(youtube|youtu).*/)
      if (!match) {
        return null
      }
      match = this.url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/)
      let videoId = match && match[2] && match[2].length ? match[2] : null

      if (!videoId) {
        return null
      }
      return `https://www.youtube.com/embed/${videoId}?enablejsapi=1`
    },
  },

  watch: {
    isPlaying(val) {
      if (!this.player) {
        return
      }

      val ? this.player.playVideo() : this.player.pauseVideo()
    },

    currentTime(val) {
      if (!this.player) {
        return
      }

      if (this.ignoreChanges) {
        this.ignoreChanges = false
        return
      }

      if (val == 0) {
        this.player.stopVideo()
      } else if (val > 0) {
        this.player.seekTo(Math.floor(val / 1000))
      }
    },

    url() {
      this.initializePlayer()
    },
  },

  mounted() {
    this.initializePlayer()
  },

  beforeUnmount() {
    clearInterval(this.interval)
  },

  methods: {
    // Se puede llamar multiples veces y se asegura de solo crear el <script> un avez
    loadApi() {
      if (window._phi_YouTubeLoader) {
        return new Promise((resolve) => window._phi_YouTubeLoader.then(() => resolve()))
      }

      window._phi_YouTubeLoader = new Promise((resolve) => {
        window.onYouTubeIframeAPIReady = () => resolve()

        var tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      })

      return window._phi_YouTubeLoader
    },

    initializePlayer() {
      this.loadApi().then(() => {
        //eslint-disable-next-line
        this.player = new YT.Player(this.$el.querySelector('iframe'), {
          events: {
            // onReady: this.onPlayerReady,
            onStateChange: this.onPlayerStateChange,
          },
        })
      })
    },

    // onPlayerReady(event) {
    //   console.log('Youtube onPlayerReady', event);
    // },

    onPlayerStateChange(event) {
      /* event.data:
        -1: no iniciado
        0: fin
        1: playing
        2: paused
        3: buffering
        5: queued
      */
      clearInterval(this.interval)

      switch (event.data) {
      case -1:
        // console.log('No iniciado');
        this.ignoreChanges = true

        this.$emit('update:isPlaying', false)
        this.$emit('update:currentTime', 0)
        break

      case 0:
        // console.log('Fin');
        this.ignoreChanges = true

        this.$emit('end')
        this.$emit('update:isPlaying', false)
        this.$emit('update:currentTime', Math.floor(this.player.getCurrentTime() * 1000))
        break

      case 1:
        // console.log('Playing');
        this.ignoreChanges = true

        this.$emit('play')
        this.$emit('update:isPlaying', true)
        this.$emit('update:currentTime', Math.floor(this.player.getCurrentTime() * 1000))

        this.interval = setInterval(() => {
          this.ignoreChanges = true
          this.$emit('update:currentTime', Math.floor(this.player.getCurrentTime() * 1000))
        }, 200)

        break

      case 2:
        // console.log('Pause');
        this.ignoreChanges = true

        this.$emit('pause')
        this.$emit('update:isPlaying', false)
        this.$emit('update:currentTime', Math.floor(this.player.getCurrentTime() * 1000))
        break
      }
    },
  },
}
</script>

<template>
  <div class="cms-media-video-youtube">
    <iframe
      v-if="iframeSrc"
      :src="iframeSrc"
      width="100%"
      height="100%"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
      style="min-height:inherit; background:inherit"
    />
    <div
      v-else
      class="empty-video"
    >
      Video no encontrado
    </div>
  </div>
</template>

<style lang="scss">
.cms-media-video-youtube {
  width: 100%;
  height: 100%;
  min-height: inherit;
}
</style>