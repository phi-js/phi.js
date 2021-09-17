<template>
  <div class="PlaneacionUnidadProducto">
    <UiRubric
      v-if="unidadProducto"
      :rows="availableCompetencias"
      :columns="notas"
      :value="sanitizedRedacciones"
      row-property="competencia"
      column-property="nota"
    >
      <template #cell="{ item }">
        <div
          class="cell-texto"
          :class="{'--selected': item.isChecked}"
          v-text="item.texto"
        ></div>
      </template>
    </UiRubric>
  </div>
</template>

<script>
import { useApi } from '@/modules/api/';
import v4Api, { planeacion } from '/apis/v4';
import UiRubric from '../UiRubric/UiRubric.vue';

export default {
  name: 'PlaneacionUnidadProducto',
  components: { UiRubric },
  mixins: [useApi],

  $api: {
    type: v4Api,
    wrappers: [planeacion],
  },

  props: {
    unidadProductoId: {
      required: false,
      default: null,
    },

    fixedData: {
      required: false,
      default: () => ({}),
    },
  },

  data() {
    return {
      unidadProducto: null,
      competencias: [],
      notas: [],
    };
  },

  mounted() {
    if (this.fixedData?.unidadProducto) {
      this.unidadProducto = this.fixedData.unidadProducto;
    } else {
      this.fetchUnidadProducto();
    }

    if (this.fixedData?.competencias) {
      this.competencias = this.fixedData.competencias;
    } else {
      this.$api.getCompetencias().then((r) => (this.competencias = r));
    }

    if (this.fixedData?.notas) {
      this.notas = this.fixedData.notas;
    } else {
      this.$api.getNotas().then((r) => (this.notas = r));
    }
  },

  watch: {
    unidadProductoId: {
      handler(newValue) {
        if (!newValue) {
          return;
        }
        this.fetchUnidadProducto();
      },
    },
  },

  computed: {
    availableCompetencias() {
      if (
        !this.unidadProducto?.redacciones?.length ||
        !this.unidadProducto?.competencias?.length ||
        !this.competencias.length
      ) {
        return [];
      }

      // Solo mostrar las competencias que estan asociadas a la unidad-producto
      return this.competencias.filter((c) =>
        this.unidadProducto.competencias.find(
          (upc) => upc.competenciaId == c.id
        )
      );
    },

    sanitizedRedacciones() {
      if (!this.unidadProducto?.redacciones?.length) {
        return [];
      }

      if (!this.unidadProducto?.calificacion?.rubric?.length) {
        return this.unidadProducto.redacciones;
      }

      return this.unidadProducto.redacciones.map((redaccion) => ({
        ...redaccion,
        isChecked: !!this.unidadProducto.calificacion.rubric.find(
          (c) =>
            c.competencia == redaccion.competencia && c.nota == redaccion.nota
        ),
      }));
    },
  },

  methods: {
    async fetchUnidadProducto() {
      let response = await this.$api.query({
        from: 'unidades-productos',
        match: { id: this.unidadProductoId },
        properties: [
          '*',
          {
            redacciones: {
              from: 'productos-redacciones',
              on: { productoId: 'productoId' },
              properties: '*',
            },
          },
        ],
      });

      this.unidadProducto = response?.length ? response[0] : null;
    },
  },
};
</script>

<style lang="scss">
.PlaneacionUnidadProducto {
  .cell-texto {
    display: block;
    font-size: 0.9em;

    overflow: auto;
    padding: 2px 6px;
    margin: 2px;

    border: 1px dashed transparent;
    border-radius: var(--ui-radius);
    min-height: 60px;

    &.--selected {
      background-color: #ffff8833;
      border: 1px solid var(--ui-color-primary);
    }
  }
}
</style>