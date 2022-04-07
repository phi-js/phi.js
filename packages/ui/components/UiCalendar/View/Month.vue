<template>
  <table
    class="ui-calendar-month"
    cellspacing="0"
    cellpadding="0"
  >
    <thead>
      <tr>
        <td
          v-for="(day, dk) in weeks[0].days"
          :key="dk"
          valign="top"
        >
          {{ i18n.d(day.date, { weekday: 'short' }) }}
        </td>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(week, k) in weeks"
        :key="k"
      >
        <td
          v-for="(day, dk) in week.days"
          :key="dk"
          valign="top"
          :class="['ui-calendar-day', day.classnames]"
          @click="clickDay(day)"
        >
          <div class="ui-calendar-day-header">
            <!-- <span class="label-weekday">{{ i18n.d(day.date, { weekday: 'long' }) }}</span> -->
            <span class="label-month">{{ i18n.d(day.date, { month: 'short' }) }}</span>
            <span class="label-day">{{ day.date.getDate() }}</span>
          </div>

          <div class="ui-calendar-day-contents">
            <slot :name="day.key">
              <slot
                name="day"
                :events="dayEvents[day.key]"
              >
                <ul
                  v-if="dayEvents[day.key]"
                  class="ui-calendar-event-list"
                >
                  <li
                    v-for="(event, i) in dayEvents[day.key]"
                    :key="i"
                    :class="['UiCalendarEvent', 'ui-calendar-event', event.className]"
                    :style="[{ backgroundColor: event.color }, event.style]"
                    @click.stop="clickEvent(event)"
                  >
                    <span class="UiCalendarEvent__title event-title">{{ event.title }}</span>
                  </li>
                </ul>
              </slot>
            </slot>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { useI18n } from '../../../../i18n'

export default {
  name: 'UiCalendarMonth',

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

    startDay: {
      type: Number,
      required: false,
      default: 1,
    },

    onDayRender: {
      type: Function,
      required: false,
      default: null,
    },
  },

  emits: ['click-day', 'click-event', 'update:visibleDateRange'],

  setup() {
    const i18n = useI18n()
    return { i18n }
  },

  computed: {
    visibleDateRange() {
      let nWeeks = 6

      // obtener el startDay mas cercano a this.date
      let startDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1,
      )
      let offset = startDate.getDay() - this.startDay
      if (offset < 0) {
        offset = 7 + offset
      }
      startDate.setDate(startDate.getDate() - offset)

      // obtener el ultimo dia visible en la vista
      let endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + nWeeks * 7)

      return [startDate, endDate]
    },

    weeks() {
      let retval = []
      let nWeeks = 6

      // obtener el startDay mas cercano a this.date
      let startDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        1,
      )
      let offset = startDate.getDay() - this.startDay
      if (offset < 0) {
        offset = 7 + offset
      }
      startDate.setDate(startDate.getDate() - offset)

      let curDate = startDate
      for (let week = 1; week <= nWeeks; week++) {
        let objWeek = { days: [] }

        for (let dayN = 0; dayN <= 6; dayN++) {
          let day = {
            date: new Date(curDate.getTime()),
            timestamp: parseInt(curDate.getTime() / 1000),
            key: this.getKey(curDate),
            classnames: [
              {
                'today': this.isToday(curDate),
                'other-month': curDate.getMonth() != this.date.getMonth(),
                'first-of-month': curDate.getDate() == 1,
                'first-row': week == 1,
                'first-of-table': week == 1 && dayN == 0,
              },
            ],
          }

          if (this.onDayRender) {
            let rendered = this.onDayRender(day)
            // day = Object.assign(day, rendered, {classnames: day.classnames.concat(rendered.classnames)});
            day = Object.assign(day, rendered)
          }

          if (typeof this.dayEvents[day.key] != 'undefined') {
            day.classnames.push(this.dayEvents[day.key].map((e) => e.dayClassName))
          }

          objWeek.days.push(day)
          curDate.setDate(curDate.getDate() + 1)
        }

        retval.push(objWeek)
      }

      return retval
    },

    dayEvents() {
      let retval = {}

      let defaultEventProperties = {}

      this.events.forEach((event) => {
        let date = event.dateStart
        let key = this.getKey(date)
        let targetEvent = Object.assign({}, defaultEventProperties, event)

        if (typeof retval[key] == 'undefined') {
          retval[key] = []
        }
        retval[key].push(targetEvent)
      })

      // Ordenar por fecha
      for (let key in retval) {
        retval[key].sort((a, b) => {
          //a is less than b by some ordering criterion
          if (a.dateStart < b.dateStart) {
            return -1
          }
          // a is greater than b by the ordering criterion
          if (a.dateStart > b.dateStart) {
            return 1
          }
          // a must be equal to b
          return 0
        })
      }

      return retval
    },
  },

  watch: {
    date: {
      immediate: true,
      handler() {
        this.$emit('update:visibleDateRange', this.visibleDateRange)
      },
    },
  },

  methods: {
    clickDay(day) {
      this.$emit('click-day', day.date)
    },

    clickEvent(event) {
      this.$emit('click-event', event)
    },

    getKey(date) {
      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
    },

    isToday(date) {
      let today = new Date()

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      )
    },
  },
}
</script>

<style lang="scss">
.ui-calendar-month {
  // <table>
  & {
    border-collapse: collapse;

    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;

    tbody td {
      width: 14.2%;
      height: 16.66%;
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    thead {
      td {
        padding-bottom: 4px;
        font-weight: bold;
        font-size: 0.8em;
        text-align: center;
      }
    }
  }

  .ui-calendar-event-list {
    list-style: none;
    margin: 0;
    padding: 0;

    .ui-calendar-event {
      border-radius: 3px;
      font-size: 11px;
      padding: 2px 6px;

      color: #666;

      // Los estilos del evento deben venir de afuera siempre
      // background-color: rgba(255, 255, 255, 0.2);
    }
  }

  .ui-calendar-day {
    position: relative;

    .ui-calendar-day-header {
      text-align: center;
      font-size: 0.8em;

      .label-weekday {
        display: none;
      }

      .label-month {
        display: none;
      }
    }

    .ui-calendar-day-contents {
      min-height: 32px;
      padding: 4px 8px;
    }

    &.today {
      .label-day {
        display: inline-block;
        justify-content: center;
        align-items: center;
        font-size: 0.8em;
        padding: 3px;

        border-radius: 50%;
        background-color: var(--ui-color-primary);
        color: #fff;
      }
    }

    &.first-of-month {
      .label-month {
        display: inline;
      }
    }

    &.first-of-table {
      .label-month {
        display: inline;
      }
    }

    &.first-row {
      .label-weekday {
        display: block;
      }
    }

    &.other-month {
      background-color: transparent;

      .ui-calendar-day-contents,
      .label-month,
      .label-day {
        opacity: 0.4;
      }
    }
  }
}
</style>