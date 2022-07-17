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
  <div class="CmsThemePicker">
    <!-- <div class="CmsThemePicker__selected">
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
    </div> -->

    <!-- <fieldset>
      <legend>Select theme</legend> -->
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
    <!-- </fieldset> -->
  </div>
</template>

<style lang="scss">
.CmsThemePicker {
  padding: 6px;
  .Theme {
    margin-bottom: 6px;
  }
}

.Theme {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  border-radius: 4px;
  padding: 6px;

  &__thumbnail {
    width: 112px;
    border-radius: 4px;
  }

  &__details {
    flex: 1;
    padding: 12px 16px;
  }

  &__name {
    margin: 0;
    font-size: 1.45em;
    font-weight: 300;
  }


  &--active {
    background-color: var(--ui-color-primary) !important;
    color: #fff;
  }

  user-select: none;
  cursor: pointer;
  &:hover {
    background-color: var(--ui-color-hover);
  }
}
</style>