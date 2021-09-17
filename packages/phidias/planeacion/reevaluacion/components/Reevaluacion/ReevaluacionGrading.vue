<template>
  <div class="ReevaluacionGrading">
    <h1 v-if="reevaluacion">{{ reevaluacion.name }} &bull; {{ reevaluacion.objProducto.card.text }}</h1>

    <table>
      <thead>
        <tr>
          <th></th>
          <th
            v-for="nota in allNotas"
            :key="nota.id"
          >
            <div
              class="header-nota"
              :style="{'--nota-color': nota.color}"
            >{{ nota.text }}</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="calificacion in calificaciones"
          :key="calificacion.person.id"
          class="calificacion-row"
          :class="{'--empty': !calificacion.calificacion}"
        >
          <td>
            <PersonItem
              class="--nowrap"
              :badge="calificacion.calificacion ? ' ' : null"
              badge-color="green"
              formal
              :person="calificacion.person"
            />
          </td>
          <td
            v-for="nota in allNotas"
            :key="nota.id"
            @click="setCalificacion(calificacion, nota)"
          >
            <div
              class="cell-nota ui-clickable ui-noselect"
              :class="{'--selected': calificacion.calificacion && calificacion.calificacion.notaId == nota.id}"
            >
              {{ nota.redaccion }}
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <footer>
      <button
        :disabled="isSaving"
        type="button"
        class="ui-button --main"
        @click="save()"
        v-text="isSaving ? 'Guardando ...' : 'Guardar'"
      ></button>
    </footer>

  </div>
</template>

<script>
import { useApi } from '@/modules/api';
import apiV4, { planeacion, reevaluacion } from '/apis/v4';
import PersonItem from '@/modules/core/components/Person/ListItem.vue';

export default {
  name: 'ReevaluacionGrading',
  mixins: [useApi],
  components: { PersonItem },

  $api: {
    type: apiV4,
    wrappers: [planeacion, reevaluacion],
  },

  props: {
    reevaluacionId: {
      type: [String, Number],
      required: true,
    },
  },

  data() {
    return {
      reevaluacion: null,
      notas: [],
      calificaciones: [],
      isSaving: false,
    };
  },

  mounted() {
    this.$api.getNotas().then((r) => (this.notas = r));
  },

  watch: {
    reevaluacionId: {
      immediate: true,
      handler() {
        this.fetchReevaluacion();
        this.fetchCalificaciones();
      },
    },
  },

  computed: {
    allNotas() {
      if (!this.reevaluacion?.objProducto?.redacciones?.length) {
        return [];
      }

      return this.notas.map((nota) => {
        let redaccion = this.reevaluacion.objProducto.redacciones.find(
          (r) => r.nota == nota.id
        );
        return { ...nota, redaccion: redaccion?.texto || null };
      });
    },
  },

  methods: {
    async fetchReevaluacion() {
      this.reevaluacion = await this.$api.getReevaluacion(this.reevaluacionId);
    },

    async fetchCalificaciones() {
      this.calificaciones = await this.$api.getReevaluacionCalificaciones(
        this.reevaluacionId
      );

      this.calificaciones.sort((a, b) =>
        a.person.lastName.localeCompare(b.person.lastName)
      );
    },

    async setCalificacion(objCalificacion, objNota) {
      if (!objCalificacion.calificacion) {
        this.$set(objCalificacion, 'calificacion', {
          notaId: objNota.id,
          value: objNota.value,
        });
        return;
      }

      if (objCalificacion.calificacion.notaId == objNota.id) {
        this.$set(objCalificacion, 'calificacion', null);
        return;
      }

      objCalificacion.calificacion.notaId = objNota.id;
      objCalificacion.calificacion.value = objNota.value;
    },

    async save() {
      let outgoing = this.calificaciones.map((c) => {
        return {
          personId: c.person.id,
          notaId: c?.calificacion?.notaId || null,
          value: c?.calificacion?.value || null,
        };
      });

      this.isSaving = true;
      await this.$api.putReevaluacionCalificaciones(
        this.reevaluacionId,
        outgoing
      );
      this.isSaving = false;
    },
  },
};
</script>

<style lang="scss">
.ReevaluacionGrading {
  & > table {
    width: 100%;

    thead {
      position: sticky;
      top: 0;
      z-index: 2;
      background-color: #fff;
    }
  }

  .calificacion-row {
    cursor: pointer;

    &.--empty {
      opacity: 0.7;
    }

    &:hover {
      opacity: 1;
      background-color: var(--ui-color-highlight);
    }
  }

  .header-nota {
    padding: 4px 6px;
    background-color: var(--nota-color);
  }

  .cell-nota {
    border: 1px solid #eee;
    border-radius: var(--ui-radius);
    padding: 4px 8px;
    min-height: 48px;

    &.--selected {
      // background-color: var(--ui-color-highlight);
      background-color: #ffff8877;
    }
  }
}
</style>