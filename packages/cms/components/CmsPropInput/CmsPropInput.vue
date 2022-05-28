<script setup>
/*
el valor de propValue se interpreta internamente asi:

propValue = "Hola"
innerValue = {
  type: 'string',
  value: 'Hola'
}

propValue = 123
innerValue = {
  type: 'number',
  value: 'Hola'
}

propValue = "{{algo}}"
innerValue = {
  type: 'variable',
  value: 'algo'
}

propValue = "{{algo ? 'si' : 'no'}}"
innerValue = {
  type: 'expression',
  value: 'algo ? 'si' : 'no''
}

propValue = "lang(algunaCosa)"
innerValue = {
  type: 'lang',
  value: 'algunaCosa'
}

<CmsPropInput v-model="propValue" />
*/

import { useAttrs, computed, ref, watch } from 'vue'
import { UiInput, UiPopover, UiIcon, UiItem } from '../../../ui'

import useModelSchema from '@/packages/vm/components/VmStatement/useModelSchema.js'
import getSchemaVariables from '@/packages/vm/helpers/getSchemaVariables.js'

const props = defineProps({
  modelValue: {
    validator: () => true,
    required: false,
    default: null,
  },

  block: {
    type: Object,
    required: false,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue', 'update:block'])
const attrs = useAttrs()

const innerValue = ref()

watch(
  () => props.modelValue,
  () => innerValue.value = parseValue(props.modelValue),
  { immediate: true },
)

function parseValue(incoming) {
  const retval = {
    type: innerValue.value?.type || attrs?.type || 'text',
    value: incoming,
  }

  if (!incoming) {
    return retval
  }

  if (typeof incoming == 'number') {
    retval.type = 'number'
    return retval
  }

  // Expression strings "{{someExpression}}"
  const expr = incoming.match(/{{(.*?)}}/)?.[1]
  if (typeof expr == 'string') {
    retval.type = 'expression'
    retval.value = expr
    return retval
  }

  // Lang strings "lang(comeLangKey)"
  const text = incoming.match(/lang\(([^"]*?)\)/)?.[1]
  if (typeof text == 'string') {
    retval.type = 'lang'
    retval.value = text
    return retval
  }

  return retval
}

const availableTypes = [
  {
    text: 'Number',
    value: 'number',
    icon: 'mdi:numeric',
  },
  {
    text: 'Text',
    value: 'text',
    icon: 'mdi:format-text',
  },
  {
    text: 'Translation',
    value: 'lang',
    icon: 'mdi:translate',
  },
  {
    text: 'Variable',
    value: 'expression',
    icon: 'mdi:code-braces',
  },
]

const currentType = computed(() => availableTypes.find((t) => t.value == innerValue.value.type))

function setType(objType) {
  if (innerValue.value.type == objType.value) {
    return false
  }

  innerValue.value.type = objType.value
  return true
}

const modelSchema = useModelSchema()
const schemaVariables = computed(() => getSchemaVariables(modelSchema.value))

const variableSelectorOptions = computed(() => {

  const retval = schemaVariables.value.map((schemaVar) => ({
    value: schemaVar.name,
    text: schemaVar.name,
  }))

  if (innerValue.value.value) {
    const found = schemaVariables.value.find((schemaVar) => schemaVar.name == innerValue.value.value)
    if (!found) {
      retval.push({
        value: innerValue.value.value,
        // text: `custom: ${innerValue.value.value}`,
        text: innerValue.value.value,
      })
    }
  }


  retval.push({
    value: 'custom',
    text: 'Type variable name...',
  })

  return retval
})

function onVariablePickerChange($event) {
  if ($event == 'custom') {
    const varName = prompt('Type a variable name', innerValue.value.value)
    if (!varName) {
      innerValue.value.value = ''
      return false
    }
    innerValue.value.value = varName
  } else {
    innerValue.value.value = $event
  }

  emit('update:modelValue', '{{' + innerValue.value.value + '}}')
}

</script>

<template>
  <div
    class="CmsPropInput"
    :class="`CmsPropInput--${innerValue.type}}`"
  >
    <div class="CmsPropInput__body">
      <template v-if="innerValue.type == 'expression'">
        <UiInput
          v-bind="attrs"
          :model-value="innerValue.value || null"
          type="select-native"
          placeholder="Select variable ..."
          :options="variableSelectorOptions"
          @update:model-value="onVariablePickerChange($event)"
        />
      </template>
      <template v-else-if="innerValue.type == 'lang'">
        <UiInput
          v-bind="attrs"
          v-model="innerValue.value"
          type="text"
          @update:model-value="emit('update:modelValue', `lang(${innerValue.value})`)"
        />
      </template>
      <template v-else>
        <UiInput
          v-bind="attrs"
          :type="innerValue.type"
          :model-value="props.modelValue"
          @update:model-value="emit('update:modelValue', $event)"
        />
      </template>
    </div>

    <div>
      <UiPopover>
        <template #trigger>
          <UiIcon
            class="CmsPropInput__picker"
            :src="currentType?.icon || 'mdi:dots-vertical'"
          />
        </template>
        <template #contents="{ close }">
          <div class="CmsPropInput__typeList">
            <UiItem
              v-for="avType in availableTypes"
              :key="avType.value"
              v-bind="avType"
              class="CmsPropInput__typeItem"
              :class="{'CmsPropInput__typeItem--active': avType.value == innerValue.type}"
              @click="setType(avType) && close()"
            />
          </div>
        </template>
      </UiPopover>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/packages/ui/themes/base/modifiers/clickable.scss';

.CmsPropInput {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;

  &__picker {
    width: 40px;
    height: 40px;
    @extend .ui--clickable;
  }

  &__typeItem {
    --ui-item-padding: 8px 12px;
    @extend .ui--clickable;

    &--active {
      background-color: rgba(255,255,255, 0.1);
      font-weight: bold;
    }
  }
}
</style>