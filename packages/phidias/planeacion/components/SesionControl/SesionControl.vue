<template>
  <div class="SesionControl">
    <div v-if="!item">
      ... cargando ...
    </div>
    <div v-else>
      <UiDrawer>
        <template #trigger>
          <UiItem
            class="ui-clickable ui-noselect"
            text="Retroalimentación"
            :icon="currentState.icon"
            :icon-color="currentState.color"
            :secondary="item.history.length ? item.history[0].comments : ''"
          />
        </template>
        <template #contents>
          <div class="entry-list">
            <template v-if="item.history.length">
              <div
                class="entry-item"
                v-for="entry in item.history"
                :key="entry.id"
              >
                <div class="entry-author">{{ entry.authorId ? `${entry.author.firstName} ${entry.author.lastName}` : '[ oculto ]'}}</div>
                <div class="entry-timestamp">{{ $date(entry.timestamp )}}</div>
                <div
                  class="entry-statechange"
                  v-if="entry.to != entry.from"
                >
                  <span>Cambiado a </span>
                  <span
                    class="span-state state-to"
                    :style="`color:${stateHash[entry.to].color}`"
                  >{{ stateHash[entry.to].text }}</span>
                </div>
                <div class="entry-comments">{{ entry.comments }}</div>
              </div>
            </template>
            <div v-else>No hay registros</div>
          </div>
        </template>
      </UiDrawer>

      <div class="sesion-control-dialog-contents">
        <div class="entry-adder ui-column">
          <div class="entry-form">
            <select
              class="ui-native"
              v-model="newEntry.to"
            >
              <option
                v-for="state in availableStates"
                :key="state.id"
                :value="state.id"
              >{{ state.text }}</option>
            </select>
            <textarea
              placeholder="Observaciones"
              type="text"
              class="ui-native"
              v-model="newEntry.comments"
            ></textarea>
            <!-- <button
              type="button"
              class="ui-button --main"
              @click="addEntry()"
            >Enviar</button> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import useI18n from '@/modules/i18n/mixins/useI18n.js';
import useApi from '@/modules/api/mixins/useApi.js';
import v4Api, { stateManager } from '/apis/v4';

import {
  UiField,
  UiIcon,
  UiItem,
  UiDialog,
  UiDrawer,
  UiChatBubble,
} from '@/modules/ui/components';

export default {
  name: 'SesionControl',
  mixins: [useApi, useI18n],

  components: {
    UiField,
    UiIcon,
    UiItem,
    UiDialog,
    UiDrawer,
    UiChatBubble,
  },

  $api: {
    type: v4Api,
    wrappers: [stateManager],
  },

  props: {
    sesionId: {
      type: String,
      required: true,
    },

    states: {
      type: Array,
      required: true,
    },

    isManager: {
      required: false,
      default: false,
    },
  },

  data() {
    return {
      item: null,
      history: [],

      newEntry: {
        to: null,
        comments: '',
      },
    };
  },

  computed: {
    itemId() {
      return `planeacion-sesion-${this.sesionId}`;
    },

    currentState() {
      return this.states.find((s) => s.id == this.item?.state);
    },

    currentUserId() {
      return this.$httpClient?.payload?.id || null;
    },

    stateHash() {
      let retval = {};
      this.states.forEach((state) => (retval[state.id] = state));
      return retval;
    },

    availableStates() {
      if (!this.currentState) {
        return [];
      }

      let retval = [
        this.currentState.id,
        ...this.currentState.validTargetIds,
      ].map((stateId) => this.stateHash[stateId]);

      if (!this.isManager) {
        retval = retval.filter((state, i) => i === 0 || !state.managerOnly);
      }

      return retval;
    },
  },

  watch: {
    itemId: {
      immediate: true,
      handler() {
        this.fetchItem();
      },
    },
  },

  methods: {
    async fetchItem() {
      this.item = await this.$api.getItem(this.itemId, {
        sesionId: this.sesionId,
      });
      if (!this.item.state) {
        this.item.state = 'building';
      }

      this.newEntry.to = this.item.state;
      this.$emit('update:state', this.item.state);
    },

    async addEntry() {
      this.item = await this.$api.setState(
        this.item,
        this.newEntry.to,
        this.newEntry.comments,
        { sesionId: this.sesionId }
      );

      this.newEntry.comments = '';
      this.$emit('update:state', this.item.state);
    },
  },
};
</script>

<style lang="scss">
.SesionControl {
  .sesion-control-dialog-contents {
    display: flex;
    flex-direction: column;
    max-height: 500px;
  }

  .entry-list {
    flex: 1;
    overflow-y: auto;
  }

  .entry-adder {
    display: flex;
    flex-direction: column;

    textarea {
      resize: vertical;
    }
  }

  .entry-form {
    margin-bottom: 12px;
    display: flex;
    flex-direction: column;
  }

  .entry-item {
    padding: 12px 0;
    border-bottom: 1px solid #00000022;

    .entry-author {
      font-weight: bold;
    }

    .entry-timestamp {
      font-size: 12px;
      opacity: 0.7;
    }

    .entry-statechange {
      font-size: 12px;
    }

    .entry-comments {
      padding: 2px;
    }
  }
}
</style>