<!-- eslint-disable max-len -->
<script>
export default {
  name: 'UiVideoYoutube',
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

    /* IFRAME props */
    autoplay: {
      type: [Boolean, String, Number],
      required: false,
      default: false,
    },

    controls: {
      type: [Boolean, String, Number],
      required: false,
      default: true,
    },

    mute: {
      type: [Boolean, String, Number],
      required: false,
      default: false,
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
      return `https://www.youtube.com/embed/${videoId}?controls=${this.controls ? '1' : '0'}&enablejsapi=1&mute=${this.mute ? '1' : '0'}&playsinline=1${this.autoplay ? '&autoplay=1' : ''}`
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

      this.player.seekTo(Math.floor(val / 1000))
      this.$emit('update:currentTime', val)
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
    // Se puede llamar multiples veces y se asegura de solo crear el <script> una vez
    loadApi() {
      if (window._phi_YouTubeLoader) {
        // return new Promise((resolve) => window._phi_YouTubeLoader.then(() => resolve()))
        return window._phi_YouTubeLoader
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
        this.player = new YT.Player(this.$el, {
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
        }, 100)

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
  <iframe
    v-if="iframeSrc"
    class="UiVideoYoutube"
    :src="iframeSrc"
    frameborder="0"
    webkitallowfullscreen
    mozallowfullscreen
    allowfullscreen
  />
  <div
    v-else
    class="UiVideoYoutube UiVideoYoutube--empty"
  >
    Video no encontrado
  </div>
</template>