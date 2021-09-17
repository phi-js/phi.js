<template>
  <div class="PlaneacionSesionLogManager">
    <table
      class="ui-table"
      style="width:100%"
    >
      <thead>
        <tr>
          <td>Autor</td>
          <td>Fecha</td>
          <td>Grupo</td>
          <td>Observaciones</td>
          <td></td>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="registro in registros"
          :key="registro.id"
        >
          <td>[ oculto ]</td>
          <td>{{ $ts(registro.fecha, 'date') }}</td>
          <td>{{ registro.grupo ? registro.grupo.name : '---' }}</td>
          <td>{{ registro.observaciones }}</td>
          <td>
            <UiIcon
              class="ui-clickable"
              value="mdi:delete-forever"
              @click="deleteRegistro(registro)"
            />
          </td>
        </tr>
      </tbody>

      <tfoot>
        <tr>
          <td></td>
          <td>
            <UiInput
              type="timestamp"
              v-model="newRegistro.fecha"
            />
          </td>
          <td>
            <select
              class="ui-native"
              v-model="newRegistro.grupoId"
            >
              <option
                v-for="grupo in grupos"
                :key="grupo.id"
                :value="grupo.id"
              >{{ grupo.name }}</option>
            </select>
          </td>
          <td>
            <UiInput
              type="text"
              v-model="newRegistro.observaciones"
            />
          </td>
          <td>
            <UiIcon
              class="ui-clickable"
              value="mdi:plus-circle"
              @click="appendRegistro()"
            />
          </td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import useApi from '@/modules/api/mixins/useApi.js';
import apiV4, { planeacion } from '/apis/v4';

import { UiInput, UiIcon } from '@/modules/ui/components';

export default {
  name: 'PlaneacionSesionLogManager',
  mixins: [useApi, useI18n],

  components: {
    UiInput,
    UiIcon,
  },

  $api: {
    type: apiV4,
    wrappers: [planeacion],
  },

  props: {
    sesionId: {
      type: String,
      required: true,
    },

    grupos: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      registros: [],
      newRegistro: {
        sesionId: null,
        grupo: null,
        fecha: null,
        observaciones: '',
      },
    };
  },

  watch: {
    sesionId: {
      immediate: true,
      handler(newValue) {
        this.newRegistro.sesionId = newValue;
        this.fetchRegistros();
      },
    },
  },

  methods: {
    async fetchRegistros() {
      let response = await this.$api.getSesionLogRecords(this.sesionId);
      this.registros = response?.length ? response : [];

      this.registros = this.registros.map((r) => ({
        ...r,
        grupo: this.grupos.find((g) => g.id == r.grupoId),
      }));
    },

    async appendRegistro() {
      let created = await this.$api.addSesionLogRecord({
        ...this.newRegistro,
        sesionId: this.sesionId,
      });
      this.registros.push(created);

      this.newRegistro.fecha = null;
      this.newRegistro.observaciones = '';
    },

    async deleteRegistro(registro) {
      if (!confirm('Eliminar este registro ?')) {
        return;
      }

      await this.$api.deleteSesionLogRecord(registro.id);
      this.registros.splice(this.registros.indexOf(registro), 1);
    },
  },
};
</script>