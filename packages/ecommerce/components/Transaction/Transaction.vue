<template>
  <div class="ec-transaction">
    <slot
      name="items"
      :items="items"
      :total="total"
    >
      <ui-list class="ec-transaction-items">
        <ui-item
          v-for="(item, i) in items"
          :key="i"
          :icon="item.icon"
          :text="item.text"
          :secondary="item.description"
        >
          <template #right>
            $ {{ item.value }}
          </template>
        </ui-item>

        <ui-item text="Total">
          <template #right>
            $ {{ total }}
          </template>
        </ui-item>
      </ui-list>
    </slot>

    <template v-if="!isDone">
      <slot
        v-if="!transaction && !providerIsLoading"
        name="gateways"
        :gateways="availableGateways"
        :beginTransaction="beginTransaction"
      >
        <div class="provider-list ui-row --tight">
          <ui-item
            v-for="gateway in availableGateways"
            :key="gateway.id"
            class="gateway-item"
            icon="g:credit_card"
            text="Realizar pago"
            :secondary="gateway.name"
            @click="beginTransaction(gateway)"
          />
        </div>
      </slot>

      <div class="ec-transaction-component">
        <component
          :is="providerComponent"
          v-if="providerComponent"
          :transaction="transaction"
          @success="providerSuccess"
          @error="providerError"
        />
      </div>
    </template>

    <slot
      v-if="!previewTransaction || providerIsLoading"
      name="loading"
    >
      <ui-loading />
    </slot>

    <div
      v-if="isDone"
      class="ec-transaction-result"
    >
      <slot
        v-if="isSuccess"
        name="success"
      >
        <ui-item
          icon="g:check"
          text="Pago recibido"
        />
      </slot>
      <slot
        v-else
        name="error"
      >
        <ui-item
          class="error-item"
          icon="g:error_outline"
          text="Error procesando pago"
          xxxxsecondary="error"
        >
          <template #right>
            <ui-icon
              class="icon-redo"
              value="g:refresh"
              @click="reset"
            />
          </template>
        </ui-item>
      </slot>
    </div>
  </div>
</template>

<script>
import useApi from '@/modules/api/mixins/useApi'
import apiEcommerce from '@/modules/ecommerce/api'

import { UiList, UiItem, UiIcon, UiLoading } from '@/modules/ui/components'

export default {
  name: 'EcTransaction',

  components: {
    UiList,
    UiItem,
    UiIcon,
    UiLoading,
  },
  mixins: [useApi],
  api: apiEcommerce,

  props: {
    type: {
      type: String,
      required: true,
    },

    payload: {
      required: false,
      default: null,
    },

    payerId: {
      type: [String, Number],
      required: false,
      default: null,
    },

    gatewayId: {
      type: String,
      required: false,
      default: null,
    },
  },

  data() {
    return {
      previewTransaction: null,
      providerComponent: null,
      transaction: null,
      providerIsLoading: false,

      response: null,
      isSuccess: null,
      isDone: false,
    }
  },

  computed: {
    items() {
      if (!this.previewTransaction) {
        return []
      }

      return this.previewTransaction.items
    },

    total() {
      return this.previewTransaction ? this.previewTransaction.value : 0
    },

    availableGateways() {
      if (!this.previewTransaction) {
        return []
      }

      if (!this.gatewayId) {
        return this.previewTransaction.gateways
      }

      let found = this.previewTransaction.gateways.find((g) => g.id == this.gatewayId)
      return found ? [found] : []
    },

    sanitizedPayerId() {
      if (this.payer) {
        return this.payer
      }
      return this.$httpClient ? this.$httpClient.payload.id : null // current authenticated user
    },

    // mas datos sobre watch de multiples propiedades https://github.com/vuejs/vue/issues/844#issuecomment-265315349
    typeOrPayload() {
      return JSON.stringify([this.type, this.payload])
    },
  },

  watch: {
    typeOrPayload: {
      immediate: true,
      handler() {
        this.fetchPreview()
      },
    },
  },

  methods: {
    providerSuccess($event) {
      this.response = $event
      this.isSuccess = true
      this.isDone = true
      this.$emit('success', $event)
    },

    providerError($event) {
      this.response = $event
      this.isSuccess = false
      this.isDone = true
      this.$emit('error', $event)
    },

    reset() {
      this.transaction = null
      this.providerComponent = null

      this.response = null
      this.isSuccess = false
      this.isDone = false
    },

    async fetchPreview() {
      this.previewTransaction = null

      this.previewTransaction = await this.$api.getTransactionDetails({
        type: this.type,
        payload: this.payload,
      })
    },

    async beginTransaction(gateway) {
      if (!gateway) {
        console.warn('beginTransaction called with no gateway argument')
        return
      }

      this.providerIsLoading = true
      this.transaction = null
      this.providerComponent = null

      try {
        let providerDefinition = await this.getProviderDefinition(gateway.provider)

        this.transaction = await this.$api.createTransaction({
          type: this.type,
          payload: this.payload,
          payerId: this.sanitizedPayerId,
          gateway: gateway.id,
        })

        // Esta linea tiene que estar respues de establecer this.transaction, de lo contrario vue intenta instanciar <component> con :transaction vacio
        this.providerComponent = providerDefinition.component
      } catch (err) {
        this.transaction = null
        this.providerComponent = null

        this.isDone = true
        this.$emit('error', err)
      }

      this.providerIsLoading = false
    },

    getProviderDefinition(providerName) {
      providerName = providerName.toLowerCase()
      return import(`../../providers/${providerName}/index.js`).then((importedModule) => importedModule.default)
    },
  },
}
</script>

<style lang="scss">
.ec-transaction {
  .provider-list {
    .gateway-item {
      cursor: pointer;
      margin: 0.1em;
    }
  }

  .error-item {
    cursor: default;
    display: inline-flex;

    .item-icon {
      color: var(--ui-color-danger) !important;
    }

    .icon-redo {
      cursor: pointer;
      color: #777;

      &:hover {
        color: var(--ui-color-success);
      }
    }
  }
}
</style>