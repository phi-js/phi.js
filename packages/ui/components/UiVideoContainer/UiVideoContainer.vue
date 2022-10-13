<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref } from 'vue'
import { UiVideo } from '../UiVideo'

const props = defineProps({
  isLoaded: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const isLoaded = ref(props.isLoaded)
const isPlaying = ref(false)

function play() {
  isPlaying.value = true
}

function pause() {
  isPlaying.value = false
}

function onPlay() {
  isLoaded.value = true
}

const videoRef = ref()
defineExpose({
  goToChapter: (args) => videoRef.value?.goToChapter?.(args),
  play: () => videoRef.value?.play?.(),
  pause: () => videoRef.value?.pause?.(),
  stop: () => videoRef.value?.stop?.(),
})
</script>

<template>
  <div
    class="UiVideoContainer"
    :class="$attrs.class"
    :style="$attrs.style"
  >
    <UiVideo
      ref="videoRef"
      v-bind="{ ...$attrs, class: undefined, style: undefined }"
      v-model:isPlaying="isPlaying"
      class="UiVideoContainer__video"
      @play="onPlay"
    />
    <div
      v-if="isLoaded"
      class="UiVideoContainer__slot"
    >
      <slot
        :play="play"
        :pause="pause"
        :is-playing="isPlaying"
      />
    </div>
  </div>
</template>

<style lang="scss">
.UiVideoContainer {
  position: relative;

  &__video {
    width: 100%;
    height: 100%;
  }

  &__slot {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 50px; // make room for video controls
    left: 0;

    // overflow: auto; // fucks up block editor face (toolbar is hidden within container)
  }
}
</style>