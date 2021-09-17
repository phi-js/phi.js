<template>
  <div class="PlaneacionProductoPicker">
    <div
      v-if="innerValue"
      class="selected-producto"
    >
      <UiCard
        class="selected-producto-card"
        v-bind="innerValue.card"
      />

      <UiIcon
        value="mdi:close"
        class="ui-clickable selected-producto-icon"
        @click="onClickResult(null)"
      />
    </div>
    <div
      v-else
      class="producto-search"
    >
      <div class="controls ui-row">
        <UiInputSearch v-model="search" />

        <UiPopover class="--noflex">
          <template #trigger>
            <UiItem
              class="ui-clickable"
              text="Redes"
              :icon="selectedRedes.length ? 'mdi:filter-menu' : 'mdi:filter-menu-outline'"
            />
          </template>
          <template #contents>
            <select
              v-model="selectedRedes"
              multiple="multiple"
              class="ui-native"
            >
              <option
                v-for="red in redes"
                :key="red.id"
                :value="red.id"
              >{{ red.text }}</option>
            </select>
          </template>
        </UiPopover>

        <UiPopover class="--noflex">
          <template #trigger>
            <UiItem
              class="ui-clickable"
              text="Cursos"
              :icon="selectedCursos.length ? 'mdi:filter-menu' : 'mdi:filter-menu-outline'"
            />
          </template>
          <template #contents>
            <select
              v-model="selectedCursos"
              multiple="multiple"
              class="ui-native"
            >
              <option
                v-for="curso in cursos"
                :key="curso.id"
                :value="curso.id"
              >{{ curso.name }}</option>
            </select>
          </template>
        </UiPopover>
      </div>

      <!-- vista resumen de los filtros seleccionados -->
      <div class="filter-summary">
        <div v-if="selectedCursos.length" class="summary-cursos">
          <span>Cursos</span>
          <ul>
            <template v-for="curso in cursos">
              <li
                v-if="selectedCursos.includes(curso.id)"
                :key="curso.id"
              >{{ curso.name }}</li>
            </template>
          </ul>
        </div>

        <div v-if="selectedRedes.length" class="summary-redes">
          <span>Redes</span>
          <ul>
            <template v-for="red in redes">
              <li
                v-if="selectedRedes.includes(red.id)"
                :key="red.id"
              >{{ red.text }}</li>
            </template>
          </ul>
        </div>

      </div>

      <div class="producto-records">
        <UiCard
          class="producto-record ui-clickable"
          v-for="producto in results"
          :key="producto.id"
          @click="onClickResult(producto)"
          v-bind="producto.card"
        />
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
  UiIcon,
  UiPopover,
  UiInputSearch,
} from '@/modules/ui/components';

export default {
  name: 'PlaneacionProductoPicker',
  mixins: [useApi],
  components: { UiCard, UiItem, UiIcon, UiPopover, UiInputSearch },
  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  inject: {
    PlaneacionProductoPicker: {
      default: null,
    },
  },

  props: {
    /**
     * Objeto PRODUCTO
     */
    value: {
      type: Object,
      required: false,
      default: null,
    },

    courseSequence: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      cursos: [],
      selectedCursos: [],
      redes: [],
      selectedRedes: [],

      innerValue: [],
      results: [],
      search: '',
    };
  },

  computed: {
    watchables() {
      return [this.search, this.selectedRedes, this.selectedCursos];
    },
  },

  async mounted() {
    await Promise.all([
      this.$api.getRedes().then((r) => (this.redes = r)),
      this.$api.getCursos().then((r) => (this.cursos = r)),
    ]);

    // Preseleccionar filtro de cursos
    if (this.courseSequence != null) {
      let found = this.cursos.find((c) => c.sequence == this.courseSequence);
      if (found) {
        this.selectedCursos.push(found.id);
      }
    }

    // preseleccionar filtro de redes
    if (this.PlaneacionProductoPicker?.getAcademicCourse) {
      const academicCourse = this.PlaneacionProductoPicker.getAcademicCourse();
      const areaId = academicCourse?.objSubject?.area;
      if (areaId) {
        let found = this.redes.find((r) => r.areaId == areaId);
        if (found) {
          this.selectedRedes.push(found.id);
        }
      }
    }

    this.fetchResults();
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = newValue;
      },
    },

    watchables() {
      this.fetchResults();
    },
  },

  methods: {
    async fetchResults() {
      let query = {
        search: this.search,
        limit: 100,
        match: {
          red: this.selectedRedes.length ? this.selectedRedes : undefined,
          cursos: this.selectedCursos.length ? this.selectedCursos : undefined,
        },

        properties: [
          '*',
          {
            redacciones: {
              from: 'productos-redacciones',
              on: { productoId: 'id' },
              properties: '*',
            },
          },
        ],
      };

      this.results = await this.$api.getProductos(query);
    },

    onClickResult(record) {
      this.innerValue = record ? JSON.parse(JSON.stringify(record)) : null;
      this.$emit('input', this.innerValue);
    },
  },
};
</script>

<style lang="scss">
.filter-summary {

  & > div {
    display: flex;
    align-items: center;
    margin-bottom: 4px;

    span {
      margin-right: 1em;
      font-size: 12px;
      font-family: var(--ui-font-secondary);
      font-weight: bold;
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
      display: flex;
      align-items: center;

      li {
        margin: 0 2px;
        font-size: 12px;
        font-family: var(--ui-font-secondary);

        padding: 4px 12px;
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: var(--ui-radius);
        color: #333;
      }
    }
  }
}

.PlaneacionProductoPicker {
  .selected-producto {
    position: relative;

    .selected-producto-icon {
      position: absolute;
      top: 6px;
      right: 6px;
      padding: var(--ui-radius);
      border-radius: var(--ui-radius);
      color: #fff;
      background-color: rgba(0, 0, 0, 0.05);
    }
  }

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
}
</style>