<template>
  <div class="PlaneacionTally">
    <div
      v-for="(tabla, i) in tablas"
      :key="i"
      class="tally-table-container"
    >
      <div class="tally-table-label ui-label">{{ tabla.title }}</div>

      <table class="ui-table">
        <thead>
          <tr>
            <td></td>
            <td
              v-for="momento in momentos"
              :key="momento.id"
              align="right"
              nowrap
            >{{ momento.text }}</td>
            <td align="right">Total</td>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="competencia in competencias"
            :key="competencia.id"
          >
            <td class="row-title"><span>{{competencia.name}}</span></td>
            <td
              v-for="momento in momentos"
              :key="momento.id"
              align="right"
            >{{ tabla.values[competencia.id][momento.id] }}</td>

            <td align="right">{{ tabla.values[competencia.id]['total'] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PlaneacionTally',

  props: {
    competencias: {
      type: Array,
      required: false,
      default: () => [],
    },

    momentos: {
      type: Array,
      required: false,
      default: () => [],
    },

    unidades: {
      type: Array,
      required: false,
      default: () => [],
    },

    relatedCourses: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      foo: null,
    };
  },

  computed: {
    tablas() {
      let retval = [];

      let defaultTable = {
        title: 'Balance de evaluación por competencias',
        values: {}, // hash.   values[competencia.id][momento.id]
      };

      let courseTables = {}; // hash { [COURSE ID]: {...objeto tabla...}   }

      this.unidades.forEach((unidad) => {
        if (!unidad?.productos?.length) {
          return;
        }

        unidad.productos.forEach((unidadProducto) => {
          let allItems = [
            ...(unidadProducto?.competencias || []),
            ...(unidadProducto?.courseCompetencias || []),
          ];

          allItems.forEach((upc) => {
            let table;
            if (upc.academicCourseId) {
              if (typeof courseTables[upc.academicCourseId] == 'undefined') {
                let objCourse = this.relatedCourses.find(
                  (rc) => rc.id == upc.academicCourseId
                );
                let courseName = objCourse
                  ? `${objCourse.objSubject.name}`
                  : `#REF: ${upc.academicCourseId}`;

                courseTables[upc.academicCourseId] = {
                  title: `Balance de evaluación por competencias (${courseName})`,
                  values: [],
                };
              }
              table = courseTables[upc.academicCourseId];
            } else {
              table = defaultTable;
            }

            if (!table._saved) {
              retval.push(table);
              table._saved = true;
            }

            if (typeof table.values[upc.competenciaId] == 'undefined') {
              table.values[upc.competenciaId] = { total: 0 };
            }

            if (
              typeof table.values[upc.competenciaId][upc.momentoId] ==
              'undefined'
            ) {
              table.values[upc.competenciaId][upc.momentoId] = 0;
            }

            table.values[upc.competenciaId][upc.momentoId]++;
            table.values[upc.competenciaId].total++;
          });
        });
      });

      // completar valores vacios de cada tabla
      retval.forEach((tabla) => {
        this.competencias.forEach((competencia) => {
          if (typeof tabla.values[competencia.id] == 'undefined') {
            tabla.values[competencia.id] = { total: 0 };
          }

          this.momentos.forEach((momento) => {
            if (
              typeof tabla.values[competencia.id][momento.id] == 'undefined'
            ) {
              tabla.values[competencia.id][momento.id] = 0;
            }
          });
        });
      });

      return retval;
    },

    tally() {
      let retval = {};

      // inicializar tally vacio
      this.competencias.forEach((competencia) => {
        retval[competencia.id] = {
          total: 0,
        };
        this.momentos.forEach((momento) => {
          retval[competencia.id][momento.id] = 0;
        });
      });

      retval['total'] = {};
      this.momentos.forEach((momento) => {
        retval['total'][momento.id] = 0;
      });

      // rellenar con contadores
      this.unidades.forEach((rUnidad) => {
        let asociaciones = rUnidad?.productos || [];
        asociaciones.forEach((asoc, j) => {
          let competencias = asoc?.competencias || [];
          competencias.forEach((linkCompetencia) => {
            let competenciaId = linkCompetencia.competenciaId;
            let momentoId = linkCompetencia.momentoId;
            if (!momentoId || !competenciaId) {
              return;
            }

            retval[competenciaId][momentoId]++;
            retval[competenciaId]['total']++;

            retval['total'][momentoId]++;
          });
        });
      });

      return retval;
    },
  },
};
</script>
<style lang="scss">
.PlaneacionTally {
  .tally-table-container {
    margin-bottom: 46px;
  }

  .tally-table-label {
    margin: 0;
    padding: 0;
  }
}
</style>