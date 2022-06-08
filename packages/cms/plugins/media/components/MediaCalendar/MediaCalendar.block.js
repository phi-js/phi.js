import { UiCalendar, UiForm } from '../../../../../ui/components'

export default {
  tags: ['embed'],
  name: 'MediaCalendar',
  title: 'Calendario',
  icon: 'mdi:calendar',

  block: {
    'component': UiCalendar,
    'props': { events: [] },
    'v-model:date': '',
    'v-model:view': '',
  },

  emits: [
    {
      event: 'click-event',
      text: 'Event is clicked',
    },
    {
      event: 'click-day',
      text: 'Day is clicked',
    },
  ],

  editor: {
    actions: [
      {
        'title': 'Variables',
        'icon': 'mdi:variable',
        'component': UiForm,
        'v-model': 'block',
        'props': {
          fields: [
            {
              model: 'v-model:events',
              type: 'text',
              label: 'Eventos',
            },
            {
              model: 'v-model:date',
              type: 'text',
              label: 'Fecha',
            },
            {
              model: 'v-model:view',
              type: 'text',
              label: 'Vista actual',
            },
          ],
        },
      },
    ],
  },
}