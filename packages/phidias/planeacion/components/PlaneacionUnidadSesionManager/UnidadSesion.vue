<template>
  <div class="UnidadSesion">
    <UiDataDialog
      v-model="innerModel"
      @input="emitInput()"
    >
      <template #trigger>
        <UiItem
          class="ui-clickable"
          :icon="innerModel.id ? 'mdi:book-open-outline' : 'mdi:plus-box-outline'"
          :text="innerModel.id ? innerModel.text : 'Agregar sesión'"
          :secondary="innerModel.fechaInicial && innerModel.fechaFinal ? $ts(innerModel.fechaInicial, 'day') + ' - ' + $ts(innerModel.fechaFinal, 'day') : null"
        >
          <template #right>
            <slot name="right"></slot>
          </template>
        </UiItem>
      </template>
      <template #contents="{ innerModel }">
        <UnidadSesionViewer
          v-if="readOnly"
          v-bind="$props"
        />
        <div
          v-else
          class="UnidadSesion-sesion-form ui-breathe"
        >
          <div class="ui-row">
            <UiInput
              type="text"
              label="Titulo"
              v-model="innerModel.text"
            />

            <div class="ui-group">
              <UiInput
                type="timestamp"
                label="Fecha inicial"
                v-model="innerModel.fechaInicial"
              />
              <UiInput
                type="timestamp"
                label="Fecha final"
                v-model="innerModel.fechaFinal"
              />
            </div>
          </div>

          <UiInput
            width="100%"
            label="Producto"
          >
            <select
              class="ui-native"
              multiple
              v-model="innerModel.arrProductos"
            >
              <option
                v-for="prod in availableProductos"
                :key="prod.value"
                :value="prod.value"
              >{{ prod.text }}</option>
            </select>
          </UiInput>

          <div class="ui-row">
            <UiInput
              type="html"
              label="Actividades"
              v-model="innerModel.actividades"
              style="flex:2; margin-right: 0.5em;"
            />

            <UiInput
              type="html"
              label="Evaluación"
              v-model="innerModel.evaluacion"
              style="flex:1; margin-right: 0.5em;"
            />

            <UiInput
              type="html"
              label="Competencias"
              v-model="innerModel.competencias"
              style="flex:1; margin-right: 0"
            />
          </div>

          <UiInput
            type="textarea"
            label="Refuerzos"
            v-model="innerModel.refuerzos"
          />
        </div>
      </template>

      <template
        #footer
        v-if="$listeners.delete"
      >
        <button
          style="float:right"
          type="button"
          class="ui-button --danger"
          @click="$emit('delete')"
        >Eliminar</button>
      </template>

    </UiDataDialog>

  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import UnidadSesionViewer from './UnidadSesionViewer.vue';
import { UiDataDialog, UiItem, UiInput, UiIcon } from '@/modules/ui/components';

export default {
  name: 'UnidadSesion',
  mixins: [useI18n],
  components: { UnidadSesionViewer, UiDataDialog, UiItem, UiInput, UiIcon },

  props: {
    value: {
      required: false,
      default: null,
    },

    unidad: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    readOnly: {
      required: false,
      default: false,
    },
  },

  data() {
    return {
      innerModel: null,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerModel = newValue
          ? JSON.parse(JSON.stringify(newValue))
          : {
              id: null,
            };

        this.innerModel.arrProductos = this.innerModel?.arrProductos || [];
      },
    },
  },

  computed: {
    availableProductos() {
      return (this.unidad?.productos || []).map((producto) => ({
        value: producto.id,
        text: producto.text,
      }));
    },
  },

  methods: {
    reset() {
      this.innerModel = {
        id: null,
      };
    },

    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)));
    },
  },
};
</script>

<style lang="scss">
.UnidadSesion-sesion-form > * {
  margin-bottom: 22px;
}
</style>