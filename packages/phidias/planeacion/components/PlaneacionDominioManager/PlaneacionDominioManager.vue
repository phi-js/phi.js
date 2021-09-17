<template>
  <div class="PlaneacionDominioManager">
    <DominioListEditor
      v-model="dominios"
      :competencias="competencias"
      :label="label"
      @update-record="onUpdateDominio"
      @create-record="onCreateDominio"
      @delete-record="onDeleteDominio"
    />
  </div>
</template>

<script>
import DominioListEditor from './DominioListEditor.vue';
import { useApi } from '@/modules/api';
import apiV4, { planeacion } from '/apis/v4';

export default {
  name: 'PlaneacionDominioManager',
  components: { DominioListEditor },
  mixins: [useApi],

  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  props: {
    courseSequence: {
      type: [String, Number],
      required: true,
    },

    label: {
      type: String,
      required: false,
    },
  },

  data() {
    return {
      tableName: 'dominios',
      dominios: [],
      competencias: [],
    };
  },

  mounted() {
    this.fetchCompetencias();
  },

  watch: {
    courseSequence: {
      immediate: true,
      handler() {
        this.fetchDominios();
      },
    },
  },

  methods: {
    async fetchCompetencias() {
      this.competencias = await this.$api.getCompetencias();
    },

    async fetchDominios() {
      this.dominios = await this.$api.getDominios(this.courseSequence);
    },

    async onCreateDominio(dominio) {
      let newRecord = await this.$api.createDominio({
        ...dominio,
        courseSequence: this.courseSequence,
      });
      this.dominios.push(newRecord);
    },

    async onUpdateDominio(dominio) {
      if (!dominio.id) {
        console.warn('onUpdateDominio without ID', dominio);
        return;
      }

      let updatedRecord = await this.$api.updateDominio(dominio);
      let foundIndex = this.dominios.findIndex((d) => d.id == dominio.id);
      this.dominios.splice(foundIndex, 1, updatedRecord);
    },

    async onDeleteDominio(dominio) {
      await this.$api.deleteDominio(dominio);
      this.dominios.splice(this.dominios.indexOf(dominio), 1);
    },
  },
};
</script>