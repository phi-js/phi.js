<template>
  <div class="ui-video">
    <component
      :is="videoComponent"
      v-if="videoComponent"
      ref="video"
      v-bind="$attrs"
      :url="url"
      @timeupdate="onTimeupdate"
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
import VideoNative from './Native/Native.vue'
import VideoYoutube from './Youtube/Youtube.vue'
import VideoVimeo from './Vimeo/Vimeo.vue'
import VideoMicrosoft from './Microsoft/Microsoft.vue'

export default {
  name: 'UiVideo',

  components: {
    VideoNative,
    VideoYoutube,
    VideoVimeo,
    VideoMicrosoft,
  },

  props: {
    /**
     * URL del video (YouTube, Vimeo o Microsoft)
     */
    url: {
      type: String,
      required: false,
      default: null,
    },

    /**
     * Objeto con información sobre el estado actual del video
     * @model
     * <pre>
     * {
     *  "isPlaying": false,  // bool. Indica si el video se está reproduciendo
     *  "time": 27608750538  // int. Tiempo actual del video (ms.)
     * }
     * </pre>
     */
    modelValue: {
      type: Object,
      required: false,
      default: null,
    },

    /**
     * Arreglo especificando capitulos
     * <pre>
     * [
     *   {
     *     name: "Capitulo 1",
     *     start: 0,
     *     end: 3000  // ms.
     *   },
     *   ...
     * ]
     * </pre>
     */
    chapters: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  emits: ['update:chapters', 'chapter-enter', 'chapter-leave'],

  data() {
    return { innerChapters: [] }
  },

  computed: {
    videoComponent() {
      if (!this.url) {
        return null
      }

      if (/(youtube\.|youtu\.)/.test(this.url)) {
        return 'VideoYoutube'
      }

      if (/(vimeo\.)/.test(this.url)) {
        return 'VideoVimeo'
      }

      if (/(microsoftstream\.com)/.test(this.url)) {
        return 'VideoMicrosoft'
      }

      return 'VideoNative'
    },
  },

  mounted() {
    this.innerChapters = []
    let incoming = Array.isArray(this.chapters) ? this.chapters : []
    for (let i = 0; i < incoming.length; i++) {
      let chapter = incoming[i]
      if (!chapter || typeof chapter != 'object') {
        continue
      }

      this.innerChapters.push({
        name: chapter.name || i,
        start: chapter.start || 0,
        end: chapter.end || Infinity,
        _active: false,
      })
    }
  },

  methods: {
    onTimeupdate(evt) {
      let activeChapters = []
      let hasChanged = false
      for (let i = 0; i < this.innerChapters.length; i++) {
        let c = this.innerChapters[i]
        let isActive = c.start <= evt.time && evt.time < c.end
        if (isActive != c._active) {
          c._active = isActive
          hasChanged = true
          this.$emit(isActive ? 'chapter-enter' : 'chapter-leave', c.name)
        }

        if (isActive) {
          activeChapters.push(c.name)
        }
      }

      if (hasChanged) {
        this.$emit('update:chapters', activeChapters)
      }
    },

    /**
     * Se invoca cuando el video inicia la reproducción
     * @event play
     */
    /**
     * Iniciar la reproducción
     * @public
     * @fires play
     */
    play() {
      this.$refs.video.play()
    },

    /**
     * Se invoca cuando se pausa el video
     * @event pause
     */
    /**
     * Pausar la reproducción
     * @public
     * @fires pause
     */
    pause() {
      this.$refs.video.pause()
    },

    /**
     * Se invoca cuando el video se detiene
     * @event stop
     */
    /**
     * Detener la reproducción
     * @public
     * @fires stop
     */
    stop() {
      this.$refs.video.stop()
    },

    /**
     * Se dispara cada 200ms mientras el video se esté reproduciendo
     * @event timeupdate
     * @property { Object } videoData - Objeto con los datos del video
     */
    /**
     * Obtener el tiempo actual del video (milisegundos)
     * @public
     * @fires timeupdate
     */
    async getCurrentTime() {
      return this.$refs.video ? this.$refs.video.getCurrentTime() : null
    },
  },
}
</script>

<style lang="scss">
.ui-video {
  width: 100%;
  height: 100%;
  min-height: 100px;

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