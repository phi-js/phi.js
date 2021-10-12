import fetch from './fetch';
import fxWindow from './window';

export default {
  fetch,
  ...fxWindow,

  echo: {
    icon: 'mdi:variable',
    text: 'Asignar'
  },
}