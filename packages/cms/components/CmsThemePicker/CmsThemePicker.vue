<script setup>
import { ref } from 'vue'
import { UiInput } from '@/packages/ui'
import themes from './themes.js'

const props = defineProps({
  /* ID of active theme */
  active: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['selectTheme'])

const activeId = ref()

function selectTheme(theme) {
  activeId.value = theme.id
  emit('selectTheme', theme)
}

</script>

<template>
  <div class="CmsThemePicker">
    <UiInput
      class="CmsThemePicker__search"
      type="search"
      placeholder="Buscar plantillas"
    />

    <div class="CmsThemePicker__list">
      <div
        v-for="theme in themes"
        :key="theme.id"
        class="Theme"
        :class="{ 'Theme--active': theme.id == activeId }"
        @click="selectTheme(theme)"
      >
        <img
          :src="theme.thumbnail"
          :alt="theme.text"
          class="Theme__thumbnail"
        >
        <div class="Theme__details">
          <h3
            class="Theme__name"
            v-text="theme.name"
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
  }
}

.Theme {
  cursor: pointer;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 36px;

  border: 1px solid transparent;

  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;

  transition: all var(--ui-duration-snap);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }

  &--active {
    border-color: var(--ui-color-primary);
    background-color: rgba(255, 255, 255, 0.17) !important;
  }

  &__thumbnail {
    width: 300px;
  }

  &__details {
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