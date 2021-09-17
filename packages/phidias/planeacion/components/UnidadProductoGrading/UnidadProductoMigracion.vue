<template>
  <div class="UnidadProductoMigracion">
    <div v-if="isLoading">... cargando ...</div>
    <div
      v-else
      style="display:flex"
    >
      <UiItem
        v-if="latest"
        style="flex:1"
        icon="mdi:clipboard-check-outline"
        text="Última publicación"
        :secondary="$ts(latest.date)"
      />
      <UiItem
        v-else
        style="flex:1"
        icon="mdi:clipboard-alert-outline"
        text="No publicado"
        secondary="Las notas aún no han sido copiadas al reporte académico"
      />

      <button
        class="ui-button"
        :disabled="isSaving"
        type="button"
        @click="putMigracion()"
      >{{ isSaving ? 'Publicando ...' : 'Publicar' }}</button>
    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacionMigracion } from '/apis/v4';
import { UiItem } from '@/modules/ui/components/UiItem';

export default {
  name: 'UnidadProductoMigracion',
  mixins: [useApi, useI18n],

  $api: {
    type: apiV4,
    wrappers: [planeacionMigracion],
  },

  components: { UiItem },

  props: {
    unidadProductoId: {
      type: String,
      required: true,
    },

    academicGroupId: {
      type: String,
      required: true,
    },

    academicSchemeId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      migraciones: [],
      isLoading: true,
      isSaving: false,
    };
  },

  async mounted() {
    this.migraciones = await this.$api.getMigraciones(
      this.unidadProductoId,
      this.academicGroupId
    );
    this.isLoading = false;
  },

  computed: {
    latest() {
      return this.migraciones?.[this.migraciones.length - 1];
    },
  },

  methods: {
    async putMigracion() {
      if (!confirm('Publicar notas en reportes académicos ?')) {
        return;
      }

      return this.put();
    },

    async put() {
      this.isSaving = true;
      let incoming = await this.$api.putMigracion(
        this.unidadProductoId,
        this.academicGroupId,
        this.academicSchemeId
      );
      this.isSaving = false;
      this.migraciones.push(incoming);
    },
  },
};
</script>