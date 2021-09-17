export default [
  {
    id: 'building',
    text: 'En proceso',
    icon: 'mdi:file-edit-outline',

    validTargetIds: ['pendiente'],
  },
  {
    id: 'pendiente',
    text: 'Por revisar',
    icon: 'mdi:file-clock-outline',
    color: 'var(--ui-color-warning)',

    validTargetIds: ['aprobado', 'corrigiendo'],
  },
  {
    id: 'aprobado',
    text: 'Aprobado',
    icon: 'mdi:file-check-outline',
    color: 'var(--ui-color-success)',

    validTargetIds: ['corrigiendo'],
    managerOnly: true,
  },
  // {
  //   id: 'rechazado',
  //   text: 'Rechazado',
  //   icon: 'mdi:file-cancel',
  //   color: 'var(--ui-color-danger)',

  //   validTargetIds: ['pendiente'],
  //   managerOnly: true,
  // },
  {
    id: 'corrigiendo',
    text: 'En correcciones',
    icon: 'mdi:file-cancel',
    color: 'var(--ui-color-danger)',

    validTargetIds: ['pendiente'],
    managerOnly: true,
  },
]