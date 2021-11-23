<template>
  <div class="media-document">
    <iframe
      v-if="provider == 'google'"
      style="width: 100%; min-height: 700px"
      :src="`https://docs.google.com/gview?url=${value}&embedded=true`"
    ></iframe>
    <iframe
      v-if="provider == 'microsoft'"
      style="width: 100%; min-height: 700px"
      :src="`https://view.officeapps.live.com/op/embed.aspx?src=${value}`"
    ></iframe>
  </div>
</template>

<script>
// https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript
export default {
  name: 'MediaDocument',

  props: {
    value: {
      type: String,
      required: false,
      default: null,
    },

    provider: {
      type: String,
      required: false,
      default: 'google',
    },
  },
};
</script>