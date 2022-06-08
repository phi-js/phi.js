<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { computed, nextTick } from 'vue'
import MediaImage from './MediaImage.vue'
import { UiInput, UiResizable } from '../../../../../ui'

const props = defineProps({
  /* objeto PROPS para MediaImage:
    src: 'https://s3.amazonaws.com/phidias-api-1/desarrollodev/cms/pages/test/Best-Cheesecake-Recipe-2-1-of-1-4.jpg',
    align: 'center',
    width: 'auto',
    href: 'https://phidias.co',
  */
  modelValue: {
    type: Object,
    required: false,
    default: () => ({}),
  },
})
const emit = defineEmits(['update:modelValue'])
const isEmpty = computed(() => !props.modelValue?.src?.trim?.())

async function toggleHeightAuto(setAuto = true, refresh) {
  emit('update:modelValue', { ...props.modelValue, height: setAuto ? 'auto' : undefined })
  await nextTick()
  refresh()
}
</script>

<template>
  <div
    class="MediaImageFace"
    :class="{ 'MediaImageFace--empty': isEmpty, 'MediaImageFace--notempty': !isEmpty }"
  >
    <UiResizable
      v-slot="{ isDragging, newBounds, refresh }"
      :enabled="['e']"
      @update:coords="emit('update:modelValue', { ...modelValue, height: $event.height })"
    >
      <MediaImage
        class="MediaImageFace__image"
        v-bind="{ ...$attrs, ...modelValue }"
        :height="isDragging ? newBounds.height + 'px' : modelValue.height"
      />

      <div class="MediaImageFace__infobox">
        <div
          v-if="!isEmpty"
          class="MediaImageFace__heightenator UiGroup"
          :style="{ justifyContent: modelValue?.align || 'center' }"
        >
          <UiInput
            type="text"
            placeholder="Height"
            :model-value="newBounds.height + 'px'"
            @update:model-value="emit('update:modelValue', { ...modelValue, height: $event })"
          />
          <label>
            <input
              type="checkbox"
              :checked="modelValue.height == 'auto'"
              @change="toggleHeightAuto($event.target.checked, refresh)"
            >
            auto
          </label>
        </div>
      </div>
    </UiResizable>
  </div>
</template>

<style lang="scss">
.MediaImageFace {
  position: relative;

  &__infobox {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    // display: flex;
    // align-items: center;
    // justify-content: center;
    padding: 8px;

    opacity: 0;
    transition: opacity var(--ui-duration-snap);

    background-color: rgba(0, 0, 0, 0.5);
  }

  &__heightenator {
    position: absolute;
    bottom: 8px;
    left: 0;
    right: 0;
  }

  &--empty,
  &:hover {
    .MediaImageFace__infobox {
      opacity: 1;
    }
  }

  &--notempty {
    .MediaImageFace__infobox {
      align-items: flex-start;
      // justify-content: flex-end;
    }
  }
}
</style>