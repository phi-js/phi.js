<template>
  <div class="ui-calendar-controls">
    <!-- <input type="text" :value="date" @input="$emit('update:date', $event.target.value)" />
    <input type="text" :value="view" @input="$emit('update:view', $event.target.value)" />-->

    <button
      type="button"
      class="UiButton"
      @click="setToday()"
    >
      {{ i18n.t('UiCalendar.Today') }}
    </button>

    <div class="date-controls">
      <div class="month-controls">
        <span
          class="month-prev"
          @click="goPrev()"
        >
          <ui-icon src="mdi:chevron-left" />
        </span>

        <span
          class="month-next"
          @click="goNext()"
        >
          <ui-icon src="mdi:chevron-right" />
        </span>
      </div>

      <div class="month-selector">
        <select
          class="UiInput"
          :value="innerDate.getMonth()"
          @change="setMonth($event.target.value)"
        >
          <option
            v-for="(monthName, i) in allMonths"
            :key="i"
            :value="i"
            v-text="monthName"
          />
        </select>
        <span class="current-year">{{ innerDate.getFullYear() }}</span>
      </div>
    </div>

    <div
      v-if="currentView == 'days'"
      class="counter-days"
    >
      <span @click="setCurrentDay(0)">
        <ui-icon src="mdi:minus" />
      </span>
      {{ currentDay }}
      <span @click="setCurrentDay(1)">
        <ui-icon src="mdi:plus" />
      </span>
    </div>

    <div class="view-selector">
      <select
        class="UiInput"
        :value="currentView"
        @change="setCurrentView($event.target.value)"
      >
        <option value="month">
          {{ i18n.t('UiCalendar.Month') }}
        </option>
        <option value="week">
          {{ i18n.t('UiCalendar.Week') }}
        </option>
        <option value="schedule">
          {{ i18n.t('UiCalendar.Schedule') }}
        </option>
        <option value="days">
          {{ i18n.t('UiCalendar.Days') }}
        </option>
      </select>
    </div>
  </div>
</template>

<script>
// Debe recibir dos props:
// "date": una fecha "actual"/"fecha seleccionada"
// "view": una cadena indicando la vista seleccionada

// Debe mostrar controles para cambiar la vista ("view") y la fecha ("date")
// y cuando lo haga debe
// Emitir un evento update:date cuando cambie la fecha
// Emitir un evento update:view cuando cambie la vista

// (Estas dos cosas las pueden copiar de src\modules\ui\components\Calendar\Calendar.vue)

import { useI18n } from '../../../i18n'
import { UiIcon } from '../UiIcon'

export default {
  name: 'UiCalendarControls',

  components: { UiIcon },

  props: {
    date: {
      type: Date,
      required: false,
      default: () => new Date(),
    },

    view: {
      type: String,
      required: false,
      default: 'month',
    },

    day: {
      type: Number,
      required: false,
      default: 7,
    },
  },

  setup() {
    const i18n = useI18n({
      en: {
        'UiCalendar.Today': 'Today',
        'UiCalendar.Month': 'Month',
        'UiCalendar.Week': 'Week',
        'UiCalendar.Schedule': 'Schedule',
        'UiCalendar.Days': 'Days',
      },

      de: {
        'UiCalendar.Today': 'Heute',
        'UiCalendar.Month': 'Monat',
        'UiCalendar.Week': 'Woche',
        'UiCalendar.Schedule': 'Terminübersicht',
        'UiCalendar.Days': 'Tag',
      },

      es: {
        'UiCalendar.Today': 'Hoy',
        'UiCalendar.Month': 'Mes',
        'UiCalendar.Week': 'Semana',
        'UiCalendar.Schedule': 'Agenda',
        'UiCalendar.Days': 'Día',
      },
    })

    return { i18n }
  },

  data() {
    return {
      innerDate: null,
      currentView: this.view,
      currentDay: this.day,
    }
  },

  computed: {
    allMonths() {
      let retval = []
      for (let m = 0; m <= 11; m++) {
        let objDate = new Date()
        objDate.setDate(1)
        objDate.setMonth(m)

        let monthName = ''
        try {
          monthName = objDate.toLocaleString(this.i18n?.baseLanguage?.value || 'en', { month: 'long' })
        } catch {
          monthName = objDate.toLocaleString('en', { month: 'long' })
        }
        retval.push(monthName)
      }
      return retval
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

  methods: {
    setToday() {
      this.innerDate = new Date()
      this.$emit('update:date', this.innerDate)
    },

    setCurrentView(view) {
      this.currentView = view
      this.$emit('update:view', this.currentView)
    },

    setCurrentDay(type) {
      if (type) {
        if (this.currentDay < 30) {
          this.currentDay++
        }
      } else {
        if (this.currentDay > 1) {
          this.currentDay--
        }
      }

      this.$emit('update:day', this.currentDay)
    },

    setMonth(monthNum) {
      // see https://github.com/vuejs/vue/issues/3613
      // and https://stackoverflow.com/questions/55653149/vuejs-reactive-date-object
      this.innerDate.setMonth(monthNum, 1)
      this.innerDate = new Date(this.innerDate)
      this.$emit('update:date', this.innerDate)
    },

    goNext() {
      let counter = 7

      if (this.currentView == 'days') {
        counter = this.currentDay
      }

      if (this.currentView == 'week' || this.currentView == 'days') {
        this.innerDate.setDate(this.innerDate.getDate() + counter)
        this.innerDate = new Date(this.innerDate)
        this.$emit('update:date', this.innerDate)
        return
      }

      this.setMonth(this.innerDate.getMonth() + 1)
    },

    goPrev() {
      let counter = 7

      if (this.currentView == 'days') {
        counter = this.currentDay
      }

      if (this.currentView == 'week' || this.currentView == 'days') {
        this.innerDate.setDate(this.innerDate.getDate() - counter)
        this.innerDate = new Date(this.innerDate)
        this.$emit('update:date', this.innerDate)
        return
      }

      this.setMonth(this.innerDate.getMonth() - 1)
    },
  },
}
</script>

<style lang="scss">
@media screen and (max-width: 599px) {
  .ui-calendar-controls {
    .date-controls {
      width: 100%;
      justify-content: space-between;
      order: 2;
    }
  }
}

.ui-calendar-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;

  user-select: none;

  .date-controls {
    flex: 1;

    display: flex;
    flex-wrap: nowrap;
    align-items: center;
  }

  .month-selector {
    display: flex;
    align-items: center;
    gap: 1em;
  }

  .month-controls {
    justify-content: center;
  }

  .month-controls,
  .counter-days {
    display: flex;
    align-items: center;
    margin: 0 12px;

    & > span {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;

      height: 40px;
      width: 40px;

      border-radius: 4px;
      background-color: transparent;
      color: #666;

      &:hover {
        color: #222;
        background-color: rgba(0, 0, 0, 0.06);
      }
    }
  }
}
</style>