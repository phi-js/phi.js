<script>
export default { inheritAttrs: false }
</script>

<script setup>
import { ref, nextTick, watch } from 'vue'
import PickerContents from './PickerContents.vue'
import { UiIcon, UiPopover } from '@/packages/ui/components'

const props = defineProps({
  text: {
    type: String,
    required: false,
    default: '',
  },

  subtext: {
    type: String,
    required: false,
    default: '',
  },

  icon: {
    type: String,
    required: false,
    default: 'mdi:plus',
  },

  title: {
    type: String,
    required: false,
    default: null,
  },

  open: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const emit = defineEmits(['input', 'update:open'])

const isMobile = window.innerWidth < 768
let hasPushedState = false

const isOpen = ref()
watch(
  () => props.open,
  (v) => {
    isOpen.value = v

    if (isMobile) {
      if (isOpen.value) {
        // register cancel listeners
        history.pushState({ open: true }, '')
        window.addEventListener('popstate', onPopState)
        hasPushedState = true
      } else {
        // unregister cancel listeners
        window.removeEventListener('popstate', onPopState)
        if (hasPushedState) {
          history.go(-1)
          hasPushedState = false
        }
      }
    }
  },
  { immediate: true },
)

const refPickerContents = ref()
async function onPopoverOpen() {
  if (!refPickerContents.value) {
    return
  }
  await nextTick()
  refPickerContents.value.querySelector('input')?.focus?.()
}

function setOpen(bool) {
  if (isOpen.value === bool) {
    return
  }
  emit('update:open', bool)
}

function onPopState() {
  hasPushedState = false
  setOpen(false)
}
</script>

<template>
  <div
    :class="[
      'CmsBlockPicker',
      {
        'CmsBlockPicker--open': isOpen,
        'CmsBlockPicker--closed': !isOpen,
        'CmsBlockPicker--mobile': isMobile,
      },
      $attrs.class
    ]"
  >
    <template v-if="isMobile">
      <div class="CmsBlockPicker__trigger">
        <slot
          name="trigger"
          :toggle="() => setOpen(!isOpen)"
        />
      </div>
      <div class="CmsBlockPicker__contents">
        <UiIcon
          class="CmsBlockPicker__close"
          src="mdi:close"
          @click="setOpen(false)"
        />
        <PickerContents
          @input="emit('input', $event); setOpen(false)"
        >
          <template #body>
            <slot
              name="body"
              :close="() => setOpen(false)"
            />
          </template>
        </PickerContents>
      </div>
    </template>
    <template v-else>
      <UiPopover
        v-model:open="isOpen"
        class="CmsBlockPicker__popover"
        placement="bottom"
        trigger="manual"
        @update:open="emit('update:open', $event)"
        @open="onPopoverOpen"
      >
        <template #trigger="{ toggle }">
          <slot
            name="trigger"
            :toggle="toggle"
          />
        </template>

        <template #contents="{ close }">
          <div ref="refPickerContents">
            <PickerContents
              class="CmsBlockPicker__contents"
              @input="emit('input', $event); close()"
            >
              <template #body>
                <slot
                  name="body"
                  :close="close"
                />
              </template>
            </PickerContents>
          </div>
        </template>
      </UiPopover>
    </template>
  </div>
</template>

<style lang="scss">
.CmsBlockPicker {
  &__contents {
    width: 488px;
    max-width: 97vw;
    height: 560px;
    max-height: 80vh;
  }
}


.CmsBlockPicker {
  &--mobile &__contents {
    display: none;
  }

  &--mobile.CmsBlockPicker--open &__contents {
    display: block;
  }

  &--mobile &__contents {
    width: auto;
    height: auto;
    max-width: none;
    max-height: none;

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 3;

    background-color: #333;
    color: #eee;

    & > .PickerContents {
      height: 100%;
    }
  }

  &--mobile &__close {
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 40px;
  }
}
</style>