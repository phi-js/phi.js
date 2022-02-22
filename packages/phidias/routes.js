import Home from './components/Home/Home.vue'
import ErrorPage from './components/Error.vue'

import LayoutContainer from '../app/components/LayoutContainer/LayoutContainer.vue'

import TabContainer from '../app/components/TabContainer/TabContainer.vue'

import PersonHome from './components/PersonHome/PersonHome.vue'
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
          { path: '/person/:personId/inbox', component: PersonInbox, props: true },
          // { path: '/message/:messageId', component: MessageRead, props: (route) => ({ ...route.params, personId: '123123' }) },
        ]
      }
    ]
  },
]