<script setup>
import { ref } from 'vue'
import { UiOverflow } from '.'
import { UiInput } from '../'

const items = ref(Array(20).fill().map((_, index) => ({
  text: `Foo ${index}`,
  index,
})))

const counter = ref({
  hidden: 0,
  visible: 0,
})

function selectHiddenItem($event) {
  arrayMove(items.value, 0, items.value.length - 1)
  arrayMove(items.value, items.value.findIndex((itm) => itm.index === $event), counter.value.visible - 1)
}

function arrayMove(arr, fromIndex, toIndex) {
  var element = arr[fromIndex]
  arr.splice(fromIndex, 1)
  arr.splice(toIndex, 0, element)
}
</script>

<template>
  <section>
    <h1>UiOverflow</h1>
    <p>Emite una variable indicando la cantidad de hijos ocultos o parcialmente visibles</p>

    <div style="display:flex; align-items: center">
      <UiOverflow
        v-model:hiddenCount="counter.hidden"
        v-model:visibleCount="counter.visible"
        style="flex: 1"
      >
        <TransitionGroup
          class="trGroup"
          name="tab-list"
          tag="div"
        >
          <div
            v-for="(item, i) in items"
            :key="item.text"
            class="Block ui--clickable"
            :class="{'Block--occluded': i == counter.visible}"
            @click="items.splice(i, 1)"
            v-text="item.text"
          />
        </TransitionGroup>
      </UiOverflow>

      <div
        v-show="counter.hidden > 0"
        style="width: 128px"
      >
        <UiInput
          type="select"
          placeholder="Otros ..."
          :options="items.slice(counter.visible).map(item => ({
            value: item.index,
            text: item.text
          }))"
          @update:modelValue="selectHiddenItem($event)"
        />
      </div>
    </div>

    <strong>visible: {{ counter.visible }}</strong>
    <br>
    <strong>hidden: {{ counter.hidden }}</strong>
    <br>
    <small>Cambia el ancho de la ventana para actualizar</small>
  </section>
</template>

<style lang="scss">
.Block {
  white-space: nowrap;
  background-color: #ddd;

  overflow: hidden;
  width: 128px;
  min-width: 128px;

  transition: all var(--ui-duration-quick);
  opacity: 1;

  &--occluded {
    opacity: 0;
  }
}

.myOverflow {
  display: flex;
  flex-wrap: nowrap;
  overflow: hidden;
}

.trGroup {
  display: flex;
  flex-wrap: nowrap;
}

// Transition for appearing/disappearing tabs
.Block {
  overflow: hidden;
}

.tab-list-enter-active,
.tab-list-leave-active {
  min-width: 0;
}

.tab-list-enter-from,
.tab-list-leave-to {
  width: 0;
  padding-left: 0;
  padding-right: 0;
}

</style>