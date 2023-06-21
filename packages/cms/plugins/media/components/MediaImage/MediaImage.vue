<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, ref, watch, useAttrs } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: null,
  },

  align: {
    type: String,
    required: false,
    default: 'center', // center, left, right
  },

  /*
  To be applied to <img> object-fit CSS property directly
  */
  objectFit: {
    type: String,
    required: false,
    default: 'contain', // cover, contain, none, ...
  },

  /* Link ptops (href, target) */
  href: {
    type: String,
    required: false,
    default: null,
  },

  target: {
    type: String,
    required: false,
    default: '_self',
  },
})

const attrs = useAttrs()

const isError = ref(false)
const isLoading = ref()

// Debounce changes to 'src'
const innerSrc = ref(props.src || '')
let loadTimeout = null

watch(
  () => props.src,
  (newValue) => {
    innerSrc.value = newValue

    isError.value = !newValue
    clearTimeout(loadTimeout)
    loadTimeout = setTimeout(() => isLoading.value = true, 50)
  },
  { immediate: true },
)

function onImageError() {
  isError.value = true
}

function onImageLoad() {
  clearTimeout(loadTimeout)
  isLoading.value = false
}

const imgStyle = computed(() => {
  return {
    'height': '100%',
    'max-width': '100%',
    'object-fit': props.objectFit,
    'object-position': props.align,
  }
})
</script>

<template>
  <div
    v-if="isError"
    class="MediaImage MediaImage--error"
    style="max-width: 100%"
  />
  <a
    v-else-if="href"
    :href="href"
    :target="target"
    class="MediaImage MediaImage--link"
    :class="{'MediaImage--loading': isLoading}"
    :align="props.align"
    style="max-width: 100%"
  >
    <img
      class="MediaImage__img"
      v-bind="attrs"
      :src="innerSrc"
      :style="imgStyle"
      @error="onImageError"
      @load="onImageLoad"
    >
  </a>
  <div
    v-else
    class="MediaImage MediaImage--div"
    :class="{'MediaImage--loading': isLoading}"
    :align="props.align"
    style="max-width: 100%"
  >
    <img
      class="MediaImage__img"
      v-bind="attrs"
      :src="innerSrc"
      :style="imgStyle"
      @error="onImageError"
      @load="onImageLoad"
    >
  </div>
</template>

<style lang="scss">
.MediaImage {
  // Los estilos de MediaImage se asignan en la propiedad <img> directamente
  // para no depender de la declaracion CSS de un archivo externo, y poder portarlo (para exportarlo a PDF, por ejemplo)

  // &__img {
  //   display: inline-block; // inline-block para reacionar a text-align del padre
  //   margin: auto;
  //   max-width: 100%;
  //   max-height: 100%;
  // }

  &--loading &__img {
    // border: 3px dashed red;
    // border-radius: 3px;
    // background-color: var(--ui-color-hover);
    min-width: 120px;
    min-height: 120px;

    background: linear-gradient(to bottom, #cccccc33, #ffffff33);
    background-size: 100% 200%;
    animation: loadingAnimation 4s linear infinite;
  }

  &--error {
    width: 100%;
    max-width: 100%;
    height: 256px !important;
    border: 1px dashed #999;
    background-color: rgba(0, 0, 0, 0.1);

    display: flex;
    align-items: center;
    justify-content: center;
  }
}

@keyframes loadingAnimation {
  0% {
    background-position: 0 200%;
  }
  100% {
    background-position: 0 -200%;
  }
}
</style>