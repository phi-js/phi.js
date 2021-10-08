<template>
  <div class="StmtSwitch">
    <!-- <UiDataDialog
      v-model="innerModel"
      @input="emitInput"
    >
      <template #trigger>
        <UiItem
          class="ui-clickable ui-outset"
          v-bind="itemAttrs"
        ></UiItem>
      </template>
      <template #contents="dialog">
        <VmExpressionInternal v-model="dialog.innerModel.switch" />
      </template>
    </UiDataDialog> -->

    <input
      type="text"
      class="ui-native"
      v-model="innerModel.switch"
      @input="emitInput"
      placeholder="Valor a comparar ..."
    />

    <div class="stmt-switch-cases">
      <fieldset
        v-for="(caseObj, i) in innerModel.case"
        :key="i"
        class="switch-case"
      >
        <legend><label class="ui-label">{{caseObj.value}}</label> <button
            class="delete-button ui-button --cancel"
            type="button"
            @click="removeCase(i)"
          >&times;</button></legend>
        <VmExpressionInternal
          class="case-expression"
          v-model="innerModel.case[i].do"
          @input="emitInput"
        />
      </fieldset>

      <div class="case-adder">
        <input
          type="text"
          class="ui-native"
          placeholder="Si el valor es ..."
          @keyup.enter="addCase($event.target.value); $event.target.value = ''"
        />
      </div>

      <fieldset class="switch-case switch-default">
        <legend><label class="ui-label">Default</label></legend>
        <VmExpressionInternal
          class="case-expression"
          v-model="innerModel.default"
          @input="emitInput"
        />
      </fieldset>
    </div>

  </div>
</template>

<script>
import VmExpressionInternal from '../../VmExpressionInternal.vue';
// import { UiItem, UiDataDialog } from '../../../../../ui';

export default {
  name: 'StmtSwitch',
  components: { /*UiItem, UiDataDialog,*/ VmExpressionInternal },

  props: {
    value: {
      required: false,
      default: null,
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
        let clone = newValue ? JSON.parse(JSON.stringify(newValue)) : newValue;
        this.innerModel = Object.assign(
          {
            switch: null,
            case: [],
            default: null,
            info: null,
          },
          clone
        );
      },
    },
  },

  computed: {
    itemAttrs() {
      return Object.assign(
        {
          icon: 'mdi:electric-switch',
          text: this.innerModel.switch,
          secondary: 'Acciones según el valor',
        },
        this.innerModel.info
      );
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerModel)));
    },

    removeCase(index) {
      this.innerModel.case.splice(index, 1);
      this.emitInput();
    },

    addCase(value) {
      this.innerModel.case.push({
        value,
        do: { chain: [] },
      });
    },
  },
};
</script>

<style lang="scss">
.StmtSwitch {
  .stmt-switch-cases {
    padding: var(--ui-breathe);
    padding-left: 42px;
  }

  .switch-case {
    margin-bottom: var(--ui-breathe);
    border-radius: var(--ui-radius);
    border: 1px solid #ccc;

    legend {
      padding: 0 var(--ui-padding-horizontal);
    }
  }
}
</style>