import { createRouter, createWebHashHistory } from 'vue-router'
import { obtainTab } from './composables'

import routes from '../phidias/routes.js'
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

/*
Navigation guards:
Force redirect to /code if app is not initialized
Force redirect to /login if user is not authenticated
*/
router.beforeEach((to, from, next) => {

  // Determine the tab for the target route
  if (!to.meta?.tab) {
    next()
    return
  }

  if (to.meta?.tab) {
    const targetTabId = (typeof to.meta.tab == 'function') ? to.meta.tab(to.params) : to.meta.tab;
    obtainTab(targetTabId, true)
      .then(() => next())
      .catch((error) => {
        console.warn('Navigation error', error);
        next({ path: '/error', params: { error }, replace: true });  /// !!! I still can't pass "error" as a component prop :(
      })
  }

  // if (!store.state.url && to.name != 'code') {
  //   next({ name: 'code' })
  //   return
  // }

  // if (!store.state.user && to.name != 'code' && to.name != 'login') {
  //   next({ name: 'login' })
  //   return
  // }

  /*
  Tab registry
  */
  // $nav.hitRoute(to, from, next, router)
  //   .catch(error => {
  //     console.warn('Navigation error', error)
  //     next({ path: '/error', props: { error }, replace: true })
  //   })
})

export default router