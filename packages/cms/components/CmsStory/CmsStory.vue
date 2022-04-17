<script>
// Base story styles
import '../../style/base.scss'

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

import CmsBlock from '../CmsBlock/CmsBlock.vue'
import { sanitizeStory, parseTranslations, forEachBlock, setProperty } from '../../functions'
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

  emits: ['update:modelValue', 'update:currentPageId'],

  setup(props, { emit }) {
    // Sanitize and translate (precompile) incoming story
    const i18n = useI18n()
    const sanitizedStory = ref(null)
    watchEffect(() => {
      const sanitized = JSON.parse(JSON.stringify(sanitizeStory(props.story))) // clone is important, otherwise we'll be mutating prop (i.e. when setting block.props and block.rules below)

      forEachBlock(sanitized, (block) => {
        if (!block.i18n) {
          return
        }
        if (block.props) {
          block.props = parseTranslations(block.props, block.i18n, i18n.locale)
        }
        if (block.rules) {
          block.rules = parseTranslations(block.rules, block.i18n, i18n.locale)
        }
        if (block['v-on']) {
          block['v-on'] = parseTranslations(block['v-on'], block.i18n, i18n.locale)
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

    // Evaluate story.setup
    const isMounted = ref(false)
    onMounted(async () => {
      if (!sanitizedStory.value.setup) {
        isMounted.value = true
        return
      }

      isMounted.value = false
      await storyVM.eval(sanitizedStory.value.setup, props.modelValue)
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

    // Provide global story methods (used by CmsBlock)
    provide('$_cms_story', {
      goTo,
      goBack,
      globals,
    })

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
      globals.$errors = evt
    }

    // Global CSS
    const storyCSS = ref()
    watchEffect(async () => {
      const strCSS = sanitizedStory.value.css.classes.map((c) => c.css).join('\n')
      storyCSS.value = await storyVM.eval(strCSS, props.modelValue)
    })

    // Render function
    return () => h('div', { class: 'CmsStory' }, [

      // Story <style> element in <head>
      h(
        Teleport,
        { to: 'head' },
        h('style', { type: 'text/css', class: 'CmsStory__style' }, storyCSS.value),
      ),

      h(
        'div',
        { class: 'CmsStory__container' },
        h(
          Transition,
          { name: `${transitionName.value}--${transitionDirection.value}` },
          () => h(
            'div',
            { key: currentPage.value.id },
            h(
              KeepAlive,
              null,
              currentPage.value && isMounted.value
                ? h(CmsBlock, {
                  'onUpdate:errors': onUpdateErrors,
                  'errors': globals.$errors,
                  'class': 'CmsStory__page',
                  'block': currentPage.value,
                  'modelValue': props.modelValue,
                  'onUpdate:modelValue': onUpdateModelValue,
                })
                : null,
            ),
          ),
        ),
      ),
    ])
  },
}
</script>

<style lang="scss">
.CmsStory {
  @import "./transitions.scss";
  --cms-story-transition-duration: var(--ui-duration-quick);

  &__container {
    position: relative;
  }
}
</style>