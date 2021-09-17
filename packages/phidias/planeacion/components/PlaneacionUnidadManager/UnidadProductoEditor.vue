<template>
  <div class="UnidadProductoEditor" :class="{'read-only': readOnly}">
    <PlaneacionProductoPicker
      v-model="producto"
      @input="onPickerInput"
      :course-sequence="courseSequence"
    />

    <UiTabs
      v-model="currentTab"
      v-show="!!producto"
    >
      <UiTab
        v-if="producto && producto.body"
        value="body"
        text="Caracterización"
        icon="mdi:file"
      />
      <UiTab
        value="rubric"
        text="Evidencias de Desempeño"
        icon="mdi:grid-large"
      />
    </UiTabs>

    <div
      v-if="producto && producto.body"
      v-show="currentTab == 'body'"
    >
      <CmsPage :value="producto.body" />
    </div>

    <div v-show="currentTab == 'rubric'">
      <div v-if="producto">
        <UiRubric
          v-if="producto.redacciones && producto.redacciones.length"
          :rows="rows"
          :columns="columns"
          :value="producto.redacciones"
          row-property="competencia"
          column-property="nota"
        >
          <template #row-header="{row}">
            <UiField :label="row.text">
              <select
                v-if="!relatedCourses.length"
                class="ui-native select-momento"
                :value="checkedCompetencias[row.id]"
                @change="setMomento(row.id, $event.target.value)"
              >
                <option :value="null"> --- </option>
                <option
                  v-for="momento in momentos"
                  :key="momento.id"
                  :value="momento.id"
                >{{ momento.text }}</option>
              </select>

              <div v-if="relatedCourses.length">
                <table style="width:100%; margin: 0">
                  <tbody>
                    <tr
                      v-for="relCourse in parsedRelatedCourses"
                      :key="relCourse.id"
                    >
                      <td>
                        <div
                          class="ui-label"
                          :style="{padding: '8px 0', opacity: relCourse._isMatchingRed ? '1' : '0.5'}"
                        >{{ relCourse.objSubject.name }}</div>
                      </td>
                      <td>
                        <div
                          v-show="!relCourse._isMatchingRed"
                          style="padding: 8px; opacity: 0.5; font-size: 0.8em"
                        >- Red no aplica -</div>

                        <select
                          v-show="relCourse._isMatchingRed"
                          class="ui-native select-momento"
                          :value="relCourse.competenciaMomentos[row.id]"
                          @change="setCourseMomento(relCourse.id, row.id, $event.target.value)"
                        >
                          <option :value="null"> --- </option>
                          <option
                            v-for="momento in momentos"
                            :key="momento.id"
                            :value="momento.id"
                          >{{ momento.text }}</option>
                        </select>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </UiField>
          </template>

          <template #cell="{ item }">
            <div
              class="producto-rubric-cell"
              v-text="item.texto"
            ></div>
          </template>
        </UiRubric>
        <div v-else>No se han definido redacciones</div>

      </div>
    </div>

  </div>
</template>

<script>
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import {
  UiCard,
  UiItem,
  UiField,
  UiInput,
  UiTabs,
  UiTab,
} from '@/modules/ui/components';
import PlaneacionProductoPicker from '../PlaneacionProductoPicker/PlaneacionProductoPicker.vue';
import UiRubric from '../UiRubric/UiRubric.vue';
import CmsPage from '@/modules/cms/components/Page/Page.vue';

export default {
  name: 'UnidadProductoEditor',
  mixins: [useApi],
  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  components: {
    UiCard,
    UiItem,
    UiField,
    UiInput,
    UiRubric,
    PlaneacionProductoPicker,
    UiTabs,
    UiTab,

    CmsPage,
  },

  props: {
    /*
    Objeto tipo "unidad-producto"
    {
      unidadId: 'xxx',
      productoId: 'xxx',
      text: '',
      competencias: [
        {competenciaId: 'c1', momentoId: 'm1'},
        {competenciaId: 'c2', momentoId: 'm2'},
        {competenciaId: 'c3', momentoId: 'm3'}
      ],

      competencia/momento para cursos relacionados:
      courseCompetencias: [
        {academicCourseId: 'xxx', competenciaId: 'c1', momentoId: 'm1'},
        {academicCourseId: 'xxx', competenciaId: 'c2', momentoId: 'm2'},
        {academicCourseId: 'xxx', competenciaId: 'c3', momentoId: 'm3'}
      ]

    }
    */
    value: {
      type: Object,
      required: false,
      default: null,
    },

    relatedCourses: {
      type: Array,
      required: false,
      default: () => [],
    },

    courseSequence: {
      type: String,
      required: false,
      default: null,
    },

    readOnly: {
      type: String,
      required: false,
      default: null
    }
  },

  data() {
    return {
      innerValue: null,
      producto: null,
      currentTab: 'body',

      competencias: [],
      momentos: [],
      notas: [],

      redes: [],
    };
  },

  computed: {
    currentRed() {
      if (!this.producto || !this.producto.red) {
        return null;
      }

      return this.redes.find((red) => red.id == this.producto.red);
    },

    rows() {
      return this.competencias
        // no mostrar competencias para las cuales no hay textos en la matriz
        .filter(c => !!(this.producto?.redacciones || []).find(r => r.competencia == c.id && r.texto.trim()))
        .map((c) => ({ ...c, text: c.name }));
    },

    columns() {
      return this.notas.map((n) => ({ ...n, text: n.text }));
    },

    checkedCompetencias() {
      let retval = {};
      if (!this.innerValue || !Array.isArray(this.innerValue.competencias)) {
        return retval;
      }

      this.innerValue.competencias.forEach((c) => {
        retval[c.competenciaId] = c.momentoId;
      });

      return retval;
    },

    parsedRelatedCourses() {
      return this.relatedCourses.map((course) => {
        let competenciaMomentos = {};

        this.competencias.forEach((competencia) => {
          competenciaMomentos[competencia.id] = null;
        });

        (this.innerValue?.courseCompetencias || [])
          .filter(
            (courseCompetencia) =>
              courseCompetencia.academicCourseId == course.id
          )
          .forEach((courseCompetencia) => {
            // courseCompetencia: {academicCourseId: 'xxx', competenciaId: 'c1', momentoId: 'm1'},
            competenciaMomentos[courseCompetencia.competenciaId] =
              courseCompetencia?.momentoId || null;
          });

        return {
          ...course,
          competenciaMomentos,
          _isMatchingRed:
            this.currentRed &&
            course?.objSubject?.area == this.currentRed.areaId,
        };
      });
      // .filter((course) => {
      //   // solo mostrar cursos cuya area(red) corresponda con la red del producto (si la hay)
      //   if (!this.currentRed) {
      //     return true;
      //   }
      //   return course?.objSubject?.area == this.currentRed.areaId;
      // });
    },
  },

  mounted() {
    this.$api.getCompetencias().then((r) => (this.competencias = r));
    this.$api.getMomentos().then((r) => (this.momentos = r));
    this.$api.getNotas().then((r) => (this.notas = r));
    this.$api.getRedes().then((r) => (this.redes = r));
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = {
          productoId: null,
          text: '',
          competencias: [],
          ...newValue,
        };

        if (!this.producto || this.producto.id != this.innerValue.productoId) {
          this.fetchProducto(this.innerValue.productoId);
        }
      },
    },
  },

  methods: {
    getError() {
      if (this.rows.length <= 1) {
        return null;
      }

      if (this.relatedCourses?.length) {
        if (this.innerValue?.courseCompetencias?.length < 2) {
          return 'Debes seleccionar al menos 2 competencias';
        }
      } else {
        if (this.innerValue?.competencias?.length < 2) {
          return 'Debes seleccionar al menos 2 competencias';
        }
      }

      return null;
    },

    async fetchProducto(productoId) {
      if (!productoId) {
        this.producto = null;
        return;
      }

      this.producto = await this.$api.getProducto(productoId);
    },

    emitInput() {
      let clonedValue = JSON.parse(JSON.stringify(this.innerValue));
      clonedValue._error = this.getError() || undefined;

      this.$emit('input', clonedValue);
    },

    onPickerInput($event) {
      this.producto = $event ? $event : null;

      this.innerValue.productoId = $event ? $event.id : null;
      this.innerValue.competencias = [];
      this.innerValue.text = $event?.card?.text || '';

      this.emitInput();
    },

    setMomento(competenciaId, momentoId = null) {
      let existingIndex = this.innerValue.competencias.findIndex(
        (c) => c.competenciaId == competenciaId
      );

      if (existingIndex == -1) {
        this.innerValue.competencias.push({
          competenciaId,
          momentoId,
        });
      } else {
        this.innerValue.competencias[existingIndex].momentoId = momentoId;
      }

      if (existingIndex >= 0 && !momentoId) {
        this.innerValue.competencias.splice(existingIndex, 1);
      }

      this.emitInput();
    },

    setCourseMomento(academicCourseId, competenciaId, momentoId = null) {
      if (!this.innerValue?.courseCompetencias) {
        this.innerValue.courseCompetencias = [];
      }

      let existingIndex = this.innerValue.courseCompetencias.findIndex(
        (c) =>
          c.academicCourseId == academicCourseId &&
          c.competenciaId == competenciaId
      );

      if (existingIndex == -1) {
        this.innerValue.courseCompetencias.push({
          academicCourseId,
          competenciaId,
          momentoId,
        });
      } else {
        this.innerValue.courseCompetencias[existingIndex].momentoId = momentoId;
      }

      if (existingIndex >= 0 && !momentoId) {
        this.innerValue.courseCompetencias.splice(existingIndex, 1);
      }

      this.emitInput();
    },
  },
};
</script>

<style lang="scss">
.UnidadProductoEditor {
  .producto-records {
    display: flex;
    flex-wrap: wrap;

    & > .producto-record {
      display: block;

      flex: 1;
      max-width: 33%;
      min-height: 120px;
      margin: 5px;
    }
  }

  .ui-rubric tbody td {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    padding: 6px;
  }

  .select-momento {
    display: block;
    width: 100%;
    min-width: 120px;
  }
}
</style>