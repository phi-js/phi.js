<template>
  <div class="CmsDialog">
    <UiDialog @open="onDialogOpen">
      <template #trigger>
        <UiItem
          class="ui--clickable"
          :text="text"
          :secondary="secondary"
          :icon="icon"
          :badgeColor="badgeColor"
          :badge="badgeColor ? ' ' : null"
        />
      </template>

      <template #contents>
        <CmsPage
          v-if="page"
          :value="page"
          :model.sync="innerModel"
        />
      </template>

      <template #footer="{close}">
        <button
          type="button"
          class="ui-button --main"
          @click="$emit('accept', innerModel); close();"
        >Aceptar</button>
        <button
          type="button"
          class="ui-button --cancel"
          @click="close"
        >Cancelar</button>
      </template>

    </UiDialog>
  </div>
</template>

<script>
import { useApi } from '../../../../../api';
import { UiItem, UiDialog } from '../../../../../ui';
import CmsPage from '../../../../components/CmsPage/CmsPage.vue';
// import pageRegistro from '/src/pages/covid-registro.js';

import apiCms from '../../../../api/index.js';

export default {
  name: 'CmsDialog',
  mixins: [useApi],
  components: { UiItem, UiDialog, CmsPage },

  $api: apiCms,

  props: {
    pageId: {
      type: String,
      required: true,
    },

    model: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    text: {
      type: String,
      required: false,
    },

    secondary: {
      type: String,
      required: false,
    },

    badgeColor: {
      type: String,
      required: false,
    },

    icon: {
      type: String,
      required: false,
      default: 'mdi:dock-window',
    },
  },

  data() {
    return {
      page: null,
      innerModel: {},
    };
  },

  watch: {
    model: {
      immediate: true,
      handler(newValue) {
        this.innerModel = JSON.parse(JSON.stringify(newValue));
      },
    },
  },

  methods: {
    async fetchPage() {
      // this.page = await this.$api.getPage(this.pageId);
      this.page = await this.$api.getDraft(this.pageId);
    },

    onDialogOpen() {
      this.fetchPage();
    },
  },
};
</script>