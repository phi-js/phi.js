<template>
  <div class="UnidadProductosManager">
    <div class="productos-list">
      <UiDialog
        v-for="(asociacion, i) in staging"
        :key="i"
      >
        <template #trigger>
          <UiItem
            class="ui-clickable"
            icon="mdi:file-outline"
            :text="asociacion.objProducto && asociacion.objProducto.card ? asociacion.objProducto.card.text : (asociacion.text || asociacion.productoId)"
          >
            <template #secondary>
              <ul class="competencia-list">
                <li
                  v-for="comp in sanitizedAsociaciones[i]._competencias"
                  :key="comp.id"
                  :style="{backgroundColor: comp ? comp.color : null}"
                >{{ comp.name }}</li>
              </ul>
            </template>
          </UiItem>
        </template>
        <template #contents>
          <UnidadProductoEditor
            :read-only="readOnly"
            v-model="staging[i]"
            :related-courses="relatedCourses"
            :course-sequence="courseSequence"
          />
        </template>
        <template #footer="{close}">
          <div>
            <button
              :disabled="asociacion._error"
              type="button"
              class="ui-button --main"
              @click="accept(); close();"
            >Aceptar</button>
            <button
              type="button"
              class="ui-button --cancel"
              @click="cancel(); close();"
            >Cancelar</button>

            <div
              v-if="!readOnly"
              style="display:block; float: right"
            >
              <button
                type="button"
                class="ui-button --danger"
                @click="deleteAsociacion(asociacion)"
              >Eliminar</button>
            </div>
            <small v-if="asociacion._error">{{ asociacion._error }}</small>
          </div>
        </template>
      </UiDialog>
    </div>

    <UiDialog class="asociacion-creator">
      <template #trigger>
        <UiItem
          class="ui-clickable"
          icon="mdi:plus"
          text="Asociar producto"
        />
      </template>
      <template #contents>
        <UnidadProductoEditor
          v-model="newAsociacion"
          :related-courses="relatedCourses"
          :course-sequence="courseSequence"
        />
      </template>
      <template #footer="{close}">
        <div>
          <button
            type="button"
            class="ui-button --main"
            @click="addAsociacion(newAsociacion); close()"
            :disabled="newAsociacion && newAsociacion._error"
          >Aceptar</button>
          <button
            type="button"
            class="ui-button --cancel"
            @click="close"
          >Cancelar</button>

          <small v-if="newAsociacion && newAsociacion._error">{{ newAsociacion._error }}</small>
        </div>
      </template>
    </UiDialog>
  </div>
</template>

<script>
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import UnidadProductoEditor from './UnidadProductoEditor.vue';
import { UiItem, UiIcon, UiDialog } from '@/modules/ui/components';

export default {
  name: 'UnidadProductosManager',
  mixins: [useApi],
  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  components: {
    UnidadProductoEditor,
    UiItem,
    UiIcon,
    UiDialog,
  },

  props: {
    value: {
      type: Array,
      required: false,
      default: () => [],
    },

    relatedCourses: {
      type: Array,
      required: false,
      default: () => [],
    },

    courseSequence: {
      type: String,
      required: false,
      default: null,
    },

    readOnly: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      competencias: [],
      asociaciones: [],
      staging: [],
      newAsociacion: null,
    };
  },

  mounted() {
    this.$api.getCompetencias().then((r) => (this.competencias = r));
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.asociaciones = Array.isArray(newValue) ? [].concat(newValue) : [];
        this.staging = JSON.parse(JSON.stringify(this.asociaciones));
      },
    },
  },

  computed: {
    hashCompetencias() {
      let retval = {};
      if (!this.competencias || !this.competencias.length) {
        return retval;
      }
      this.competencias.forEach((c) => (retval[c.id] = c));
      return retval;
    },

    /*
    El mismo valor de STAGING pero incluyendo la propiedad
    _competencias para cada elemento.

    _competencias es un arreglo con la lista de objetos competencia UNICOS asociados a esta asociacion (aka. unidad-producto)
    */
    sanitizedAsociaciones() {
      let retval = [];

      this.staging.forEach((unidadProducto) => {
        let allItems = [
          ...(unidadProducto?.competencias || []),
          ...(unidadProducto?.courseCompetencias || []),
        ];

        let competencias = [];
        let seen = [];

        if (allItems.length) {
          allItems.forEach((upc) => {
            if (seen.includes(upc.competenciaId)) {
              return;
            }

            competencias.push(
              this.hashCompetencias?.[upc.competenciaId] || {
                id: upc.competenciaId,
                name: ` ...${upc.competenciaId}... `, // placeholder
              }
            );
            seen.push(upc.competenciaId);
          });
        }

        retval.push({ ...unidadProducto, _competencias: competencias });
      });

      return retval;
    },
  },

  methods: {
    accept() {
      this.asociaciones = this.staging;
      this.$emit('input', this.asociaciones);
    },

    cancel() {
      this.staging = JSON.parse(JSON.stringify(this.asociaciones));
    },

    deleteAsociacion(item) {
      if (!confirm('Retirar este producto ?')) {
        return;
      }

      this.staging.splice(this.staging.indexOf(item), 1);
      this.accept();

      this.$emit('delete-asociacion', item);
    },

    addAsociacion(record) {
      this.staging.push(record);
      this.accept();
      this.newAsociacion = null;
    },
  },
};
</script>

<style lang="scss">
.UnidadProductosManager {
  .competencia-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;

    li {
      display: block;
      background-color: var(--ui-color-primary);
      border-radius: var(--ui-radius);
      padding: 2px 8px;
      color: #fff;
      margin-right: 6px;

      max-width: 70px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .mosaic {
    display: flex;
    flex-wrap: wrap;
  }

  .mosaic-item {
    position: relative;
    flex: 1;
    max-width: 33%;
    min-height: 120px;
    margin: 5px;

    display: flex;

    & > .ui-card {
      flex: 1;
    }

    .delete-icon {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 2;
      padding: 8px;
      background-color: rgba(255, 255, 255, 0.3);

      &:hover {
        color: var(--ui-color-danger);
      }
    }
  }
}
</style>