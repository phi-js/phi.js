<template>
  <div class="PersonGrading">
    <UiRubric
      class="checkable-rubric"
      :value="fullRubric"
      :rows="competencias"
      :columns="notas"
      row-property="competencia"
      column-property="nota"
    >
      <template #cell="{ item }">
        <div
          class="cell-texto ui-clickable"
          :class="{'--selected': item.isChecked}"
          v-text="item.texto"
          @click="onClickCell(item)"
        ></div>
      </template>

      <template #row-header="{ row }">
        <div class="grading-row-header">
          <h3>{{ row.name }}</h3>
          <small v-if="row.momento">{{ row.momento.text }}</small>
        </div>
      </template>

      <template #row-end-header>
        <div class="cell-row-end">
          <label class="ui-label">Justificante</label>
        </div>
      </template>

      <template #row-end="{ row }">
        <div
          class="cell-row-end"
          :class="{'--required': !hashCalificacion[row.id].nota && !hashCalificacion[row.id].justificante}"
        >
          <select
            v-model="hashCalificacion[row.id].justificante"
            @change="emitInput"
            class="ui-native justificante-select"
            :disabled="hashCalificacion[row.id] && hashCalificacion[row.id].nota"
          >
            <option :value="null"> -- </option>
            <option value="cero">Cero</option>
            <option value="excusa">E.J.</option>
          </select>
        </div>
      </template>
    </UiRubric>

    <PersonSummary
      style="margin-top: 22px"
      :calificacion="innerValue"
      :notas="notas"
      :competencias="competencias"
      :redacciones="redacciones"
      :dominios="dominios"
    >
      <template #refuerzos>
        <div class="refuerzos-container">
          <UiItem
            v-for="(ref, i) in innerValue.refuerzos"
            :key="ref.dominioId"
            icon="mdi:circle-medium"
            :text="ref.text"
          >
            <template #right>
              <UiIcon
                class="ui-clickable"
                value="mdi:close"
                @click="removeRefuerzo(i)"
              />
            </template>
          </UiItem>

          <select
            class="ui-native"
            :disabled="innerValue.refuerzos.length >= 3"
            @change="pushRefuerzo($event)"
          >
            <option>Agregar dominio</option>
            <option
              v-for="dominio in availableDominios"
              :key="dominio.id"
              :value="dominio.id"
            >{{ dominio.text }}</option>
          </select>
        </div>
      </template>

      <template #observaciones>
        <div class="observations-container">
          <textarea
            class="textarea-observacion ui-native"
            v-model="innerValue.observaciones"
            @input="emitInput"
          ></textarea>
        </div>
      </template>

    </PersonSummary>

  </div>
</template>

<script>
/*
Componente BRUTO para editar un objeto CALIFICACION
*/

import useI18n from '@/modules/i18n/mixins/useI18n.js';
import { UiIcon, UiItem } from '@/modules/ui/components';
import UiRubric from '../UiRubric/UiRubric.vue';
import PersonSummary from './PersonSummary.vue';

export default {
  name: 'PersonGrading',
  mixins: [useI18n],

  components: {
    PersonSummary,
    UiRubric,
    UiIcon,
    UiItem,
  },

  props: {
    personId: {
      type: String,
      required: true,
    },

    unidadProductoId: {
      type: String,
      required: true,
    },

    /*
    {
      observaciones: null,
      refuerzos: [
        ... dominioId 1,
        ... dominioId 2
        ... dominioId 3
      ],
      rubric: [
        {
          competencia: competenciaId,
          nota: notaId,
          observacion: null,
          justificante: null,  // si nota es NULL, la justificante puede ser "cero" o "excusa"
        },
        {
          competencia: competenciaId,
          nota: notaId,
          observacion: null,
          justificante: null,
        },
        {
          competencia: competenciaId,
          nota: notaId,
          observacion: null,
          justificante: null,
        },
      ]
    }
    */
    value: {
      type: Object,
      required: false,
      default: null,
    },

    notas: {
      type: Array,
      required: false,
      default: () => [],
    },

    competencias: {
      type: Array,
      required: false,
      default: () => [],
    },

    redacciones: {
      type: Array,
      required: false,
      default: () => [],
    },

    dominios: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      innerValue: {},
      observaciones: {},
      calificaciones: [],
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = this.sanitizeValue(newValue);
      },
    },
  },

  computed: {
    fullRubric() {
      let rubric = [];
      this.competencias.forEach((competencia) => {
        let curCell = this.innerValue.rubric.find(
          (cell) => cell.competencia == competencia.id
        );
        let curNotaId = curCell?.nota;

        this.notas.forEach((nota) => {
          let redaccion = this.redacciones.find(
            (r) => r.competencia == competencia.id && r.nota == nota.id
          );

          rubric.push({
            competencia: competencia.id,
            nota: nota.id,
            texto: redaccion?.texto || '???',
            isChecked: nota.id == curNotaId,
            justificante: null,
          });
        });
      });

      return rubric;
    },

    availableDominios() {
      return this.dominios.filter(
        (dom) =>
          !this.innerValue.refuerzos.find((ref) => ref.dominioId == dom.id)
      );
    },

    isRubricEmpty() {
      let gradedItems = (this.value?.rubric || []).filter(
        (grade) => !!grade.nota
      );
      return gradedItems.length == 0;
    },

    /* Un hash de innerValue.rubric, de la forma:
    {
      [competenciaId]: {
        competencia: "c1",
        nota: "n1",
        observacion: null,
        justificante: null
      }
    }
    */
    hashCalificacion() {
      let retval = {};
      (this.innerValue?.rubric || []).forEach(
        (calificacion) => (retval[calificacion.competencia] = calificacion)
      );
      return retval;
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerValue)));
    },

    sanitizeValue(value) {
      let retval = {
        justificante: null,
        ...value,
        observaciones: value?.observaciones || '',
        refuerzos: value?.refuerzos?.length ? value.refuerzos : [],
        rubric: [],
      };

      this.competencias.forEach((competencia) => {
        let curCell = value?.rubric?.length
          ? value.rubric.find((cell) => cell.competencia == competencia.id)
          : null;

        retval.rubric.push({
          competencia: competencia.id,
          nota: curCell?.nota || null,
          observacion: curCell?.observacion || null,
          justificante: curCell?.justificante || null,
        });
      });

      return retval;
    },

    onClickCell(cell) {
      let foundCell = this.innerValue.rubric.find(
        (r) => r.competencia == cell.competencia
      );
      foundCell.nota = cell.isChecked ? null : cell.nota;

      this.emitInput();
    },

    pushRefuerzo($event) {
      if (!$event.target.value) {
        return;
      }

      let objDominio = this.dominios.find((d) => d.id == $event.target.value);

      this.innerValue.refuerzos.push({
        dominioId: objDominio.id,
        text: objDominio.text,
      });

      this.emitInput();

      $event.target.value = null;
    },

    removeRefuerzo(index) {
      this.innerValue.refuerzos.splice(index, true);
      this.emitInput();
    },
  },
};
</script>

<style lang="scss">
.PersonGrading {
  .grading-row-header {
    h1,
    h2,
    h3,
    h4,
    p,
    small {
      margin: 0;
    }
  }

  .cell-texto {
    display: block;
    font-size: 0.9em;

    overflow: auto;
    padding: 2px 6px;
    margin: 2px;

    border: 1px dashed transparent;
    border-radius: var(--ui-radius);
    min-height: 100px;

    &:hover {
      background-color: transparent;
      // border-color: #ccc;
      border-color: var(--ui-color-primary);
    }

    &.--selected {
      background-color: #ffff8866;
      border: 1px solid var(--ui-color-primary);
      // background-color: var(--ui-color-selected);
    }
  }

  .textarea-observacion {
    display: block;
    margin: 0;
    width: 100%;
    min-height: 100px;
    font-size: 1em;
  }

  .cell-row-end {
    text-align: right;
    .ui-label {
      padding: 10px;
      display: block;
    }

    &.--required {
      &::after {
        content: '*';
        color: red;
        font-weight: bold;
      }
    }
  }

  .justificante-select {
    &:disabled {
      opacity: 0.5;
    }
  }

  .ui-rubric table thead td {
    border-bottom: 1px solid #eee;
  }
}
</style>