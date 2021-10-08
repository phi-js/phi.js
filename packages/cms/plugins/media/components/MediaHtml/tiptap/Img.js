// import { Node } from 'tiptap'
import { Image } from 'tiptap-extensions'
import ImgComponent from './ImgComponent.vue';

export default class Img extends Image {

  setSelection() {
    console.log('Img.setSelection!()', arguments);
  }

  get view() {
    return ImgComponent
  }

  get schema() {
    return {
      inline: true,
      attrs: {
        src: {},
        alt: { default: null },
        title: { default: null },
        style: { default: null },
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs: dom => ({
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            alt: dom.getAttribute('alt'),
            style: dom.getAttribute('style'),
          }),
        },
      ],
      toDOM: node => ['img', node.attrs],
    }
  }
}