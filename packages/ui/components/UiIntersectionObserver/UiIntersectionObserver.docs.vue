<script setup>
import { ref } from 'vue'
import UiIntersectionObserver from './UiIntersectionObserver.vue'

const events = ref([])

function onScrollShow(evt) {
  events.value.push(`onSchollShow: ${evt}`)
}

function onScrollHide(evt) {
  events.value.push(`onScrollHide: ${evt}`)
}
</script>

<template>
  <div class="UiIntersectionObserverDocs">
    <div style="width: 500px; height: 500px; overflow: auto;">
      <!-- !!! --->
      <div style="width: max-content">
        <UiIntersectionObserver @show="onScrollShow('top')" @hide="onScrollHide('top')" />
        <div style="display: flex; flex-wrap: nowrap;">
          <UiIntersectionObserver @show="onScrollShow('left')" @hide="onScrollHide('left')" />
          <div style="flex: 1; white-space: nowrap;">
            <p v-for="n in 30">
              Loremp sdfklsaudhflaksjdfh lksjadhf lksadfh slkadfjh lkasdfh
              lak;sdjfh laskdfh laskdjhfaslkjf hdskjsdfklsaudhflaksjdfh lksjadhf
              lksadfh slkadfjh lkasdfh lak;sdjfh laskdfh laskdjhfaslkjf hdskjsdfkl
              saudhflaksjdfh lksjadhf lksadfh slkadfjh lkasdfh lak;sdjfh laskdfh
              laskdjhfaslkjf hdskjsdfklsaudhflaksjdfh lksjadhf lksadfh slkadfjh
              lkasdfh lak;sdjfh laskdfh laskdjhfaslkjf hdskj
            </p>
          </div>
          <UiIntersectionObserver @show="onScrollShow('right')" @hide="onScrollHide('right')" />
        </div>
        <UiIntersectionObserver @show="onScrollShow('bottom')" @hide="onScrollHide('bottom')" />
      </div>
    </div>

    <ul>
      <li v-for="(e, i) in events.slice().reverse()" :key="i">{{ e }}</li>
    </ul>
  </div>
</template>

<style lang="scss">
.UiIntersectionObserver {
  min-width: 1px;
  min-height: 1px;
}
</style>