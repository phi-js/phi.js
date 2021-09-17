<template>
  <div class="PlaneacionUnidadManager">

    <div class="split-divs">
      <div class="unidad-list">
        <div
          v-for="(unidad, i) in unidades"
          :key="unidad.id"
        >
          <UiDataDialog
            class="drawer-unidad"
            v-model="unidades[i]"
            @input="updateUnidad(unidades[i])"
            :disabled="(innerModel) => !innerModel || !innerModel.titulo || !innerModel.fechaInicial || !innerModel.fechaFinal"
          >
            <template #trigger>
              <UiItem
                class="ui-clickable"
                :text="unidad.titulo"
                :secondary="unidad.descripcion"
                :tertiary="`${$ts(unidad.fechaInicial, 'day')} - ${$ts(unidad.fechaFinal, 'day')}`"
                icon="mdi:book-outline"
              />
            </template>
            <template #contents="{innerModel, setModel}">
              <div class="data-drawer-contents">
                <PlaneacionUnidadEditor
                  :value="innerModel"
                  @input="setModel"
                  :period="objPeriod"
                />
              </div>
            </template>
            <template #footer>
              <div style="display:block; float: right">
                <button
                  :disabled="unidad.sesiones && unidad.sesiones.length ? true : false"
                  type="button"
                  class="ui-button --danger"
                  @click="deleteUnidad(unidad)"
                >Eliminar</button>
                <small v-if="unidad.sesiones && unidad.sesiones.length">Contiene sesiones</small>
              </div>
            </template>
          </UiDataDialog>

          <div
            class="unidad-productos"
            style="padding: 0 0 24px 40px"
          >
            <UnidadProductosManager
              :read-only="readOnly"
              :course-sequence="courseSequence"
              :related-courses="relatedCourses"
              v-model="unidades[i].productos"
              @input="onProductosManagerInput(unidades[i])"
              @delete-asociacion="onDeleteAsociacion"
            />
          </div>

        </div>

        <!-- creador de unidades -->
        <UiDataDialog
          class="drawer-unidad"
          :value="newUnidad"
          @input="createUnidad"
          :disabled="(innerModel) => !innerModel || !innerModel.titulo || !innerModel.fechaInicial || !innerModel.fechaFinal"
        >
          <template #trigger>
            <UiItem
              class="ui-clickable"
              text="Crear unidad didáctica"
              icon="mdi:book-plus-outline"
            />
          </template>
          <template #contents="{innerModel, setModel}">
            <div class="data-drawer-contents">
              <PlaneacionUnidadEditor
                :value="innerModel"
                @input="setModel"
                :period="objPeriod"
              />
            </div>
          </template>
        </UiDataDialog>
      </div>

      <div class="unidad-wheel">
        <DominioWheel
          :competencias="competencias"
          :dominios="dominios"
          :label="wheelLabel"
        />

        <!-- TABLAS DE RESUMEN -->
        <PlaneacionTally
          :momentos="momentos"
          :competencias="competencias"
          :unidades="unidades"
          :related-courses="relatedCourses"
        />
      </div>
    </div>

  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import { useApi } from '@/modules/api/';
import v4Api, { planeacion, academicCourse } from '/apis/v4';
import PlaneacionTally from './PlaneacionTally.vue';

import {
  UiCard,
  UiDrawer,
  UiDataDrawer,
  UiDataDialog,
  UiField,
  UiInputSearch,
  UiIcon,
  UiItem,
} from '@/modules/ui/components';

import UnidadProductosManager from './UnidadProductosManager.vue';
import PlaneacionUnidadEditor from './PlaneacionUnidadEditor.vue';

import DominioWheel from '../PlaneacionDominioManager/DominioWheel.vue';

export default {
  name: 'PlaneacionUnidadManager',
  mixins: [useApi, useI18n],

  components: {
    PlaneacionTally,
    DominioWheel,
    UiCard,
    UiDrawer,
    UiDataDrawer,
    UiDataDialog,
    PlaneacionUnidadEditor,
    UnidadProductosManager,
    UiField,
    UiInputSearch,
    UiIcon,
    UiItem,
  },

  $api: {
    planeacion: {
      type: v4Api,
      wrappers: [planeacion],
    },

    academicCourse: {
      type: v4Api,
      wrappers: [academicCourse],
    },
  },

  provide() {
    return {
      PlaneacionProductoPicker: {
        getAcademicCourse: () => this.academicCourse,
      },
    };
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

    readOnly: {
      type: String,
      required: false,
      default: null
    },

    // para identificar los DOMINIOS
    courseSequence: {
      type: String,
      required: false,
      default: null,
    },

    wheelLabel: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      academicCourse: null,
      unidades: [],
      newUnidad: null,
      objPeriod: null,

      dominios: [],
      competencias: [],
      momentos: [],
    };
  },

  async mounted() {
    await this.fetchPeriod();
    this.fetchAcademicCourse();
    this.fetchUnidades();
    this.fetchDominios();

    this.$api.planeacion.getCompetencias().then((r) => (this.competencias = r));
    this.$api.planeacion.getMomentos().then((r) => (this.momentos = r));
  },

  watch: {
    academicCourseId: {
      handler() {
        this.fetchAcademicCourse();
        this.fetchUnidades();
      },
    },

    periodId: {
      handler() {
        this.fetchPeriod();
        this.fetchUnidades();
      },
    },

    courseSequence: {
      handler() {
        this.fetchDominios();
      },
    },
  },

  computed: {
    relatedCourses() {
      let links = this.academicCourse?.links || [];
      return links.map((l) => l.linkedCourse);
    },
  },

  methods: {
    async fetchPeriod() {
      let response = await this.$api.planeacion.query({
        from: { entity: 'Phidias\\V3\\Academic\\Period\\Entity' },
        match: { id: this.periodId },
        properties: '*',
      });

      if (response?.[0]?.id) {
        this.objPeriod = response[0];
      } else {
        this.objPeriod = null;
      }
    },

    async fetchAcademicCourse() {
      let response = await this.$api.academicCourse.getCourseWithLinks(
        this.academicCourseId
      );
      if (Array.isArray(response) && response.length) {
        this.academicCourse = response[0];
      }
      if (!this.academicCourse.links) {
        this.academicCourse.links = [];
      }
    },

    onProductosManagerInput(unidad) {
      return this.updateUnidad(unidad);
    },

    async fetchUnidades() {
      this.unidades = await this.$api.planeacion.getUnidades({
        academicCourseId: this.academicCourseId,
        periodId: this.periodId,
      });
    },

    async updateUnidad(unidad) {
      let updated = await this.$api.planeacion.updateUnidad(unidad);
      this.$set(this.unidades, this.unidades.indexOf(unidad), updated);

      return updated;
    },

    async deleteUnidad(unidad) {
      if (!confirm('Eliminar esta unidad ?')) {
        return;
      }
      await this.$api.planeacion.deleteUnidad(unidad);
      this.unidades.splice(this.unidades.indexOf(unidad), 1);
    },

    async createUnidad(unidad) {
      let created = await this.$api.planeacion.createUnidad({
        ...unidad,
        academicCourseId: this.academicCourseId,
        periodId: this.periodId,
      });
      this.unidades.push(created);
      this.newUnidad = {};

      return created;
    },

    async fetchDominios() {
      if (this.courseSequence == null) {
        return;
      }
      this.dominios = await this.$api.planeacion.getDominios(
        this.courseSequence
      );
    },

    async onDeleteAsociacion(asoc) {
      await this.$api.planeacion.deleteUnidadProducto(asoc);
    },
  },
};
</script>

<style lang="scss">
.PlaneacionUnidadManager {
  .split-divs {
    display: flex;
    flex-wrap: wrap;
    & > * {
      flex: 1;
    }
  }

  .tally {
    .label {
      display: block;
      margin-bottom: var(--ui-breathe);
    }

    table {
      width: 100%;
    }
  }
}

.drawer-unidad {
  & > .ui-drawer-contents {
    margin-left: 42px;
    padding-bottom: 36px;
  }

  .data-drawer-contents {
    margin-bottom: 32px;
  }
}
</style>