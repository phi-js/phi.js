<template>
  <div class="media-video-picker">
    <div class="media-video-picker-form">
      <input
        class="ui-native"
        type="text"
        :value="value"
        @input="$emit('input', $event.target.value)"
        placeholder="URL (YouTube o Vimeo)"
      />
    </div>

    <UiVideo :url="value"></UiVideo>
  </div>
</template>

<script>
import { UiVideo } from '../../../../../ui';

export default {
  name: 'MediaVideoPicker',
  components: { UiVideo },
  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },
  },
};
</script>

<style lang="scss">
.media-video-picker {
  .media-video-picker-form {
    input {
      width: 100%;
      border-bottom: 0;
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
    }
  }
}
</style>