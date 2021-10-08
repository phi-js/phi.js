<template>
  <div class="media-file-launcher">
    <UiFileUploader
      ref="launcherUploader"
      :path="path"
      @success="onUploadSuccess"
      @queuecomplete="onQueueComplete"
    />
  </div>
</template>

<script>
import { UiFileUploader } from '../../../../../ui';

export default {
  name: 'MediaFileLauncher',
  components: { UiFileUploader },
  props: {
    path: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      uploadedFiles: [],
    };
  },

  methods: {
    onUploadSuccess(files) {
      if (!Array.isArray(files)) {
        files = [files];
      }

      files.forEach((file) => {
        this.$emit('input', {
          component: 'CmsMediaFile',
          props: {
            href: file.url,
            text: file.name,
            secondary: '',
            icon: 'mime:' + file.mimetype,
            name: file.name,
            size: file.size,
            mimetype: file.mimetype,
          },
        });
      });
    },

    onQueueComplete() {
      this.$emit('cancel');
    },
  },

  mounted() {
    this.$refs.launcherUploader.open();
  },
};
</script>