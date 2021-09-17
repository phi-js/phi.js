<template>
  <div class="UnidadProductoResults">
    <div
      v-for="unidad in sanitizedUnidades"
      :key="unidad.id"
    >
      <UiDrawer>
        <template #trigger>
          <UiItem
            class="ui-clickable"
            icon="mdi:book-outline"
            :text="unidad.titulo"
            :secondary="unidad.descripcion"
            :tertiary="`${$ts(unidad.fechaInicial, 'day')} - ${$ts(unidad.fechaFinal, 'day')}`"
          />
        </template>
        <template #contents>
          <div class="unidad-productos">
            <div
              v-for="unidadProducto in unidad.productos"
              :key="unidadProducto.id"
            >
              <UiItem
                v-if="!unidadProducto.calificacion"
                icon="mdi:file-outline"
                v-bind="unidadProducto.producto.card"
                secondary="No calificado aún"
              />
              <UiDialog v-else>
                <template #trigger>
                  <UiItem
                    class="ui-clickable"
                    icon="mdi:file-outline"
                    v-bind="unidadProducto.producto.card"
                  />
                </template>
                <template #contents>
                  <UiCard v-bind="unidadProducto.producto.card" />

                  <table
                    class="calificacion-table"
                    v-if="unidadProducto.resumen"
                  >
                    <thead>
                      <tr>
                        <th>Ganados</th>
                        <th>Perdidos</th>
                        <th>Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td valign="top">
                          <div
                            v-for="(item, i) in unidadProducto.resumen.ganados"
                            :key="i"
                            class="grading-item"
                          >
                            <span class="competencia-nombre">{{ item.objCompetencia.name }}</span>
                            <span class="nota-symbol">{{ item.objNota.initial }}</span>
                            <span class="redaccion-texto">{{ item.redaccion.texto }}</span>
                          </div>
                        </td>
                        <td valign="top">
                          <div
                            v-for="(item, i) in unidadProducto.resumen.perdidos"
                            :key="i"
                            class="grading-item"
                          >
                            <span class="competencia-nombre">{{ item.objCompetencia.name }}</span>
                            <span class="nota-symbol">{{ item.objNota.initial }}</span>
                            <span class="redaccion-texto">{{ item.redaccion.texto }}</span>
                          </div>
                        </td>
                        <td valign="top">
                          <span class="unidadProducto-observaciones">{{ unidadProducto.resumen.observaciones }}</span>

                          <div
                            v-if="unidadProducto.resumen.refuerzos.length"
                            classs="unidadProducto-refuerzos"
                          >
                            <div>Procesos del mapa de dominio a reforzar:</div>
                            <ul>
                              <li
                                v-for="refuerzo in unidadProducto.resumen.refuerzos"
                                :key="refuerzo.dominioId"
                              >{{ refuerzo.text }}</li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </template>
              </UiDialog>
            </div>
          </div>
        </template>
      </UiDrawer>
    </div>

  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';
import { UiItem, UiDrawer, UiDialog, UiCard } from '@/modules/ui/components';

export default {
  name: 'UnidadProductoResults',
  mixins: [useI18n, useApi],
  components: { UiItem, UiDrawer, UiDialog, UiCard },

  $api: {
    type: apiV4,
    wrappers: [planeacion],
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

    personId: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      unidades: [],
      notas: [],
      competencias: [],
    };
  },

  mounted() {
    this.fetchUnidades();
    this.$api.getNotas().then((r) => (this.notas = r));
    this.$api.getCompetencias().then((r) => (this.competencias = r));
  },

  watch: {
    academicCourseId() {
      this.fetchUnidades();
    },

    periodId() {
      this.fetchUnidades();
    },

    personId() {
      this.fetchUnidades();
    },
  },

  computed: {
    sanitizedUnidades() {
      if (
        !this.unidades.length ||
        !this.notas.length ||
        !this.competencias.length
      ) {
        return [];
      }

      let retval = [];

      this.unidades.forEach((unidad) => {
        let unidadProductos = [];
        unidad.productos.forEach((unidadProducto) => {
          if (!unidadProducto?.calificacion) {
            return;
          }

          let resumen = {
            ganados: [],
            perdidos: [],
            observaciones: unidadProducto?.calificacion?.observaciones || '',
            refuerzos: unidadProducto?.calificacion?.refuerzos || [],
          };

          (unidadProducto.calificacion?.rubric || []).forEach((cell) => {
            if (!cell.nota) {
              return;
            }

            let objCompetencia = this.competencias.find(
              (c) => c.id == cell.competencia
            );
            let objNota = this.notas.find((n) => n.id == cell.nota);
            if (!objNota) {
              console.warn(
                'no se encontró objeto definiendo la nota',
                cell.nota
              );
              return;
            }

            objNota.initial = objNota.text.substring(0, 1);

            let redaccion = (unidadProducto?.producto?.redacciones || []).find(
              (r) => r.competencia == cell.competencia && r.nota == cell.nota
            );

            let targetItem = {
              cell,
              redaccion,
              objCompetencia,
              objNota,
            };

            /// !!!! Quemado:  Determinar si es GANADO o PERDIDO
            if (objNota.value >= 3) {
              resumen.ganados.push(targetItem);
            } else {
              resumen.perdidos.push(targetItem);
            }
          });

          unidadProducto.resumen = resumen;

          unidadProductos.push(unidadProducto);
        });

        if (unidadProductos.length) {
          retval.push({ ...unidad, productos: unidadProductos });
        }
      });

      // retval.forEach((unidad) => {
      //   unidad.productos.forEach((unidadProducto) => {
      //     if (!unidadProducto?.calificacion) {
      //       return;
      //     }
      //     // unidadProducto.calificaciones = unidadProducto.calificaciones.map(
      //     //   (calificacion) => {
      //     //     let redaccion = (
      //     //       unidadProducto?.producto?.redacciones || []
      //     //     ).find(
      //     //       (r) =>
      //     //         r.competencia == calificacion.competencia &&
      //     //         r.nota == calificacion.nota
      //     //     );

      //     //     if (redaccion) {
      //     //       redaccion.nota = this.notas.find((n) => n.id == redaccion.nota);
      //     //       redaccion.competencia = this.competencias.find(
      //     //         (c) => c.id == redaccion.competencia
      //     //       );
      //     //     }

      //     //     return {
      //     //       ...calificacion,
      //     //       redaccion,
      //     //     };
      //     //   }
      //     // );
      //   });
      // });

      return retval;
    },
  },

  methods: {
    async fetchUnidades() {
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
                  producto: {
                    single: true,
                    from: 'productos',
                    on: { id: 'productoId' },
                    properties: [
                      'id',
                      'card',
                      {
                        redacciones: {
                          from: 'productos-redacciones',
                          on: { productoId: 'id' },
                          properties: '*',
                        },
                      },
                    ],
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

<style lang="scss">
.UnidadProductoResults {
  .unidad-productos {
    padding-left: 48px;
  }
}

.calificacion-table {
  width: 100%;
  margin: 0;
  padding: 0;
  margin-top: var(--ui-breathe);

  th {
    text-align: left;
  }

  .grading-item {
    margin-bottom: 0.5em;

    .competencia-nombre {
      display: block;
      font-weight: bold;
    }

    .nota-symbol {
      display: inline-block;
      margin-right: 0.5em;
    }
  }
}

.calificacion-summary {
  .calificacion-item {
    margin: 12px 0;
  }

  .calif-competencia {
    display: inline-block;
  }
  .calif-nota {
    display: inline-block;
  }
  .calif-texto {
    display: block;
  }
}
</style>