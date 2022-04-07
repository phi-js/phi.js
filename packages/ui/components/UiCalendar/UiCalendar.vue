<template>
  <div class="UiCalendar">
    <controls
      v-model:date="innerDate"
      v-model:view="currentView"
      v-model:day="nDays"
      @update:date="$emit('update:date', $event)"
      @update:view="$emit('update:view', $event)"
    />

    <div class="ui-calendar-view">
      <template v-if="currentView == 'schedule'">
        <view-schedule
          :date="innerDate"
          :events="sanitizedEvents"
          @click-day="$emit('click-day', $event)"
          @click-event="$emit('click-event', $event)"
        />
      </template>

      <template v-else-if="currentView == 'week'">
        <view-days
          v-bind="$attrs"
          :n-days="7"
          :view="currentView"
          :date="innerDate"
          :events="sanitizedEvents"
          @click-day="$emit('click-day', $event)"
          @click-event="$emit('click-event', $event)"
        />
      </template>

      <template v-else-if="currentView == 'days'">
        <view-days
          v-bind="$attrs"
          :n-days="nDays"
          :view="currentView"
          :date="innerDate"
          :events="sanitizedEvents"
          @click-day="$emit('click-day', $event)"
          @click-event="$emit('click-event', $event)"
        />
      </template>

      <template v-else>
        <view-month
          v-bind="$attrs"
          :date="innerDate"
          :events="sanitizedEvents"
          @click-day="$emit('click-day', $event)"
          @click-event="$emit('click-event', $event)"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { sanitizeEventAsObjects } from './functions.js'

import ViewMonth from './View/Month.vue'
import ViewSchedule from './View/Schedule.vue'
import ViewDays from './View/Days.vue'
import Controls from './Controls.vue'

export default {
  name: 'UiCalendar',

  components: {
    ViewMonth,
    ViewSchedule,
    ViewDays,
    Controls,
  },

  props: {
    date: {
      type: Date,
      required: false,
      default: () => new Date(),
    },

    events: {
      type: Array,
      required: false,
      default: () => [],
    },

    view: {
      type: String,
      required: false,
      default: 'month',
    },
  },

  emits: ['update:date', 'update:view', 'click-day', 'click-event'],

  data() {
    return {
      innerDate: null,
      currentView: this.view,
      nDays: 1,
    }
  },

  computed: {
    sanitizedEvents() {
      return this.events.map(sanitizeEventAsObjects).filter((event, i) => {
        if (event == null) {
          console.warn('UiCalendar: Evento inválido', this.events[i])
          return false
        }
        return true
      })
    },
  },

  watch: {
    date: {
      immediate: true,
      handler(newVal) {
        this.innerDate = newVal
      },
    },
  },
}
</script>