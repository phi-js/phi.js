<script setup>
import { ref, watch, watchEffect, computed, defineComponent, h, Teleport, provide } from 'vue'
import { sanitizeStory, getStorySchema } from '../../functions'
import { CmsBlockEditor } from '../CmsBlockEditor'

const props = defineProps({
  story: {
    type: Object,
    required: false,
    default: null,
  },

  currentPageId: {
    type: [String, Number],
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:story', 'update:currentPageId'])

// Sanitize incoming story
const sanitizedStory = ref(null)
watch(
  () => props.story,
  (incomingStory) => {
    // sanitizedStory.value = JSON.parse(JSON.stringify(sanitizeStory(incomingStory)))
    sanitizedStory.value = sanitizeStory(incomingStory)
  },
  {
    immediate: true,
    // deep: true, // causes loop (!)
  },
)

/* Provide VM schema */
const storySchema = computed(() => {
  const storySchema = getStorySchema(sanitizedStory.value)

  if (!storySchema.properties?.$i18n) {
    storySchema.properties.$i18n = {
      type: 'object',
      properties: {
        locale: {
          type: 'string',
          info: { text: 'Language' },
          enum: [
            { value: 'en' },
            { value: 'es' },
            { value: 'fr' },
            { value: 'de' },
          ],
        },
      },
    }
  }

  if (!storySchema.properties?.$errors) {
    storySchema.properties.$errors = {
      type: 'object',
      properties: {
        length: {
          type: 'number',
          info: { text: 'No. of errors' },
        },
      },
    }
  }

  return storySchema
})

provide('$_vm_modelSchema', storySchema)

const currentPage = ref()
watchEffect(() => {
  const foundPage = sanitizedStory.value.pages.find((p) => p.id == props.currentPageId)
  currentPage.value = foundPage || sanitizedStory.value.pages?.[0]
})

function onUpdateCurrentPage() {
  emit('update:story', {
    ...sanitizedStory.value,
    pages: sanitizedStory.value.pages.map((page) => page.id == currentPage.value.id ? { ...currentPage.value } : page),
  })
}

const transitionName = ref('slideX')
const transitionDirection = ref('fw') // fw, bw

const storyCSS = computed(() => sanitizedStory.value.css.classes.map((c) => c.css).join('\n'))
const StyleTag = defineComponent({
  render: () => h(
    Teleport,
    { to: 'head' },
    h(
      'style',
      {
        type: 'text/css',
        class: 'CmsStory__style',
      },
      storyCSS.value,
    ),
  ),
})


// THEMES
const storyClassNames = ref([])
if (sanitizedStory.value?.theme) {

  watch(
    () => sanitizedStory.value.theme,
    () => {
      const themes = Array.isArray(sanitizedStory.value.theme)
        ? sanitizedStory.value.theme
        : [sanitizedStory.value.theme]

      themes.forEach((themeName) => import(`../../style/themes/${themeName}/index.scss`))
      storyClassNames.value = themes.map((themeName) => `phi-theme-${themeName}`)
    },
    { immediate: true },
  )
}
</script>

<template>
  <div
    class="CmsStoryEditor CmsStory"
    :class="storyClassNames"
  >
    <StyleTag />

    <Transition :name="`${transitionName}--${transitionDirection}`">
      <div
        v-if="currentPage"
        :key="currentPage.id"
      >
        <KeepAlive>
          <CmsBlockEditor
            v-model:block="currentPage"
            class="CmsStoryEditor__page CmsStory__page"
            @update:block="onUpdateCurrentPage"
          />
        </KeepAlive>
      </div>
    </Transition>
  </div>
</template>