<template>
  <div class="PersonSummary">
    <!-- ¿Dónde estoy?  (Ganardos) -->
    <section v-if="passing.length">
      <h2>¿Dónde estoy?</h2>
      <div
        v-for="(foo, i) in passing"
        :key="i"
        class="foo-item"
      >
        <div
          class="item-competencia"
          :style="{'--competencia-color': foo.objCompetencia.color}"
        >{{ foo.objCompetencia.name }}</div>

        <div
          class="item-nota"
          :style="{'--nota-color': foo.objNota.color}"
        >{{ foo.objNota.text }}</div>

        <div class="item-redaccion">{{ foo.redaccion.texto }}</div>
      </div>
    </section>

    <!-- ¿Qué me falta?  (Perdidos) -->
    <section v-if="failing.length">
      <h2>¿Qué me falta?</h2>
      <div
        v-for="(foo, i) in failing"
        :key="i"
        class="foo-item"
      >
        <div
          class="item-competencia"
          :style="{'--competencia-color': foo.objCompetencia.color}"
        >{{ foo.objCompetencia.name }}</div>

        <div
          class="item-nota"
          :style="{'--nota-color': foo.objNota.color}"
        >{{ foo.objNota.text }}</div>

        <div class="item-redaccion">{{ foo.redaccion.texto }}</div>
      </div>
    </section>

    <!-- Refuerzos -->
    <section v-show="(calificacion.refuerzos && calificacion.refuerzos.length) || $slots.refuerzos || $scopedSlots.refuerzos">
      <h2>Procesos del mapa de dominio a reforzar</h2>
      <slot name="refuerzos">
        <ul v-if="calificacion.refuerzos && calificacion.refuerzos.length">
          <li
            v-for="refuerzo in calificacion.refuerzos"
            :key="refuerzo.dominioId"
          >{{ refuerzo.text }}</li>
        </ul>
      </slot>
    </section>

    <!-- Pasos a seguir (Observaciones) -->
    <section v-show="calificacion.observaciones || $slots.observaciones || $scopedSlots.observaciones">
      <h2>Pasos a seguir</h2>
      <slot name="observaciones">
        <div>{{ calificacion.observaciones }}</div>
      </slot>
    </section>

  </div>
</template>

<script>
/*
Recibe una prop CALIFICACION
{
    "observaciones": "",
    "refuerzos": [
        {
            "dominioId": "pvuqx1qbvjp",
            "text": "Dominio 1"
        },
        {
            "dominioId": "pvuqy5cwf0k",
            "text": "Dominio 2"
        },
        {
            "dominioId": "pvur7xvjaz0",
            "text": "Dominio 5"
        }
    ],
    "rubric": [
        {
            "competencia": "c1",
            "nota": "n4",
            "observacion": null
        },
        {
            "competencia": "c2",
            "nota": "n4",
            "observacion": null
        },
        {
            "competencia": "c3",
            "nota": "n5",
            "observacion": null
        },
        {
            "competencia": "c4",
            "nota": "n5",
            "observacion": null
        }
    ],
    "unidadProductoId": "pdmics6skfq",
    "personId": "8239",
    "id": "8239:pdmics6skfq",
    "justificante": "justificado"
}
*/

export default {
  name: 'PersonSummary',

  props: {
    calificacion: {
      type: Object,
      required: true,
    },

    competencias: {
      type: Array,
      required: true,
    },

    notas: {
      type: Array,
      required: true,
    },

    redacciones: {
      type: Array,
      required: true,
    },

    dominios: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      foo: null,
    };
  },

  computed: {
    /*
    Cada item del rubric de la calificacion corresponde a una NOTA.
    Obtendremos una lista de NOTAS asi:

    [
      {
        competenciaId: "c1",
        notaId: "n4",
        observacion: "", // en desuso,
        redaccion: "",    texto correspondiente en redacciones para esta competencia y nota,
        objNota: {},
        objCompetencia: {},
      },
      ....
    ]
    */
    foos() {
      return (this.calificacion?.rubric || [])
        .filter((cell) => !!cell.nota)
        .map((cell) => {
          let objCompetencia = this.competencias.find(
            (c) => c.id == cell.competencia
          );

          let objNota = this.notas.find((c) => c.id == cell.nota);
          if (!objNota) {
            objNota = {
              value: 0,
              text: `Nota ${cell.nota}`,
              color: '#666666',
            };
          }

          let redaccion = this.redacciones.find(
            (r) => r.competencia == cell.competencia && r.nota == cell.nota
          );
          if (!redaccion) {
            redaccion = {
              texto: `Dato faltante para competencia: ${cell.competencia} y nota: ${cell.nota}`,
            };
          }

          let isPassing = objNota.value >= 3;

          return {
            competenciaId: cell.competencia,
            notaId: cell.nota,
            observacion: cell.observacion,

            isPassing,
            redaccion,
            objCompetencia,
            objNota,
          };
        });
    },

    passing() {
      return this.foos.filter((f) => f.isPassing);
    },

    failing() {
      return this.foos.filter((f) => !f.isPassing);
    },
  },
};
</script>

<style lang="scss">
.PersonSummary {
  & > section {
    background-color: #f8f8f8;
    padding: 12px;
    margin-bottom: 22px;

    & > h2 {
      margin: 0;
      margin-bottom: 22px !important;
    }
  }

  .foo-item {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-bottom: 30px;
  }

  .item-competencia {
    font-size: 1.2em;
    margin-right: 1em;
    font-weight: bold;
    font-family: var(--ui-font-secondary);
  }

  .item-nota {
    font-size: 0.9em;
    background-color: var(--nota-color);
    border-radius: 3px;
    padding: 4px 9px;
    display: inline-block;
    font-weight: bold;
    font-family: var(--ui-font-secondary);
  }

  .item-redaccion {
    width: 100%;
    margin-top: 6px;
    opacity: 0.8;
    // font-style: italic;
  }
}
</style>