export default {
  title: 'My Story',
  pages: [
    {
      id: 'start',
      component: 'LayoutPage',
      slot: [
        {
          component: 'MediaHtml',
          props: { value: '<h1>Page one</h1><p>Hello world!</p><p>things: {{things}}</p><p>arrThings: {{arrThings}}</p><p>person.name: {{person.name}}</p><p>person_name: {{person_name}}</p>' },
        },
      ],
    },
  ],
}