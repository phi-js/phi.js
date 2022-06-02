<script setup>
import { ref, watchEffect, computed } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiInput, UiIcon } from '@/packages/ui'

/*
Object containing CSS Background properties:

{
  'background-image': 'url(...)',
  'background-repeat': 'norepeat',
  'background-size': 'cover',
  'background-position': '0 0',
  ...
  ... rest of properties are ignored
}
*/
const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  /* Endpoint for file uploads */
  endpoint: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

function emitUpdate() {
  emit('update:modelValue', { ...props.modelValue, ...css.value })
}

const i18n = useI18n({
  en: {
    'PropBackground.Color': 'Color',
    'PropBackground.Image': 'Image',
    'PropBackground.RemoveImage': 'Remove image',
    'PropBackground.ImageUrl': 'Image URL',
    'PropBackground.HorizontalPosition': 'Horizontal position',
    'PropBackground.VerticalPosition': 'Vertical position',
    'PropBackground.Repeat': 'Repeat',
    'PropBackground.RepeatHorizontal': 'Horizontally',
    'PropBackground.RepeatVertical': 'Vertically',
    'PropBackground.BackgroundSize': 'Image size',
    'PropBackground.sizeAuto': 'Original size',
    'PropBackground.sizeCover': 'Cover container',
    'PropBackground.sizeContain': 'Fit inside container',
    'PropBackground.BackgroundFixed': 'Fixed on scroll',
  },

  es: {
    'PropBackground.Color': 'Color',
    'PropBackground.Image': 'Imagen',
    'PropBackground.RemoveImage': 'Quitar imagen',
    'PropBackground.ImageUrl': 'URL de la imagen',
    'PropBackground.HorizontalPosition': 'Posición horizontal',
    'PropBackground.VerticalPosition': 'Posición vertical',
    'PropBackground.Repeat': 'Repetir',
    'PropBackground.RepeatHorizontal': 'Horizontal',
    'PropBackground.RepeatVertical': 'Vertical',
    'PropBackground.BackgroundSize': 'Tamaño de imagen',
    'PropBackground.sizeAuto': 'Original',
    'PropBackground.sizeCover': 'Cubrir contenedor',
    'PropBackground.sizeContain': 'Ajustar dentro del contenedor',
    'PropBackground.BackgroundFixed': 'Fijar durante scroll',
  },
})

const css = ref({
  'background-color': null,
  'background-image': null,
  'background-repeat': null,
  'background-size': null,
  'background-position': null,
  'background-attachment': null,
})

watchEffect(() => {
  Object.assign(css.value, {
    'background-color': props.modelValue?.['background-color'],
    'background-image': props.modelValue?.['background-image'],
    'background-repeat': props.modelValue?.['background-repeat'],
    'background-size': props.modelValue?.['background-size'],
    'background-position': props.modelValue?.['background-position'],
    'background-attachment': props.modelValue?.['background-attachment'],
  })
})

const backgroundImageUrl = computed({
  get() {
    if (!css.value['background-image'] || !css.value['background-image'].startsWith('url(')) {
      return ''
    }
    // url(hello) ----> hello
    return css.value['background-image'].slice(4, -1)
  },
  set(newValue) {
    css.value['background-image'] = newValue ? `url(${newValue})` : null
    emitUpdate()
  },
})

const backgroundRepeat = computed({
  get() {
    if (
      !css.value['background-repeat']
      || css.value['background-repeat'] == 'repeat'
    ) {
      return ['x', 'y']
    }

    if (css.value['background-repeat'] == 'repeat-x') {
      return ['x']
    }

    if (css.value['background-repeat'] == 'repeat-y') {
      return ['y']
    }

    if (css.value['background-repeat'] == 'no-repeat') {
      return []
    }

    return ['x', 'y']
  },

  set(newValue) {
    if (!newValue || !newValue.length) {
      css.value['background-repeat'] = 'no-repeat'
    } else if (newValue.length == 2) {
      css.value['background-repeat'] = 'repeat'
    } else if (newValue[0] == 'x') {
      css.value['background-repeat'] = 'repeat-x'
    } else if (newValue[0] == 'y') {
      css.value['background-repeat'] = 'repeat-y'
    }

    emitUpdate()
  },
})


function getPositions(strPosition) {
  if (!strPosition || !strPosition.split) {
    return {
      h: 'left',
      v: 'top',
    }
  }

  const parts = strPosition.split(' ')
  if (parts.length != 2) {
    return {
      h: 'left',
      v: 'top',
    }
  }

  return {
    h: parts[0],
    v: parts[1],
  }
}

const backgroundPositionH = computed({
  get() {
    return getPositions(css.value['background-position']).h
  },

  set(newValue) {
    const positions = getPositions(css.value['background-position'])
    css.value['background-position'] = `${newValue} ${positions.v}`
    emitUpdate()
  },
})

const backgroundPositionV = computed({
  get() {
    return getPositions(css.value['background-position']).v
  },

  set(newValue) {
    const positions = getPositions(css.value['background-position'])
    css.value['background-position'] = `${positions.h} ${newValue}`
    emitUpdate()
  },
})

const backgroundIsFixed = computed({
  get() {
    return css.value['background-attachment'] == 'fixed'
  },

  set(newValue) {
    css.value['background-attachment'] = newValue ? 'fixed' : 'scroll'
    emitUpdate()
  },
})

</script>

<template>
  <div class="PropBackground">
    <UiInput
      v-model="css['background-color']"
      :label="i18n.t('PropBackground.Color')"
      type="color-css"
      @update:model-value="emitUpdate()"
    />

    <UiInput
      :label="i18n.t('PropBackground.Image')"
    >
      <div
        v-if="backgroundImageUrl"
        class="PropBackground__image"
      >
        <UiIcon
          class="PropBackground__image-deleter"
          src="mdi:close"
          :title="i18n.t('PropBackground.RemoveImage')"
          @click="backgroundImageUrl = null"
        />
        <img :src="backgroundImageUrl">
      </div>

      <UiInput
        v-model="backgroundImageUrl"
        type="url"
        :endpoint="endpoint"
        :placeholder="i18n.t('PropBackground.ImageUrl')"
      />
    </UiInput>

    <div v-show="!!backgroundImageUrl">
      <UiInput
        v-model="backgroundPositionH"
        :label="i18n.t('PropBackground.HorizontalPosition')"
        type="select-buttons"
        :options="[
          { value: 'left', icon: 'mdi:align-horizontal-left' },
          { value: 'center', icon: 'mdi:align-horizontal-center' },
          { value: 'right', icon: 'mdi:align-horizontal-right' },
        ]"
      />

      <UiInput
        v-model="backgroundPositionV"
        :label="i18n.t('PropBackground.VerticalPosition')"
        type="select-buttons"
        :options="[
          { value: 'top', icon: 'mdi:align-vertical-top' },
          { value: 'center', icon: 'mdi:align-vertical-center' },
          { value: 'bottom', icon: 'mdi:align-vertical-bottom' },
        ]"
      />

      <UiInput
        v-model="backgroundRepeat"
        :label="i18n.t('PropBackground.Repeat')"
        type="select-list"
        multiple
        :options="[
          { value: 'x', text: i18n.t('PropBackground.RepeatHorizontal') },
          { value: 'y', text: i18n.t('PropBackground.RepeatVertical') },
        ]"
      />

      <UiInput
        v-model="css['background-size']"
        :label="i18n.t('PropBackground.BackgroundSize')"
        type="select-native"
        :options="[
          { value: 'auto', text: i18n.t('PropBackground.sizeAuto') },
          { value: 'cover', text: i18n.t('PropBackground.sizeCover') },
          { value: 'contain', text: i18n.t('PropBackground.sizeContain') },
        ]"
        @update:model-value="emitUpdate()"
      />

      <UiInput
        v-model="backgroundIsFixed"
        :label="i18n.t('PropBackground.BackgroundFixed')"
        type="checkbox"
      />
    </div>
  </div>
</template>

<style lang="scss">
.PropBackground {
  & > .UiInput,
  & > div > .UiInput {
    padding: 8px 0;
  }

  &__image {
    display: inline-block;
    position: relative;

    img {
      max-width: 200px;
      max-height: 200px;
    }

    &-deleter {
      position: absolute;
      top: 0;
      left: 100%;
      width: 22px;
      height: 22px;

      cursor: pointer;
      &:hover {
        color: red;
      }
    }
  }
}
</style>