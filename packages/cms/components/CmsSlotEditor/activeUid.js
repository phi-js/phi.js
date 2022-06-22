import { ref, watch } from 'vue'
const activeUid = ref(-1)

watch(activeUid, () => {
  if (window?.navigator?.vibrate) {
    window.navigator.vibrate(1)
  }
})

export default activeUid