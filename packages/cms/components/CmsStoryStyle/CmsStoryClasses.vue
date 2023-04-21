<script setup>
/*
Given an array of STYLESHEETS,
this component will CRUD manage those with type=class
[
  {
    id: 'highlihgtedTexts',
    src: '.highlihgtedTexts {\n}\n\n.highlihgtedTexts h2 {\n  color: var(--ui-color-primary);\n  font-weight: 600;\n  font-size: 3em;\n}',
    type: 'class',
  },
  {
    id: 'my-group',
    src: '.my-group {\n  margin: 2rem 0;\n  border-radius: 5px;\n  background-color: var(--ui-color-z1);\n  padding: 12px 16px;\n}\n\n.my-group h3 {\n  font-weight: 600;\n}',
    type: 'class',
  },
  ...
]
*/
import { ref, watch } from 'vue'
import { UiItem } from '@/packages/ui'
import CssEditor from '@/packages/ui/components/CssEditor/CssEditor.vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: false,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'created'])

const arrClasses = ref([])
const selectedClassIndex = ref(-1)

watch(
  () => props.modelValue,
  (newValue) => arrClasses.value = newValue.filter((sheet) => sheet.type == 'class'),
  { immediate: true },
)

function emitUpdate() {
  const targetValue = props.modelValue.filter((sheet) => sheet.type != 'class')
  targetValue.push(...arrClasses.value)
  emit('update:modelValue', targetValue)
}

function onDeleteClass(index) {
  if (!confirm(`Delete class '${arrClasses.value[index].id}'?`)) {
    return
  }

  arrClasses.value.splice(index, 1)
  emitUpdate()
}

function promptCreateClass() {
  const classTitle = window.prompt('Type a class name')
  if (!classTitle || !classTitle.trim()) {
    return
  }
  const className = classTitle.replace(/[^a-zA-Z0-9.\-_]/g, '')
  if (!className) {
    return
  }

  const newClass = {
    id: className,
    title: classTitle,
    src: `.${className} {\n  \n}`,
    type: 'class',
  }

  arrClasses.value.push(newClass)
  emitUpdate()
  emit('created', newClass)

  selectedClassIndex.value = arrClasses.value.length - 1
}
</script>

<template>
  <div class="CmsStoryClasses">
    <CssEditor
      v-if="selectedClassIndex >= 0"
      v-model="arrClasses[selectedClassIndex].src"
      class="CmsStoryClasses__classEditor"
      @update:model-value="emitUpdate()"
    >
      <template #header>
        <UiItem
          class="CmsStoryClasses__headerItem"
          :text="arrClasses[selectedClassIndex].title || arrClasses[selectedClassIndex].id"
          icon="mdi:arrow-left-thick"
          @click-icon="selectedClassIndex = -1"
        />
      </template>
    </CssEditor>
    <template v-else>
      <UiItem
        v-for="(cssClass, i) in arrClasses"
        :key="i"
        class="CmsStoryClasses__classItem"
        :text="cssClass.title || cssClass.id"
        :subtext="cssClass.description"
        icon="mdi:arrow-right-thick"
        @delete="onDeleteClass(i)"
        @click="selectedClassIndex = i"
      />

      <UiItem
        class="CmsStoryClasses__adder"
        text="Create class"
        icon="mdi:plus"
        @click="promptCreateClass()"
      />
    </template>
  </div>
</template>