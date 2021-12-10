<script setup>
import { ref, defineAsyncComponent, watch, onMounted } from 'vue'
const UiTree = defineAsyncComponent(() => import('./UiTree.vue'))
import { UiDrawer } from '../UiDrawer'

const props = defineProps({
  /*
  An item OBJECT
  {
    ... anything ...
    [childrenProp]: ... another object
  }
  */
  value: {
    type: Object,
    required: true,
  },

  /*
  The object property containing the recursive item(s)
  */
  childrenProp: {
    type: String,
    required: false,
    default: 'children',
  },

  /* For internal use */
  depth: {
    type: Number,
    required: false,
    default: 0,
  },

  initialOpen: {
    type: Function,
    required: false,
    default: null,
  },

  /* Unique name (to use as drawer group base name) */
  name: {
    type: String,
    required: false,
    default: '',
  },
})

const item = ref() // una copia del objeto iterado, SIN su propiedad [childrenProp]
const children = ref()
const isOpen = ref(false)

// onMounted(() => {
//   if (typeof props.initialOpen === 'function') {
//     isOpen.value = props.initialOpen(props.value)
//   }
// })

watch(
  () => props.value,
  (newValue) => {
    children.value = newValue?.[props.childrenProp] || null
    item.value = { ...newValue }
    delete item.value[props.childrenProp]

    if (typeof props.initialOpen === 'function') {
      isOpen.value = props.initialOpen(props.value)
    }
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<template>
  <div class="UiTree">
    <div class="UiTree__face">
      <slot
        name="default"
        :item="item"
        :children="children"
        :isOpen="isOpen"
        :toggle="() => isOpen = !isOpen"
        :expand="() => isOpen = true"
        :collapse="() => isOpen = false"
        :depth="props.depth"
      />
    </div>
    <UiDrawer
      v-if="children"
      v-model:open="isOpen"
      :drawer-group="`UiTree-${props.name}-${props.depth}`"
    >
      <UiTree
        class="UiTree__children"
        v-bind="props"
        :value="children"
        :depth="props.depth + 1"
      >
        <template #default="slotProps">
          <slot
            name="default"
            v-bind="slotProps"
          />
        </template>
      </UiTree>
    </UiDrawer>
  </div>
</template>