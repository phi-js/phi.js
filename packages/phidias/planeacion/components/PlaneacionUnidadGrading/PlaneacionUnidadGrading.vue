<template>
  <div class="PlaneacionUnidadGrading">

    <div
      class="pending-notice"
      v-if="!unidades.length"
    >
      <p>Aún no se han definido unidades para estre trimestre</p>
      <small v-if="state">({{ state.state }})</small>
    </div>

    <UiTabs v-model="currentUnidadId">
      <UiTab
        v-for="unidad in unidades"
        :key="unidad.id"
        class="drawer-unidad"
        icon="mdi:book-outline"
        :value="unidad.id"
        :text="unidad.titulo"
        :secondary="`${$ts(unidad.fechaInicial, 'day')} - ${$ts(unidad.fechaFinal, 'day')}`"
      />
    </UiTabs>

    <div
      v-for="unidad in unidades"
      :key="unidad.id"
      v-show="currentUnidadId == unidad.id"
    >
      <div class="producto-list">
        <UiCard
          class="ui-clickable"
          v-for="unidadProducto in unidad.productos"
          :key="unidadProducto.id"
          v-bind="unidadProducto.producto.card"
          @click="onClickUnidadProducto(unidadProducto)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import { UiCard, UiItem, UiTabs, UiTab } from '@/modules/ui/components';

export default {
  name: 'PlaneacionUnidadGrading',
  mixins: [useApi, useI18n],
  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  components: {
    UiCard,
    UiItem,
    UiTabs,
    UiTab,
  },

  props: {
    academicCourseId: {
      type: String,
      required: true,
    },

    academicGroupId: {
      type: String,
      required: true,
    },

    periodId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      state: null,
      unidades: [],
      momentos: [],
      currentUnidadId: null,
    };
  },

  watch: {
    academicCourseId: {
      immediate: true,
      handler() {
        this.fetchUnidades();
      },
    },

    periodId: {
      handler() {
        this.fetchUnidades();
      },
    },
  },

  methods: {
    onClickUnidadProducto(unidadProducto) {
      let eventData = {
        unidadProductoId: unidadProducto.id,
        academicGroupId: this.academicGroupId,
        periodId: this.periodId,
      };

      this.$emit('click-unidad-producto', eventData);
    },

    async fetchUnidades() {
      this.momentos = await this.$api.getMomentos();

      // Verificar estado
      let response = await this.$api.query({
        from: 'state-items',
        properties: '*',
        match: { id: `planeacion-${this.academicCourseId}-${this.periodId}` },
      });

      this.state = response?.length ? response[0] : null;
      if (this.state?.state != 'aprobado') {
        return;
      }

      response = await this.$api.query({
        from: 'unidades',
        match: {
          academicCourseId: this.academicCourseId,
          periodId: this.periodId,
        },

        properties: [
          '*',
          {
            productos: {
              from: 'unidades-productos',
              on: { unidadId: 'id' },
              properties: [
                '*',
                {
                  producto: {
                    from: 'productos',
                    on: { id: 'productoId' },
                    properties: 'card',
                    single: true,
                  },
                },
              ],
            },
          },
        ],
      });

      this.unidades = response?.length ? response : [];
      this.currentUnidadId = this.unidades.length ? this.unidades[0].id : null;

      // Determinar la lista unica de momentos de cada unidad-producto
      this.unidades.forEach((unidad) => {
        unidad.productos.forEach((unidadProducto) => {
          unidadProducto.momentos = [];
          let distinctMomentoIds = [];
          unidadProducto.competencias.forEach((competencia) => {
            if (!distinctMomentoIds.includes(competencia.momentoId)) {
              distinctMomentoIds.push(competencia.momentoId);
            }
          });

          unidadProducto.momentos = distinctMomentoIds.map((mId) =>
            this.momentos.find((m) => m.id == mId)
          );
        });
      });
    },
  },
};
</script>

<style lang="scss">
.PlaneacionUnidadGrading {
  .producto-list {
    display: flex;
    flex-wrap: wrap;

    & > * {
      flex: 1;
      width: 30%;
      min-width: 250px;
      margin: 4px;
    }
  }
}
</style>