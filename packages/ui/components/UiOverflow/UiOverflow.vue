<template>
  <div class="UiOverflow">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'UiOverflow',

  emits: ['update:hiddenCount', 'update:visibleCount'],

  data() {
    return {
      resizeObserver: null,
      mutationObserver: null,
    }
  },

  mounted() {
    const childElements = [...this.$el.childNodes].filter((n) => n.nodeType === 1)
    let targetElement = childElements.length == 1 ? childElements[0] : this.$el

    this.resizeObserver = new ResizeObserver(this.updateHiddenCount)
    this.resizeObserver.observe(targetElement)

    this.mutationObserver = new MutationObserver(this.updateHiddenCount)
    this.mutationObserver.observe(targetElement, {
      childList: true,
      attributes: false,
      subtree: false,
    })
  },

  unmounted() {
    this.resizeObserver.disconnect()
    this.mutationObserver.disconnect()
  },

  methods: {
    updateHiddenCount() {
      let count = 0
      let elBound = this.$el.getBoundingClientRect()

      const childElements = [...this.$el.childNodes].filter((n) => n.nodeType === 1)
      let targetElement = childElements.length == 1 ? childElements[0] : this.$el

      let targetNodes = targetElement.childNodes
      let childCount = 0

      targetNodes.forEach((child) => {
        if (!child.getBoundingClientRect) {
          return
        }

        let childBound = child.getBoundingClientRect()
        if (childBound.right + this.$el.scrollLeft > elBound.right) {
          count++
        }

        childCount++
      })

      this.$emit('update:hiddenCount', count)
      this.$emit('update:visibleCount', childCount - count)
    },
  },
}
</script>

<style lang="scss">
.UiOverflow {
  overflow: hidden;
}
</style>