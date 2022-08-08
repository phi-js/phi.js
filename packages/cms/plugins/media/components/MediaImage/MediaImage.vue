<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: false,
    default: null,
  },

  height: {
    type: [Number, String],
    required: false,
    default: null, // CSS height property applied to container element
  },

  align: {
    type: String,
    required: false,
    default: 'center', // left, right, center
  },

  href: {
    type: String,
    required: false,
    default: null,
  },

})

const isError = ref(false)
const containerStyle = computed(() => ({
  height: props.height || undefined,
  boxSizing: 'border-box',
  overflowX: 'clip',
  display: 'flex',
  justifyContent: props.align,
  // textAlign: props.align,
  // backgroundPosition: `top ${props.align}`,
  // backgroundRepeat: 'no-repeat',
  // backgroundImage: `url(${props.src})`,
  // backgroundSize: 'contain',
}))

const imgStyle = computed(() => ({
  height: '100%',
  maxWidth: '100%',
}))

watch(
  () => props.src,
  (newValue) => isError.value = !newValue,
  { immediate: true },
)

function onImageError() {
  isError.value = true
}
</script>

<template>
  <div
    class="MediaImage"
    :style="containerStyle"
  >
    <div
      v-if="isError"
      class="MediaImage__placeholder"
    />
    <template v-else>
      <a
        v-if="href"
        :href="href"
        target="_system"
        class="MediaImage__link"
      >
        <img
          class="MediaImage__img"
          :src="src"
          :style="imgStyle"
          @error="onImageError"
        >
      </a>
      <img
        v-else
        class="MediaImage__img"
        :src="src"
        :style="imgStyle"
        @error="onImageError"
      >
    </template>
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

  &__placeholder {
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