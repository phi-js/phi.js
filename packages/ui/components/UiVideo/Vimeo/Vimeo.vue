<template>
  <div class="cms-media-video-vimeo">
    <iframe
      v-if="iframeSrc"
      :src="iframeSrc"
      width="100%"
      height="420"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    />
    <div
      v-else
      class="empty-video"
    >
      {{ url ? 'URL inválida' : 'No hay URL' }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiVideoVimeo',
  props: {
    url: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      player: null,
      videoData: {
        isPlaying: false,
        time: null,
      },
    }
  },

  computed: {
    iframeSrc() {
      let match = this.url.match(/^.*(vimeo).*/)
      if (!match) {
        return null
      }

      match = this.url.match(/^.*(vimeo.com\/)([^#&?]*).*/)
      let videoId = match && match[2] && match[2].length ? match[2] : null

      if (!videoId) {
        return null
      }

      return `https://player.vimeo.com/video/${videoId}?color=ffffff&title=0&byline=0&portrait=0`
    },
  },

  watch: {
    url() {
      this.initializePlayer()
    },
  },

  mounted() {
    this.initializePlayer()
  },

  methods: {
    loadApi() {
      return new Promise((resolve /*, reject*/) => {
        if (document.getElementById('script-api-vimeo')) {
          return resolve()
        }

        var tag = document.createElement('script')
        tag.id = 'script-api-vimeo'
        tag.src = 'https://player.vimeo.com/api/player.js'
        tag.onload = () => {
          resolve()
        }

        var firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      })
    },

    initializePlayer() {
      if (this.player) {
        return
      }

      this.loadApi().then(() => {
        // this.player is a PROXY object, which fucks up .on('xxx') calls.  use as const instead
        // this.player = new Vimeo.Player(this.$el.querySelector('iframe'));
        const player = new Vimeo.Player(this.$el.querySelector('iframe'))

        player.on('play', (/*eventData*/) => {
          this.videoData.isPlaying = true
          this.$emit('play', this.videoData)
          this.$emit('input', this.videoData)
        })

        player.on('pause', (/*eventData*/) => {
          this.videoData.isPlaying = false
          this.$emit('pause', this.videoData)
          this.$emit('input', this.videoData)
        })

        player.on('end', (/*eventData*/) => {
          this.videoData.isPlaying = false
          this.$emit('end', this.videoData)
          this.$emit('input', this.videoData)
        })

        player.on('timeupdate', (eventData) => {
          this.videoData.time = eventData.seconds * 1000
          this.$emit('update:currentTime', this.videoData.time)
          this.$emit('input', this.videoData)
        })

        this.player = player
      })
    },

    play() {
      this.player && this.player.play()
    },

    pause() {
      this.player && this.player.pause()
    },

    stop() {
      this.player && this.player.stop()
    },

    // Tiempo del video en milisegundos
    async getCurrentTime() {
      if (!this.player) {
        return null
      }

      return (await this.player.getCurrentTime()) * 1000
    },
  },
}
</script>

<style lang="scss">
.cms-media-video-vimeo {
  .empty-video {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px dashed rgba(0, 0, 0, 0.4);
    background-color: rgba(0, 0, 0, 0.08);
    min-height: 256px;
  }
}
</style>