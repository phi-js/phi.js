<template>
  <div class="ui-calendar-schedule">
    <div
      v-for="(day, dk) in days"
      :key="dk"
      class="day-row"
      :class="day.classNames"
      @click="$emit('click-day', day.date)"
    >
      <div class="day-date">
        <span class="day">{{ day.date.getDate() }}</span>
        <span class="month">{{ i18n.d(day.date, { month: 'short' }) }}</span>
        <span class="weekday">{{ i18n.d(day.date, { weekday: 'long' }) }}</span>
      </div>

      <div class="day-contents">
        <div
          v-for="(event, i) in day.events"
          :key="i"
          :class="['day-event', 'ui-calendar-event', event.className]"
          :style="event.style"
          tabindex="0"
          @click="$emit('click-event', event)"
          @keydown.enter.prevent="$emit('click-event', event)"
        >
          <div class="time">
            <span class="start">{{ i18n.time(event.dateStart, { hour: "2-digit", minute: "2-digit" }) }}</span>
            -
            <span class="end">{{ i18n.time(event.dateEnd, { hour: "2-digit", minute: "2-digit" }) }}</span>
          </div>

          <div class="description">
            {{ event.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from '../../../../i18n'

export default {
  name: 'UiCalendarSchedule',

  props: {
    events: {
      type: Array,
      required: false,
      default: () => [],
    },

    date: {
      type: Date,
      required: false,
      default: () => new Date(),
    },

    numDaysBefore: {
      type: Number,
      required: false,
      default: 5,
    },

    numDaysAfter: {
      type: Number,
      required: false,
      default: 30,
    },
  },

  emits: ['click-day', 'click-event'],

  setup() {
    const i18n = useI18n()
    return { i18n }
  },

  computed: {
    days() {
      let retval = []

      let startDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate() - this.numDaysBefore,
      )
      let endDate = new Date(
        this.date.getFullYear(),
        this.date.getMonth(),
        this.date.getDate() + this.numDaysAfter,
      )

      let curDate = startDate
      while (curDate <= endDate) {
        let dayEvents = this.getEventsForDay(curDate)

        let isSelectedDay =
          curDate.getFullYear() === this.date.getFullYear() &&
          curDate.getMonth() === this.date.getMonth() &&
          curDate.getDate() === this.date.getDate()

        let day = {
          date: new Date(curDate.getTime()),
          events: dayEvents,
          classNames: {
            '--selected': isSelectedDay,
            '--today': this.isToday(curDate),
            '--previous': curDate < this.today,
            '--empty': dayEvents.length == 0,
          },
        }

        retval.push(day)
        curDate.setDate(curDate.getDate() + 1)
      }

      return retval
    },

    today() {
      return new Date()
    },
  },

  methods: {
    isToday(date) {
      let today = new Date()

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      )
    },

    // focusWindow() {
    //   let elem = this.$el.querySelector(".--selected");
    //   if (elem) {
    //     elem.scrollIntoView();
    //   }
    // },

    getEventsForDay(date) {
      return this.events.filter((event) => {
        let eventDate = event.dateStart

        return (
          date.getFullYear() == eventDate.getFullYear() &&
          date.getMonth() == eventDate.getMonth() &&
          date.getDate() == eventDate.getDate()
        )
      })
    },
  },

  // mounted() {
  //   this.focusWindow();
  // }
}
</script>

<style lang="scss">
.ui-calendar-schedule {
  .day-row {
    display: flex;
    flex-wrap: nowrap;
    align-items: baseline;

    background-color: #fff;
    border-bottom: 1px solid #ddd;

    .day-date {
      cursor: pointer;

      display: flex;
      align-items: center;

      padding: 10px;
      width: 128px;

      font-size: 0.8em;

      color: #666;

      .day {
        width: 32px;
        height: 32px;

        display: flex;
        align-items: center;
        justify-content: center;

        font-size: 1.3em;
        margin-right: 0.5em;
        border-radius: 100%;

        transition: 0.2s all ease;

        &:hover {
          background-color: #e0e0e0;
        }
      }

      .month,
      .weekday {
        padding: 3px;
      }
    }

    .day-contents {
      flex: 1;
    }

    &.--previous {
      opacity: 0.5;
    }

    &.--today {
      .day {
        color: #fff;
        background-color: var(--ui-color-primary);
      }
    }

    // Ocultar dias vacios
    // &.--empty {
    //     display: none;
    // }
  }

  .day-event {
    cursor: pointer;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    transition: 0.2s all ease;

    .time {
      font-size: 0.8em;
      width: 150px;
    }

    .description {
      flex: 1;
    }

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
  }
}
</style>