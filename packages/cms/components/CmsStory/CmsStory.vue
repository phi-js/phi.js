<!-- eslint-disable max-len -->
<script>
import {
  ref,
  watch,
  watchEffect,
  provide,
  h,
  Transition,
  KeepAlive,
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
    // Sanitize and translate (precompile) incoming story
    const sanitizedStory = ref(null)
    watchEffect(() => {
      sanitizedStory.value = JSON.parse(JSON.stringify(sanitizeStory(props.story))) // clone is important, otherwise we'll be mutating prop (i.e. when setting block.props and block.rules below)
    })

    // Determine current page
    const currentPage = ref()

    const setCurrentPage = (pageId) => {
      const foundPage = pageId
        ? sanitizedStory.value.pages.find((page) => page.id == pageId)
        : null

      currentPage.value = foundPage || sanitizedStory.value.pages?.[0]
      if (!currentPage.value?.id) {
        return
      }

      // Splice story header and footer into page slots
      currentPage.value.slots = {
        ...currentPage.value.slots,
        header: currentPage.value.isHeaderEnabled === false ? undefined : sanitizedStory.value.header,
        footer: currentPage.value.isFooterEnabled === false ? undefined : sanitizedStory.value.footer,
      }
    }

    watch(
      () => sanitizedStory.value,
      () => {
        // The story object changed from the outside, so update currentPage
        if (currentPage.value?.id) {
          setCurrentPage(currentPage.value.id)
        }
      },
    )


    // Parse translations
    const i18n = useI18n()

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
    const innerModel = ref({})
    watch(
      () => props.modelValue,
      (newValue) => innerModel.value = newValue, // OJO. REFERENCE to prop !!!
      { immediate: true },
    )

    // StoryVM
    const storyVM = new VM
    storyVM.onModelSet = (propName, propValue) => {
      setProperty(innerModel.value, propName, propValue)
      onUpdateModelValue(innerModel.value)
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
          for (const [propName, propValue] of Object.entries(objData)) {
            setProperty(innerModel.value, propName, propValue)
          }
          onUpdateModelValue(innerModel.value)
        },
      })

      if (!sanitizedStory.value.setup) {
        isMounted.value = true
        return
      }

      const evaluableSetup = i18n.obj(sanitizedStory.value.setup)
      storyVM.eval(evaluableSetup, innerModel.value)
      isMounted.value = true
    })


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

    // Navigation history and direction
    const navigationHistory = ref([]) // array of page IDs
    const loadedPages = {} // loadedPages[page-id] = true | false
    const transitionDirection = ref('forward') // 'forward' | 'back'

    // Hash of window.scrollY positions when leaving a page
    // previousY[page name] = n
    let previousScrollY = {}

    const navigateToPage = (pageId) => {
      if (pageId && pageId == currentPage.value?.id) {
        return
      }

      const previousId = currentPage.value?.id

      previousScrollY[previousId] = window.scrollY

      setCurrentPage(pageId)
      if (currentPage.value?.id) {
        emit('update:currentPageId', currentPage.value.id)
      }

      if (previousId) {
        const previousIndex = sanitizedStory.value.pages.findIndex((p) => p.id == previousId)
        const nextIndex = sanitizedStory.value.pages.findIndex((p) => p.id == currentPage.value.id)
        transitionDirection.value = nextIndex > previousIndex ? 'forward' : 'back'
      }

      if (navigationHistory.value[navigationHistory.value.length - 1]?.id == pageId) {
        return
      }
      navigationHistory.value.push(pageId)

      const pageTo = currentPage.value

      // Evaluate page setup() (once)
      if (pageTo?.['v-on']?.load && !loadedPages[pageTo.id]) {
        storyVM.eval(pageTo['v-on'].load, innerModel.value)
        loadedPages[pageTo.id] = true
      }

      // Evaluate page enter event
      if (pageTo?.['v-on']?.enter) {
        storyVM.eval(pageTo['v-on'].enter, innerModel.value)
      }

      // Evaluate page leave event
      if (previousId) {
        const pageFrom = sanitizedStory.value.pages.find((page) => page.id == previousId)
        if (pageFrom?.['v-on']?.leave) {
          storyVM.eval(pageFrom['v-on'].leave, innerModel.value)
        }
      }
    }

    watch(
      () => props.currentPageId,
      (newPageId) => navigateToPage(newPageId),
      { immediate: true },
    )

    ////// Story navigation

    // Visible pages.  All pages without v-if, or truthy v-if
    const visiblePages = computed(() => {
      return sanitizedStory.value.pages
        .filter((page) => !page['v-if'] || storyVM.eval(page['v-if'], innerModel.value))
        .map((page) => ({
          id: page.id,
          hash: page.hash,
          title: page.title,
        }))
    })

    const pageNav = computed(() => {
      const currentIndex = visiblePages.value.findIndex((p) => p.id == currentPage.value?.id)
      const previousPage = visiblePages.value?.[currentIndex - 1]
      const nextPage = visiblePages.value?.[currentIndex + 1]

      return {
        current: {
          id: currentPage.value?.id,
          hash: currentPage.value?.hash,
          title: currentPage.value?.title,
        },

        prev: previousPage
          ? {
            id: previousPage?.id,
            hash: previousPage?.hash,
            title: previousPage?.title,
          }
          : null,

        next: nextPage
          ? {
            id: nextPage?.id,
            hash: nextPage?.hash,
            title: nextPage?.title,
          }
          : null,
      }
    })

    function goTo(pageId) {
      navigateToPage(pageId)
    }

    function goNext() {
      const currentPageIndex = visiblePages.value.findIndex((p) => p.id == currentPage.value?.id)
      const nextPage = visiblePages.value?.[currentPageIndex + 1]
      if (!nextPage?.id) {
        console.warn('CmsStory.goNext: No next page')
        return
      }

      goTo(nextPage.id)
    }

    function goBack() {
      navigationHistory.value.pop() // remove THIS page from history
      const currentPageIndex = visiblePages.value.findIndex((p) => p.id == currentPage.value?.id)
      const prevPage = visiblePages.value?.[currentPageIndex - 1]

      // const lastPageId = navigationHistory.value.pop()
      if (!prevPage?.id) {
        console.warn('CmsStory.goBack: Already at start')
        return
      }

      goTo(prevPage.id)
    }

    /*
    pageId can also be "next" or "back"
    IF the page is visible, returns a page info object:
    {
      id,
      hash,
      title
    }
    */
    function getPageById(pageId) {
      if (pageId == 'next') {
        return pageNav.value.next
      }
      if (pageId == 'back') {
        return pageNav.value.prev
      }

      const targetPage = visiblePages.value.find((p) => p.id == pageId)
      if (!targetPage) {
        return null
      }

      return {
        id: targetPage?.id,
        hash: targetPage?.hash,
        title: targetPage?.title || targetPage?.info?.text,
      }
    }

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

    function getPageHref(pageId) {
      const useHashes = false
      return useHashes ? `#/${pageId}` : null
    }

    function isPageActive(pageId) {
      return currentPage.value?.id == pageId
    }

    const storyStylesheets = computed(() => sanitizedStory.value.stylesheets)

    // Provide global story methods (used by CmsBlock)
    const providedData = {
      getPageHref,
      isPageActive,
      goNext,
      goTo,
      goBack,
      getPageById,
      sanitizedStory,
      emitStoryEvent,
      visiblePages,
      nav: pageNav,
      refs: blockRefs,
      defineBlockRef,
      stylesheets: storyStylesheets,
    }
    provide('$_cms_story', providedData)
    storyVM.custom = { story: providedData }


    function onUpdateModelValue(event) {
      innerModel.value = event
      emit('update:modelValue', innerModel.value)

      // evaluate story[v-on][update:modelValue]
      if (sanitizedStory.value?.['v-on']?.['update:modelValue']) {
        const initialSetter = storyVM.onModelSet
        storyVM.onModelSet = null
        storyVM.eval(sanitizedStory.value['v-on']['update:modelValue'], innerModel.value)
          .then(() => storyVM.onModelSet = initialSetter)
      }
    }

    /* Story defined stylesheets */
    watchEffect(() => {
      if (Array.isArray(sanitizedStory.value?.stylesheets)) {
        const parsedSheets = storyVM.eval(sanitizedStory.value.stylesheets, innerModel.value)
        useStylesheets(parsedSheets)
      }
    })

    /* Preserve previous window scroll position when navigating */
    function onTransitionEnter() {
      if (previousScrollY?.[currentPage.value?.id]) {
        window.scrollTo(0, previousScrollY[currentPage.value.id])
      }
    }


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

    // Render function
    return () => !isMounted.value
      ? null
      : h(
        'div',
        { class: 'CmsStory' },
        h(
          Transition,
          {
            'name': 'phi-navigation',
            'enter-from-class': `phi-navigation-enter-from phi-navigation-${transitionDirection.value}-enter-from`,
            'enter-active-class': `phi-navigation-enter-active phi-navigation-${transitionDirection.value}-enter-active`,
            'enter-to-class': `phi-navigation-enter-to phi-navigation-${transitionDirection.value}-enter-to`,
            'leave-from-class': `phi-navigation-leave-from phi-navigation-${transitionDirection.value}-leave-from`,
            'leave-active-class': `phi-navigation-leave-active phi-navigation-${transitionDirection.value}-leave-active`,
            'leave-to-class': `phi-navigation-leave-to phi-navigation-${transitionDirection.value}-leave-to`,
            'onEnter': onTransitionEnter,
          },
          () => h(
            KeepAlive,
            null,
            currentPage.value
              ? h(CmsBlock, {
                'key': currentPage.value.id,
                'class': 'CmsStory__page',
                'block': translatedPage.value,
                'modelValue': {
                  ...innerModel.value,
                  // $i18n: i18n,
                  $pages: visiblePages.value,
                  $nav: pageNav.value,
                  $page: pageNav.value.current,
                  $enum: $enum.value,
                  $format: $format,
                },
                'onUpdate:modelValue': onUpdateModelValue,
              })
              : null,
          ),
        ),
      )
  },
}
</script>

<style lang="scss">
@import "./transitions.scss";

.CmsStory {
  --cms-story-transition-duration: var(--ui-duration-quick);
  --cms-story-transition-duration: 0.3s;

  position: relative;
  // border: 1px solid transparent; // prevent margin collapses // BUT it fucks up elements with 100vh or 100vw
}
</style>