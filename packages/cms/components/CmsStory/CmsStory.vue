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
  computed,
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
      })

      sanitizedStory.value = sanitized
    })

    // Evaluate story.setup
    onMounted(async () => {
      if (!sanitizedStory.value.setup) {
        return
      }

      const storyVM = new VM
      storyVM.onModelSet = (propName, propValue) => {
        const modelValue = { ...props.modelValue }
        setProperty(modelValue, propName, propValue)
        onUpdateModelValue(modelValue)
      }

      await storyVM.eval(sanitizedStory.value.setup)
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
    const navigationHistory = ref([]) // array of page IDs

    watch(
      () => props.currentPageId,
      (newPageId) => {
        navigationHistory.value.push(newPageId)
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
    }

    // Global CSS
    const storyCSS = computed(() => sanitizedStory.value.css.classes.map((c) => c.css).join('\n'))

    // Render function
    return () => h('div', { class: 'CmsStory' }, [
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
              currentPage.value
                ? h(CmsBlock, {
                  'v-model:errors': globals.$errors,
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