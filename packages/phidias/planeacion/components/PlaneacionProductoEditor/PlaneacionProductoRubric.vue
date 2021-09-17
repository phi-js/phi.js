<template>
  <div class="PlaneacionProductoRubric">
    <UiRubric
      v-if="rows && rows.length"
      :rows="rows"
      :columns="columns"
      :value="redacciones"
      row-property="competencia"
      column-property="nota"
    >
      <template #corner>
        <div>
          <label>
            <input
              type="checkbox"
              v-model="isConfiguring"
            />
            Generador
          </label>
          <button
            style="margin-top: 12px"
            v-show="isConfiguring"
            type="button"
            @click="autofill"
          >Autocompletar</button>
        </div>
      </template>

      <template #column-description="{column}">
        <input
          v-show="isConfiguring"
          type="text"
          :placeholder="`Prefijo de ${column.text}`"
          v-model="filler.columns[column.id]"
        />
      </template>

      <template #row-description="{row}">
        <textarea
          v-show="isConfiguring"
          :placeholder="`Texto base de ${row.text}`"
          v-model="filler.rows[row.id]"
        ></textarea>
      </template>

      <template #cell="{ item }">
        <textarea
          class="rubric-textarea"
          v-model="item.texto"
          @input="onTextareaInput"
          onfocus="this.select()"
        ></textarea>
      </template>
    </UiRubric>
  </div>
</template>

<script>
import UiRubric from '../UiRubric/UiRubric.vue';

export default {
  name: 'PlaneacionProductoRubric',
  components: { UiRubric },

  props: {
    notas: {
      type: Array,
      required: true,
    },

    competencias: {
      type: Array,
      required: true,
    },

    value: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  mounted() {
    this.notas.forEach((n) => this.$set(this.filler.columns, n.id, ''));
    this.competencias.forEach((c) => this.$set(this.filler.rows, c.id, ''));
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.redacciones = Array.isArray(newValue)
          ? JSON.parse(JSON.stringify(newValue))
          : [];

        this.populateRedacciones();
      },
    },

    notas() {
      this.populateRedacciones();
    },

    competencias() {
      this.populateRedacciones();
    },
  },

  data() {
    return {
      redacciones: [],

      isConfiguring: false,
      filler: {
        rows: {},
        columns: {},
      },
    };
  },

  computed: {
    rows() {
      return this.competencias.map((c) => ({ ...c, text: c.name }));
    },

    columns() {
      return this.notas.map((n) => ({ ...n, text: n.text }));
    },

    redaccionesHash() {
      let hash = {};
      this.redacciones.forEach((redaccion) => {
        if (typeof hash[redaccion.nota] == 'undefined') {
          hash[redaccion.nota] = {};
        }
        if (typeof hash[redaccion.nota][redaccion.competencia] == 'undefined') {
          hash[redaccion.nota][redaccion.competencia] = {};
        }

        hash[redaccion.nota][redaccion.competencia] = redaccion;
      });

      return hash;
    },
  },

  methods: {
    // Se asegura de que existan redacciones para todas las combinaciones de nota x competencia
    populateRedacciones() {
      if (
        this.redacciones.length ==
        this.notas.length * this.competencias.length
      ) {
        return;
      }

      this.notas.forEach((nota) => {
        this.competencias.forEach((competencia) => {
          if (
            typeof this.redaccionesHash[nota.id] == 'undefined' ||
            typeof this.redaccionesHash[nota.id][competencia.id] == 'undefined'
          ) {
            this.redacciones.push({
              competencia: competencia.id,
              nota: nota.id,
              texto: '',
            });
          }
        });
      });
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.redacciones)));
    },

    onTextareaInput() {
      this.emitInput();
    },

    autofill() {
      this.redacciones
        .filter((r) => !r.texto.trim())
        .forEach(
          (r) =>
            (r.texto = `${this.filler.columns[r.nota]} ${
              this.filler.rows[r.competencia]
            }`)
        );

      this.emitInput();
    },
  },
};
</script>

<style lang="scss">
.PlaneacionProductoRubric {
  .rubric-textarea {
    display: block;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    min-height: 150px;

    font-size: 0.9em;

    margin: 0;
    padding: 8px;
    border: 1px solid rgba(0, 0, 0, 0.06);
    resize: none;
    overflow: auto;
  }
}
</style>