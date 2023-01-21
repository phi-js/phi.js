<script setup>
import { ref, computed, watch } from 'vue'
import { UiItem } from '../UiItem'
import { UiIcon } from '../UiIcon'

const props = defineProps({
  value: {
    type: Array,
    required: false,
    default: () => [],
  },

  path: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const innerPath = ref()
watch(
  () => props.path,
  (newPath) => innerPath.value = newPath,
  { immediate: true },
)

const pages = computed(() => {
  let curParent = null
  let curItems = props.value

  const retval = [
    {
      parent: null,
      items: curItems,
    },
  ]

  for (let i = 0; i < innerPath.value.length; i++) {
    curParent = curItems?.[innerPath.value[i]]
    curItems = curParent?.children
    if (!curParent || !curItems) {
      break
    }
    retval.push({
      parent: { ...curParent, children: undefined },
      items: curItems,
    })
  }

  return retval
})


const page = computed(() => pages.value[pages.value.length - 1])

const transitionName = ref('forward')

function closePage() {
  transitionName.value = 'back'
  innerPath.value.pop()
}

function onItemClick(itemIndex) {
  transitionName.value = 'forward'
  innerPath.value.push(itemIndex)
}
</script>

<template>
  <div class="UiTreeExplorer">
    <Transition :name="transitionName">
      <div
        :key="innerPath.length"
        class="UiTreeExplorer__page"
      >
        <UiItem
          v-if="page.parent"
          class="UiTreeExplorer__parent"
          icon="mdi:arrow-left"
          :text="page.parent.text"
          @click="closePage()"
        />

        <div class="UiTreeExplorer__list">
          <template
            v-for="(item, i) in page.items"
            :key="i"
          >
            <slot
              name="item"
              :item="item"
              :has-children="item.children?.length"
              :navigate="() => onItemClick(i)"
            >
              <UiItem
                :icon="item.icon"
                :text="item.text"
                :subtext="item.subtext"
                @click="item.children?.length && onItemClick(i)"
              >
                <template
                  v-if="item.children?.length"
                  #actions
                >
                  <UiIcon src="mdi:chevron-right" />
                </template>
              </UiItem>
            </slot>
          </template>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss">
.UiTreeExplorer {
  position: relative;
  user-select: none;


  /* Transitions */
  .forward-enter-active,
  .forward-leave-active,
  .back-enter-active,
  .back-leave-active {
    transition: all 0.3s ease;
    opacity: 1;
    transform: translateX(0);
  }

  .forward-enter-from,
  .back-leave-to {
    position: absolute;
    opacity: 0;
    transform: translateX(30%);
  }

  .forward-leave-to,
  .back-enter-from {
    position: absolute;
    opacity: 0;
    transform: translateX(-30%);
  }
}
</style>