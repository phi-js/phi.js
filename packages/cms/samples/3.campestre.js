export default {
  component: 'LayoutPage',

  setup: {
    chain: [
      {
        info: {
          text: 'Fetch grading',
          icon: 'mdi:plus-network',
        },
        do: {
          call: 'fetch',
          args: {
            url: 'http://v4.local//v3/jsondb/query',
            options: {
              method: 'POST',
              headers: { authorization: 'Bearer {{token}}' },

              body: {
                from: { entity: 'Phidias\\V3\\Academic\\Grading\\Course\\Entity' },
                match: { student: '{{personId}}', period: '{{periodId}}' },
                properties: ['*', {
                  objCourse: {
                    single: true,
                    from: { entity: 'Phidias\\V3\\Academic\\Course\\Entity' },
                    on: { id: 'course' },
                    properties: ['*', {
                      objSubject: {
                        single: true,
                        from: { entity: 'Phidias\\V3\\Academic\\Subject\\Entity' },
                        on: { id: 'subject' },
                        properties: ['*', {
                          objArea: {
                            single: true,
                            from: { entity: 'Phidias\\V3\\Academic\\Area\\Entity' },
                            on: { id: 'area' },
                            properties: ['*'],
                          },
                        }],
                      },
                    }, {
                      observations: {
                        single: true,
                        from: { entity: 'Phidias\\V3\\Academic\\Course\\Observation\\Entity' },
                        on: { course: 'id' },
                        match: { student: '{{personId}}', period: '{{periodId}}' },
                        properties: ['*', {
                          objAuthor: {
                            single: true,
                            from: { entity: 'Phidias\\V3\\Person\\Entity' },
                            on: { id: 'author' },
                            properties: ['id', 'firstname', 'lastname', 'gender'],
                          },
                        }],
                      },
                    }],
                  },
                }],
              },
            },
          },
        },
        assign: 'grades',
      },
    ],
  },

  slot: [
    {
      component: 'LayoutRow',
      slot: [
        {
          component: 'LayoutColumn',
          slot: [
            {
              component: 'MediaHtml',
              props: { value: '<h1>Reporte de mitad de Trimestre</h1>' },
            },
          ],
        },
      ],
    },

    {
      'v-for': 'grades',
      'component': 'LayoutRow',
      'props': {
        alignItems: 'flex-start',
        style: {
          'border-bottom': '2px dotted #ccc',
          'padding-bottom': '40px',
          'margin-bottom': '40px',
        },
      },
      'slot': [
        {
          component: 'LayoutColumn',
          props: { flex: 1 },
          slot: [
            {
              component: 'MediaHtml',
              props: { value: '<h2 style="margin:0">{{$item.objCourse.objSubject.name}}</h2><p style="margin:0">{{$item.value}}</p>' },
            },
          ],
        },
        {
          component: 'LayoutColumn',
          props: { flex: 3 },
          slot: [
            {
              'component': 'InputSelect',
              'v-model': '$item.cosa',
              'props': {
                type: 'select-buttons',
                options: [
                  {
                    text: 'Cosa 1',
                    value: '1',
                  },
                  {
                    text: 'Cosa 2',
                    value: '2',
                  },
                  {
                    text: 'Cosa 3',
                    value: '3',
                  },
                ],
              },
            },
            {
              'v-if': {
                op: 'eq',
                field: '$item.cosa',
                args: 2,
              },
              'component': 'InputTextarea',
              'v-model': '$item.obs',
              'props': {
                type: 'textarea',
                label: 'Observaciones',
              },
            },
          ],
        },
      ],

    },
  ],
}