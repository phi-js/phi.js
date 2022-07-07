<script setup>
import { ref, watch, computed } from 'vue'

import { useI18n } from '@/packages/i18n'
import { UiTabs, UiTab, UiInput, UiIcon, UiItem } from '@/packages/ui'

import { normalizeQuery, denormalizeQuery } from './normalize'
import DbQueryProperties from './DbQueryProperties.vue'
import DbQueryWhere from './DbQueryWhere.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: false,
    default: null,
  },

  schema: {
    type: Object,
    required: false,
    default: null,
  },

  tab: {
    type: String,
    required: false,
    default: null,
  },

  isNested: {
    type: Boolean,
    required: false,
    default: false,
  },

  /*
  An array of allowed tab IDs.
  No allowedTabs means ALL tabs are allowed
  e.g. ['where']   from | properties | where
  */
  allowedTabs: {
    type: Array,
    required: false,
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'update:tab'])

const innerQuery = ref()

watch(
  () => props.modelValue,
  (newValue) => innerQuery.value = normalizeQuery(newValue),
  { immediate: true },
)

function emitUpdate() {
  emit('update:modelValue', denormalizeQuery(innerQuery.value))
}

const availableSources = ref([
  {
    value: 'default',
    text: 'Tabla',
  },
  {
    value: 'page',
    text: 'Page',
  },
  {
    value: 'entity',
    text: 'Entity',
  },
])

const isAllowed = computed(() => {
  const retval = {
    from: true,
    properties: true,
    where: true,
    limit: true,
    source: true,
  }

  if (!Array.isArray(props.allowedTabs)) {
    return retval
  }

  return {
    from: props.allowedTabs.includes('from'),
    properties: props.allowedTabs.includes('properties'),
    where: props.allowedTabs.includes('where'),
    limit: props.allowedTabs.includes('limit'),
    source: props.allowedTabs.includes('source'),
  }
})

const i18n = useI18n({
  en: {
    'DbQueryEditor.From': 'From',
    'DbQueryEditor.Properties': 'Properties',
    'DbQueryEditor.Where': 'Where',
    'DbQueryEditor.Limit': 'Limit',
    'DbQueryEditor.Source': 'Source',
  },

  es: {
    'DbQueryEditor.From': 'Origen',
    'DbQueryEditor.Properties': 'Propiedades',
    'DbQueryEditor.Where': 'Condiciones',
    'DbQueryEditor.Limit': 'Límite',
    'DbQueryEditor.Source': 'Fuente',
  },
})
</script>

<template>
  <div class="DbQueryEditor">
    <UiTabs
      :model-value="props.tab"
      @update:model-value="emit('update:tab', $event)"
    >
      <UiTab
        v-if="isAllowed.from"
        :text="i18n.t('DbQueryEditor.From')"
        value="from"
      >
        <div class="UiGroup details__contents">
          <UiInput
            v-model="innerQuery.from.source"
            label="source"
            type="select-native"
            :options="availableSources"
            @update:model-value="emitUpdate()"
          />
          <UiInput
            v-model="innerQuery.from.table"
            label="table"
            type="text"
            @update:model-value="emitUpdate()"
          />
        </div>

        <!-- ON -->
        <div v-if="props.isNested">
          <div
            v-for="(joinCondition, i) in innerQuery.on"
            :key="i"
            class="UiGroup"
          >
            <UiInput
              v-model="innerQuery.on[i].local"
              label="local"
              type="text"
              @update:model-value="emitUpdate()"
            />
            <UiInput
              v-model="innerQuery.on[i].foreign"
              label="foreign"
              type="text"
              @update:model-value="emitUpdate()"
            />
            <UiIcon
              class="ui--clickable"
              src="mdi:close"
              @click="innerQuery.on.splice(i,1); emitUpdate();"
            />
          </div>

          <UiItem
            class="ui--clickable"
            icon="mdi:plus"
            text="Agregar join"
            @click="innerQuery.on.push({local:'', foreign:''})"
          />
        </div>


        <!-- MATCH -->
        <div class="details__contents">
          <div
            v-for="(_, i) in innerQuery.match"
            :key="i"
            class="UiGroup"
          >
            <UiInput
              v-model="innerQuery.match[i].propertyName"
              label="propertyName"
              type="text"
              @update:model-value="emitUpdate()"
            />
            <UiInput
              v-model="innerQuery.match[i].propertyValue"
              label="propertyValue"
              type="text"
              @update:model-value="emitUpdate()"
            />
            <UiIcon
              class="ui--clickable"
              src="mdi:close"
              @click="innerQuery.match.splice(i,1); emitUpdate();"
            />
          </div>

          <UiItem
            class="ui--clickable"
            icon="mdi:plus"
            text="Agregar match"
            @click="innerQuery.match.push({propertyName:'', propertyValue:''})"
          />
        </div>
      </UiTab>

      <UiTab
        v-if="isAllowed.properties"
        :text="i18n.t('DbQueryEditor.Properties')"
        value="properties"
      >
        <div class="details__contents">
          <DbQueryProperties
            v-model="innerQuery.properties"
            @update:model-value="emitUpdate()"
          />
        </div>
      </UiTab>

      <UiTab
        v-if="isAllowed.where"
        :text="i18n.t('DbQueryEditor.Where')"
        value="where"
      >
        <div class="details__contents">
          <DbQueryWhere
            v-model="innerQuery.where"
            :schema="props.schema"
            @update:model-value="emitUpdate()"
          />
        </div>
      </UiTab>

      <template v-if="!isNested">
        <UiTab
          v-if="isAllowed.limit"
          :text="i18n.t('DbQueryEditor.Limit')"
          value="limit"
        >
          <div class="UiGroup details__contents">
            <UiInput
              v-model="innerQuery.limit"
              label="limit"
              type="text"
              @update:model-value="emitUpdate()"
            />
            <UiInput
              v-model="innerQuery.page"
              label="page"
              type="text"
              @update:model-value="emitUpdate()"
            />
          </div>
        </UiTab>

        <UiTab
          v-if="isAllowed.source"
          :text="i18n.t('DbQueryEditor.Source')"
          value="source"
        >
          <UiInput
            v-model="innerQuery"
            type="json"
            @update:model-value="emitUpdate()"
          />
        </UiTab>
      </template>

      <slot name="tabs" />
    </UiTabs>
  </div>
</template>