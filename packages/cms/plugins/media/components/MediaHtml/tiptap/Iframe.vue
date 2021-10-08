<template>
  <div class="iframe omgfoo">
    <iframe
      class="iframe__embed"
      :src="src"
    ></iframe>
    <input
      class="iframe__input"
      @paste.stop
      type="text"
      v-model="src"
      v-if="view.editable"
    />
  </div>
</template>

<script>
export default {
  props: ['node', 'updateAttrs', 'view'],
  computed: {
    src: {
      get() {
        return this.node.attrs.src;
      },
      set(src) {
        this.updateAttrs({
          src,
        });
      },
    },
  },
};
</script>

<style lang="scss">
.omgfoo {
  border: 1px solid red;
  display: inline-block;

  .iframe__input {
    display: block;
    width: 100%;
  }
}
</style>