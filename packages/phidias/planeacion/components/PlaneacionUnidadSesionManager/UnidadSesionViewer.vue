<template>
  <div class="UnidadSesionViewer">
    <div>
      <div class="sesion-header">
        <h1 v-text="value.text"></h1>
        <div class="sesion-dates">{{ $ts(value.fechaInicial, 'day') }} - {{ $ts(value.fechaFinal, 'day') }}</div>
      </div>

      <section class="sesion-productos">
        <h2>Productos</h2>
        <ul>
          <li
            v-for="producto in selectedProductos"
            :key="producto.value"
            v-text="producto.text"
          ></li>
        </ul>
      </section>

      <div class="ui-row --top">
        <section
          class="sesion-actividades"
          style="flex:2; margin-right: 0.5em;"
        >
          <h2>Actividades</h2>
          <div v-html="value.actividades"></div>
        </section>
        <section
          class="sesion-evaluacion"
          style="flex:1; margin-right: 0.5em;"
        >
          <h2>Evaluacion</h2>
          <div v-html="value.evaluacion"></div>
        </section>
        <section
          class="sesion-competencias"
          style="flex:1; margin-right: 0;"
        >
          <h2>Competencias</h2>
          <div v-html="value.competencias"></div>
        </section>
      </div>

      <section class="refuerzos">
        <h2>Refuerzos</h2>
        <div v-text="value.refuerzos"></div>
      </section>
    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';

export default {
  name: 'UnidadSesionViewer',
  mixins: [useI18n],
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
  },

  computed: {
    availableProductos() {
      return (this.unidad?.productos || []).map((producto) => ({
        value: producto.id,
        text: producto.text,
      }));
    },

    selectedProductos() {
      return (this.value?.arrProductos || []).map(
        (pid) =>
          this.availableProductos.find((p) => p.value === pid) || {
            value: pid,
            text: `#REF ${pid}`,
          }
      );
    },
  },
};
</script>

<style lang="scss">
.UnidadSesionViewer {
  .sesion-header {
    h1 {
      margin: 0;
      padding: 0;
    }
  }

  section {
    margin-top: 18px;

    & > h2 {
      margin: 0;
      padding: 0;
    }
  }

  section.sesion-productos {
    ul {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }
}
</style>