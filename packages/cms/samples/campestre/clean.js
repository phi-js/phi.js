export default {
  component: 'LayoutPage',
  setup: {
    chain: [
      {
        info: {
          text: 'Fetch students',
          icon: 'mdi:plus-network',
        },
        do: {
          call: 'fetch',
          args: {
            url: '{{baseURL}}/v3/jsondb/query',
            options: {
              method: 'POST',
              headers: { authorization: 'Bearer {{token}}' },
              body: {
                from: { entity: 'Phidias\\V3\\Academic\\Course\\Group\\Inscription\\Entity' },
                match: {
                  group: '{{groupId}}',
                  period: '{{periodId}}',
                },
                properties: [
                  '*',
                  {
                    objPerson: {
                      single: true,
                      on: { id: 'student' },
                      from: { entity: 'Phidias\\Core\\Person\\Entity' },
                      properties: [
                        'id',
                        'firstName',
                        'lastName',
                        'gender',
                        'avatar',
                        {
                          grading: {
                            single: true,
                            from: { entity: 'Phidias\\V3\\Academic\\Grading\\Course\\Entity' },
                            on: { student: 'id' },
                            match: {
                              period: '{{periodId}}',
                              course: '{{courseId}}',
                            },
                            properties: '*',
                          },
                        },
                      ],
                    },
                  },
                  {
                    retroalimentacion: {
                      single: true,
                      from: 'retroalimentacion',
                      on: {
                        personId: 'student',
                        groupId: 'group',
                      },
                      properties: '*',
                    },
                  },
                ],
              },
            },
          },
        },
        assign: 'inscriptions',
      },
      {
        info: { text: 'Sort and parse' },
        do: { eval: '\n          $modelValue.inscriptions.sort((a, b) => a.objPerson.lastName.localeCompare(b.objPerson.lastName));\n          $modelValue.inscriptions.forEach((inscr) => {\n            const val = inscr.objPerson.grading?.value;\n            if (val > 0 && val <= 44.9) {\n              inscr.objPerson.grading.text = \'Bajo\';\n            } else if (val > 44.9 && val <= 59.9) {\n              inscr.objPerson.grading.text = \'Insuficiente\';\n            } else if (val > 59.9 && val <= 74.9) {\n              inscr.objPerson.grading.text = \'Básico\';\n            } else if (val > 74.9 && val <= 89.9) {\n              inscr.objPerson.grading.text = \'Sobresaliente\';\n            } else if (val > 89.9 && val <= 100) {\n              inscr.objPerson.grading.text = \'Excelente\';\n            }\n          })' },
      },
    ],
  },
  slot: [
    {
      component: 'LayoutRow',
      props: {
        style: {
          'padding-bottom': '6px',
          'margin-bottom': '24px',
        },
      },
      slot: [
        {
          component: 'LayoutColumn',
          slot: [
            {
              component: 'MediaHtml',
              props: { value: '<h1>Retroalimentación a padres de familia y estudiantes</h1>' },
            },
          ],
        },
      ],
    },
    {
      'v-for': 'inscriptions',
      'component': 'LayoutRow',
      'props': {
        alignItems: 'flex-start',
        style: {
          'border-bottom': '1px dotted #ccc',
          'padding-bottom': '12px',
          'margin-bottom': '12px',
        },
      },
      'slot': [
        {
          component: 'LayoutColumn',
          props: { flex: 1 },
          slot: [
            {
              component: 'MediaItem',
              props: {
                icon: '{{$item.objPerson.avatar}}',
                text: '{{$item.objPerson.lastName}}, {{$item.objPerson.firstName}}',
                subtext: '{{$item.objPerson.grading.text}}',
              },
            },
            {
              'component': 'InputSelect',
              'v-model': '$item.retroalimentacion.nivel',
              'props': {
                type: 'select-buttons',
                options: [
                  {
                    text: 'Esperado',
                    value: 'esperado',
                  },
                  {
                    text: 'Pendiente',
                    value: 'pendiente',
                  },
                ],
                style: {
                  'position': 'relative',
                  'top': '-24px',
                  'margin-left': '64px',
                },
              },
              'v-on': {
                'update:modelValue': {
                  chain: [
                    {
                      info: {
                        text: 'Save record',
                        icon: 'mdi:window-maximize',
                      },
                      do: {
                        call: 'fetch',
                        args: {
                          url: '{{baseURL}}/v3/jsondb/tables/retroalimentacion?index[]=personId&index[]=groupId',
                          options: {
                            method: 'POST',
                            headers: { authorization: 'Bearer {{token}}' },
                            body: {
                              personId: '{{$item.student}}',
                              groupId: '{{groupId}}',
                              nivel: '{{$item.retroalimentacion.nivel}}',
                              observaciones: '{{$item.retroalimentacion.observaciones}}',
                            },
                          },
                        },
                      },
                      assign: null,
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          component: 'LayoutColumn',
          props: { flex: 3 },
          slot: [
            {
              'v-if': {
                field: '$item.retroalimentacion.nivel',
                op: 'eq',
                args: 'pendiente',
              },
              'component': 'InputTextarea',
              'v-model': '$item.retroalimentacion.observaciones',
              'props': {
                type: 'textarea',
                label: 'Estrategias para consolidación',
              },
              'v-on': {
                'update:modelValue': {
                  chain: [
                    {
                      do: true,
                      assign: '$item.dirty',
                    },
                  ],
                },
              },
            },
            {
              'v-if': {
                field: '$item.retroalimentacion.nivel',
                op: 'eq',
                args: 'pendiente',
              },
              'component': 'InputButton',
              'props': {
                type: 'button',
                label: {
                  if: '{{$item.dirty}}',
                  then: 'Guardar',
                  else: 'Cambios guardados',
                },
                disabled: { not: '{{$item.dirty}}' },
              },
              'v-on': {
                click: {
                  chain: [
                    {
                      info: {
                        text: 'Save record',
                        icon: 'mdi:window-maximize',
                      },
                      do: {
                        call: 'fetch',
                        args: {
                          url: '{{baseURL}}/v3/jsondb/tables/retroalimentacion?index[]=personId&index[]=groupId',
                          options: {
                            method: 'POST',
                            headers: { authorization: 'Bearer {{token}}' },
                            body: {
                              personId: '{{$item.student}}',
                              groupId: '{{groupId}}',
                              nivel: '{{$item.retroalimentacion.nivel}}',
                              observaciones: '{{$item.retroalimentacion.observaciones}}',
                            },
                          },
                        },
                      },
                      assign: null,
                    },
                    {
                      do: false,
                      assign: '$item.dirty',
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  ],
}