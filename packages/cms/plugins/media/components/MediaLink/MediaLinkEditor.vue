<template>
  <div class="media-link-editor">
    <UiItem
      v-bind="sanitizedValue"
      class="ui--clickable"
      @click="isEditing = true"
    />

    <div
      v-show="isEditing"
      class="link-editor-form"
    >
      <input
        v-model="innerValue.href"
        type="text"
        class="ui-native"
        placeholder="http://..."
      >
      <input
        v-model="innerValue.text"
        type="text"
        class="ui-native"
        placeholder="Titulo"
      >
      <input
        v-model="innerValue.secondary"
        type="text"
        class="ui-native"
        placeholder="Descripcion"
      >

      <select
        v-model="innerValue.target"
        class="ui-native"
      >
        <option>Destino</option>
        <option value="_system">
          Nueva pestaña
        </option>
        <option value="_self">
          Pestaña actual
        </option>
      </select>

      <div class="link-editor-form-footer">
        <button
          type="button"
          class="ui-button --main"
          @click="accept"
        >
          OK
        </button>
        <button
          type="button"
          class="ui-button --cancel"
          @click="cancel"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useApi } from '../../../../../api'
import { UiItem } from '../../../../../ui'
import cmsApi from '../../../../api'

export default {
  name: 'MediaLinkEditor',
  components: { UiItem },
  mixins: [useApi],
  api: cmsApi,
  props: {
    value: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      innerValue: null,
      isEditing: false,
    }
  },

  computed: {
    isEmpty() {
      return (
        !this.innerValue.href &&
        !this.innerValue.text &&
        !this.innerValue.secondary
      )
    },

    sanitizedValue() {
      return {
        href: this.innerValue.href,
        text: this.innerValue.text || 'Sin título',
        secondary: this.innerValue.secondary,
        icon: this.innerValue.icon || 'mdi:open-in-new',
      }
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(newValue) {
        this.innerValue = JSON.parse(JSON.stringify(newValue))
        this.isEditing = this.isEmpty
      },
    },
  },

  async mounted() {
    // Fetch URL title when url is present and text is empty
    if (this.value.href && !this.value.text) {
      this.innerValue.text = '... fetching ...'
      this.innerValue.secondary = this.value.href
      let details = await this.$api.getUrlDetails(this.value.href)
      if (details) {
        this.innerValue.text = details.title
        this.innerValue.secondary = details.description
        this.$emit('input', JSON.parse(JSON.stringify(this.innerValue)))
      }
    }
  },

  methods: {
    accept() {
      this.$emit('input', JSON.parse(JSON.stringify(this.innerValue)))
      this.isEditing = false
    },

    cancel() {
      this.innerValue = JSON.parse(JSON.stringify(this.value))
      this.isEditing = false

      if (this.isEmpty) {
        this.$emit('delete')
      }
    },

    doDelete() {
      if (!confirm('Eliminar este vínculo ?')) {
        return
      }
      this.$emit('delete')
    },
  },
}
</script>

<style lang="scss">
.media-link-editor {
  .link-editor-form {
    padding-left: 50px;
    padding-right: 12px;

    input {
      display: block;
      width: 100%;
    }

    .link-editor-form-footer {
      text-align: right;
      margin-top: var(--ui-breathe);
    }
  }
}
</style>