import Home from './components/Home/Home.vue'
import Dummy from './components/Dummy.vue'
import ErrorPage from './components/Error.vue'

import LayoutContainer from '../app/components/LayoutContainer/LayoutContainer.vue'

import TabContainer from '../app/components/TabContainer/TabContainer.vue'

import PersonHome from './components/PersonHome/PersonHome.vue'
import PersonCalendar from './components/PersonCalendar/PersonCalendar.vue'
import PersonInbox from './components/PersonInbox/PersonInbox.vue'
// import MessageRead from './components/MessageRead/MessageRead.vue'

export default [
  // { path: '/', component: Home },
  {
    path: '/error', component: ErrorPage, props: (ass) => {
      console.log('dude!', ass)
      return {
        error: 'this asshole',
        ass
      }
    }
  },

  {
    path: '/layout',
    component: LayoutContainer,
    children: [
      {
        path: '/admin',
        component: TabContainer,
        meta: {
          tab: 'admin'
        },

        children: [
          { path: '/', component: Home, alias: '/home' },
          { path: '/book/:number', component: Dummy, props: (rt) => ({ ...rt.params, title: `Book ${rt.params.number}` }) },
        ]
      },

      {
        path: '/person/:personId',
        redirect: to => `/person/${to.params.personId}/home`,
        component: TabContainer,
        meta: {
          tab: (params) => `person:${params.personId}`
        },

        children: [
          { path: '/person/:personId/home', component: PersonHome, props: true },
          { path: '/person/:personId/calendar', component: PersonCalendar, props: true },
          { path: '/person/:personId/inbox', component: PersonInbox, props: true },
          { path: '/person/:personId/mail/trash', component: Dummy, props: { title: 'Papelera de reciclaje' } },
          { path: '/person/:personId/compose', component: Dummy, props: { title: 'Redactar mensaje' } },
          { path: '/person/:personId/classroom', component: Dummy, props: { title: 'Aula virtual' } },
          { path: '/person/:personId/history', component: Dummy, props: { title: 'Historial académico' } },
        ]
      }
    ]
  },
]