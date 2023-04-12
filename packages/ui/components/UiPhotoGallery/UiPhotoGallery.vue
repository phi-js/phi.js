<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { UiIcon } from '../UiIcon'
// import VueZoomerGallery from './vue-zoomer/vue-zoomer-gallery.vue'
const VueZoomerGallery = defineAsyncComponent(() => import('./vue-zoomer/vue-zoomer-gallery.vue'))

const props = defineProps({
  files: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const previewList = computed(() => props.files.map((file) => file.preview).filter((i) => !!i))
const selectedFile = ref()

function openZoomer(file) {
  selectedFile.value = file
  selIndex.value = props.files.indexOf(file)
}

const selIndex = ref(0)
</script>

<template>
  <div class="UiPhotoGallery">
    <div class="UiPhotoGallery__thumbnails">
      <div
        v-for="file in files"
        :key="file.id"
        class="UiPhotoGallery__thumbnail ui--clickable"
        :style="{
          '--file-url': `url(${file.url})`,
          '--file-preview': `url(${file.preview})`,
          '--file-thumbnail': `url(${file.thumbnail})`,
        }"
        @click="openZoomer(file)"
      />
    </div>

    <div
      v-if="!!selectedFile"
      class="UiPhotoGallery__zoomer"
    >
      <UiIcon
        src="mdi:close"
        class="UiPhotoGallery__close ui--clickable"
        @click="selectedFile = null"
      />
      <VueZoomerGallery
        v-model="selIndex"
        style="width: 100%; height: 100%"
        :list="previewList"
      />
      <div
        v-show="selIndex < previewList.length - 1"
        class="UiPhotoGallery__next"
        @click="selIndex++"
      />
      <div
        v-show="selIndex > 0"
        class="UiPhotoGallery__prev"
        @click="selIndex--"
      />
    </div>
  </div>
</template>

<style lang="scss">
.UiPhotoGallery {
  &__thumbnails {
    display: flex;
    flex-wrap: wrap;
  }

  &__zoomer {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    z-index: 2;
  }

  &__close {
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 2;
    color: #fff;
    font-size: 32px;
  }

  &__next,
  &__prev {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 52px;
    cursor: pointer;

    transition: background-color var(--ui-duration-quick);
    &:hover {
      background-color: rgba(255,255,255, 0.5);
    }
  }

  &__prev {
    left: 0;
  }

  &__next {
    right: 0;
  }

  &__thumbnail {
    flex: 1;
    min-width: 120px;
    max-width: 220px;

    height: 140px;
    background-image: var(--file-thumbnail);
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
  }
}
</style>