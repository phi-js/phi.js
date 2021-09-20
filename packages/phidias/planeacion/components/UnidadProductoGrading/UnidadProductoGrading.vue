<template>
  <div class="UnidadProductoGrading">
    <template v-if="producto">
      <div class="entity ui-row --tight">
        <h1 class="title">{{ unidad.titulo }} &bull; {{ producto.card.text }}</h1>
      </div>
      <!-- <UiCard v-bind="producto.card" /> -->
    </template>

    <div class="view-container">
      <transition name="grading-fade">
        <div
          class="people-list"
          v-show="!currentPerson"
        >
          <table>
            <thead>
              <tr>
                <th></th>
                <th
                  v-for="competencia in competencias"
                  :key="competencia.id"
                  style="width: 110px"
                >
                  <div class="competencia">{{ competencia.text }}</div>
                </th>
                <th>
                  <UiIcon
                    value="mdi:information-outline"
                    title="Procesos del mapa de dominio a reforzar"
                    size="16"
                  />
                </th>
                <th></th>
              </tr>
              <tr>
                <th></th>
                <th
                  v-for="competencia in competencias"
                  :key="competencia.id"
                >
                  <div class="momento">{{ competencia.momento.text }}</div>
                </th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(person, i) in sanitizedPeople"
                :key="person.id"
                @click="setCurrentPerson(sanitizedPeople[i])"
                :class="{'--focused': person.id == focusedPersonId}"
              >
                <td>
                  <PersonItem
                    class="person-item"
                    formal
                    :person="person"
                  />
                </td>

                <td
                  v-for="competencia in competencias"
                  :key="competencia.id"
                  class="nota-td"
                >
                  <div
                    class="nota-item"
                    :style="`--nota-color: ${person.hashNotas[competencia.id].color}`"
                  >
                    {{ person.hashNotas[competencia.id].text }}
                  </div>
                </td>

                <td class="refuerzos-td">
                  <div
                    v-if="person.calificacion && person.calificacion.refuerzos && person.calificacion.refuerzos.length"
                    title="Procesos del mapa de dominio a reforzar"
                    v-text="person.calificacion.refuerzos.length"
                  ></div>
                </td>

                <td>
                  <div class="notices --table">
                    <UiItem
                      v-for="(notice, ndx) in person.notices"
                      :key="ndx"
                      v-bind="notice"
                      :icon-color="notice.color"
                      class="notice-item"
                      icon-size="16"
                    />
                  </div>
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr class="empty-row">
                <td></td>
                <td
                  v-for="competencia in competencias"
                  :key="competencia.id"
                ></td>
                <td></td>
                <td></td>
              </tr>

              <tr
                v-for="nota in notas"
                :key="nota.id"
              >
                <td>{{ nota.text }}</td>
                <td
                  v-for="competencia in competencias"
                  :key="competencia.id"
                >
                  <div class="tally-item">
                    <div class="tally-count">{{ tally[competencia.id][nota.id].count }}</div>
                    <div class="tally-percent">{{ tally[competencia.id][nota.id].percent }}%</div>
                  </div>
                </td>
                <td></td>
                <td></td>
              </tr>

              <tr class="footer-row">
                <td :colspan="competencias.length + 2">
                  <UnidadProductoMigracion
                    ref="migracion"
                    :unidad-producto-id="unidadProductoId"
                    :academic-group-id="academicGroupId"
                    :academic-scheme-id="academicSchemeId"
                  />
                </td>
                <td></td>
              </tr>

            </tfoot>
          </table>

        </div>
      </transition>

      <transition name="grading-fade">
        <div
          v-if="currentPerson"
          class="current-person-page"
        >
          <div class="person-toolbar">

            <div style="display:flex; align-items: flex-start">
              <UiIcon
                value="mdi:arrow-left"
                class="ui-clickable"
                style="padding: 12px"
                title="Regresar al listado"
                @click="setCurrentPerson(null)"
              />
              <PersonItem
                :person="currentPerson"
                formal
              >
                <template #secondary>
                  <div class="notices --top">
                    <UiItem
                      v-for="(notice, ndx) in currentPerson.notices"
                      :key="ndx"
                      v-bind="notice"
                      :icon-color="notice.color"
                      class="notice-item"
                      icon-size="16"
                    />
                  </div>
                </template>
              </PersonItem>
            </div>

            <div class="navigation --top">
              <div class="navigation-actions">
                <div class="ui-group">
                  <button
                    class="ui-button"
                    :disabled="!previousPerson"
                    :title="previousPerson ? `${previousPerson.lastName}, ${previousPerson.firstName}` : ''"
                    @click="setCurrentPerson(previousPerson)"
                  >Anterior</button>

                  <button
                    class="ui-button"
                    :disabled="!nextPerson"
                    :title="nextPerson ? `${nextPerson.lastName}, ${nextPerson.firstName}` : 'Fin!'"
                    @click="setCurrentPerson(nextPerson)"
                  >Siguiente</button>
                </div>

                <button
                  type="button"
                  class="ui-button --cancel"
                  style="margin-left: auto"
                  @click="setCurrentPerson(null)"
                >Cerrar</button>
              </div>
            </div>

          </div>

          <div class="current-grading-container">
            <PersonGrading
              :unidad-producto-id="unidadProductoId"
              :person-id="currentPerson.id"
              :notas="notas"
              :competencias="competencias"
              :redacciones="redacciones"
              :dominios="dominios"
              v-model="currentPerson.calificacion"
              @input="onEditorInput"
            />

            <div class="current-footer">
              <button
                v-if="nextPerson"
                type="button"
                class="ui-button --main"
                style="margin-right: 1em"
                @click="onEditorAccept(currentPerson.calificacion, nextPerson)"
                :disabled="isSaving"
                :title="nextPerson ? `${nextPerson.lastName}, ${nextPerson.firstName}` : ''"
                v-text="isSaving ? 'Guardando ...' : 'Guardar y avanzar'"
              ></button>

              <button
                type="button"
                class="ui-button"
                @click="onEditorAccept(currentPerson.calificacion)"
                :disabled="isSaving"
                v-text="isSaving ? 'Guardando ...' : 'Guardar y cerrar'"
              ></button>

              <div class="navigation --bottom">
                <div class="navigation-actions">
                  <div class="ui-group">
                    <button
                      class="ui-button"
                      :disabled="!previousPerson"
                      :title="previousPerson ? `${previousPerson.lastName}, ${previousPerson.firstName}` : ''"
                      @click="setCurrentPerson(previousPerson)"
                    >Anterior</button>

                    <button
                      class="ui-button"
                      :disabled="!nextPerson"
                      :title="nextPerson ? `${nextPerson.lastName}, ${nextPerson.firstName}` : 'Fin!'"
                      @click="setCurrentPerson(nextPerson)"
                    >Siguiente</button>
                  </div>

                  <button
                    type="button"
                    class="ui-button --cancel"
                    style="margin-left: auto"
                    @click="setCurrentPerson(null)"
                  >Cerrar</button>
                </div>
              </div>
            </div>

            <div class="notices --bottom">
              <UiItem
                v-for="(notice, ndx) in currentPerson.notices"
                :key="ndx"
                v-bind="notice"
                :icon-color="notice.color"
                class="notice-item"
                icon-size="16"
              />
            </div>

          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import PersonGrading from './PersonGrading.vue';
import UnidadProductoMigracion from './UnidadProductoMigracion.vue';
import PersonItem from '@/modules/core/components/Person/ListItem.vue';
import { UiCard, UiItem, UiIcon, UiTabs, UiTab } from '@/modules/ui/components';

export default {
  name: 'UnidadProductoGrading',
  mixins: [useApi, useI18n],

  components: {
    UnidadProductoMigracion,
    PersonGrading,
    PersonItem,
    UiCard,
    UiItem,
    UiIcon,
    UiTabs,
    UiTab,
  },

  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  props: {
    unidadProductoId: {
      type: String,
      required: true,
    },

    academicGroupId: {
      type: String,
      required: true,
    },

    // Se podria obteniendo primero el unidadProducto,
    // pero tenerlo de antemano nos ayuda a hacer el query de traer
    // estudiantes de inmediato
    periodId: {
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
      allCompetencias: [],

      unidadProducto: null,
      people: [],

      notas: [],
      competencias: [],
      redacciones: [],
      momentos: [],
      dominios: [],

      currentPerson: null,

      unidad: null,
      producto: null,

      hasChanges: false,
      isSaving: false,
      windowLastScrollY: null,
      focusedPersonId: null,
    };
  },

  computed: {
    /*
    Contador de porcentajes para cada competencia-nota
    {
      "c1": {
        "n1": {count: 0, percent: 0},
        "n2": 33,
      }
    }
    */
    tally() {
      let retval = {};
      this.allCompetencias.forEach((competencia) => {
        retval[competencia.id] = {};

        this.notas.forEach((nota) => {
          retval[competencia.id][nota.id] = {
            count: 0,
            percent: 0,
          };
        });
      });

      this.people.forEach((person) => {
        if (person.calificacion?.rubric?.length) {
          person.calificacion.rubric
            .filter((cell) => !!cell.nota)
            .forEach((cell) => {
              let item = retval[cell.competencia][cell.nota];
              item.count++;
              item.percent = (
                (item.count / this.people.length) *
                100
              ).toPrecision(2);
            });
        }
      });

      return retval;
    },

    hashNotas() {
      let retval = {};
      this.notas.forEach((n) => (retval[n.id] = n));

      retval.cero = { id: 'cero', value: '0', text: 'Cero' };
      retval.excusa = {
        id: 'excusa',
        value: '0',
        text: 'E.J',
      };
      return retval;
    },

    /*
    Lista de personas incluyendo las propiedades:
      notices: lista de alertar para el profesor
      hashNotas: hash de nota por competencia (garantizado de existir una llave por cada competencia)
    */
    sanitizedPeople() {
      return this.people.map((person) => {
        let notices = this.getNotices(person.calificacion);

        let hashNotas = {};
        if (person.calificacion?.rubric?.length) {
          person.calificacion.rubric.forEach((cell) => {
            hashNotas[cell.competencia] = cell.nota
              ? {
                  text: this.hashNotas?.[cell.nota]?.text || '-',
                  color: this.hashNotas?.[cell.nota]?.color,
                }
              : {
                  text: this.hashNotas?.[cell.justificante]?.text || '-',
                  color: this.hashNotas?.[cell.justificante]?.color,
                };
          });
        }

        // faltantes
        this.allCompetencias.forEach((competencia) => {
          if (typeof hashNotas[competencia.id] == 'undefined') {
            hashNotas[competencia.id] = { text: '-' };
          }
        });

        return { ...person, notices, hashNotas };
      });
    },

    nextPerson() {
      if (!this.currentPerson) {
        return null;
      }
      let currentPersonIndex = this.sanitizedPeople.findIndex(
        (p) => p.id == this.currentPerson.id
      );
      return this.sanitizedPeople?.[currentPersonIndex + 1] || null;
    },

    previousPerson() {
      if (!this.currentPerson) {
        return null;
      }
      let currentPersonIndex = this.sanitizedPeople.findIndex(
        (p) => p.id == this.currentPerson.id
      );
      return this.sanitizedPeople?.[currentPersonIndex - 1] || null;
    },
  },

  async mounted() {
    this.$api.getCompetencias().then((r) => (this.allCompetencias = r));
    this.$api.getNotas().then((r) => (this.notas = r));
    this.$api.getMomentos().then((r) => (this.momentos = r));
  },

  watch: {
    unidadProductoId: {
      immediate: true,
      handler() {
        this.fetchUnidades();
      },
    },

    academicGroupId: {
      immediate: true,
      handler() {
        this.fetchPeople();
      },
    },

    periodId: {
      handler() {
        this.fetchPeople();
      },
    },
  },

  methods: {
    onEditorInput() {
      this.hasChanges = true;
      this.currentPerson.notices = this.getNotices(
        this.currentPerson.calificacion
      );
    },

    async onEditorAccept(calificacion, gotoPerson = null) {
      if (!this.currentPerson) {
        return;
      }

      if (!this.hasChanges) {
        this.setCurrentPerson(gotoPerson);
        return;
      }

      this.isSaving = true;

      try {
        let created = await this.$api.setCalificacion(
          this.unidadProductoId,
          this.currentPerson.id,
          calificacion
        );

        this.$set(this.currentPerson, 'calificacion', created);

        // actualizar el registro en el listado
        let personObj = this.people.find((p) => p.id == this.currentPerson.id);
        if (personObj) {
          Object.assign(personObj, this.currentPerson);
        }
        this.hasChanges = false;
        this.setCurrentPerson(gotoPerson);

        // Migrador:  Si esta en estado publicado, auto-publicar cambios
        // cada vez que se modifique un estudiante
        // if (this.$refs.migracion.latest) {
        //   this.$refs.migracion.put();
        // }
      } catch (err) {
        console.error(err);
        alert('Error guardando datos!');
      }

      this.isSaving = false;
    },

    setCurrentPerson(person) {
      if (
        this.hasChanges &&
        !confirm('Hay cambios sin guardar. Realmente deseas salir ?')
      ) {
        return;
      }

      // Si estoy haciendo click desde el listado, recordar el scrollY
      if (!this.currentPerson) {
        this.windowLastScrollY = window.scrollY;
      }

      if (!person) {
        this.currentPerson = null;
        this.$nextTick(() => {
          window.scrollTo(0, this.windowLastScrollY);

          this.$el.querySelector('.--focused')?.scrollIntoView({
            block: 'nearest',
            inline: 'nearest',
          });
        });
      } else {
        this.currentPerson = JSON.parse(JSON.stringify(person));
        this.focusedPersonId = person.id;
        this.$nextTick(() => window.scrollTo(0, 0));
      }

      this.hasChanges = false;
    },

    async fetchUnidades() {
      let response = await this.$api.query({
        from: 'unidades-productos',
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
            objUnidad: {
              single: true,
              from: 'unidades',
              on: { id: 'unidadId' },
              properties: '*',
            },
          },
          {
            objProducto: {
              single: true,
              from: 'productos',
              on: { id: 'productoId' },
              properties: ['id', 'card'],
            },
          },
        ],
        match: {
          id: this.unidadProductoId,
        },
      });
      this.unidadProducto = response?.[0] || null;

      if (!this.unidadProducto) {
        return;
      }

      this.unidad = this.unidadProducto.objUnidad;
      this.producto = this.unidadProducto.objProducto;
      this.redacciones = this.unidadProducto.redacciones;

      this.competencias = this.unidadProducto.competencias
        .map((upCompetencia) => {
          let objCompetencia = this.allCompetencias.find(
            (c) => c.id == upCompetencia.competenciaId
          );
          if (!objCompetencia) {
            return null;
          }

          let objMomento = this.momentos.find(
            (m) => m.id == upCompetencia.momentoId
          );
          return { ...objCompetencia, momento: objMomento };
        })
        .filter((e) => e != null);
    },

    async fetchPeople() {
      let inscriptions = await this.$api.query({
        from: {
          entity: 'Phidias\\V3\\Academic\\Course\\Group\\Inscription\\Entity',
        },
        match: {
          group: this.academicGroupId,
          period: this.periodId,
        },
        properties: [
          '*',
          {
            objGroup: {
              single: true,
              from: { entity: 'Phidias\\V3\\Academic\\Course\\Group\\Entity' },
              on: { id: 'group' },
              properties: [
                '*',
                {
                  objSection: {
                    single: true,
                    from: {
                      entity: 'Phidias\\V3\\Course\\Section\\Entity',
                    },
                    on: { id: 'section' },
                    properties: [
                      '*',
                      {
                        objCourse: {
                          single: true,
                          from: {
                            entity: 'Phidias\\V3\\Course\\Entity',
                          },
                          on: { id: 'course' },
                          properties: ['*'],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },

          {
            person: {
              single: true,
              from: { entity: 'Phidias\\Core\\Person\\Entity' },
              on: { id: 'student' },
              properties: [
                'id',
                'firstName',
                'lastName',
                'gender',
                'avatar',
                {
                  calificacion: {
                    single: true,
                    from: 'unidad-producto-calificaciones',
                    on: { personId: 'id' },
                    match: { unidadProductoId: this.unidadProductoId },
                    properties: '*',
                  },
                },
              ],
            },
          },
        ],
      });

      if (!inscriptions?.length) {
        this.people = [];
        return;
      }

      // Si hay una seccion (course/section/entity) asociada, usarla para obtener
      // el curso y su lista de dominios
      let courseSequence =
        inscriptions?.[0]?.objGroup?.objSection?.objCourse.sequence;

      if (parseInt(courseSequence) >= 0) {
        this.dominios = await this.$api.getDominios(courseSequence);
      }

      this.people = inscriptions.map((ins) => ins.person);
      this.people.sort((a, b) => a.lastName.localeCompare(b.lastName));
    },

    /**
     * Lista de "notices": Comentarios referentes a la falificacion del estudiante
     * e.ej "Falta metacognicion",  "No tiene observaciones".  Cada una con icono y color (opt)
     */
    getNotices(calificacion) {
      let retval = [];

      let pendientes = this.competencias.filter((competencia) => {
        return !(calificacion?.rubric || []).find(
          (cal) =>
            cal.competencia == competencia.id && (cal.nota || cal.justificante)
        );
      });

      if (pendientes.length === this.competencias.length) {
        return [
          {
            text: 'Pendiente de evaluación',
            color: 'var(--ui-color-warning)',
            icon: 'mdi:clipboard-alert',
          },
        ];
      }

      if (pendientes.length === 1) {
        retval.push({
          text: `${pendientes[0].text} pendiente de evaluación`,
          color: 'var(--ui-color-warning)',
          icon: 'mdi:alert',
        });

        return retval;
      }

      if (pendientes.length > 0) {
        retval.push({
          text: `${pendientes.length} competencias pendientes de evaluación`,
          color: 'var(--ui-color-warning)',
          icon: 'mdi:alert',
        });

        return retval;
      }

      if (!calificacion.observaciones.trim() && !pendientes.length) {
        retval.push({
          text: 'No se han escrito pasos a seguir',
          color: 'var(--ui-color-warning)',
          icon: 'mdi:message',
        });

        return retval;
      }

      retval.push({
        text: 'Evaluado',
        color: 'var(--ui-color-success)',
        icon: 'mdi:check',
      });

      return retval;
    },

    normalize(string) {
      return string
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9 ]/g, '');
    },
  },
};
</script>

<style lang="scss">
.UnidadProductoGrading {
  .current-footer {
    display: flex;
    align-items: flex-start;
  }

  .view-container {
    position: relative;

    .people-list {
      z-index: 0;
    }

    // Tabla de personas
    .people-list table {
      position: relative;

      thead {
        position: sticky;
        top: 0;
        background-color: rgba(255, 255, 255, 0.8);

        th {
          padding: 0 6px;

          .momento {
            font-size: 12px;
            color: #777;
          }
        }
      }

      tbody {
        tr {
          cursor: pointer;
        }

        tr:hover,
        tr.--focused {
          background-color: var(--ui-color-highlight);
          td {
            background-color: var(--ui-color-highlight);
          }
        }

        td {
          vertical-align: top;
        }
      }

      tfoot {
        .empty-row {
          td {
            height: 10px;
            border-top: 1px solid #eee;
          }

          &:hover td {
            background-color: initial;
          }
        }

        tr:hover td {
          background-color: var(--ui-color-highlight);
        }

        td {
          text-align: center;

          &:first-child {
            text-align: left;
            padding-left: 56px;
            font-weight: bold;
          }
        }

        .footer-row td {
          padding: 12px;
          padding-left: 0;
        }
      }

      .tally-item {
        font-size: 0.9em;
        font-family: var(--ui-font-secondary);
        display: flex;
        align-items: center;

        & > div {
          flex: 1;
          text-align: right;
        }

        .tally-count {
          flex: 2;
          font-weight: bold;
        }

        .tally-percent {
          font-size: 11px;
        }
      }

      .nota-td {
        text-align: center;
      }

      .nota-item {
        // border-radius: 3px;
        margin-top: 12px;
        padding: 5px 7px;
        background-color: var(--nota-color);
        font-size: 12px;
        font-family: var(--ui-font-secondary);
      }

      .refuerzos-td {
        text-align: center;

        div {
          margin-top: 18px;
          // padding: 5px 7px;
          font-size: 12px;
          font-family: var(--ui-font-secondary);
          font-weight: bold;
        }
      }
    }

    .current-person-page {
      background-color: #fff;
      z-index: 3;
    }

    // TRANSITION
    .grading-fade-enter-active,
    .grading-fade-leave-active {
      transition: all var(--ui-duration-snap);

      // Si se dejan todos los elementos con position:absolute
      // el contenedor colapsa (altura 0) durante la transicion
      // y causa wonkyness con el contenido que tiene debajo
      // position: absolute;
      &.current-person-page {
        position: absolute;
      }

      top: 0;
      width: 100%;
    }

    .grading-fade-enter,
    .grading-fade-leave-to {
      opacity: 0;
      transform: translateX(20px);
    }
  }

  .person-toolbar {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    margin-bottom: 4px;
  }

  .navigation {
    margin-left: auto;
  }

  .notices {
    padding: 8px;

    .notice-item {
      font-size: 0.9em;

      // El elemento <UiItem> deberia responder a font-size
      // incluyendo el icono (y paddings(?))
      --item-icon-width: 28px;

      .item-body {
        padding: 0;
      }
    }

    &.--top {
      padding: 0;
      margin-left: -8px;
    }
  }

  .person-resumen {
    .resumen-item {
      display: inline-block;
      margin-right: 1em;
      min-width: 20%;
      padding: 3px;
      border-radius: var(--ui-radius);

      &.--missing {
        .resumen-item-nota {
          color: var(--ui-color-danger);
        }
      }

      .resumen-item-competencia,
      .resumen-item-nota {
        display: block;
      }

      .resumen-item-competencia {
        font-weight: bold;
      }
    }
  }
}
</style>