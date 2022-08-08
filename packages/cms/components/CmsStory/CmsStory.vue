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
  onMounted,
  computed,
} from 'vue'

import { CmsBlock } from '../CmsBlock'
import {
  getPluginData,
  sanitizeStory,
  parseTranslations,
  forEachBlock,
  setProperty,
  useStylesheets,
} from '../../functions'
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
    // Determine current page
    const currentPage = ref()

    // Sanitize and translate (precompile) incoming story
    const i18n = useI18n()
    const sanitizedStory = ref(null)
    watchEffect(() => {
      sanitizedStory.value = JSON.parse(JSON.stringify(sanitizeStory(props.story))) // clone is important, otherwise we'll be mutating prop (i.e. when setting block.props and block.rules below)

      // The story changed from the outside, so reload the currentPage value
      if (currentPage.value?.id) {
        setCurrentPage(currentPage.value.id)
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
          block.props = parseTranslations(block.props, i18n.locale, block.i18n)
        }
        if (block.rules) {
          block.rules = parseTranslations(block.rules, i18n.locale, block.i18n)
        }
        if (block['v-on']) {
          block['v-on'] = parseTranslations(block['v-on'], i18n.locale, block.i18n)
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

      storyVM.eval(sanitizedStory.value.setup, innerModel.value)
      isMounted.value = true
    })

    // Navigation history and direction
    const navigationHistory = ref([]) // array of page IDs
    const loadedPages = {} // loadedPages[page-id] = true | false
    const transitionName = ref('slideX')
    const transitionDirection = ref('fw') // fw, bw

    // Hash of window.scrollY positions when leaving a page
    // previousY[page name] = n
    let previousScrollY = {}

    // Set the current page
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
        header: !currentPage.value.omitHeader ? sanitizedStory.value.header : undefined,
        footer: !currentPage.value.omitFooter ? sanitizedStory.value.footer : undefined,
      }
    }

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
        transitionDirection.value = nextIndex > previousIndex ? 'fw' : 'bw'
      }

      if (navigationHistory.value[navigationHistory.value.length - 1]?.id == pageId) {
        return
      }
      navigationHistory.value.push(pageId)

      const pageTo = currentPage.value

      // Evaluate page setup() (once)
      if (pageTo?.setup && !loadedPages[pageTo.id]) {
        storyVM.eval(pageTo.setup, innerModel.value)
        loadedPages[pageTo.id] = true
      }

      // Evaluate page onEnter()
      if (pageTo?.onEnter) {
        storyVM.eval(pageTo.onEnter, innerModel.value)
      }

      // Evaluate page onLeave()
      if (previousId) {
        const pageFrom = sanitizedStory.value.pages.find((page) => page.id == previousId)
        if (pageFrom?.onLeave) {
          storyVM.eval(pageFrom.onLeave, innerModel.value)
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
      goNext,
      goTo,
      goBack,
      globals,
      sanitizedStory,
      emitStoryEvent,
      visiblePages,
      nav: pageNav,
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

    function onUpdateErrors(evt) {
      // globals.$errors is reactive and will trigger an update on ALL blocks when it changes
      // so make sure not to update the value unnecessarylylylyl
      if (!evt.length && !globals.$errors.length) {
        return
      }

      globals.$errors = evt
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

    // Render function
    return () => !isMounted.value
      ? null
      : h(
        'div',
        { class: 'CmsStory' },
        [
          h(
            'div',
            { class: 'CmsStory__viewport' },
            h(
              Transition,
              {
                'name': `${transitionName.value}--${transitionDirection.value}`,
                'enter-active-class': `animating ${transitionName.value}--${transitionDirection.value}-enter-active`,
                'leave-active-class': `animating ${transitionName.value}--${transitionDirection.value}-leave-active`,
                'onEnter': onTransitionEnter,
              },
              () => h(
                KeepAlive,
                null,
                currentPage.value
                  ? h(CmsBlock, {
                    'key': currentPage.value.id,
                    'onUpdate:errors': onUpdateErrors,
                    'class': 'CmsStory__page',
                    'block': translatedPage.value,
                    'modelValue': {
                      ...innerModel.value,
                      $i18n: i18n,
                      $pages: visiblePages.value,
                      $nav: pageNav.value,
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
  // --cms-story-transition-duration: 5s;

  &__viewport {
    position: relative;

    // o height 100%, o overflow:hidden.  Pero tener AMBOS causa que no se haga scroll en la vista final del story
    // height: 100%;
    overflow: hidden;
  }
}
</style>