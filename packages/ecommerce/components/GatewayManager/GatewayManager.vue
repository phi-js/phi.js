<template>
  <div class="GatewayManager">
    <UiList>
      <UiDrawer v-for="(gateway, i) in gateways" :key="gateway.id" v-show="!gateway._deleting">
        <template #trigger>
          <UiItem
            class="ui--clickable"
            icon="g:credit_card"
            :text="gateway.name"
            :secondary="gateway.provider"
            @delete="deleteGateway(gateway)"
          />
        </template>

        <template #contents="{toggle}">
          <GatewayEditor
            v-model="gateways[i]"
            @save="updateGateway(gateway).then(() => toggle())"
            @cancel="toggle()"
          >
            <template #data="{data, setData}">
              <slot name="data" :data="data" :set-data="setData"></slot>
            </template>
          </GatewayEditor>
        </template>
      </UiDrawer>

      <UiDrawer>
        <template #trigger="{isOpen}">
          <UiItem
            class="ui--clickable"
            :icon="isOpen ? 'g:close' : 'g:add_circle'"
            :text="$t('GatewayManager.addGateway')"
          />
        </template>

        <template #contents="{toggle}">
          <GatewayEditor
            v-model="newGateway"
            @save="saveNewGateway().then(() => toggle())"
            @cancel="resetNewGateway(); toggle()"
          >
            <template #data="{data, setData}">
              <slot name="data" :data="data" :set-data="setData"></slot>
            </template>
          </GatewayEditor>
        </template>
      </UiDrawer>
    </UiList>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import useApi from '@/modules/api/mixins/useApi';
import apiEcommerce from '../../api/index.js';

import { UiList, UiItem, UiDrawer } from '@/modules/ui/components';
import GatewayEditor from './GatewayEditor.vue';

export default {
  name: 'GatewayManager',

  mixins: [useApi, useI18n],
  api: apiEcommerce,

  components: {
    UiList,
    UiItem,
    UiDrawer,
    GatewayEditor,
  },

  data() {
    return {
      gateways: [],

      newGateway: {
        name: null,
        provider: 'tucompra',
        settings: null,
      },
    };
  },

  methods: {
    async fetchGateways() {
      this.gateways = await this.$api.getGatewaysWithSettings();
    },

    updateGateway(gateway) {
      return this.$api.updateGateway(gateway.id, gateway);
    },

    async saveNewGateway() {
      let incomingGateway = await this.$api.createGateway(this.newGateway);
      this.gateways.push(incomingGateway);
      this.resetNewGateway();

      return incomingGateway;
    },

    resetNewGateway() {
      this.newGateway = {
        name: null,
        provider: 'tucompra',
        settings: null,
      };
    },

    deleteGateway(gateway) {
      if (
        !confirm(
          this.$t('GatewayManager.deleteGatewayWarning', { name: gateway.name })
        )
      ) {
        return;
      }

      this.$set(gateway, '_deleting', true);

      return this.$api
        .deleteGateway(gateway.id)
        .then(() => {
          this.gateways.splice(this.gateways.indexOf(gateway), 1);
        })
        .catch(() => {
          this.$set(gateway, '_deleting', undefined); // push back into the array if delete fails
        });
    },
  },

  mounted() {
    this.fetchGateways();
  },

  i18n: {
    en: {
      'GatewayManager.addGateway': 'Create new gateway',
      'GatewayManager.deleteGatewayWarning': 'Delete gateway "{{name}}" ?',
    },

    es: {
      'GatewayManager.addGateway': 'Crear nueva pasarela',
      'GatewayManager.deleteGatewayWarning':
        'Eliminar la pasarela "{{name}}" ?',
    },
  },
};
</script>