<template>
  <div class="PlaneacionUnidadEditor">

    <UiDrawer :open="isDrawerOpen">
      <template #contents>
        <div class="unidad-fieldset">
          <UiInput
            type="text"
            class="ui-breathe"
            label="Título"
            v-model="unidad.titulo"
            @input="emitInput"
          />

          <div class="ui-group">
            <UiInput
              class="ui-breathe"
              label="Fecha inicial"
              type="timestamp"
              v-model="unidad.fechaInicial"
              @input="emitInput"
            />
            <UiInput
              class="ui-breathe"
              label="Fecha final"
              type="timestamp"
              v-model="unidad.fechaFinal"
              @input="emitInput"
            />
          </div>

          <!-- <UiInput
            type="number"
            class="ui-breathe"
            label="No. de sesiones"
            v-model="unidad.numSesiones"
            @input="emitInput"
          /> -->
        </div>
      </template>
    </UiDrawer>
    <div
      class="fieldset-toggler ui-clickable"
      @click="isDrawerOpen = !isDrawerOpen"
    >&bull;&bull;&bull;</div>
<!-- 
    <UnidadProductosManager
      class="unidad-productos"
      v-model="unidad.productos"
      @input="emitInput"
    /> -->

    <UiInput
      type="text"
      class="ui-breathe"
      label="Descripción"
      v-model="unidad.descripcion"
      @input="emitInput"
    />

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

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.unidad)));
    },
  },
};
</script>

<style lang="scss">
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