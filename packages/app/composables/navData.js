import { reactive } from 'vue'

/*
Details relating to the navigation:
Tab and menu keys and transition directions
(keys to be used in <router-view :key="navData.tab.key" />)
*/

const navData = reactive({
  tab: {
    key: 0,
    isForward: false
  },

  page: {
    isForward: false,
    shouldAnimate: false
  }
})

export default navData