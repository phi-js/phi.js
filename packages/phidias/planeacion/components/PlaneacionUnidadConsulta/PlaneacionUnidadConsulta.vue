<template>
  <div class="PlaneacionUnidadConsulta">
    <div
      class="pending-notice"
      v-if="state && state.state != 'aprobado'"
    >
      <p>Aún no se han definido unidades para estre trimestre</p>
    </div>

    <div class="unidad-list">
      <div
        v-for="unidad in unidades"
        :key="unidad.id"
        class="unidad-item"
      >
        <UiItem
          class="ui-clickable"
          :text="unidad.titulo"
          :secondary="`${$ts(unidad.fechaInicial, 'day')} - ${$ts(
            unidad.fechaFinal,
            'day'
          )}`"
          icon="mdi:book-outline"
        />

        <div
          class="unidad-productos"
          style="padding: 0 0 24px 40px"
        >
          <UiDialog
            v-for="producto in unidad.productos"
            :key="producto.id"
            @accept="() => null"
          >
            <template #trigger>
              <UiItem
                class="ui-clickable"
                icon="mdi:file-outline"
                :text="producto.text"
              />
            </template>

            <template #contents>
              <PlaneacionUnidadProducto :fixed-data="{ unidadProducto: producto, notas, competencias }" />

              <PersonSummary
                v-if="producto.calificacion"
                style="margin-top: 1em"
                :calificacion="producto.calificacion"
                :competencias="competencias"
                :notas="notas"
                :redacciones="producto.redacciones"
                :dominios="[]"
              />
            </template>
          </UiDialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import { useApi } from '@/modules/api/';
import v4Api, { planeacion } from '/apis/v4';

import PlaneacionUnidadProducto from '../PlaneacionUnidadProducto/PlaneacionUnidadProducto.vue';
import PersonSummary from '../UnidadProductoGrading/PersonSummary.vue';

import { UiDialog, UiItem } from '@/modules/ui/components';

export default {
  name: 'PlaneacionUnidadConsulta',
  mixins: [useApi, useI18n],

  $api: {
    type: v4Api,
    wrappers: [planeacion],
  },

  components: {
    PlaneacionUnidadProducto,
    PersonSummary,
    UiDialog,
    UiItem,
  },

  props: {
    academicCourseId: {
      type: String,
      required: true,
    },

    periodId: {
      type: String,
      required: true,
    },

    personId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      unidades: [],
      state: null,

      competencias: [],
      notas: [],
    };
  },

  async mounted() {
    this.fetchUnidades();

    this.$api.getCompetencias().then((r) => (this.competencias = r));
    this.$api.getNotas().then((r) => (this.notas = r));
  },

  watch: {
    academicCourseId: {
      handler() {
        this.fetchUnidades();
      },
    },

    periodId: {
      handler() {
        this.fetchUnidades();
      },
    },

    personId: {
      handler() {
        this.fetchUnidades();
      },
    },
  },

  methods: {
    async fetchUnidades() {
      let state = await this.$api.query({
        from: 'state-items',
        limit: 1,
        match: { id: `planeacion-${this.academicCourseId}-${this.periodId}` },
        properties: '*',
      });
      this.state = state?.length ? state[0] : null;

      if (!this.state || this.state?.state != 'aprobado') {
        return;
      }

      this.unidades = await this.$api.query({
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
                  redacciones: {
                    from: 'productos-redacciones',
                    on: { productoId: 'productoId' },
                    properties: '*',
                  },
                },
                {
                  calificacion: {
                    single: true,
                    from: 'unidad-producto-calificaciones',
                    on: { unidadProductoId: 'id' },
                    match: { personId: this.personId },
                    properties: '*',
                  },
                },
              ],
            },
          },
        ],
      });
    },
  },
};
</script>