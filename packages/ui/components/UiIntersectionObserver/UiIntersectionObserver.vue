<script>
export default {
  name: 'UiIntersectionObserver',

  props: {
    threshold: {
      type: [String, Number],
      required: false,
      default: '0.0'
    }
  },

  /*
  Emits SHOW when the visible element portion exceeds the threshold
  Emits HIDE when the visible element is below the threshold
  */
  emits: ['show', 'hide'], // show: the event is scroll into a fully visible position.  hide: event is occluded or hiden

  data() {
    return {
      IntersectionObserver: null,
    };
  },

  methods: {
    callbackObserver(entries) {
      entries.forEach(({ isIntersecting }) => {
        isIntersecting ? this.$emit('show') : this.$emit('hide')
      });
    },
  },

  created() {
    this.IntersectionObserver = new IntersectionObserver(
      this.callbackObserver,
      {
        root: this.$el,
        threshold: this.threshold,
      }
    );
  },

  mounted() {
    this.IntersectionObserver.observe(this.$el);
  },

  beforeDestroy() {
    this.IntersectionObserver.disconnect();
  },
};
</script>

<template>
  <div class="UiIntersectionObserver">
    <slot></slot>
  </div>
</template>