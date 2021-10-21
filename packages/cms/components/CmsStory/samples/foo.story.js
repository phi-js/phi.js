export default {
  nodes: [
    {
      id: 'home',

      card: { text: 'Inicio' },

      page: {
        id: 'home',
        blocks: [
          {
            component: 'MediaHtml',
            props: { value: '<h1>Hola {{persona.firstName}}!</h1>' },
          },
          {
            'component': 'InputSelect',
            'v-model': 'temas',
            'props': {
              label: 'Selecciona los temas que te interesan',
              type: 'select-list',
              multiple: true,
              options: [
                {
                  text: 'Matemáticas',
                  value: 'temaMat',
                },
                {
                  text: 'Lenguaje',
                  value: 'temaLen',
                },
                {
                  text: 'Biología',
                  value: 'temaBio',
                },
                {
                  text: 'Química',
                  value: 'temaQui',
                },
                {
                  text: 'Física',
                  value: 'temaFis',
                },
              ],
            },
          },
          {
            'component': 'MediaHtml',
            'props': { value: '<p>Elige al menos un tema</p>' },
            'v-if': {
              field: 'temas.length',
              op: 'eq',
              args: 0,
            },
          },
          {
            'component': 'StoryNavigation',
            'v-if': {
              field: 'temas.length',
              op: 'gte',
              args: 1,
            },
          },
        ],
      },
    },
    {
      'id': 'temaMat',

      'card': { text: 'Matemáticas' },

      'v-if': {
        or: [
          {
            op: 'hasAny',
            field: 'temas',
            args: ['temaMat'],
          },
        ],
      },

      'page': {
        id: 'temaMat',
        blocks: [
          {
            component: 'MediaHtml',
            props: { value: '<h1>Matemáticas</h1>' },
            layout: {
              row: 0,
              column: 0,
              order: 0,
            },
          },
          {
            component: 'MediaHtml',
            title: 'Text',
            props: { value: '<p>In elementary algebra, the quadratic formula is a formula that provides the solution(s) to a quadratic equation. There are other ways of solving a quadratic equation instead of using the quadratic formula, such as factoring (direct factoring, grouping, AC method), completing the square, graphing and others.</p><p>Given a general quadratic equation of the form&nbsp;</p>' },
            layout: {
              row: 0,
              column: 0,
              order: 2,
            },
          },
          {
            component: 'MediaMath',
            props: { value: '{\\displaystyle ax^{2}+bx+c=0}' },
            layout: {
              row: 0,
              column: 0,
              order: 3,
            },
          },
          {
            component: 'MediaHtml',
            title: 'Text',
            props: { value: '<p>with x representing an unknown, a, b and c representing constants with a ≠ 0, the quadratic formula is:</p>' },
            layout: {
              row: 0,
              column: 0,
              order: 4,
            },
          },
          {
            component: 'MediaMath',
            props: { value: '{\\displaystyle x={\\frac {-b\\pm {\\sqrt {b^{2}-4ac}}}{2a}}\\ \\ }' },
            layout: {
              row: 0,
              column: 0,
              order: 5,
            },
          },

          { component: 'StoryNavigation' },
        ],
      },
    },
    {
      'target': 'dialog',
      'card': { text: 'Lenguaje' },
      'id': 'temaLen',
      'v-if': {
        op: 'hasAny',
        field: 'temas',
        args: ['temaLen'],
      },
      'page': {
        id: 'temaLen',
        blocks: [
          {
            component: 'MediaHtml',
            props: { value: '<h1>Lenguaje</h1>' },
          },
          {
            'component': 'CmsQuizRae',
            'v-on': {
              success: {
                do: [
                  {
                    'action': 'assign',
                    'v-model': 'temaLenOk',
                    'arguments': true,
                  },
                ],
              },
            },
            'validation': [
              {
                text: 'Debes acertar al menos una',
                rule: { temaLenOk: { '&eq': true } },
              },
            ],
          },
          {
            'component': 'InputButton',
            'v-model': 'input',
            'props': {
              type: 'button',
              label: 'Saltar',
              theme: 'ui-button --cancel',
            },
            'v-on': {
              click: {
                if: null,
                do: [
                  {
                    'action': 'assign',
                    'arguments': true,
                    'v-model': 'temaLenOk',
                  },
                ],
                else: [],
                then: [],
              },
            },
          },

          { component: 'StoryNavigation' },
        ],
      },
    },
    {
      'card': { text: 'Biología' },
      'id': 'temaBio',
      'v-if': {
        op: 'hasAny',
        field: 'temas',
        args: ['temaBio'],
      },
      'page': {
        id: 'temaBio',
        blocks: [
          {
            component: 'MediaHtml',
            props: { value: '<h1>Biología</h1>' },
          },
          {
            'component': 'CmsQuizTable',
            'props': {
              questions: [
                {
                  label: 'Pieza que cierra por la parte superior cajas o recipientes',
                  answer: 'TAPA',
                },
                {
                  label: 'Representación geográfica de la Tierra o parte de ella en una superficie plana',
                  answer: 'MAPA',
                },
                {
                  label: 'Utensilio de limpieza compuesto por un palo largo y un conjunto de hilos o tiras en uno de sus extremos, que sirve para sacar brillo a los suelos',
                  answer: 'MOPA',
                },
                {
                  label: 'Gusta, resulta agradable o estupendo',
                  answer: 'MOLA',
                },
                {
                  label: 'Cosa muy pesada y voluminosa',
                  answer: 'MOLE',
                },
              ],
            },
            'v-on': {
              success: {
                do: [
                  {
                    'action': 'assign',
                    'v-model': 'temaBioOk',
                    'arguments': true,
                  },
                ],
              },
            },
          },
          {
            'component': 'InputButton',
            'v-model': 'input',
            'props': {
              type: 'button',
              label: 'Me rindo',
              theme: 'ui-button --cancel',
            },
            'v-on': {
              click: {
                if: null,
                do: [
                  {
                    'action': 'assign',
                    'arguments': true,
                    'v-model': 'temaBioOk',
                  },
                ],
                else: [],
                then: [],
              },
            },
          },

          { component: 'StoryNavigation' },
        ],
        validation: [
          {
            text: 'Debes completar la prueba',
            rule: { temaBioOk: { '&eq': true } },
          },
        ],
      },
    },
    {
      'card': { text: 'Química' },
      'id': 'temaQui',
      'v-if': {
        op: 'hasAny',
        field: 'temas',
        args: ['temaQui'],
      },
      'page': {
        id: 'temaQui',
        blocks: [
          {
            component: 'MediaHtml',
            props: { value: '<h1>Química</h1>' },
          },

          { component: 'StoryNavigation' },
        ],
      },
    },
    {
      'card': { text: 'Física' },
      'id': 'temaFis',
      'v-if': {
        op: 'hasAny',
        field: 'temas',
        args: ['temaFis'],
      },
      'page': {
        id: 'temaFis',
        blocks: [
          {
            component: 'MediaHtml',
            props: { value: '<h1>Física</h1>' },
          },
          { component: 'StoryNavigation' },
        ],
      },
    },
    {
      card: { text: 'resumen' },
      id: 'resumen',
      page: {
        id: 'resumen',
        blocks: [
          {
            component: 'MediaHtml',
            props: { value: '<h1>Resumen</h1>' },
          },
          { component: 'StoryNavigation' },
        ],
      },
    },
    {
      'card': { text: 'secret' },
      'id': 'secret',
      'v-if': {
        op: 'eq',
        field: 'temas',
        args: ['temaMat', 'temaLen'],
      },
      'page': {
        id: 'secret',
        blocks: [
          {
            component: 'MediaHtml',
            props: { value: '<h1>Llegaste a la puerta secreta :)</h1>' },
          },
          // { component: 'StoryNavigation' },
        ],
      },
    },
  ],
  paths: [
    {
      card: { text: 'Ir a Matemáticas' },
      from: 'home',
      to: 'temaMat',
      transition: {
        leave: 'slideToLeft',
        enter: 'slideFromRight',
      },
    },
    {
      card: { text: 'Continuar a Lenguaje' },
      from: 'temaMat',
      to: 'temaLen',
      transition: {
        leave: 'animated bounceOutUp',
        enter: 'animated bounceInUp',
      },
    },
    {
      card: { text: 'Biología' },
      from: 'temaLen',
      to: 'temaBio',
      transition: {
        leave: 'animated zoomOut',
        enter: 'animated zoomIn',
      },
    },
    {
      card: { text: 'Química' },
      from: 'temaBio',
      to: 'temaQui',
    },
    {
      card: { text: 'Física' },
      from: 'temaQui',
      to: 'temaFis',
    },
    {
      card: { text: 'Ver resumen' },
      from: 'temaFis',
      to: 'resumen',
    },
    {
      card: { text: 'Ves una grieta...' },
      from: 'resumen',
      to: 'secret',
    },
  ],
  props: {
    personId: {
      type: 'string',
      required: true,
    },
  },
}