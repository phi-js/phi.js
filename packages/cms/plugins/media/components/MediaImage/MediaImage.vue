<script setup>
import { computed, ref, watch } from 'vue'

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

const isError = ref(false)

watch(
  () => props.src,
  (newValue) => isError.value = !newValue,
  { immediate: true },
)

function onImageError() {
  isError.value = true
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
    :align="props.align"
    style="max-width: 100%"
  >
    <img
      class="MediaImage__img"
      :alt="src"
      :src="src"
      :style="imgStyle"
      @error="onImageError"
    >
  </a>
  <div
    v-else
    class="MediaImage"
    :align="props.align"
    style="max-width: 100%"
  >
    <img
      class="MediaImage__img"
      :alt="src"
      :src="src"
      :style="imgStyle"
      @error="onImageError"
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
</style>