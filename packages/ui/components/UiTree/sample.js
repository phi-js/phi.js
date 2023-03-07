export default [
  {
    text: 'Item 1',
    subtext: 'Un subtexto',
    color: 'red',
    icon: 'mdi:virus',
    children: [
      {
        text: 'Item 1.1',
        children: [{ text: 'Item 1.1.1' }, { text: 'Item 1.1.2' }, { text: 'Item 1.1.3' }],
      },
      {
        text: 'Item 1.2',
        children: [
          { text: 'Item 1.2.1' },
          {
            text: 'Item 1.2.2',
            children: [
              { text: 'Item 1.2.2.1' },
              { text: 'Item 1.2.2.2' },
              { text: 'Item 1.2.2.3' },
            ],
          },
          { text: 'Item 1.2.3' },
        ],
      },
      {
        text: 'Item 1.3',
        children: [{ text: 'Item 1.3.1' }, { text: 'Item 1.3.2' }, { text: 'Item 1.3.3' }],
      },
    ],
  },
  {
    text: 'Item 2',
    subtext: 'Otro subtexto (sin hijos)',
    color: 'blue',
    icon: 'mdi:vuejs',
  },
  {
    text: 'Item 3',
    subtext: 'Otro subtexto',
    color: 'purple',
    icon: 'mdi:code-json',
    children: [
      { text: 'Item 3.1' },
      {
        text: 'Item 3.2',
        children: [
          { text: 'Item 3.2.1' },
          { text: 'Item 3.2.2' },
          {
            text: 'Item 3.2.3',
            children: [
              { text: 'Item 3.2.3.1', href: 'https://www.google.com' },
              { text: 'Item 3.2.3.2' },
              { text: 'Item 3.2.3.3' },
              { text: 'Item 3.2.3.4' },
              { text: 'Item 3.2.3.5' },
              { text: 'Item 3.2.3.6' },
              { text: 'Item 3.2.3.7' },
            ],
          },
        ],
      },
      { text: 'Item 3.3' },
    ],
  },
  {
    text: 'Academia',
    icon: 'mdi:book',
    children: [
      {
        text: 'Reportes',
        children: [
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
        ],
      },
      {
        text: 'Configuracion',
        children: [
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
        ],
      },
      {
        text: 'Procesos',
        children: [
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
          { text: 'Blalskdjaskldjsakl' },
        ],
      },
    ],
  },
  {
    text: 'Tesoreria',
    icon: 'mdi:book',
    children: [
      {
        text: 'Cobros',
        children: [
          { text: 'Consolidado' },
          { text: 'Por conceptos' },
          { text: 'Anulados' },
          { text: 'Recargos' },
          { text: 'Reporte fiscal' },
        ],
      },
      {
        text: 'Pagos',
        children: [
          { text: 'Consolidado de pagos' },
          { text: 'Pagos sin aplicar' },
          { text: 'Saldos a favor' },
          { text: 'Anular descuentos' },
          { text: 'Pagos anulados' },
          { text: 'Certificados' },
        ],
      },
      {
        text: 'Cartera',
        children: [
          { text: 'Por cursos' },
          { text: 'Por edades' },
          { text: 'Por conceptos' },
          { text: 'Vencida' },
          { text: 'Paz y salvos' },
        ],
      },
      {
        text: 'Reportes contables',
        children: [
          { text: 'Cierre mensual' },
          { text: 'Debitos' },
          { text: 'Creditos' },
          { text: 'Transacciones en línea' },
        ],
      },
    ],
  },
  {
    text: 'Empleados',
    icon: 'mdi:book',
    children: [
      {
        text: 'Reportes',
        children: [
          { text: 'Consolidado' },
          { text: 'Reporte dinamico' },
          { text: 'Tabla' },
        ],
      },
      {
        text: 'Procesos',
        children: [
          { text: 'Agregar colaborador' },
        ],
      },
    ],
  },
]