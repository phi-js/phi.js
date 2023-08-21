<template>
  <div class="ui-calendar-view-days">
    <!-- Fila (encabezado) conteniendo los GMTs y Titulos de los dias -->
    <div class="row row-day-names">
      <div
        v-for="(tz, i) in innerTimezones"
        :key="i"
        class="column column-timezone"
      >
        {{ tz.label }}
      </div>

      <div
        v-for="day in visibleDays"
        :key="day.key"
        :class="['column column-day-name ui-calendar-day', day.classnames]"
        @click="clickDay(day)"
      >
        <span class="label-weekday">{{ i18n.d(day.date, { weekday: 'short' }) }}</span>
        <span class="label-day">{{ day.date.getDate() }}</span>
        <span class="label-month">{{ i18n.d(day.date, { month: 'short' }) }}</span>
      </div>
    </div>

    <!-- Fila 2: Listas de eventos que ocurren todo el dia -->
    <div class="row row-header">
      <div
        v-for="(tz, i) in innerTimezones"
        :key="i"
        class="column column-timezone"
      />

      <div
        v-for="day in visibleDays"
        :key="day.key"
        class="day-slot-header column"
      >
        <div
          v-for="event in day.eventsAllDay"
          :key="event.key"
          class="UiCalendarEvent UiCalendarEvent--allDay"
          :class="[`UiCalendarEvent--id-${event.id}`, event.className]"
          :style="event.style"
          tabindex="0"
          @keydown.enter="clickEvent(event)"
          @click="clickEvent(event)"
        >
          <span class="UiCalendarEvent__title">{{ event.title }}</span>
        </div>
      </div>
    </div>

    <!-- Fila 3: Columnas prinicpales con los eventos de cada dia -->
    <div class="row row-grid">
      <div
        v-for="(tz, i) in innerTimezones"
        :key="i"
        class="column column-timezone"
      >
        <div
          v-for="(timeSlot, k) in timeSlots"
          :key="i+'_'+k"
          class="slot hour-slot"
          :style="timeSlotStyle"
        >
          <span class="hour-label">{{ getHourLabel(timeSlot, tz) }}</span>
        </div>
      </div>

      <div
        v-for="day in visibleDays"
        :key="day.key"
        class="column column-day"
      >
        <!-- divs para cada evento de este dia -->
        <div class="events-container">
          <div
            v-for="event in day.events"
            :key="event.key"
            :class="[
              'UiCalendarEvent',
              `UiCalendarEvent--id-${event.id}`,
              event.className,
              event._siblings > 1 ? '--siblings' : null
            ]"
            :style="event.style"
            :title="event.title"
            tabindex="0"
            @click="clickEvent(event)"
            @keydown.enter="clickEvent(event)"
          >
            <span class="UiCalendarEvent__title">{{ event.title }}</span>
            <span class="UiCalendarEvent__time">
              {{ i18n.time(event.dateStart, { hour: "2-digit", minute: "2-digit" }) }}
              -
              {{ i18n.time(event.dateEnd, { hour: "2-digit", minute: "2-digit" }) }}
            </span>
          </div>
        </div>

        <!-- slots de hora (para dibujar el grid) -->
        <div
          v-for="(timeSlot, i) in timeSlots"
          :key="i"
          class="slot hour-slot"
          :style="timeSlotStyle"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useI18n } from '../../../../i18n'

export default {
  name: 'UiCalendarWeek',

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
      default: 1, // 1 - monday
    },

    view: {
      type: String,
      required: false,
      default: 'week',
    },

    nDays: {
      type: [Number, String],
      required: false,
      default: 7, // Numero de dias a mostrar
    },

    timezones: {
      type: Array,
      required: false,
      default: () => [],
    },

    hourMin: {
      type: [String, Number], // 0 - 23  UTC
      required: false,
      // default: '0',
      default: '7',
    },

    hourMax: {
      type: [String, Number], // 0 - 23  UTC
      required: false,
      default: '20',
    },

    // Para timezones: tamaño de cada slot (en minutos)
    slotSize: {
      type: [String, Number],
      required: false,
      default: 60,
    },

    // Para timezones: alto de cada slot (en pixeles)
    slotHeight: {
      type: [String, Number],
      required: false,
      default: 40,
    },
  },

  emits: ['click-day', 'click-event'],

  setup() {
    const i18n = useI18n()
    return { i18n }
  },

  computed: {
    innerTimezones() {
      if (this.timezones?.length) {
        return this.timezones
      }

      return [
        // {
        //   label: 'es',
        //   offset: '+0200',
        // },
        {
          label: 'co',
          offset: '-0500', // offset debe estar en formato +0000,
          useAm: true,
        },
        // {
        //   label: 'otro',
        //   offset: '+0800',
        //   useAm: true,
        // },
      ]
    },

    /*
    Data una hora inicial (UTC)
    y una hora final (UTC)

    timeSlots contiene el arreglo de todas los bloques de una hora
    */
    timeSlots() {
      let retval = []

      let startHour = Math.max(0, parseInt(this.hourMin))
      let endHour = Math.max(startHour, parseInt(this.hourMax))

      for (let curHour = startHour; curHour <= endHour; curHour++) {
        let nextHour = curHour + 1
        retval.push({
          start: (curHour < 10 ? '0' : '') + `${curHour}:00`,
          end: (nextHour < 10 ? '0' : '') + `${nextHour}:00`,
        })
      }

      return retval
    },

    timeSlotStyle() {
      return { height: this.slotHeight + 'px' }
    },

    /*
    HashEvents es un objeto cuyo KEY es un String representando el dia día (dd-mm-yyyy) y cuyo valor
    es el arreglo de eventos que ocurren en ese día
    {
      '07-07-2020': [
        ... todos los eventos de 07-07-2020
      ]
    }
    */
    hashEvents() {
      let minuteSize = this.slotHeight / this.slotSize // tamaño de un minuto en pixeles

      let firstSlot = this.timeSlots[0]
      let parts = firstSlot.start.split(':')
      let slotStartMinute = parseInt(parts[0]) * 60 + parseInt(parts[1])

      let retval = {}
      for (let i = 0; i < this.events.length; i++) {
        let eventStart = this.events[i].dateStart
        let eventEnd = this.events[i].dateEnd
        let eventKey = this.getKey(eventStart)

        if (typeof retval[eventKey] == 'undefined') {
          retval[eventKey] = []
        }

        let eventStartMinute =
          eventStart.getUTCHours() * 60 + eventStart.getUTCMinutes()

        let eventEndMinute = eventEnd
          ? eventEnd.getUTCHours() * 60 + eventEnd.getUTCMinutes()
          : eventStartMinute + 60

        let event = Object.assign({}, this.events[i], {
          key: this.events[i].id,
          style: {
            ...this.events[i].style,
            top:
              Math.max(eventStartMinute - slotStartMinute, 0) * minuteSize +
              'px',
            height: (eventEndMinute - eventStartMinute) * minuteSize
              ? (eventEndMinute - eventStartMinute) * minuteSize + 'px'
              : 'auto',
            zIndex: eventStartMinute,
            backgroundColor: this.events[i].color,
          },

          _startMinute: eventStartMinute,
          _endMinute: eventEndMinute,
          _siblings: 0,
          _order: 0,
        })

        retval[eventKey].push(event)
      }

      /*
      Para cada evento, contar los hermanos y establecer el orden
      Un hermano es todo evento cuya primera hora se intersecta contra su primera hora
      */
      for (let eventKey in retval) {
        let events = retval[eventKey]

        events.forEach((event) => {
          let siblings = events.filter((e) => {
            return (
              // e._endMinute >= event._startMinute &&
              // e._startMinute <= event._endMinute
              e._startMinute + 60 > event._startMinute &&
              e._startMinute < event._startMinute + 60
            )
          })

          event._siblings = siblings.length

          let order = 1
          siblings.forEach((sibling) => {
            if (!sibling._order) {
              sibling._order = order++
            }
          })
        })

        events.forEach((event) => {
          event.style.width = Math.floor(100 / event._siblings) + '%'
          event.style.left =
            (event._order - 1) * Math.floor(100 / event._siblings) + '%'
        })
      }

      return retval
    },

    visibleDays() {
      /*
        key: '08-07-2020',
        date: new Date('2020-07-08T00:00:00+00:00'),
        event: [] ?
        eventsAllDay: [] ?
      */

      let retval = []
      let startDay = new Date(this.date)

      if (this.view == 'week') {
        let offset = startDay.getDay() - this.startDay
        if (offset < 0) {
          offset = 7 + offset
        }
        startDay.setDate(startDay.getDate() - offset)
      }

      let curDay = startDay
      for (let dayN = 0; dayN < this.nDays; dayN++) {
        let dayKey = this.getKey(curDay)
        let dayEvents = this.hashEvents[dayKey]

        let day = {
          date: new Date(curDay),
          timestamp: parseInt(curDay.getTime() / 1000),
          key: dayKey,
          classnames: [
            {
              'today': this.isToday(curDay),
              'other-month': curDay.getMonth() != this.date.getMonth(),
              'first-of-month': curDay.getDate() == 1,
            },
          ],

          events: dayEvents ? dayEvents.filter((e) => !e.isAllDay) : [],
          eventsAllDay: dayEvents ? dayEvents.filter((e) => e.isAllDay) : [],
        }

        retval.push(day)
        curDay.setDate(curDay.getDate() + 1)
      }

      return retval
    },
  },

  methods: {
    /*
    hour: hora en format 00:00 (mm:ss) se asume que es UTC
    timezone: objeto timezone {label: 'es', offset: '+0000' (+HHMM)}
    */
    getHourLabel(timeSlot, timezone) {
      let utcHour = timeSlot.start
      let utcParts = utcHour.split(':')
      let utcMinutes = parseInt(utcParts[0]) * 60 + parseInt(utcParts[1])

      let offset = timezone.offset
      let offsetMinutes =
        parseInt(offset.substring(1, 3)) * 60 +
        parseInt(offset.substring(3, 5))

      if (offset[0] == '-') {
        offsetMinutes *= -1
      }

      let localMinutes = utcMinutes + offsetMinutes

      if (localMinutes < 0) {
        localMinutes = 24 * 60 + localMinutes
      }

      let localHour = Math.floor(localMinutes / 60)
      let localMinute = localMinutes - localHour * 60

      // formato am/pm (1 pm - 3 pm)
      let hour = localHour % 12
      if (hour == 0) {
        hour = 12
      }

      return timezone.useAm
        ? hour + ' ' + (localHour >= 12 ? 'pm' : 'am')
        : String(localHour).padStart(2, '0') +
        ':' +
        String(localMinute).padStart(2, '0')
    },

    clickDay(day) {
      this.$emit('click-day', day.date)
    },

    clickEvent(event) {
      this.$emit('click-event', event)
    },

    getKey(date) {
      return (
        date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
      )
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
.ui-calendar-view-days {
  background: #fff;

  .row {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    .column {
      flex: 1;
      align-self: stretch;
    }

    .column-time {
      flex: none;
      width: 80px;
    }

    .column-day {
      position: relative;
      border-left: 1px solid rgba(0, 0, 0, 0.1);

      .events-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }

      .UiCalendarEvent {
        position: absolute;
        overflow: hidden;
        text-overflow: ellipsis;

        &.--siblings:hover {
          opacity: 0.95;
          z-index: 9999 !important;
        }
      }
    }
  }

  .column-time {
    font-size: 12px;
    color: #777;
  }

  .slot {
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
  }

  .column-timezone {
    max-width: 60px;
    text-align: center;

    font-size: 11px;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.5);
  }

  .column-day-name {
    flex: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    .label-weekday {
      font-size: 14px;
    }

    .label-month {
      display: none;

      opacity: 0.5;
      font-size: 11px;
      font-weight: bold;
    }

    .label-day {
      display: inline-block;
      width: 26px;
      height: 26px;
      cursor: pointer;
      font-size: 18px;
      line-height: 25px;
      font-weight: bold;
      text-align: center;

      &:hover {
        background: #e0e0e0;
      }
    }

    &.today {
      .label-day {
        font-size: 0.9em;
        border-radius: 50%;
        background-color: var(--ui-color-primary);
        color: #fff;
      }
    }
  }

  .hour-slot {
    text-align: center;
    white-space: nowrap;

    &:first-child {
      opacity: 0;
    }

    .hour-label {
      display: inline-block;
      position: relative;
      top: -11px;
      background-color: #fff;
      padding: 2px 12px;
    }
  }
}
</style>