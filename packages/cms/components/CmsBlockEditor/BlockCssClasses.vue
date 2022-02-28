<script setup>
import { watch, ref, computed } from 'vue'
import { UiItem } from '@/packages/ui'
import availableClasses from '../../style/classes/index.js'

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

const selectedClasses = ref([])

const allClases = computed(() => availableClasses.map((objClass) => {
  let selectedVariation = ''
  if (objClass.variations?.length) {
    const foundVariation = objClass.variations.find((variation) => selectedClasses.value.includes(variation.name))
    if (foundVariation) {
      selectedVariation = foundVariation.name
    }
  }

  return {
    ...objClass,
    isSelected: selectedClasses.value.includes(objClass.name),
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
    removeClass(objClass.name)
    if (objClass?.variations?.length) {
      objClass.variations.forEach((variation) => removeClass(variation.name))
    }
  } else {
    addClass(objClass.name)
    if (objClass?.variations?.length) {
      addClass(objClass.variations[0].name)
    }
  }

  emitUpdate()
}

function setVariation(objClass, variationClassName) {
  objClass.variations.forEach((variation) => removeClass(variation.name))
  addClass(variationClassName)
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
  <div class="BlockCssClasses">
    <div
      v-for="objClass in allClases"
      :key="objClass.name"
      class="BlockClass ui--clickable"
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
          class="UiInput"
          :value="objClass.selectedVariation"
          @change="setVariation(objClass, $event.target.value)"
        >
          <option
            v-for="variation in objClass.variations"
            :key="variation.name"
            :value="variation.name"
            v-text="variation.text"
          />
        </select>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.BlockCssClasses {
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