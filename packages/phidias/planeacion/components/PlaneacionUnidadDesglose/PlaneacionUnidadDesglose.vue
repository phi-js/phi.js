<template>
  <div class="PlaneacionUnidadDesglose">
    <UiTabs v-model="currentUnidadId">
      <UiTab
        v-for="unidad in unidades"
        :key="unidad.id"
        class="drawer-unidad"
        icon="mdi:book-outline"
        :value="unidad.id"
        :text="unidad.titulo"
        :secondary="`${$date(unidad.fechaInicial, 'day')} - ${$date(unidad.fechaFinal, 'day')}`"
      />
    </UiTabs>

    <div
      v-for="unidad in unidades"
      :key="unidad.id"
      v-show="currentUnidadId == unidad.id"
    >
      <!-- <UnidadSesionScaffold
        v-model="unidad.sesiones"
        @input="onUpdateSesiones(unidad)"
        :unidad-id="unidad.id"
        :is-manager="isManager"
        :grupos="grupos"
      /> -->
      <PlaneacionUnidadSesionManager
        :unidad-id="unidad.id"
        :unidad="unidad"
        :grupos="grupos"
        v-model="unidad.sesiones"
        @input="onUpdateSesiones(unidad)"
        :show-creator="unidad.cierreStatus != 1"
        :is-manager="isManager"
      />

      <div
        class="unidad-cierre ui-padded"
        v-if="unidad.isClosable"
      >
        <UiInput label="Estado">
          <select
            class="ui-native"
            v-model="unidad.cierreStatus"
            @change="updateUnidad(unidad)"
          >
            <option value="0">Abierta</option>
            <option value="1">Cerrada</option>
          </select>
        </UiInput>

        <UiInput
          v-show="unidad.cierreStatus == 1"
          type="textarea"
          label="Cierre de la unidad"
          v-model="unidad.cierreTexto"
          @input="debounceUpdateUnidad(unidad)"
        />
      </div>

    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import {
  UiInput,
  UiDrawer,
  UiItem,
  UiTabs,
  UiTab,
} from '@/modules/ui/components';
import PlaneacionUnidadSesionManager from '../PlaneacionUnidadSesionManager/PlaneacionUnidadSesionManager.vue';
// import { UnidadSesionScaffold } from '../../unidad/sesion/components/UnidadSesion';

export default {
  name: 'PlaneacionUnidadDesglose',
  mixins: [useApi, useI18n],
  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  components: {
    UiInput,
    UiDrawer,
    UiItem,
    UiTabs,
    UiTab,
    PlaneacionUnidadSesionManager,
    // UnidadSesionScaffold,
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

    isManager: {
      required: false,
      default: false,
    },
  },

  data() {
    return {
      unidades: [],
      grupos: [],
      currentUnidadId: null,
      timeout: null,
    };
  },

  watch: {
    academicCourseId: {
      immediate: true,
      handler() {
        this.fetchUnidades();
        this.fetchGrupos();
      },
    },

    periodId: {
      handler() {
        this.fetchUnidades();
      },
    },
  },

  methods: {
    async fetchGrupos() {
      let response = await this.$api.query({
        from: { entity: 'Phidias\\V3\\Academic\\Course\\Group\\Entity' },
        match: { course: this.academicCourseId },
        properties: '*',
      });

      if (response?.length) {
        this.grupos = response;
      } else {
        this.grupos = [];
      }
    },

    debounceUpdateUnidad(unidad) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.updateUnidad(unidad), 400);
    },

    updateUnidad(unidad) {
      this.$api.updateUnidad(unidad);
    },

    onUpdateSesiones(unidad) {
      unidad.isClosable = unidad?.sesiones?.length
        ? unidad.sesiones.every((sess) => sess?.statevm?.state == 'aprobado')
        : false;
    },

    async fetchUnidades() {
      let response = await this.$api.query({
        from: 'unidades',
        match: {
          academicCourseId: this.academicCourseId,
          periodId: this.periodId,
        },

        properties: [
          'academicCourseId',
          'periodId',
          'titulo',
          'descripcion',
          'fechaInicial',
          'fechaFinal',
          'cierreStatus',
          'cierreTexto',
          {
            sesiones: {
              from: 'unidades-sesiones',
              on: { unidadId: 'id' },
              order: 'id desc',
              properties: [
                '*',
                {
                  statevm: {
                    from: 'state-items',
                    on: { sesionId: 'id' },
                    properties: '*',
                    single: true,
                  },
                },
              ],
            },
          },
          {
            productos: {
              from: 'unidades-productos',
              on: { unidadId: 'id' },
              properties: ['*'],
            },
          },
        ],
      });

      this.unidades = response?.length ? response : [];

      this.unidades.forEach((unidad) => {
        unidad.isClosable = unidad?.sesiones?.length
          ? unidad.sesiones.every((sess) => sess?.statevm?.state == 'aprobado')
          : false;
      });

      this.currentUnidadId = this.unidades.length ? this.unidades[0].id : null;
    },
  },
};
</script>