<template>
  <div class="cms-media-video-microsoft">
    <iframe
      v-if="iframeSrc"
      :src="iframeSrc"
      width="100%"
      height="420"
      frameborder="0"
      webkitallowfullscreen
      mozallowfullscreen
      allowfullscreen
    ></iframe>
    <div
      v-else
      class="empty-video"
    >{{ url ? 'URL inválida' : 'No hay URL' }}</div>
  </div>
</template>

<script>
export default {
  name: 'cms-media-video-microsoft',
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
    };
  },

  computed: {
    iframeSrc() {
      let match = this.url.match(/^.*(\/video\/)([^#&?]*).*/);
      let videoId = match && match[2] && match[2].length ? match[2] : null;

      if (!videoId) {
        return null;
      }

      return `https://web.microsoftstream.com/embed/video/${videoId}?autoplay=false&preload=none`;
    },
  },

  methods: {
    play() {},
    pause() {},
    stop() {},
    async getCurrentTime() {},
  },
};
</script>

<style lang="scss">
.cms-media-video-microsoft {
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