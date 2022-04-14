<script setup>
import bytes from '../../../filters/bytes.js'

const props = defineProps({
  value: {
    type: Object,
    required: false,
    default: null,
  },
})
</script>

<template>
  <a
    v-if="props.value"
    class="outputUpload"
    :title="props.value.name"
    target="_blank"
    :href="props.value.url"
  >
    <img
      v-if="props.value.thumbnail"
      class="outputUpload__thumbnail"
      :src="props.value.thumbnail"
    >
    <div class="outputUpload__body">
      <h3
        class="outputUpload__name"
        v-text="props.value.name"
      />
      <span
        class="outputUpload__size"
        v-text="bytes(props.value.size)"
      />
    </div>
  </a>
</template>

<style lang="scss">
.outputUpload {
  position: relative;
  background: rgba(238, 238, 238, 0.6);
  padding: 8px;
  max-width: 180px;
  margin-bottom: 8px;

  display: flex;
  &__body {
    flex: 1;
    min-width: 0;
  }

  &:hover {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0, 0.2);
    }
  }

  &__thumbnail {
    overflow: hidden;
    width: 32px;
    height: 100%;
    margin-right: 8px;
  }

  &__name {
    display: block;
    font-size: 1em;
    font-weight: normal;
    margin: 0;

    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  &__size {
    font-size: 12px;
    display: block;
  }
}
</style>