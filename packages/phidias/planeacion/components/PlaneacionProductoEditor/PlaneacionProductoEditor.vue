<template>
  <div class="PhidiasProductoEditor">
    <PlaneacionProductoInput
      :cursos="cursos"
      :notas="notas"
      :competencias="competencias"
      :redes="redes"
      v-model="producto"
      @input="$emit('input', $event)"
    />
  </div>
</template>

<script>
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import PlaneacionProductoInput from './PlaneacionProductoInput.vue';

export default {
  name: 'PhidiasProductoEditor',
  mixins: [useApi],
  components: { PlaneacionProductoInput },
  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  props: {
    value: {
      type: Object,
      required: false,
    },
  },

  mounted() {
    this.fetchCursos();
    this.fetchNotas();
    this.fetchCompetencias();
    this.fetchRedes();
  },

  watch: {
    'value.id': {
      immediate: true,
      handler() {
        this.fetchProducto();
      },
    },
  },

  data() {
    return {
      producto: null,

      cursos: [],
      notas: [],
      competencias: [],
      redes: [],
    };
  },

  methods: {
    async fetchProducto() {
      if (this.value?.id === undefined) {
        return;
      }
      this.producto = await this.$api.getProducto(this.value.id);
    },

    async fetchNotas() {
      this.notas = await this.$api.getNotas();
    },

    async fetchCursos() {
      this.cursos = await this.$api.getCursos();
    },

    async fetchCompetencias() {
      this.competencias = await this.$api.getCompetencias();
    },

    async fetchRedes() {
      this.redes = await this.$api.getRedes();
    },
  },
};
</script>