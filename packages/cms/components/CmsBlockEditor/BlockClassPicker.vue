<script setup>
import { watch, ref, computed } from 'vue'
import { UiItem } from '@/packages/ui'

const props = defineProps({
  /*
  Array of class names
  */
  modelValue: {
    type: Array,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const availableClassess = ref([
  {
    class: 'FullHeight',
    text: 'Altura completa',
    subtext: 'Ocupar todo el alto de la pantalla',
    css: '',
  },

  {
    class: 'FlexCenter',
    text: 'Centered flex',
    subtext: 'Content will be centered horizontally and vertically',
  },

  {
    class: 'BlockCard',
    text: 'Card',
    subtext: 'Una tarjeta, varia segun el tema',
    css: '',
  },

  {
    class: 'BlockShadow',
    text: 'Sombra',
    subtext: 'Ilusión de relieve',
    css: '',

    variations: [
      {
        class: 'BlockShadow--z-1',
        text: 'Altura 1',
      },
      {
        class: 'BlockShadow--z-2',
        text: 'Altura 2',
      },
      {
        class: 'BlockShadow--z-3',
        text: 'Altura 3',
      },
      {
        class: 'BlockShadow--z-4',
        text: 'Altura 4',
      },
    ],
  },

  {
    class: 'BlockOpacity',
    text: 'Opacidad',
    subtext: 'Nivel de opacidad',
    css: '',

    variations: [
      {
        class: 'BlockOpacity--75',
        text: '75%',
      },
      {
        class: 'BlockOpacity--50',
        text: '50%',
      },
      {
        class: 'BlockOpacity--25',
        text: '25%',
      },
    ],
  },

  {
    class: 'BlackBox',
    text: 'Black box',
    subtext: 'Square with black background and high contrast font',
  },
])

const selectedClasses = ref([])

const allClases = computed(() => availableClassess.value.map((objClass) => {
  let selectedVariation = ''
  if (objClass.variations?.length) {
    const foundVariation = objClass.variations.find((variation) => selectedClasses.value.includes(variation.class))
    if (foundVariation) {
      selectedVariation = foundVariation.class
    }
  }

  return {
    ...objClass,
    isSelected: selectedClasses.value.includes(objClass.class),
    selectedVariation,
  }
}))

watch(
  () => props.modelValue,
  (newValue) => selectedClasses.value = Array.isArray(newValue) ? JSON.parse(JSON.stringify(newValue)) : [],
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', selectedClasses.value.length ? JSON.parse(JSON.stringify(selectedClasses.value)) : null)
}

function selectClass(objClass) {
  if (objClass.isSelected) {
    removeClass(objClass.class)
    if (objClass?.variations?.length) {
      objClass.variations.forEach((variation) => removeClass(variation.class))
    }
  } else {
    addClass(objClass.class)
    if (objClass?.variations?.length) {
      addClass(objClass.variations[0].class)
    }
  }

  emitUpdate()
}

function setVariation(objClass, variationClass) {
  objClass.variations.forEach((variation) => removeClass(variation.class))
  addClass(variationClass)
  emitUpdate()
}

function addClass(className) {
  if (selectedClasses.value.includes(className)) {
    return
  }
  selectedClasses.value.push(className)
}

function removeClass(className) {
  const foundIndex = selectedClasses.value.indexOf(className)
  if (foundIndex === -1) {
    return
  }
  selectedClasses.value.splice(foundIndex, 1)
}
</script>

<template>
  <div class="BlockClassPicker">
    <div
      v-for="objClass in allClases"
      :key="objClass.class"
      class="BlockClass ui--clickable ui--noselect"
    >
      <UiItem
        :text="objClass.text"
        :subtext="objClass.subtext"
        :icon="objClass.isSelected ? 'mdi:checkbox-marked' : 'mdi:checkbox-blank-outline'"
        class="BlockClass__item"
        @click="selectClass(objClass)"
      />

      <div
        v-if="objClass.variations?.length && objClass.isSelected"
        class="BlockClass__options"
      >
        <select
          class="ui-native"
          :value="objClass.selectedVariation"
          @change="setVariation(objClass, $event.target.value)"
        >
          <option
            v-for="variation in objClass.variations"
            :key="variation.class"
            :value="variation.class"
            v-text="variation.text"
          />
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.BlockClassPicker {
  .BlockClass {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;

    &__item {
      flex: 1;
    }

    &__options {
      margin-left: 28px;
      padding: 8px;
    }
  }
}
</style>