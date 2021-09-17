<template>
  <div class="UnidadSesionInput ui-breathe">
    <div class="ui-row">
      <UiInput
        type="text"
        label="Titulo"
        v-model="sesion.text"
      />
      <div class="ui-group">
        <UiInput
          type="timestamp"
          label="Fecha inicial"
          v-model="sesion.fechaInicial"
        />
        <UiInput
          type="timestamp"
          label="Fecha final"
          v-model="sesion.fechaFinal"
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
        v-model="sesion.arrProductos"
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
        v-model="sesion.actividades"
        style="flex:2; margin-right: 0.5em;"
      />

      <UiInput
        type="html"
        label="Evaluación"
        v-model="sesion.evaluacion"
        style="flex:1; margin-right: 0.5em;"
      />

      <UiInput
        type="html"
        label="Competencias"
        v-model="sesion.competencias"
        style="flex:1; margin-right: 0"
      />
    </div>

    <UiInput
      type="textarea"
      label="Refuerzos"
      v-model="sesion.refuerzos"
    />
  </div>
</template>

<script>
import defaultSesion from '../../sesion.js';
import { bindProps } from '@/modules/ui';
import { UiInput } from '@/modules/ui/components';

export default {
  name: 'UnidadSesionInput',
  mixins: [bindProps],
  components: { UiInput },

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
      sesion: defaultSesion,
    };
  },

  $bindProps: {
    sesion: 'value',
  },

  computed: {
    availableProductos() {
      return (this.unidad?.productos || []).map((producto) => ({
        value: producto.id,
        text: producto.text,
      }));
    },
  },
};
</script>