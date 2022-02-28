<template>
  <div class="ui-calendar-controls">
    <!-- <input type="text" :value="date" @input="$emit('update:date', $event.target.value)" />
    <input type="text" :value="view" @input="$emit('update:view', $event.target.value)" />-->

    <button type="button" class="UiButton" @click="setToday()">{{ i18n.t('UiCalendar.Today') }}</button>

    <span class="view-selector">
      <select class="UiInput" :value="currentView" @change="setCurrentView($event.target.value)">
        <option value="month">{{ i18n.t('UiCalendar.Month') }}</option>
        <option value="week">{{ i18n.t('UiCalendar.Week') }}</option>
        <option value="schedule">{{ i18n.t('UiCalendar.Schedule') }}</option>
        <option value="days">{{ i18n.t('UiCalendar.Days') }}</option>
      </select>
    </span>

    <span class="counter-days" v-if="currentView == 'days'">
      <span @click="setCurrentDay(0)">
        <ui-icon src="mdi:minus"></ui-icon>
      </span>
      {{ currentDay }}
      <span @click="setCurrentDay(1)">
        <ui-icon src="mdi:plus"></ui-icon>
      </span>
    </span>

    <span class="month-selector">
      <select
        class="UiInput"
        :value="innerDate.getMonth()"
        @change="setMonth($event.target.value)"
      >
        <option v-for="(monthName, i) in allMonths" :key="i" :value="i" v-text="monthName"></option>
      </select>
      <span class="current-year">{{ innerDate.getFullYear() }}</span>
    </span>

    <span class="month-controls">
      <span class="month-prev" @click="goPrev()">
        <ui-icon src="mdi:chevron-left"></ui-icon>
      </span>

      <span class="month-next" @click="goNext()">
        <ui-icon src="mdi:chevron-right"></ui-icon>
      </span>
    </span>
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
import { UiIcon } from '../UiIcon';

export default {
  name: 'ui-calendar-controls',

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

  components: {
    UiIcon,
  },

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

  data() {
    return {
      innerDate: null,
      currentView: this.view,
      currentDay: this.day,
    };
  },

  watch: {
    date: {
      immediate: true,
      handler(newVal) {
        this.innerDate = newVal;
      },
    },
  },

  computed: {
    allMonths() {
      let retval = [];
      for (let m = 0; m <= 11; m++) {
        let objDate = new Date();
        objDate.setDate(1);
        objDate.setMonth(m);
        retval.push(
          objDate.toLocaleString(/*this.$i18n.language*/'en', {
            month: 'long',
          })
        );
      }
      return retval;
    },
  },

  methods: {
    setToday() {
      this.innerDate = new Date();
      this.$emit('update:date', this.innerDate);
    },

    setCurrentView(view) {
      this.currentView = view;
      this.$emit('update:view', this.currentView);
    },

    setCurrentDay(type) {
      if (type) {
        if (this.currentDay < 30) {
          this.currentDay++;
        }
      } else {
        if (this.currentDay > 1) {
          this.currentDay--;
        }
      }

      this.$emit('update:day', this.currentDay);
    },

    setMonth(monthNum) {
      // see https://github.com/vuejs/vue/issues/3613
      // and https://stackoverflow.com/questions/55653149/vuejs-reactive-date-object
      this.innerDate.setMonth(monthNum, 1);
      this.innerDate = new Date(this.innerDate);
      this.$emit('update:date', this.innerDate);
    },

    goNext() {
      let counter = 7;

      if (this.currentView == 'days') {
        counter = this.currentDay;
      }

      if (this.currentView == 'week' || this.currentView == 'days') {
        this.innerDate.setDate(this.innerDate.getDate() + counter);
        this.innerDate = new Date(this.innerDate);
        this.$emit('update:date', this.innerDate);
        return;
      }

      this.setMonth(this.innerDate.getMonth() + 1);
    },

    goPrev() {
      let counter = 7;

      if (this.currentView == 'days') {
        counter = this.currentDay;
      }

      if (this.currentView == 'week' || this.currentView == 'days') {
        this.innerDate.setDate(this.innerDate.getDate() - counter);
        this.innerDate = new Date(this.innerDate);
        this.$emit('update:date', this.innerDate);
        return;
      }

      this.setMonth(this.innerDate.getMonth() - 1);
    },
  }
};
</script>

<style lang="scss">
.ui-calendar-controls {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  background-color: #fff;

  .view-selector {
    margin: 0 12px;
  }

  .month-selector {
    margin: 0 12px 0 0;
    margin-left: auto;
    display: flex;
    align-items: center;

    select {
      margin: 0 12px 0 0;
    }
  }

  .month-controls {
    justify-content: center;
    margin-left: auto;
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

      border-radius: 50%;
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