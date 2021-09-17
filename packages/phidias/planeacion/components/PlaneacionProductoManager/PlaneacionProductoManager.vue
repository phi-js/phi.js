<template>
  <div class="PlaneacionProductoManager">
    <div
      class="manager-controls"
      style="text-align:right"
    >
      <div class="ui-toolbar">
        <UiPopover>
          <template #trigger>
            <UiIcon
              class="ui-clickable"
              :value="query.match.cursos.length ? 'mdi:filter-menu' : 'mdi:filter-menu-outline'"
              title="Filtros"
            />
          </template>
          <template #contents>

            <div
              class="ui-row --top"
              style="text-align: left"
            >
              <div style="margin-right: 1em">
                <label>Curso</label>
                <select
                  multiple
                  class="ui-native"
                  v-model="query.match.cursos"
                >
                  <option
                    v-for="course in cursos"
                    :key="course.id"
                    :value="course.id"
                  >{{ course.name }}</option>
                </select>
              </div>

              <div>
                <label>Red</label>
                <select
                  multiple
                  class="ui-native"
                  v-model="query.match.red"
                >
                  <option
                    v-for="red in redes"
                    :key="red.id"
                    :value="red.id"
                  >{{ red.text }}</option>
                </select>
              </div>
            </div>

          </template>
        </UiPopover>

        <p>Vista</p>

        <UiIcon
          title="Mosaico"
          class="ui-clickable"
          value="mdi:view-grid"
          @click="currentView = 'mosaic'"
          :class="{'--active': currentView == 'mosaic'}"
        />

        <UiIcon
          title="Lista"
          class="ui-clickable"
          value="mdi:view-list"
          @click="currentView = 'table'"
          :class="{'--active': currentView == 'table'}"
        />

        <UiDialog
          class="creator-dialog"
          @accept="onCreatorAccept()"
          @cancel="onCreatorCancel()"
        >
          <template #trigger>
            <button
              type="button"
              class="ui-clickable"
            >Crear producto</button>
          </template>
          <template #contents>
            <PlaneacionProductoEditor v-model="newProducto" />
          </template>
        </UiDialog>
      </div>
    </div>

    <section class="manager-filters">
      <UiInputSearch v-model="query.search" />

      <div class="filtered-cursos filter-summary">
        <span class="ui-label">Cursos</span>
        <ul>
          <li
            v-show="!selectedCursos.length"
            class="--default"
          >Todos</li>
          <li
            v-for="curso in selectedCursos"
            :key="curso.id"
            v-text="curso.name"
          ></li>
        </ul>
      </div>

      <div class="filtered-redes filter-summary">
        <span class="ui-label">Redes</span>
        <ul>
          <li
            v-show="!selectedRedes.length"
            class="--default"
          >Todas</li>
          <li
            v-for="red in selectedRedes"
            :key="red.id"
            v-text="red.text"
          ></li>
        </ul>
      </div>
    </section>

    <div class="producto-results">
      <div
        v-if="currentView == 'mosaic'"
        class="records-mosaic"
      >
        <div
          class="record-item ui-clickable"
          v-for="producto in productos"
          :key="producto.id"
        >
          <UiCard
            v-bind="producto.card"
            @click="editingProducto = producto"
          >
            <ul class="cursos-ul">
              <li
                v-for="curso in producto._cursos"
                :key="curso.id"
              >{{ curso.name }}</li>
            </ul>
          </UiCard>
        </div>

      </div>
      <div v-else>
        <UiDataTable
          :columns="columns"
          :data="productos"
          @click-row="onClickRow"
        />
      </div>
    </div>

    <UiDialog
      v-if="editingProducto"
      :open="true"
      @accept="onEditorAccept(editingProducto)"
      @cancel="onEditorCancel(editingProducto)"
    >
      <template #contents>
        <PlaneacionProductoEditor v-model="editingProducto" />
      </template>
      <template #actions="{ close }">
        <button
          type="button"
          class="ui-button --danger"
          style="float:right"
          @click="onDelete(editingProducto, close)"
        >Eliminar</button>
      </template>
    </UiDialog>
  </div>
</template>

<script>
import { useApi } from '@/modules/api';
import v4Api, { planeacion } from '/apis/v4';

import {
  UiCard,
  UiField,
  UiInputSearch,
  UiIcon,
  UiItem,
  UiPopover,
  UiDialog,
} from '@/modules/ui/components';

import PlaneacionProductoEditor from '../PlaneacionProductoEditor/PlaneacionProductoEditor.vue';
import UiDataTable from '@/modules/ui/components/UiDataTableNew/UiDataTable.vue';

export default {
  name: 'PlaneacionProductoManager',
  mixins: [useApi],

  $api: {
    type: v4Api,
    wrappers: [planeacion],
  },

  components: {
    UiCard,
    UiDataTable,
    UiField,
    UiInputSearch,
    UiIcon,
    UiItem,
    UiPopover,
    UiDialog,
    PlaneacionProductoEditor,
  },

  data() {
    return {
      productos: [],
      cursos: [],
      redes: [],
      currentView: 'mosaic', // table | mosaic

      newProducto: null,

      records: [],
      query: {
        search: '',
        match: {
          cursos: [],
          red: [],
        },
      },

      editingProducto: null,
    };
  },

  async mounted() {
    this.fetchRedes();
    await this.fetchCursos();
    this.fetchProductos();
  },

  watch: {
    query: {
      deep: true,
      handler(newValue) {
        this.fetchProductos();
      },
    },
  },

  computed: {
    selectedCursos() {
      if (!this.query?.match?.cursos?.length) {
        return [];
      }

      return this.query.match.cursos.map((cursoId) =>
        this.cursos.find((c) => c.id == cursoId)
      );
    },

    selectedRedes() {
      if (!this.query?.match?.red?.length) {
        return [];
      }

      return this.query.match.red.map((redId) =>
        this.redes.find((r) => r.id == redId)
      );
    },

    columns() {
      return [
        {
          title: 'Título',
          src: '$.card.text',
        },
        {
          title: 'Descripcion',
          src: '$.card.secondary',
        },
        {
          name: 'cursos',
          title: 'Cursos',
          src: '$.cursos',
          type: 'array',
          items: {
            enum: this.cursos.map((c) => ({ text: c.name, value: c.id })),
          },
        },
        {
          name: 'red',
          title: 'Red de conocimiento',
          src: '$.red',
          type: 'string',
          enum: this.redes.map((r) => ({ text: r.text, value: r.id })),
        },
        {
          title: 'Modificado',
          src: '$._record.dateModified',
          type: 'date',
          props: {
            format: null,
          },
        },
        {
          title: 'Creado',
          src: '$._record.dateCreated',
          type: 'date',
          props: {
            format: null,
          },
        },
      ];
    },
  },

  methods: {
    onClickRow($event) {
      this.editingProducto = $event;
    },

    async onCreatorAccept() {
      let created = await this.$api.createProducto(this.newProducto);
      this.productos.push(this.sanitizeProductos([created])[0]);
      this.newProducto = null;
    },

    onCreatorCancel() {
      this.newProducto = null;
    },

    async onDelete(producto, closeDialog) {
      if (!confirm('Eliminar este producto?')) {
        return;
      }

      await this.$api.deleteProducto(producto.id);
      this.productos.splice(this.productos.indexOf(producto), 1);

      this.editingProducto = null;
      closeDialog();
    },

    async onEditorAccept(producto) {
      await this.$api.updateProducto(producto);
      // let updatedProducto = await this.$api.updateProducto(producto);
      // let sourceIndex = this.productos.indexOf(producto);
      // this.productos.splice(sourceIndex, 1, updatedProducto);

      let found = this.productos.find(
        (prd) => prd.id == this.editingProducto?.id
      );
      if (found) {
        Object.assign(found, this.editingProducto);
        found._cursos = (found?.cursos || []).map((cursoId) =>
          this.cursos.find((c) => c.id == cursoId)
        );
      }

      this.editingProducto = null;
    },

    onEditorCancel(producto) {
      this.editingProducto = null;
    },

    async fetchProductos() {
      let match = {
        cursos: this.query?.match?.cursos?.length
          ? this.query.match.cursos
          : undefined,

        red: this.query?.match?.red?.length ? this.query.match.red : undefined,
      };

      let search = this.query?.search ? this.query.search.trim() : undefined;

      let results = await this.$api.getProductos({
        match,
        search,
        properties: [
          'id',
          'title',
          'cursos',
          'red',
          'card',
          'record.dateCreated',
          'record.dateModified',
          'record.authorId',
          // {
          //   redacciones: {
          //     from: 'productos-redacciones',
          //     on: { productoId: 'id' },
          //     properties: '*',
          //   },
          // },
        ],
      });
      this.productos = this.sanitizeProductos(results);
    },

    async fetchCursos() {
      this.cursos = await this.$api.getCursos();
    },

    async fetchRedes() {
      this.redes = await this.$api.getRedes();
    },

    sanitizeProductos(records) {
      if (!Array.isArray(records) || !records.length) {
        return [];
      }

      return records.map((record) => {
        record._cursos = !Array.isArray(record.cursos)
          ? []
          : record.cursos.map((cursoId) =>
              this.cursos.find((c) => c.id == cursoId)
            );

        record._record = {
          dateCreated: record['record.dateCreated'],
          dateModified: record['record.dateModified'],
          authorId: record['record.authorId'],
        };

        return record;
      });
    },
  },
};
</script>

<style lang="scss">
.PlaneacionProductoManager {
  .records-mosaic {
    display: flex;
    flex-wrap: wrap;

    & > .record-item {
      display: block;

      flex: 1;
      min-width: 30%;
      margin: var(--ui-breathe);
    }
  }

  .filter-summary {
    display: flex;
    align-items: center;
    flex-wrap: wrap;

    .ui-label {
      margin: 0;
      padding: 8px 12px;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      align-items: center;

      li {
        font-size: 0.9em;
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: var(--ui-radius);
        padding: 8px 12px;
        margin: 0 3px;
      }
    }
  }

  .cursos-ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;

    li {
      padding: 3px 8px;
      border-radius: var(--ui-radius);
      background-color: var(--ui-color-primary);
      color: #fff;
      font-family: var(--ui-font-secondary);
      font-size: 12px;

      display: flex;
      align-items: center;
      justify-content: center;

      margin: 0 2px 2px 0;
    }
  }
}

.creator-dialog {
  display: flex;
  .ui-dialog-trigger {
    display: flex;
  }
}
</style>