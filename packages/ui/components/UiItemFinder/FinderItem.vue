<script setup>
import { UiItem, UiDetails } from '../'

const props = defineProps({
  /*
  {
    keywords: ... searchable words (other tan text and subtext)

    text: ...,
    subtext: ...,
    icon: ...,
    ... any additional data ...,

    children: [
      ... array of items
    ]
  }
  */
  item: {
    type: Object,
    required: false,
    default: null,
  },

  /*
    Name for UiDetails group
  */
  group: {
    type: String,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['click-item'])
</script>

<template>
  <UiDetails
    v-if="props.item?.children?.length"
    class="FinderItem FinderItem--group"
    :class="props.item?.class"
    :group="props.group"

    :text="props.item?.text || props.item?.title"
    :subtext="props.item?.subtext || props.item?.description"
    :icon="props.item?.icon"
  >
    <div class="FinderItem__children">
      <FinderItem
        v-for="(child, i) in props.item.children"
        :key="i"
        :item="child"
        :group="props.group + '-c'"
        @click-item="emit('click-item', $event)"
      />
    </div>
  </UiDetails>
  <UiItem
    v-else
    tabindex="0"
    class="FinderItem FinderItem--item"
    :class="props.item?.class"
    :text="props.item?.text || props.item?.title"
    :subtext="props.item?.subtext || props.item?.description"
    :icon="props.item?.icon"
    @click="emit('click-item', props.item)"
    @keyup.enter="emit('click-item', props.item)"
  />
</template>