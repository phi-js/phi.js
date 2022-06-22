<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  /* Array of selected themes:
  [
    {
      name: 'ThemeOne', // theme name IS the class name
      url: 'https://phi.co/css/themes/ThemeOne.css', // CSS url
      thumbnail: 'https:// ... thumbnail image URL ',
      description: '... description text ...',
    },
    ...
  ],
  */
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue'])

const selectedThemes = ref([])
watch(
  () => props.modelValue,
  (newValue) => selectedThemes.value = Array.isArray(newValue) ? newValue.concat() : [],
  { immediate: true },
)

// Hash.  selectedThemeNames[themeName] = BOOL
const selectedThemeNames = computed(() => {
  const retval = {}
  selectedThemes.value.forEach((theme) => retval[theme.name] = true)
  return retval
})

function toggleTheme(theme) {
  // const foundIndex = selectedThemes.value.findIndex((t) => t.name == theme.name)
  // if (foundIndex >= 0) {
  //   selectedThemes.value.splice(foundIndex, 1)
  // } else {
  //   selectedThemes.value.push(theme)
  // }

  theme.enabled = !theme.enabled

  emit('update:modelValue', selectedThemes.value.concat())
}
</script>

<template>
  <div class="CmsThemePicker">
    <div class="CmsThemePicker__list">
      <div
        v-for="theme in selectedThemes"
        :key="theme.name"
        class="Theme"
        :class="{ 'Theme--active': theme.enabled }"
        @click="toggleTheme(theme)"
      >
        <img
          v-if="theme.thumbnail"
          :src="theme.thumbnail"
          :alt="theme.title || theme.name"
          class="Theme__thumbnail"
        >
        <div class="Theme__details">
          <h3
            class="Theme__name"
            v-text="theme.title || theme.name"
          />
          <div
            class="Theme__description"
            v-text="theme.description"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.CmsThemePicker {
  &__search {
    .UiInput__elem {
      display: block;
      width: 100%;
    }
  }

  &__list {
    display: flex;
    flex-wrap: wrap;
    padding: 12px;
  }
}

.Theme {
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  border: 1px solid transparent;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;

  transition: all var(--ui-duration-snap);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }


  opacity: 0.6;

  &--active {
    border-color: var(--ui-color-primary);
    background-color: rgba(255, 255, 255, 0.17) !important;
    opacity: 1;
  }

  &__thumbnail {
    align-self: flex-start;
    width: 50%;
    height: auto;
    padding: 8px;

    max-width: 200px;
    order: 2;
  }

  &__details {
    padding: 12px;
    flex: 1;
  }

  &__name {
    font-size: 1.6em;
    font-weight: normal;
    margin: 0 0 8px 0;
  }

  &__description {
    opacity: 0.8;
  }
}
</style>