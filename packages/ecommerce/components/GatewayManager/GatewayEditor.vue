<template>
  <div class="GatewayEditor">
    <div class="ui-column">
      <UiInput :label="$t('GatewayEditor.provider')">
        <select class="UiInput" v-model="gateway.provider" @change="input()">
          <option value="banorte">Banorte</option>
          <option value="bbva">BBVA</option>
          <option value="mercadopago">MercadoPago</option>
          <option value="redsys">RedSys</option>
          <option value="tucompra">TuCompra</option>
          <option value="fiserv">Fiserv</option>
        </select>
      </UiInput>

      <UiInput :label="$t('GatewayEditor.name')">
        <input class="UiInput" type="text" v-model="gateway.name" @input="input()" />
      </UiInput>

      <slot name="data" :data="gateway.data || {}" :set-data="setData"></slot>

      <UiInput :label="$t('GatewayEditor.settings')">
        <UiFormGenerator
          class="settings-editor"
          v-if="settingsSchema"
          :schema="settingsSchema"
          v-model="gateway.settings"
          @input="input"
        />
        <UiInputJson v-else v-model="gateway.settings" @input="input()" />
      </UiInput>
    </div>

    <footer>
      <button class="ui-button --main" @click="save()">{{ $t('common.Save') }}</button>
      <button class="ui-button --cancel" @click="cancel()">{{ $t('common.Cancel') }}</button>
    </footer>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import { UiInput, UiFormGenerator, UiInputJson } from '@/modules/ui/components';
import setProperty from '@/modules/ui/helpers/setProperty.js';

export default {
  name: 'GatewayEditor',
  mixins: [useI18n],

  components: {
    UiInputJson,
    UiInput,
    UiFormGenerator,
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
      initialValue: null,
      gateway: null,
      settingsSchema: null,
    };
  },

  watch: {
    value: {
      immediate: true,
      async handler(newValue) {
        this.gateway = JSON.parse(JSON.stringify(newValue));

        if (!this.initialValue) {
          this.initialValue = JSON.parse(JSON.stringify(newValue));
        }

        let definition = await this.getProviderDefinition(
          this.gateway.provider
        );
        this.settingsSchema = definition.settingsSchema;
      },
    },
  },

  methods: {
    input() {
      this.$emit('input', JSON.parse(JSON.stringify(this.gateway)));
    },

    save() {
      this.initialValue = null;
      let clone = JSON.parse(JSON.stringify(this.gateway));
      this.$emit('save', clone);
      this.$emit('input', clone);
    },

    cancel() {
      this.$emit('input', this.initialValue);
      this.$emit('cancel');
    },

    getProviderDefinition(providerName) {
      providerName = providerName.toLowerCase();
      return import(
        `@/modules/ecommerce/providers/${providerName}/index.js`
      ).then((importedModule) => importedModule.default);
    },

    setData(propertyName, propertyValue) {
      if (!this.gateway.data) {
        this.gateway.data = {};
      }
      setProperty(this.gateway.data, propertyName, propertyValue);
      this.input();
    },
  },

  i18n: {
    en: {
      'GatewayEditor.name': 'Name',
      'GatewayEditor.provider': 'Provider',
      'GatewayEditor.settings': 'Settings',
    },

    es: {
      'GatewayEditor.name': 'Nombre',
      'GatewayEditor.provider': 'Proveedor',
      'GatewayEditor.settings': 'Configuración',
    },
  },
};
</script>

<style lang="scss">
.GatewayEditor {
  .ui-field-body {
    flex: 1;
  }

  .settings-editor {
    .ui-field {
      margin: 0 0 12px 0 !important;
      input {
        width: 100%;
      }
    }
  }
}
</style>