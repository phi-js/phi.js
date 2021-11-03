<script setup>
import { UiItem } from '../UiItem'
import { UiPhotoGallery } from '../UiPhotoGallery'

defineProps({
  /*
  Arreglo de ARCHIVOS
  {
    id: "odzvc02sfxz",
    path: "/cms/pages/test",
    name: "Best-Cheesecake-Recipe-2-1-of-1-4.jpg",
    size: "29050",
    mimetype: "image/jpeg",
    timestamp: "1615566175",
    url: "https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg",
    preview: "https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.preview.jpg",
    thumbnail: "https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg.thumbnail.jpg"
  }
  */
  files: {
    type: Array,
    required: false,
    default: () => [],
  },

  view: {
    type: String,
    required: false,
    default: 'list',
    validator: (v) => ['list', 'grid', 'gallery'].includes(v),
  },
})
</script>

<template>
  <div class="UiFileList">
    <UiPhotoGallery
      v-if="view === 'gallery'"
      class="UiFileList__gallery"
      :files="files"
    />
    <div
      v-else
      class="UiFileList__list"
    >
      <a
        v-for="file in files"
        :key="file.id"
        :href="file.url"
        target="_blank"
      >
        <UiItem
          class="ui--clickable ui--noselect"
          :text="file.name"
          :subtext="file.size"
          :icon="file.thumbnail || `mime:${file.mimetype}`"
        />
      </a>
    </div>
  </div>
</template>