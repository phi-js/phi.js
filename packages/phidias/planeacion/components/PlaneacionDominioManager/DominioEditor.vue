<template>
  <div class="DominioEditor">
    <UiDataDrawer
      :value="dominio"
      @input="emitInput($event)"
    >
      <template #trigger>
        <UiItem
          class="item-dominio ui-clickable"
          :icon="value ? 'mdi:circle-medium' : 'mdi:plus'"
          :text="value ? value.text : 'Agregar dominio'"
          @mouseenter.native="$emit('mouseenter')"
          @mouseleave.native="$emit('mouseleave')"
        >
          <template #secondary>
            <div class="chip-list">
              <div
                class="ui-chip"
                v-for="subc in curCompetencias"
                :key="subc.id"
                :style="{color: subc.color}"
              >{{ subc.name }}</div>
            </div>
          </template>
        </UiItem>
      </template>

      <template #contents="{ innerModel }">
        <div class="drawer-contents">
          <textarea
            class="ui-native"
            v-model="innerModel.text"
          ></textarea>

          <!-- <select
            class="ui-native"
            multiple
            v-model="innerModel.competencias"
          >
            <option
              v-for="(competencia, i) in competencias"
              :key="'opt_' + i"
              :value="competencia.id"
            >{{ competencia.text }}</option>
          </select> -->

          <UiInput
            type="select"
            :multiple="true"
            :options="selectOptions"
            v-model="innerModel.competencias"
          />

        </div>
      </template>
      <template
        #footer
        v-if="$listeners.delete"
      >
        <button
          type="button"
          class="ui-button --danger"
          @click="$emit('delete')"
        >Eliminar</button>
      </template>
    </UiDataDrawer>
  </div>
</template>

<script>
import { UiItem, UiInput, UiDataDrawer } from '@/modules/ui/components';

export default {
  name: 'DominioEditor',
  components: { UiItem, UiInput, UiDataDrawer },

  props: {
    value: {
      type: Object,
      required: false,
      default: null,
    },

    /**
    Arreglo de COMPETENCIAS:
    [
      { id: 'c1', text: 'Metacognición', color: '#43aa8b' },
      ...
    ]
    */
    competencias: {
      type: Array,
      required: false,
      default: () => [],
    },
  },

  data() {
    return {
      dominio: {},
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.dominio = newValue
          ? JSON.parse(JSON.stringify(newValue))
          : { id: null, text: '', competencias: [] };
      },
    },
  },

  computed: {
    curCompetencias() {
      if (!this.value || !Array.isArray(this.value.competencias)) {
        return [];
      }

      return this.competencias.filter((c) =>
        this.value.competencias.includes(c.id)
      );
    },

    selectOptions() {
      return this.competencias.map((c) => ({
        text: c.name,
        value: c.id,
      }));
    },
  },

  methods: {
    emitInput(newValue) {
      this.$emit('input', newValue);

      // Si no hay datos en la propiedad "value" se asume que este es un formulario para crear nuevos dominios
      // asi que una vez creado, el valor interno se resetea
      if (!this.value) {
        this.dominio = { id: null, text: '', competencias: [] };
      }
    },
  },
};
</script>

<style lang="scss">
.DominioEditor {
  .chip-list {
    .ui-chip {
      display: inline;

      border-radius: var(--ui-radius);
      font-family: var(--ui-forn-secondary);
      font-size: 13px;
      font-weight: bold;

      &::before {
        content: ', ';
      }

      &:last-child::before {
        content: ' y ';
      }

      &:first-child::before {
        content: '';
      }
    }
  }

  .ui-button.--danger {
    float: right;
    clear: both;
    margin-right: var(--ui-breathe);
  }

  /// !!! clase interna de UiDataDrawer / UiDrawer
  .ui-drawer-contents {
    padding: var(--ui-padding);
    padding-left: 48px;
    padding-bottom: 32px;

    .data-drawer-footer {
      padding-top: 24px;
    }

    input,
    select,
    textarea {
      display: block;
      width: 100%;
      margin-bottom: var(--ui-breathe);
    }
  }
}
</style>