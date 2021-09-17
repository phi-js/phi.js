<template>
  <div class="PlaneacionUnidadEditor">
    <div class="unidad-fieldset">
      <UiInput
        type="text"
        class="ui-breathe"
        label="Título"
        v-model="unidad.titulo"
        @input="emitInput"
        required
      />

      <div class="ui-group">
        <UiInput
          class="ui-breathe"
          label="Fecha inicial"
          type="timestamp"
          v-model="unidad.fechaInicial"
          @input="emitInput"
          v-bind="dateProps"
          required
        />
        <UiInput
          class="ui-breathe"
          label="Fecha final"
          type="timestamp"
          v-model="unidad.fechaFinal"
          @input="emitInput"
          v-bind="dateProps"
          required
        />
      </div>

      <UiInput
        type="textarea"
        class="ui-breathe"
        label="Propuesta didáctica general"
        v-model="unidad.descripcion"
        @input="emitInput"
      />
    </div>
  </div>
</template>

<script>
import UnidadProductosManager from './UnidadProductosManager.vue';
import { UiInput, UiDrawer } from '@/modules/ui/components';

export default {
  name: 'PlaneacionUnidadEditor',

  components: {
    UnidadProductosManager,
    UiInput,
    UiDrawer,
  },

  props: {
    value: {
      type: Object,
      required: false,
      default: null,
    },

    period: {
      type: Object,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      unidad: null,
      isDrawerOpen: false,
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.unidad = newValue ? JSON.parse(JSON.stringify(newValue)) : {};
        if (!newValue) {
          this.isDrawerOpen = true;
        }
      },
    },
  },

  computed: {
    dateProps() {
      if (!this.period?.evaluation_date) {
        return null;
      }

      return {
        daysOptions: [
          {
            date: this.period.evaluation_date,
            className: 'cool-date',
          },
        ],
      };
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.unidad)));
    },
  },
};
</script>

<style lang="scss">
.flatpickr-day.cool-date {
  background-color: #990000cc;
  color: #fff;
  font-weight: bold;
}

.PlaneacionUnidadEditor {
  .fieldset-toggler {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 18px;
    border-radius: var(--ui-radius);
    background-color: rgba(0, 0, 0, 0.05);
  }

  .unidad-fieldset {
    .ui-input {
      input[type='text'] {
        width: 100%;
      }
    }
  }
}
</style>