<script setup>
import UiCalendar from './UiCalendar.vue'
</script>

<template>
  <div class="Docs">
    <h1>UiCalendar</h1>
    <code>import { UiCalendar } from '@/packages/ui'</code>
    <p>
      The <strong>UiCalendar</strong> component is a customizable calendar component that can display events in different views such as month, week, days, and schedule. It also includes a set of controls to navigate between different views and dates.
    </p>

    <table>
      <thead>
        <tr>
          <th>Prop</th>
          <th>Description</th>
          <th>Type</th>
          <th>Required</th>
          <th>Default Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>date</td>
          <td>The date selected on the calendar</td>
          <td>Date</td>
          <td>No</td>
          <td>new Date()</td>
        </tr>
        <tr>
          <td>events</td>
          <td>The list of events to display on the calendar</td>
          <td>Array</td>
          <td>No</td>
          <td>[]</td>
        </tr>
        <tr>
          <td>view</td>
          <td>The initial view to display on the calendar</td>
          <td>String</td>
          <td>No</td>
          <td>'month'</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Event</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>update:date</td>
          <td>Event triggered when the date is updated</td>
        </tr>
        <tr>
          <td>update:view</td>
          <td>Event triggered when the current view is updated</td>
        </tr>
        <tr>
          <td>click-day</td>
          <td>Event triggered when a day is clicked on the calendar</td>
        </tr>
        <tr>
          <td>click-event</td>
          <td>Event triggered when an event is clicked on the calendar</td>
        </tr>
      </tbody>
    </table>

    <table>
      <thead>
        <tr>
          <th>Slot</th>
          <th>Description</th>
          <th>Slot bindings</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>default</td>
          <td>Slot to add custom content to the calendar component</td>
          <td>-</td>
        </tr>
      </tbody>
    </table>

    <pre><code>
// Example usage of UiCalendar component
&lt;UiCalendar
:date="new Date()"
:events="events"
&gt;
  &lt;template #controls="{ prev, next, view, date }"&gt;
    &lt;div class="ui-calendar-header"&gt;
      &lt;button @click="prev()"&gt;Prev&lt;/button&gt;
      &lt;span&gt;{ { view }} { { date }}&lt;/span&gt;
      &lt;button @click="next()"&gt;Next&lt;/button&gt;
    &lt;/div&gt;
  &lt;/template&gt;
&lt;/UiCalendar&gt;
</code></pre>


    <UiCalendar :date="new Date()">
      <template #controls="{ prev, next, view, date }">
        <div>
          <button @click="prev()">
            Prev
          </button>
          <span>{{ view }} {{ date }}</span>
          <button @click="next()">
            Next
          </button>
        </div>
      </template>
    </UiCalendar>
  </div>
</template>