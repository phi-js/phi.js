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
export default function getCssObjectAttributes(blockCss) {
  const retval = {
    class: [],
    style: null,
  }

  // css.class  Single main class
  if (blockCss?.class) {
    retval.class.push(blockCss.class)
  }

  // css.classes
  if (blockCss?.classes?.length) {
    retval.class = [...retval.class, ...blockCss.classes]
  }

  // css.style
  if (blockCss?.style) {
    retval.style = blockCss.style
  }

  return {
    class: retval.class?.length ? retval.class : undefined,
    style: retval.style ? retval.style : undefined,
  }
}