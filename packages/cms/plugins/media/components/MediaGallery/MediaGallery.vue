<template>
  <div class="media-gallery">
    <component
      v-if="files.length"
      :is="innerComponent"
      :files="files"
      v-bind="$attrs"
      @click-file="fileClicked"
    ></component>
    <div v-else>
      <p>No hay archivos</p>
    </div>
  </div>
</template>

<script>
import { UiFileList, UiFileGrid, UiFileGallery } from '../../../../../ui';

export default {
  name: 'MediaGallery',
  components: { UiFileList, UiFileGrid, UiFileGallery },

  props: {
    files: {
      type: Array,
      required: false,
      default: () => [],
    },

    view: {
      type: String,
      required: false,
      default: 'list',
      validator: (item) => ['list', 'grid', 'gallery'].indexOf(item) !== -1,
    },
  },

  computed: {
    innerComponent() {
      switch (this.view) {
        case 'list':
          return 'UiFileList';

        case 'gallery':
          return 'UiFileGallery';

        case 'grid':
        default:
          return 'UiFileGrid';
      }
    },
  },

  methods: {
    fileClicked(file) {
      window.open(file.url, '_system');
    },
  },
};
</script>