<script setup>
import { ref, watch, computed } from 'vue'
import { UiItem } from '@/packages/ui'
import { getAvailableThemes } from '../../themes'

const props = defineProps({
  /* Array of stylesheets:
  [
    {
      id: // required.  Unique ID
      title: 'Some Title, if you want',
      description: 'Also a description',

      container: css selector of parent container (to which classes are applied).  default: body

      // SRC can be:
      // a url
      src: 'https:// ....'
      // a string containing a CSS declaration
      src: '.something\n{\n  border-radius: 2px;}',
      // an object containing CSS properties (to be applied to "container" element if present, --2do: apply to ":root" if no container)

      type: optional. A descriptive indicator of the type of stylesheet (font, class, palette, ...any custom string)
    }
    ...
  ]
  */
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const availableThemes = ref([])
getAvailableThemes().then((r) => availableThemes.value = r)

const selectedThemes = ref([])
watch(
  () => props.modelValue,
  (newValue) => {
    selectedThemes.value = newValue.filter((sheet) => sheet.type == 'theme')
  },
  { immediate: true },
)

const listedThemes = computed(() => availableThemes.value.map((theme) => ({
  ...theme,
  isActive: selectedThemes.value.findIndex((t) => t.id == theme.id) >= 0,
})))


function selectTheme(theme) {
  const returnValue = props.modelValue.filter((sheet) => sheet.type != 'theme')

  const foundIndex = selectedThemes.value.findIndex((t) => t.id == theme.id)
  if (foundIndex === -1) {
    returnValue.unshift({ ...theme, type: 'theme' })
  }

  emit('update:modelValue', returnValue)
}
</script>

<template>
  <div class="CmsThemePicker">
    <UiItem
      v-for="(theme,i) in listedThemes"
      :key="i"
      class="Theme"
      :class="{'Theme--active': theme.isActive}"
      :icon="theme.thumbnail"
      :text="theme.title || theme.id"
      :subtext="theme.description"
      @click="selectTheme(availableThemes[i])"
    />
  </div>
</template>

<style lang="scss">
.CmsThemePicker {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 4px;
}

.Theme {
  user-select: none;
  cursor: pointer;
  --ui-item-padding: 6px;
  border-radius: 4px;

  .UiItem {
    &__body {
      padding-left: 6px;
    }

    &__text {
      font-size: 1.4em;
    }

    &__icon {
      width: 100px;
      height: 60px;
      border-radius: 4px;
      overflow: hidden;
    }
  }

  &--active {
    background-color: var(--ui-color-primary) !important;
    color: #fff;
  }

  &:hover {
    background-color: var(--ui-color-hover);
  }
}
</style>