<script setup>
import { ref, watch } from 'vue'

import { VM } from '/packages/vm'
import CmsBlock from '../CmsBlock/CmsBlock.vue'
import { getProperty, setProperty } from '../../functions'
import helperPage from '../../helpers/Page.js'

const props = defineProps({
  page: {
    type: Object,
    required: false,
    default: null,
  },

  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue'])

const pageVm = new VM()

async function evalPage(page) {
  let retval = JSON.parse(JSON.stringify(page))

  for (let si = 0; si < retval.sections.length; si++) {
    let section = retval.sections[si]
    for (let ri = 0; ri < section.rows.length; ri++) {
      let row = section.rows[ri]
      for (let ci = 0; ci < row.columns.length; ci++) {
        let column = row.columns[ci]
        let targetBlocks = []
        for (let bi = 0; bi < column.blocks.length; bi++) {
          let block = column.blocks[bi]

          // Exclude blocks with non-passing v-if
          if (typeof block['v-if'] !== 'undefined' && !(await pageVm.eval(block['v-if'], props.modelValue))) {
            continue
          }

          // Parse props
          let blockProps = block?.props ? await pageVm.eval(block.props, props.modelValue) : undefined
          block.props = blockProps

          // Handle v-model
          if (typeof block['v-model'] !== 'undefined') {
            block.props.modelValue = getProperty(props.modelValue, block['v-model'])
            block.props['onUpdate:modelValue'] = (newValue) => {
              let clone = { ...props.modelValue }
              setProperty(clone, block['v-model'], newValue)
              emit('update:modelValue', clone)
            }
          }

          // Handle listeners
          if (typeof block['v-on'] !== 'undefined') {
            let listeners = block['v-on']
            for (let eventName in listeners) {
              let propName = 'on' + eventName.charAt(0).toUpperCase() + eventName.slice(1)
              block.props[propName] = async ($event) => {
                return await pageVm.eval(listeners[eventName], { ...props.modelValue, $event })
              }
            }
          }

          targetBlocks.push(block)
        }

        column.blocks = targetBlocks
      }
    }
  }

  return retval
}

const sanitizedPage = ref(null)
const page = ref(null)

watch(
  () => props.page,
  async (newValue) => {
    sanitizedPage.value = helperPage.sanitizePage(newValue)
    page.value = await evalPage(sanitizedPage.value)
  },
  {
    immediate: true,
    deep: true,
  },
)

watch(
  () => props.modelValue,
  async () => page.value = await evalPage(sanitizedPage.value),
  { deep: true },
)
</script>

<template>
  <div class="CmsPage">
    <template v-if="page">
      <div
        v-for="section in page.sections"
        :key="section.id"
        class="CmsPage__section"
      >
        <div
          v-for="(row) in section.rows"
          :key="row.id"
          class="CmsPage__row"
        >
          <div
            v-for="(column) in row.columns"
            :key="column.id"
            class="CmsPage__column"
            :style="{flex: column.flex}"
          >
            <CmsBlock
              v-for="(block) in column.blocks"
              :key="block.id"
              class="CmsPage__block"
              :block="block"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.CmsPage {
  &__row {
    display: flex;
  }
}

@media (max-width: 800px) {
  .CmsPage {
    &__row {
      display: block;
    }
  }
}
</style>