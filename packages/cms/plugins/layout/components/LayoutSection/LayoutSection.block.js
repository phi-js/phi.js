export default {
  name: 'LayoutSection',
  title: 'Section',
  icon: 'mdi:view-day',

  block: {
    component: 'LayoutGroup',
    title: 'Section',
    props: {
      style: {
        'padding': '64px 64px 64px 64px',
        'height': '420px',
        'color': '#fff',
        'background-color': 'gray',
        'background-image': 'url(https://picsum.photos/1024/500)',
        'background-repeat': 'no-repeat',
        'background-size': 'cover',
        'background-attachment': 'fixed',
        'background-position': 'center',
      },
    },
    slot: [
      {
        component: 'MediaHtml',
        props: { value: '<h1>Heading</h1>' },
      },
    ],
  },

  staging: false,
}