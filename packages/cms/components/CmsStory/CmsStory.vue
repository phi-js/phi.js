<script>
import {
  ref,
  watch,
  watchEffect,
  provide,
  reactive,
  h,
  Transition,
  KeepAlive,
  Teleport,
  onMounted,
} from 'vue'

import { colorScheme } from '@/packages/ui'

import { CmsBlock } from '../CmsBlock'
import { getPluginData, sanitizeStory, parseTranslations, forEachBlock, setProperty, useThemes } from '../../functions'
import { useI18n } from '../../../i18n'
import { VM } from '../../../vm'

export default {
  props: {
    story: {
      type: Object,
      required: false,
      default: null,
    },

    modelValue: {
      type: Object,
      required: false,
      default: () => ({}),
    },

    currentPageId: {
      type: [String, Number],
      required: false,
      default: null,
    },
  },

  emits: ['update:modelValue', 'update:currentPageId', 'story-emit'],

  setup(props, { emit }) {
    // Sanitize and translate (precompile) incoming story
    const i18n = useI18n()
    const sanitizedStory = ref(null)
    watchEffect(() => {
      const sanitized = JSON.parse(JSON.stringify(sanitizeStory(props.story))) // clone is important, otherwise we'll be mutating prop (i.e. when setting block.props and block.rules below)

      forEachBlock(sanitized, (block) => {
        if (block.props) {
          block.props = parseTranslations(block.props, i18n.locale, block.i18n)
        }
        if (block.rules) {
          block.rules = parseTranslations(block.rules, i18n.locale, block.i18n)
        }
        if (block['v-on']) {
          block['v-on'] = parseTranslations(block['v-on'], i18n.locale, block.i18n)
        }
      })

      sanitizedStory.value = sanitized
    })

    // StoryVM
    const storyVM = new VM
    storyVM.onModelSet = (propName, propValue) => {
      const modelValue = { ...props.modelValue }
      setProperty(modelValue, propName, propValue)
      onUpdateModelValue(modelValue)
    }


    // Get enabled plugins
    const pluginData = getPluginData()

    // Evaluate story.setup()
    const isMounted = ref()
    onMounted(async () => {
      isMounted.value = false

      await pluginData.emit('storyMounted', sanitizedStory.value, {
        patchModelValue: (objData) => {
          if (!objData || typeof objData !== 'object') {
            return
          }
          const modelValue = { ...props.modelValue }
          for (const [propName, propValue] of Object.entries(objData)) {
            setProperty(modelValue, propName, propValue)
          }
          onUpdateModelValue(modelValue)
        },
      })

      if (!sanitizedStory.value.setup) {
        isMounted.value = true
        return
      }

      storyVM.eval(sanitizedStory.value.setup, props.modelValue)
      isMounted.value = true
    })

    // Determine current page
    const currentPage = ref()
    const transitionName = ref('slideX')
    const transitionDirection = ref('fw') // fw, bw

    watchEffect(() => {
      const foundPage = sanitizedStory.value.pages.find((page) => page.id == props.currentPageId)
      currentPage.value = foundPage || sanitizedStory.value.pages?.[0]
    })

    // Story navigation
    // Watch current page changes
    const navigationHistory = ref([]) // array of page IDs
    const loadedPages = {} // loadedPages[page-id] = true | false

    watch(
      () => props.currentPageId,
      (newPageId, oldPageId) => {
        if (!newPageId) {
          newPageId = sanitizedStory.value.pages?.[0]?.id
        }

        navigationHistory.value.push(newPageId)

        const pageTo = sanitizedStory.value.pages.find((page) => page.id == newPageId)

        // Evaluate page setup() (once)
        if (pageTo?.setup && !loadedPages[pageTo.id]) {
          storyVM.eval(pageTo.setup, props.modelValue)
          loadedPages[pageTo.id] = true
        }

        // Evaluate page onEnter()
        if (pageTo?.onEnter) {
          storyVM.eval(pageTo.onEnter, props.modelValue)
        }

        // Evaluate page onLeave()
        if (oldPageId) {
          const pageFrom = sanitizedStory.value.pages.find((page) => page.id == oldPageId)
          if (pageFrom?.onLeave) {
            storyVM.eval(pageFrom.onLeave, props.modelValue)
          }
        }
      },
      { immediate: true },
    )

    function goTo(pageId) {
      const foundPage = sanitizedStory.value.pages.find((page) => page.id == pageId)
      if (!foundPage) {
        console.warn(`CmsStory.goTo: page '${pageId}' not found`)
        return
      }

      currentPage.value = foundPage
      emit('update:currentPageId', pageId)
    }

    function goBack() {
      navigationHistory.value.pop() // remove THIS page from history
      const lastPageId = navigationHistory.value.pop()
      if (!lastPageId) {
        console.warn('CmsStory.goBack: Already at start')
        return
      }

      goTo(lastPageId)
    }

    const globals = reactive({ $errors: [] })

    /*
    storyEvent: {
      name: 'custom event name',
      data: { ... custom event data }
      block: { ... block object that triggered the event }
      bubbled: true (if it was emitted via block.bubble)
    }
    */
    function emitStoryEvent(storyEvent) {
      emit('story-emit', storyEvent)
    }

    // Provide global story methods (used by CmsBlock)
    const providedData = {
      goTo,
      goBack,
      globals,
      sanitizedStory,
      emitStoryEvent,
    }
    provide('$_cms_story', providedData)
    storyVM.custom = { story: providedData }


    function onUpdateModelValue(event) {
      emit('update:modelValue', event)

      // evaluate story[v-on][update:modelValue]
      if (sanitizedStory.value?.['v-on']?.['update:modelValue']) {
        const initialSetter = storyVM.onModelSet
        storyVM.onModelSet = null
        storyVM.eval(sanitizedStory.value['v-on']['update:modelValue'], props.modelValue)
          .then(() => storyVM.onModelSet = initialSetter)
      }
    }

    function onUpdateErrors(evt) {
      // globals.$errors is reactive and will trigger an update on ALL blocks when it changes
      // so make sure not to update the value unnecessarylylylyl
      if (!evt.length && !globals.$errors.length) {
        return
      }

      globals.$errors = evt
    }

    // Global CSS
    const storyCSS = ref()
    watchEffect(() => {
      const strCSS = sanitizedStory.value.css.classes.map((c) => c.css).join('\n')
      storyCSS.value = storyVM.eval(strCSS, props.modelValue)
    })

    const storyStyleProp = ref()
    watchEffect(() => {
      const objStyle = {
        ...sanitizedStory.value.css?.style,
        ...sanitizedStory.value.css?.[`style-${colorScheme.value}`],
      }

      if (objStyle) {
        storyStyleProp.value = storyVM.eval(objStyle, props.modelValue)
      }
    })

    // Determine story THEME
    const themeClassNames = ref([])
    if (sanitizedStory.value?.themes) {
      themeClassNames.value = useThemes(sanitizedStory.value)
    }

    // Render function
    return () => !isMounted.value
      ? null
      : h(
        'div',
        {
          class: ['CmsStory', ...themeClassNames.value],
          style: storyStyleProp.value,
        },
        [
          // Story <style> element in <head>
          h(
            Teleport,
            { to: 'head' },
            h('style', { type: 'text/css', class: 'CmsStory__style' }, storyCSS.value),
          ),

          h(
            'div',
            { class: 'CmsStory__viewport' },
            h(
              Transition,
              { name: `${transitionName.value}--${transitionDirection.value}` },
              () => h(
                KeepAlive,
                null,
                currentPage.value
                  ? h(CmsBlock, {
                    'key': currentPage.value.id,
                    'onUpdate:errors': onUpdateErrors,
                    'class': 'CmsStory__page',
                    'block': currentPage.value,
                    'modelValue': {
                      ...props.modelValue,
                      $i18n: i18n,
                    },
                    'onUpdate:modelValue': onUpdateModelValue,
                  })
                  : null,
              ),
            ),
          ),
        ],
      )
  },
}
</script>

<style lang="scss">
.CmsStory {
  @import "./transitions.scss";
  --cms-story-transition-duration: var(--ui-duration-quick);

  &__viewport {
    position: relative;
    height: 100%;
  }
}
</style>