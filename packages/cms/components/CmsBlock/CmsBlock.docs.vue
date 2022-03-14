<script setup>
import { ref } from 'vue'
import { CmsBlock } from '@/packages/cms/components'

const defaultStory = {
  id: 'story-test-1',

  pages: [
    {
      component: 'LayoutPage',
      props: {
        elti: '{{texts.title}}',
        elsubti: '{{texts.subtitle}}',
        ladecri: '{{texts.description}}',
        // elnest: '{{texts.nested.text}}',
      },
      slot: [
        {
          component: 'LayoutRow',
          slot: [
            {
              component: 'LayoutColumn',
              slot: [
                {
                  'component': 'MediaImage',
                  'props': {
                    alt: 'Phi.js',
                    title: 'Hello world!',
                    src: '/phi.svg',
                    align: 'center',
                  },
                  'v-if': {
                    field: 'nParrafos',
                    op: 'eq',
                    args: '3',
                  },
                },
                {
                  component: 'MediaHtml',
                  props: { value: '<h1>Phi<em>.js</em> ({{nParrafos}})</h1><h2>{{ texts.title }}</h2>' },
                },
                {
                  'component': 'InputText',
                  'props': { label: 'Color', type: 'text' },
                  'v-model': 'texts.title',
                  'rules': [
                    {
                      required: true,
                      message: 'Debes poner un color',
                    },
                    {
                      regex: '^[a-z]+$',
                      message: 'Sólo minúsculas',
                    },
                  ],
                },
                {
                  'v-if': {
                    field: 'nParrafos',
                    op: 'eq',
                    args: '3',
                  },
                  'component': 'MediaLoremIpsum',
                  'props': { nParagraphs: '{{nParrafos}}' },
                  'css': {
                    style: { color: '#333' },
                    class: 'foo',
                    classes: ['two'],
                    css: `
                    .foo p {
                      font-size: 1.2em;
                      margin: 0 0 1rem 0;
                    }

                    .two {
                      background: #fff;
                      padding: 24px;
                      border-radius: 12px;
                      border: 5px solid {{texts.title}};
                    }`,
                  },
                },
                {
                  'component': 'InputButton',
                  'props': { type: 'button', label: 'Click me' },
                  'v-on': {
                    click: {
                      chain: [
                        {
                          do: {
                            call: 'console.log',
                            args: 'CLICKITY!!!!',
                          },
                        },
                        {
                          do: 'TOMA YA',
                          assign: 'items[0].name',
                        },
                        {
                          do: 'TOMA YA TU',
                          assign: 'items[1].name',
                        },
                        {
                          do: {
                            eval: `
                              console.log('OH INDEED', $modelValue)
                              //return $modelValue.items.map(i => ({...i, name: 'YEE'}))
                              $modelValue.items.forEach((i,k) => i.name = 'Yyeeee ' + (k || ''))
                            `,
                          },
                          // assign: 'items',
                        },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
        {
          'v-for': 'items',
          // 'v-if': {
          //   field: '$key',
          //   op: 'number.gte',
          //   args: 2,
          // },
          'component': 'LayoutRow',
          'slot': {
            component: 'LayoutColumn',
            slot: [
              // {
              //   component: 'MediaHtml',
              //   props: { value: '<pre>$item: {{$item}}\n$key: {{$key}}</pre>' },
              // },
              {
                'component': 'InputText',
                'props': { label: 'Name' },
                'v-model': '$item.name',
                'rules': [
                  {
                    required: true,
                    message: 'No puede estar vacio',
                  },
                  {
                    regex: '^[^0-9]+$',
                    message: 'No pongas numeros',
                  },
                ],
              },
            ],
          },
        },
      ],
    },
  ],
}

const story = ref(defaultStory)


const modelValue = ref({
  nParrafos: 2,

  texts: {
    title: 'TITLE!',
    subtitle: 'SUBTITLE',
    description: 'DESCRIPTION',
    nested: { text: 'NESTY' },
  },

  items: [
    { id: 1, name: 'pepe 1' },
    { id: 2, name: 'pepe 2' },
    { id: 3, name: 'pepe 3' },
    { id: 4, name: 'pepe 4' },
    { id: 5, name: 'pepe 5' },
  ],
})

</script>

<template>
  <input
    v-model="modelValue.nParrafos"
    type="text"
  >
  <input
    v-model="modelValue.texts.title"
    type="text"
  >
  <input
    v-model="modelValue.texts.subtitle"
    type="text"
  >
  <input
    v-model="modelValue.texts.description"
    type="text"
  >
  <input
    v-model="modelValue.texts.nested.text"
    type="text"
  >
  <input
    v-model="modelValue.items[0].name"
    type="text"
  >

  <br>

  <input
    v-model="story.pages[0].slot[0].slot[0].slot[0].props.title"
    type="text"
  >
  <input
    v-model="story.pages[0].slot[0].slot[0].slot[1].props.value"
    type="text"
  >
  <CmsBlock
    v-model="modelValue"
    :block="story.pages[0]"
  />
  <pre>modelValue: {{ modelValue }}</pre>
</template>