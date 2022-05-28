/*
Given a block "css" object:

block: {
  ...
  css: {
    class: '' STRING.  A main class name to assign to this object
    classes: [] ARRAY.  An ARRAY of STRINGS of class names to assign to this object
    style: {} OBJECT. An object describing css attributes, passed to final component as :style="..."
    css: STRING.  A string with custom css classes, to be added as a <style> by CmsBlock.vue
  }
}

return an object with parsed "class" and "style" properties,
ready to be used via v-bind to a component

{
  "class": ["className1", "className2", "..."],
  "style": "--ui-content-width: none; --ui-color-primary; color: red; border: 2px solid red; padding: 20px"
}

*/
export default function getCssObjectAttributes(evaldCSS, block = null) {
  const retval = {
    class: [],
    style: null,
  }

  // css.class  Single main class
  if (evaldCSS?.class) {
    retval.class.push(evaldCSS.class)
  }

  // css.classes
  if (evaldCSS?.classes?.length) {
    retval.class = [...retval.class, ...evaldCSS.classes]
  }

  // css.style
  if (evaldCSS?.style) {
    retval.style = evaldCSS.style
  }

  if (block !== null) {
    retval.class.push('CmsBlock')
    if (block.name) {
      retval.class.push(block.name)
    }
  }

  return {
    class: retval.class?.length ? retval.class : undefined,
    style: retval.style ? retval.style : undefined,
  }
}