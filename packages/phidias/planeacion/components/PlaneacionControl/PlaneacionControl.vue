<template>
  <div class="PlaneacionControl">
    <div v-if="!item">
      ... cargando ...
    </div>
    <div v-else>
      <UiDialog>
        <template #trigger>
          <UiItem
            class="ui-clickable"
            :text="currentState.text"
            :icon="currentState.icon"
            :icon-color="currentState.color"
            :secondary="lastEntry && $ts(lastEntry.timestamp)"
            :tertiary="lastEntry ? `&quot;${lastEntry.comments}&quot;` : null"
          />
        </template>
        <template #contents>
          <div class="dialog-contents">
            <div class="entry-adder ui-column">
              <textarea
                type="text"
                class="ui-native"
                v-model="newEntry.comments"
              ></textarea>

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

                <button
                  type="button"
                  class="ui-button --main"
                  @click="addEntry()"
                >Enviar</button>
              </div>
            </div>

            <div class="entry-list">
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
            </div>

          </div>
        </template>
        <template #footer="{close}">
          <button
            class="ui-button"
            style="float:right"
            type="button"
            @click="close()"
          >Cerrar</button>
        </template>
      </UiDialog>
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
  UiChatBubble,
} from '@/modules/ui/components';

export default {
  name: 'PlaneacionControl',
  mixins: [useApi, useI18n],

  $api: {
    type: v4Api,
    wrappers: [stateManager],
  },

  components: {
    UiField,
    UiIcon,
    UiItem,
    UiDialog,
    UiChatBubble,
  },

  props: {
    itemName: {
      type: String,
      required: false,
      default: null,
    },

    isManager: {
      required: false,
      default: false,
    },

    academicCourseId: {
      type: String,
      required: true,
    },

    periodId: {
      type: String,
      required: true,
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

      states: [
        {
          id: 'building',
          text: 'En proceso',
          icon: 'mdi:file-edit-outline',

          validTargetIds: ['pendiente'],
        },
        {
          id: 'pendiente',
          text: 'Por revisar',
          icon: 'mdi:file-edit-outline',
          color: 'var(--ui-color-warning)',

          validTargetIds: ['aprobado', 'rechazado', 'corrigiendo'],
        },
        {
          id: 'aprobado',
          text: 'Aprobado',
          icon: 'mdi:file-check-outline',
          color: 'var(--ui-color-success)',

          validTargetIds: ['pendiente'],
          managerOnly: true,
        },
        {
          id: 'rechazado',
          text: 'Rechazado',
          icon: 'mdi:file-cancel',
          color: 'var(--ui-color-danger)',

          validTargetIds: ['pendiente'],
          managerOnly: true,
        },
        {
          id: 'corrigiendo',
          text: 'En correcciones',
          icon: 'mdi:file-edit-outline',
          color: 'var(--ui-color-warning)',

          validTargetIds: ['pendiente'],
          managerOnly: true,
        },
      ],
    };
  },

  computed: {
    itemId() {
      return (
        `planeacion-${this.academicCourseId}-${this.periodId}` +
        (this.itemName ? `-${this.itemName}` : '')
      );
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

    lastEntry() {
      let history = this.item?.history || [];
      if (!history.length) {
        return null;
      }

      // return history[history.length - 1];
      return history[0];
    },

    availableStates() {
      if (!this.currentState) {
        return [];
      }

      return [this.currentState.id, ...this.currentState.validTargetIds]
        .map((stateId) => this.stateHash[stateId])
        .filter((stateObj) =>
          stateObj?.managerOnly
            ? !!this.isManager && this.isManager != '0'
            : true
        );
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
        academicCourseId: this.academicCourseId,
        periodId: this.periodId,
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
        {
          academicCourseId: this.academicCourseId,
          periodId: this.periodId,
        }
      );

      this.newEntry.comments = '';
      this.$emit('update:state', this.item.state);
    },
  },
};
</script>

<style lang="scss">
.PlaneacionControl {
  border-radius: var(--ui-radius);
  border: 2px dashed #ccc;
  padding: var(--ui-breathe);
  margin-bottom: var(--ui-breathe);
}

.dialog-contents {
  display: flex;
  flex-direction: column;
  max-height: 500px;

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
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
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