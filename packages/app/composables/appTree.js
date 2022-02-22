import { reactive } from 'vue'

const tree = reactive({
  tabs: [
    {
      id: 'admin',
      text: 'Administración',
      icon: 'mdi:school',
      isActive: true,
      isClosable: false,
      menu: [
        {
          text: 'Inicio',
          icon: 'mdi:home',
          href: '#/home'
        },
        {
          text: 'Book',
          icon: 'mdi:book-open-variant',
          children: [
            {
              text: 'Page 1',
              icon: 'mdi:file',
              href: '#/book/1'
            },
            {
              text: 'Page 2',
              icon: 'mdi:file',
              href: '#/book/2'
            },
            {
              text: 'Page 3',
              icon: 'mdi:file',
              href: '#/book/3'
            },
          ]
        },
      ]
    },

    {
      id: 'person:1',
      text: 'Hugo Perez',
      icon: 'mdi:account',
      isActive: false,
      isClosable: false,
      menu: [
        {
          text: 'Inicio',
          icon: 'mdi:home',
          href: '#/person/1'
        },
        {
          text: 'Comunicación',
          icon: 'mdi:email-open',
          children: [
            {
              text: 'Entrada',
              icon: 'mdi:inbox',
              href: '#/person/1/inbox'
            },
            {
              text: 'Redactar',
              icon: 'mdi:email-plus',
              href: '#/compose'
            },
            {
              text: 'Papelera',
              icon: 'mdi:delete',
              href: '#/person/1/mail/trash'
            },
          ]
        }
      ]
    },

    {
      id: 'person:2',
      text: 'Paco Perez',
      icon: 'mdi:account',
      isActive: false,
      isClosable: false,
      menu: [
        {
          text: 'Inicio',
          icon: 'mdi:home',
          href: '#/person/2'
        },
        {
          text: 'Comunicación',
          icon: 'mdi:email-open',
          children: [
            {
              text: 'Entrada',
              icon: 'mdi:inbox',
              href: '#/person/2/inbox'
            },
            {
              text: 'Redactar',
              icon: 'mdi:email-plus',
              href: '#/compose'
            },
            {
              text: 'Papelera',
              icon: 'mdi:delete',
              href: '#/person/2/mail/trash'
            },
          ]
        }
      ]
    },

    {
      id: 'person:3',
      text: 'Luis Perez',
      icon: 'mdi:account',
      isActive: false,
      isClosable: false,
      menu: [
        {
          text: 'Inicio',
          icon: 'mdi:home',
          href: '#/person/3'
        },
        {
          text: 'Comunicación',
          icon: 'mdi:email-open',
          children: [
            {
              text: 'Entrada',
              icon: 'mdi:inbox',
              href: '#/person/3/inbox'
            },
            {
              text: 'Redactar',
              icon: 'mdi:email-plus',
              href: '#/compose'
            },
            {
              text: 'Papelera',
              icon: 'mdi:delete',
              href: '#/person/3/mail/trash'
            },
          ]
        }
      ]
    },
  ]
})

for (let i = 1; i <= 10; i++) {
  tree.tabs.push({
    id: `person:filler-${i}`,
    text: `Filler ${i}`,
    icon: 'mdi:account',
    href: `#/person/filler-${i}`,
    isClosable: true
  })
}

export default tree