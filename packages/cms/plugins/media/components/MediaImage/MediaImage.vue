<template>
  <div
    :class="['MediaImage', {'ui-clickable': !!this.href}]"
    @click="onClick()"
    :style="containerStyle"
  >
    <img
      v-if="src && !isError"
      :src="src"
      :style="imgStyle"
      @error="onImageError"
    />
    <div
      v-else
      class="media-image-placeholder"
    ></div>
  </div>
</template>

<script>
export default {
  name: 'MediaImage',
  props: {
    src: {
      type: String,
      required: false,
      default: null,
    },

    align: {
      type: String,
      required: false,
      default: 'center', // left, right, center
    },

    width: {
      type: String,
      required: false,
      default: 'auto', // CSS width property applied to <img> element
    },

    href: {
      type: String,
      required: false,
      default: null,
    },

    height: {
      type: [Number, String],
      required: false,
      default: 350,
    },

    sizing: {
      type: String,
      required: false,
      default: 'contain', // "cover" o "contain"
    },

    attachment: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      isError: false,
    };
  },

  computed: {
    imgStyle() {
      return {
        width: this.width || '',
      };
    },

    containerStyle() {
      return {
        textAlign: this.align,
      };
      // return {
      //   backgroundImage: this.src ? `url(${this.src})` : '',
      //   backgroundSize: this.sizing,
      //   backgroundRepeat: 'no-repeat',
      //   backgroundPosition: '50% 0',
      //   backgroundAttachment: this.attachment,
      //   height: parseInt(this.height) + 'px',
      // };
    },
  },

  watch: {
    src: {
      immediate: true,
      handler() {
        this.isError = false;
      },
    },
  },

  methods: {
    onClick() {
      this.$emit('click');
      if (!this.href) {
        return;
      }

      window.open(this.href, '_system');
    },

    onImageError() {
      this.isError = true;
    },
  },
};
</script>

<style lang="scss">
.MediaImage {
  & > img {
    display: inline-block;
    margin: auto;
    // width: 100%;
    max-width: 100%;
  }

  .media-image-placeholder {
    width: 100%;
    max-width: 100%;
    height: 256px;
    border: 1px dashed #999;
    background-color: rgba(0, 0, 0, 0.1);

    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>