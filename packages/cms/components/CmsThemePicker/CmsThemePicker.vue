<script setup>
import { ref, watch, computed } from 'vue'
import { getAvailableThemes } from '../../themes'

const props = defineProps({
  /* Array of selected themes:
  [
    {
      title: 'The theme\'s name',
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

const availableThemes = ref([])
getAvailableThemes().then((r) => availableThemes.value = r)

const selectedThemes = ref([])
watch(
  () => props.modelValue,
  (newValue) => selectedThemes.value = Array.isArray(newValue) ? newValue.concat() : [],
  { immediate: true },
)

const listedThemes = computed(() => availableThemes.value.map((theme) => ({
  ...theme,
  isActive: selectedThemes.value.findIndex((t) => t.name == theme.name) >= 0,
})))


function selectTheme(theme) {
  const foundIndex = selectedThemes.value.findIndex((t) => t.name == theme.name)
  if (foundIndex >= 0) {
    return
  }

  selectedThemes.value = [theme]
  emit('update:modelValue', selectedThemes.value.concat())
}
</script>

<template>
  <div class="CmsThemePicker UiForm">
    <div class="CmsThemePicker__selected">
      <div
        v-for="theme in selectedThemes"
        :key="theme.name"
        class="Theme"
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

    <fieldset>
      <legend>Select theme</legend>
      <div class="CmsThemePicker__available">
        <div
          v-for="(theme,i) in listedThemes"
          :key="theme.name"
          class="Theme"
          :class="{'Theme--active': theme.isActive}"
          :title="theme.description"
          @click="selectTheme(availableThemes[i])"
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
          </div>
        </div>
      </div>
    </fieldset>
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

  &__available {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
  }
}

.CmsThemePicker__available .Theme {
  position: relative;
  width: 200px;
  height: 133px;
  border-radius: 4px;
  overflow: clip;

  user-select: none;
  cursor: pointer;

  &--active {
    border: 2px solid var(--ui-color-primary);
  }

  &__thumbnail {
    position: absolute;
    width: 100%;
  }

  &__details {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 8px 12px;

    background-color: rgba(0,0,0, 0.7);
  }

  &__name {
    margin: 0;
  }
}


.CmsThemePicker__selected .Theme {
  display: flex;
  flex-wrap: wrap;
  border: 1px solid transparent;
  background-color: rgba(255, 255, 255, 0.1) !important;
  border-radius: 4px;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;

  transition: all var(--ui-duration-snap);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &__thumbnail {
    align-self: flex-start;
    width: 50%;
    height: auto;
    padding: 8px;

    max-width: 200px;
  }

  &__details {
    padding: 12px;
    flex: 1;
  }

  &__name {
    font-size: 1.2em;
    font-weight: normal;
    margin: 0;
  }

  &__description {
    opacity: 0.8;
    font-size: 0.9em;
    margin: 0;
  }
}
</style>