/*
Given a block "css" object:
{
  "classes": ["className1", "className2", "..."],                 // Array
  "variables": {                                                  // Object
    "--ui-content-width": "",
    "--ui-color-primary": ""
  },
  "style": "color: red; border: 2px solid red; padding: 20px"     // String
}

return an object with parsed "class" and "style" properties,
ready to be used via v-bind

{
  "class": ["className1", "className2", "..."],
  "style": "--ui-content-width: none; --ui-color-primary; color: red; border: 2px solid red; padding: 20px"
}

*/
export default function getCssObjectAttributes(blockCss) {
  const retval = {
    class: null,
    style: null,
  }

  // css.classes
  if (blockCss?.classes?.length) {
    retval.class = retval.class ? [retval.class, ...blockCss.classes] : blockCss.classes
  }

  let strStyle = ''

  // css.variables
  if (blockCss?.variables && typeof blockCss.variables === 'object' && Object.keys(blockCss.variables).length) {
    strStyle = toStyleString(blockCss.variables)
  }

  // css.style
  if (blockCss?.style) {
    strStyle = strStyle + blockCss.style
  }

  if (strStyle) {
    retval.style = retval.style ? strStyle + retval.style : strStyle
  }

  return {
    class: retval.class?.length ? retval.class : undefined,
    style: retval.style ? retval.style : undefined,
  }
}

function toStyleString(obj) {
  let retval = ''
  for (const [key, value] of Object.entries(obj)) {
    retval += `${key}:${value};`
  }
  return retval
}