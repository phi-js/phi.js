<template>
  <div class="DominioListEditor">

    <div class="manager-wheel">
      <DominioWheel
        :label="label"
        :dominios="dominios"
        :competencias="competencias"
        :dominioId.sync="curDominioId"
      />
    </div>

    <div class="manager-list">
      <DominioEditor
        v-for="(dominio, i) in dominios"
        :key="dominio.id"
        class="dominio-editor"
        :class="{'--active': dominio.id == curDominioId}"
        :competencias="competencias"
        v-model="dominios[i]"
        @input="updateRecord(dominios[i])"
        @delete="deleteRecord(dominios[i])"
        @mouseenter="curDominioId = dominio.id"
        @mouseleave="curDominioId = null"
      />

      <DominioEditor
        :competencias="competencias"
        @input="createRecord"
      />
    </div>

  </div>
</template>

<script>
/**
Este es un componente bruto, que permite editar un ARREGLO de DOMINIOS.
Emite eventos para las siguientes acciones:

@updateRecord(record)
@deleteRecord(record)
@createRecord(record)
*/

import DominioWheel from './DominioWheel.vue';
import DominioEditor from './DominioEditor.vue';

export default {
  name: 'DominioListEditor',
  components: { DominioWheel, DominioEditor },

  props: {
    /**
    Arreglo de DOMINIOS:
    [
      {
        competencias: ['c1'], // arreglo de ids de competencias
        color: '#43aa8b',
        text: 'Describes a plan to identify learning strategies from a given list',
      }
    ]
    */
    value: {
      type: Array,
      required: false,
      default: () => [],
    },

    /**
     * Texto a mostrar en el centro del círculo
     */
    label: {
      type: String,
      required: false,
      default: '',
    },

    competencias: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      dominios: [],
      curDominioId: null,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.dominios = Array.isArray(newValue) ? newValue.concat([]) : [];
      },
    },
  },

  methods: {
    updateRecord(record) {
      this.$emit('update-record', record);
    },

    deleteRecord(record) {
      if (!confirm('Eliminar este dominio ?')) {
        return;
      }
      // this.dominios.splice(this.dominios.indexOf(record), 1);
      this.$emit('delete-record', record);
    },

    createRecord(record) {
      this.$emit('create-record', record);

      // this.dominios.push(
      //   Object.assign({}, record, { id: `dominio:${this.dominios.length}` })
      // );
    },
  },
};
</script>

<style lang="scss">
.DominioListEditor {
  display: flex;

  // .manager-wheel,
  // .manager-list {
  //   flex: 1;
  // }

  .manager-list {
    flex: 4;
  }

  .manager-wheel {
    flex: 3;
  }

  .dominio-editor.--active {
    .item-dominio {
      background-color: #ff8;
    }
  }
}
</style>