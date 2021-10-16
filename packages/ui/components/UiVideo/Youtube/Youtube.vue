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

<script>
export default {
  name: 'CmsMediaVideo',
  props: {
    url: {
      type: String,
      required: true,
    },
  },

  emits: ['update:modelValue', 'play', 'pause', 'end', 'timeupdate'],

  data() {
    return {
      player: null,
      interval: null,
      videoData: {
        isPlaying: false,
        time: null,
      },
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
    playing(val) {
      val && this.player ? this.player.playVideo() : this.player.pauseVideo()
    },

    url() {
      this.initializePlayer()
    },
  },

  mounted() {
    this.initializePlayer()
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
      if (this.player) {
        return
      }

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
        this.videoData.time = 0
        this.videoData.isPlaying = false
        this.$emit('update:modelValue', this.videoData)
        break
      case 0:
        // console.log('Fin');
        this.videoData.time = Math.floor(this.player.getCurrentTime() * 1000)
        this.videoData.isPlaying = false
        this.$emit('end', this.videoData)
        this.$emit('update:modelValue', this.videoData)
        break
      case 1:
        // console.log('Playing');

        this.videoData.time = Math.floor(this.player.getCurrentTime() * 1000)
        this.videoData.isPlaying = true
        this.$emit('play', this.videoData)
        this.$emit('update:modelValue', this.videoData)

        this.interval = setInterval(() => {
          this.videoData.time = Math.floor(this.player.getCurrentTime() * 1000)
          this.$emit('timeupdate', this.videoData)
          this.$emit('update:modelValue', this.videoData)
        }, 200)

        break
      case 2:
        // console.log('Pause');
        this.videoData.time = Math.floor(this.player.getCurrentTime() * 1000)
        this.videoData.isPlaying = false
        this.$emit('pause', this.videoData)
        this.$emit('update:modelValue', this.videoData)
        break
      }
    },

    play() {
      this.player && this.player.playVideo()
    },

    pause() {
      this.player && this.player.pauseVideo()
    },

    stop() {
      this.player && this.player.stopVideo()
    },

    // Tiempo del video en milisegundos
    async getCurrentTime() {
      return this.player
        ? Math.floor(this.player.getCurrentTime() * 1000)
        : null
    },
  },
}
</script>

<style lang="scss">
.cms-media-video-youtube {
  width: 100%;
  height: 100%;
  min-height: inherit;
}
</style>