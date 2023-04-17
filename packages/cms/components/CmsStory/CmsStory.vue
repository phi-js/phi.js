<!-- eslint-disable max-len -->
<script>
import {
  ref,
  watch,
  watchEffect,
  provide,
  h,
  Transition,
  onMounted,
  computed,
} from 'vue'

import { CmsBlock } from '../CmsBlock'
import {
  getPluginData,
  sanitizeStory,
  forEachBlock,
  getProperty,
  setProperty,
  useStylesheets,
  useStorySettings,
  useNavigation,
} from '../../functions'

import { useI18n } from '@/packages/i18n'
import { VM } from '@/packages/vm'

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
    const i18n = useI18n()

    // Sanitize and translate (precompile) incoming story
    const sanitizedStory = ref(null)
    watchEffect(() => {
      sanitizedStory.value = JSON.parse(JSON.stringify(sanitizeStory(props.story))) // clone is important, otherwise we'll be mutating prop (i.e. when setting block.props and block.rules below)
      sanitizedStory.value.paths = i18n.obj(sanitizedStory.value.paths)
    })

    // Story model value and single source of truth for all things model
    const innerModel = ref({})

    // Story initialization: create VM, read plugins, run story setup()

    // StoryVM
    const storyVM = new VM
    storyVM.onModelSet = (propName, propValue) => {
      setProperty(innerModel.value, propName, propValue)
      onUpdateModelValue(innerModel.value)
    }

    // Get enabled plugins
    const pluginData = getPluginData()


    // Story Navigation
    const $nav = useNavigation(
      sanitizedStory,
      innerModel,
      {
        onPageEnter,
        onPageLeave,
      },
    )

    watch(
      () => props.currentPageId,
      (newPageId) => {
        if (!newPageId || newPageId == $nav.currentPageId.value) {
          return
        }
        $nav.goTo(newPageId)
      },
      // { immediate: true }, // If run immediately, conditional story pages are not resolved yet. Do this in onMounted for the first run.
    )

    // Evaluate story.setup()
    const isMounted = ref()
    onMounted(async () => {
      isMounted.value = false

      await pluginData.emit('storyMounted', sanitizedStory.value, {
        patchModelValue: (objData) => {
          if (!objData || typeof objData !== 'object') {
            return
          }
          for (const [propName, propValue] of Object.entries(objData)) {
            setProperty(innerModel.value, propName, propValue)
          }
          onUpdateModelValue(innerModel.value)
        },
      })

      if (sanitizedStory.value.setup) {
        const evaluableSetup = i18n.obj(sanitizedStory.value.setup)
        storyVM.eval(evaluableSetup, innerModel.value)
      }

      isMounted.value = true

      // Initial currentPageId value
      if (props.currentPageId && props.currentPageId == $nav.currentPageId.value) {
        return
      }
      if (props.currentPageId) {
        $nav.goTo(props.currentPageId)
      } else {
        $nav.goTo(sanitizedStory.value.pages[0]?.id)
      }
    })


    const loadedPages = {} // loadedPages[page-id] = true | false

    function onPageEnter(pageId) {
      const pageTo = sanitizedStory.value.pages.find((page) => page.id == pageId)

      // Evaluate page setup() (once)
      if (pageTo?.['v-on']?.load && !loadedPages[pageTo.id]) {
        storyVM.eval(pageTo['v-on'].load, innerModel.value)
        loadedPages[pageTo.id] = true
      }

      // Evaluate page enter event
      if (pageTo?.['v-on']?.enter) {
        storyVM.eval(pageTo['v-on'].enter, innerModel.value)
      }

      emit('update:currentPageId', pageId)
    }

    function onPageLeave(pageId) {
      // Evaluate page leave event
      const pageFrom = sanitizedStory.value.pages.find((page) => page.id == pageId)
      if (pageFrom?.['v-on']?.leave) {
        storyVM.eval(pageFrom['v-on'].leave, innerModel.value)
      }
    }

    const currentPage = computed(() => {
      let foundPage = sanitizedStory.value.pages.find((p) => p.id == $nav.currentPageId.value)
      if (!foundPage) {
        foundPage = sanitizedStory.value.pages[0]
      }

      if (!foundPage) {
        return null
      }

      // Splice story header and footer into current page slots
      return {
        ...foundPage,
        slots: {
          ...foundPage.slots,
          header: foundPage.isHeaderEnabled === false ? undefined : sanitizedStory.value.header,
          footer: foundPage.isFooterEnabled === false ? undefined : sanitizedStory.value.footer,
        },
      }
    })



    // Parse translations
    const translatedPage = computed(() => {
      if (!currentPage.value) {
        return
      }

      const pageClone = JSON.parse(JSON.stringify(currentPage.value))
      forEachBlock(pageClone, (block) => {
        if (block.props) {
          block.props = i18n.obj(block.props)
        }
        if (block.rules) {
          block.rules = i18n.obj(block.rules)
        }
        if (block['v-on']) {
          block['v-on'] = i18n.obj(block['v-on'])
        }
      })

      return pageClone
    })


    // Story modelValue
    const storySettings = useStorySettings()

    watch(
      () => props.modelValue,
      (newValue) => innerModel.value = {
        ...newValue,
        $settings: storySettings,
      },
      { immediate: true },
    )

    function onUpdateModelValue(event) {
      innerModel.value = event
      emit('update:modelValue', { ...innerModel.value, $settings: undefined })

      // evaluate story[v-on][update:modelValue]
      if (sanitizedStory.value?.['v-on']?.['update:modelValue']) {
        const initialSetter = storyVM.onModelSet
        storyVM.onModelSet = null
        storyVM.eval(sanitizedStory.value['v-on']['update:modelValue'], innerModel.value)
          .then(() => storyVM.onModelSet = initialSetter)
      }
    }




    // Computed variables
    const computedVariables = {} // computedVariables[variable name]: fx unregister()

    watchEffect(() => {
      const seen = []

      if (Array.isArray(sanitizedStory.value.computed)) {
        sanitizedStory.value.computed.forEach((computation) => {
          if (!computation?.name || !computation?.statement) {
            return
          }

          const targetName = computation.name
          if (!computedVariables[targetName]) {
            computedVariables[targetName] = watchEffect(() => {
              try {
                const result = storyVM.eval(computation.statement, innerModel.value)
                setProperty(innerModel.value, targetName, result)
              } catch (e) {
                console.warn(`Error computing variable '${targetName}'`, e)
              }
            })
          }

          seen.push(targetName)
        })
      }

      Object.keys(computedVariables).forEach((computedVarName) => {
        if (!seen.includes(computedVarName)) {
          // unregister
          computedVariables[computedVarName]()
        }
      })
    })

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

    const blockRefs = {}
    function defineBlockRef(refName, vueInstance) {
      blockRefs[refName] = vueInstance
    }

    const storyStylesheets = computed(() => sanitizedStory.value.stylesheets)

    // Provide global story methods (used by CmsBlock)
    const providedData = {
      sanitizedStory,
      emitStoryEvent,
      refs: blockRefs,
      defineBlockRef,
      stylesheets: storyStylesheets,
    }
    provide('$_cms_story', providedData)
    storyVM.custom = { story: providedData }


    /* Story defined stylesheets */
    watchEffect(() => {
      if (Array.isArray(sanitizedStory.value?.stylesheets) || Array.isArray(sanitizeStory.value?.fonts)) {
        const parsedSheets = storyVM.eval(sanitizedStory.value.stylesheets, innerModel.value)
        useStylesheets({
          stylesheets: parsedSheets,
          fonts: sanitizedStory.value.fonts,
        })
      }
    })

    const declaredEnums = computed(() => {
      const retval = {}
      forEachBlock(sanitizedStory.value, (block) => {
        if (block.component == 'InputSelect' && block['v-model']) {
          let enumOptions = block.props?.options?.length
            ? i18n.obj(block.props?.options)
            : []

          // what if options is a parsed value  e.g. "{{children}}"
          enumOptions = storyVM.eval(enumOptions, innerModel.value)
          // what if InputSelect has option-text and option-value props?  2DO!

          if (Array.isArray(enumOptions)) {
            retval[block['v-model']] = enumOptions
          }
        }
      })
      return retval
    })

    const $enum = computed(() => {
      const enumValues = {}
      for (const [variableName, enumOptions] of Object.entries(declaredEnums.value)) {
        const currentValue = getProperty(innerModel.value, variableName)

        let targetValue = null
        if (Array.isArray(currentValue)) {
          // Find values this way, so that the end result is sorted in the same order as the enum options
          targetValue = []
          enumOptions.forEach((option) => {
            if (currentValue.includes(option.value)) {
              targetValue.push(option.text)
            }
          })
        } else {
          const matchingEnum = enumOptions.find((e) => e.value == currentValue)
          targetValue = matchingEnum?.text ? matchingEnum.text : currentValue
        }

        setProperty(enumValues, variableName, targetValue)
      }

      return enumValues
    })

    const $format = {
      ul(value) {
        if (!value) {
          return ''
        }
        const arrValue = Array.isArray(value) ? value : [value]
        return '<ul>'
          + arrValue.map((i) => `<li>${i}</li>`).join('')
          + '</ul>'
      },

      ol(value) {
        if (!value) {
          return ''
        }
        const arrValue = Array.isArray(value) ? value : [value]
        return '<ol>'
          + arrValue.map((i) => `<li>${i}</li>`).join('')
          + '</ol>'
      },

      list(value) {
        if (!value) {
          return ''
        }
        const arrValue = Array.isArray(value) ? value : [value]
        return new Intl.ListFormat(i18n.language.value).format(arrValue) // This is awesome
      },

      date(value, options = null) {
        return i18n.date(value, options)
      },

      range(startDate, endDate, options = null) {
        return i18n.formatRange(startDate, endDate, options)
      },
    }


    const isAnimating = ref(false)

    /* Scroll to top of new page */
    function onTransitionEnter() {
      isAnimating.value = true
      window.scrollTo(0, 0)
    }

    function onTransitionAfterEnter() {
      isAnimating.value = false
    }

    // Render function
    return () => !isMounted.value
      ? null
      : h(
        'div',
        {
          class: [
            'CmsStory',
            { 'CmsStory--animating': isAnimating.value },
          ],
        },
        h(
          Transition,
          {
            'name': 'phi-navigation',
            'enter-from-class': `phi-navigation-enter-from phi-navigation-${$nav.transitionDirection.value}-enter-from`,
            'enter-active-class': `phi-navigation-enter-active phi-navigation-${$nav.transitionDirection.value}-enter-active`,
            'enter-to-class': `phi-navigation-enter-to phi-navigation-${$nav.transitionDirection.value}-enter-to`,
            'leave-from-class': `phi-navigation-leave-from phi-navigation-${$nav.transitionDirection.value}-leave-from`,
            'leave-active-class': `phi-navigation-leave-active phi-navigation-${$nav.transitionDirection.value}-leave-active`,
            'leave-to-class': `phi-navigation-leave-to phi-navigation-${$nav.transitionDirection.value}-leave-to`,
            'onEnter': onTransitionEnter,
            'onAfterEnter': onTransitionAfterEnter,
          },
          () => currentPage.value
            ? h(CmsBlock, {
              'key': currentPage.value.id,
              'class': 'CmsStory__page',
              'block': translatedPage.value,
              'modelValue': {
                ...innerModel.value,
                $i18n: {
                  t: (a, b, c) => i18n.t(a, b, c),
                  obj: (v) => i18n.obj(v),
                  words: (v) => i18n.words(v),
                  currency: (value, currency) => i18n.$(value, currency),
                },
                $enum: $enum.value,
                $format: $format,
              },
              'onUpdate:modelValue': onUpdateModelValue,
            })
            : null,
        ),
      )
  },
}
</script>

<style lang="scss">
@import "./transitions.scss";

.CmsStory {
  --cms-story-transition-duration: 0.3s;

  position: relative;
  // border: 1px solid transparent; // prevent margin collapses // BUT it fucks up elements with 100vh or 100vw

  font-size: var(--ui-font-size);
  font-family: var(--ui-font-texts);
  h1,h2,h3,h4,h5,h6 {
    font-family: var(--ui-font-titles);
  }

  &--animating {
    overflow: hidden;
  }
}
</style>