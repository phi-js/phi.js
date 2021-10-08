<template>
  <div class="input-editor">
    <FieldEditor
      v-model="inputProps"
      :show-label="value.type != 'checkbox' && value.type != 'button'"
      @input="emitInput"
    >
      <template v-if="value.type == 'textarea'">
        <textarea
          style="width: 99%; pointer-events: none"
          class="ui-native"
          v-bind="$attrs"
        ></textarea>
      </template>
      <template v-else-if="value.type == 'select'">
        <SelectEditor
          v-model="inputProps"
          @input="emitInput"
        ></SelectEditor>
      </template>
      <template v-else-if="value.type == 'checkbox'">
        <UiItem
          class="ui-checkbox-editor"
          icon="mdi:checkbox-blank-outline"
          icon-color="var(--ui-color-primary)"
        >
          <input
            style="width: 100%; font: inherit; border: 0; background: transparent"
            placeholder="Agregar texto"
            v-model="inputProps.label"
            @input="emitInput"
          />
        </UiItem>
      </template>
      <template v-else-if="value.type == 'button'">
        <button
          class="ui-button --main"
          type="button"
          v-bind="$attrs"
          style="pointer-events: none"
        >{{inputProps.label || '....'}}</button>
      </template>
      <template v-else>
        <input
          class="ui-native"
          :type="value.type"
          v-bind="$attrs"
          style="pointer-events: none"
        />
      </template>
    </FieldEditor>
  </div>
</template>

<script>
import { UiItem } from '../../../../../ui';
import FieldEditor from '../FieldEditor/FieldEditor.vue';
import SelectEditor from '../SelectEditor/SelectEditor.vue';

export default {
  name: 'InputEditor',
  components: {
    UiItem,
    FieldEditor,
    SelectEditor,
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
      inputProps: {},
    };
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        if (!newValue) {
          return;
        }

        this.inputProps = JSON.parse(JSON.stringify(newValue));
      },
    },
  },

  methods: {
    emitInput() {
      this.$emit('input', JSON.parse(JSON.stringify(this.inputProps)));
    },
  },
};
</script>