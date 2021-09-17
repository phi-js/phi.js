<template>
  <div
    class="DominioWheel"
    :class="{'--has-selection': currentDominioId || currentCompetenciaId}"
  >
    <UiRadial
      :width="240"
      :height="240"
      :slices="slices"
      @slice-enter="onSliceEnter"
      @slice-leave="onSliceLeave"
    />

    <div class="central-content">
      <p
        v-show="!!centralText"
        class="central-text --long"
      >{{ centralText }}</p>
      <p
        v-show="!centralText"
        class="central-text"
      >{{ label }}</p>

      <!-- <div
          class="chip-list"
          v-if="currentDominio"
        >
          <div
            class="ui-chip"
            v-for="subc in currentDominio.competencias"
            :key="subc.id"
            :style="{color: subc.color}"
          >{{ subc.text }}</div>
        </div> -->
    </div>
  </div>
</template>

<script>
import { UiRadial } from '@/modules/ui/components';

export default {
  name: 'DominioWheel',
  components: { UiRadial },

  props: {
    /**
     * Texto a mostrar en el centro del círculo
     */
    label: {
      type: String,
      required: false,
      default: '',
    },

    /**
     * Arreglo de dominios
     */
    dominios: {
      type: Array,
      required: false,
      default: () => [],
    },

    /**
     * Arreglo de competencias
     */
    competencias: {
      type: Array,
      required: false,
      default: () => [],
    },

    /**
     * ID de dominio actual (.sync)
     */
    dominioId: {
      stype: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      currentDominioId: null,
      currentCompetenciaId: null,
      leaveTimeout: null,
    };
  },

  watch: {
    dominioId(newValue) {
      this.currentDominioId = newValue;
      this.currentCompetenciaId = null;
      clearTimeout(this.leaveTimeout);
    },
  },

  computed: {
    centralText() {
      let currentDominio = this.currentDominioId
        ? this.dominios.find((d) => d.id == this.currentDominioId)
        : null;

      if (currentDominio) {
        return currentDominio.text;
      }

      let currentCompetencia = this.currentCompetenciaId
        ? this.competencias.find((c) => c.id == this.currentCompetenciaId)
        : null;

      if (currentCompetencia) {
        return currentCompetencia.name;
      }

      return null;
    },

    /**
     * Objetos "slice" para UiRadial
     */
    slices() {
      let count = 0;
      let retval = [];

      let currentDominio = this.currentDominioId
        ? this.dominios.find((d) => d.id == this.currentDominioId)
        : null;

      let currentCompetencia = this.currentCompetenciaId
        ? this.competencias.find((c) => c.id == this.currentCompetenciaId)
        : null;

      // competencias
      let nCompetencias = this.competencias.length;
      let gap = 1;
      let offset = 45;
      let len = 360 / nCompetencias;

      this.competencias.forEach((competencia, i) => {
        let isActive = this.currentCompetenciaId == competencia.id;
        let isRelevant =
          currentDominio &&
          currentDominio.competencias.includes(competencia.id);

        retval.push({
          id: competencia.id,
          color: competencia.color,
          start: i * len + offset + gap,
          end: i * len + len + offset,
          r_start: 35,
          r_end: 60,
          type: 'competencia',
          class: {
            '--active': isActive,
            '--relevant': isRelevant,
          },
        });
      });

      // dominios
      let nDominios = this.dominios.length;
      gap = 1;
      offset = 45;
      len = 360 / nDominios;

      this.dominios.forEach((dominio, i) => {
        let domStart = i * len + gap;
        let domEnd = i * len + len;

        let isActive = this.currentDominioId == dominio.id;
        let isRelevant = dominio.competencias.includes(
          this.currentCompetenciaId
        );

        let color = '#ccc';
        if (isRelevant && currentCompetencia) {
          color = currentCompetencia.color;
        }

        retval.push({
          id: dominio.id,
          color: color,
          start: domStart + offset,
          end: domEnd + offset,
          r_start: 62,
          r_end: 82,
          type: 'dominio',
          class: {
            dominio: true,
            '--active': isActive,
            '--relevant': isRelevant,
          },
        });

        // linea delgada para cada categoria del dominio
        let catSliceLength = len / dominio.competencias.length;
        dominio.competencias.forEach((competenciaId, j) => {
          let objCompetencia = this.competencias.find(
            (c) => c.id == competenciaId
          );

          let cEnd = domStart + j * catSliceLength + catSliceLength;
          if (j == dominio.competencias.length - 1) {
            cEnd = cEnd - gap;
          }

          retval.push({
            id: `${dominio.id}-${competenciaId}-${count++}`,

            parent: competenciaId,
            color: objCompetencia ? objCompetencia.color : '#ccc',
            start: domStart + j * catSliceLength + offset,
            end: cEnd + offset,
            r_start: 62,
            r_end: 66,
            type: 'dominio-part',
            class: {
              '--active': isActive,
              '--relevant': isRelevant,
            },
            style: {
              'pointer-events': 'none',
            },
          });
        });
      });

      return retval;
    },
  },

  methods: {
    onSliceEnter(slice) {
      clearTimeout(this.leaveTimeout);
      this.currentDominioId = null;
      this.currentCompetenciaId = null;

      switch (slice.type) {
        case 'dominio':
          this.currentDominioId = slice.id;
          break;
        case 'competencia':
          this.currentCompetenciaId = slice.id;
          break;
      }

      this.$emit('update:dominioId', this.currentDominioId);
    },

    onSliceLeave() {
      clearTimeout(this.leaveTimeout);
      this.leaveTimeout = setTimeout(() => {
        this.currentDominioId = null;
        this.currentCompetenciaId = null;

        this.$emit('update:dominioId', this.currentDominioId);
      }, 140);
    },
  },
};
</script>

<style lang="scss">
.DominioWheel {
  position: relative;

  .central-content {
    pointer-events: none;

    position: absolute;
    width: 180px;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    margin: 0;
    padding: 0;

    text-align: center;
  }

  .central-text {
    font-family: var(--ui-font-secondary);
    font-size: 1.6em;
    font-weight: bold;

    &.--long {
      font-size: 1em;
      font-weight: normal;
    }
  }

  .radial__slice {
    cursor: pointer;
    transition: all var(--ui-duration-snap);
  }

  &.--has-selection {
    .radial__slice {
      stroke: #ccc;

      &.--active,
      &.--relevant {
        stroke: var(--radial-slice-color);
      }

      &.--relevant {
        opacity: 0.75;
      }

      &.dominio.--active {
        stroke: #ff8;
      }
    }
  }
}
</style>