<template>
  <div class="MediaVideoPicker">
    <div class="MediaVideoPicker__infobox">
      <UiInput
        v-if="endpoint"
        type="url"
        :endpoint="endpoint"
        :model-value="modelValue"
        placeholder="Video URL"
        class="MediaVideoPicker__url"
        @update:modelValue="$emit('update:modelValue', $event)"
      />
      <div v-else class="MediaVideoPicker__form">
        <input
          class="UiInput"
          type="text"
          :value="modelValue"
          placeholder="URL (YouTube o Vimeo)"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>
    </div>

    <UiVideo :url="modelValue" />
  </div>
</template>

<script>
import { UiVideo, UiInput } from '../../../../../ui'

export default {
  name: 'MediaVideoPicker',
  components: { UiVideo, UiInput },
  props: {
    modelValue: {
      type: String,
      required: false,
      default: null,
    },

    endpoint: {
      type: String,
      required: false,
      default: null,
    },
  },
  emits: ['update:modelValue'],
}
</script>

<style lang="scss">
.MediaVideoPicker {
  position: relative;

  &__infobox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    padding: 8px;
    background-color: rgba(0, 0, 0, 0.5);

    opacity: 0;
    transition: opacity var(--ui-duration-snap);
    pointer-events: none;

    & > * {
      pointer-events: initial;
    }
  }

  &:hover &__infobox {
    opacity: 1;
  }
}
</style>