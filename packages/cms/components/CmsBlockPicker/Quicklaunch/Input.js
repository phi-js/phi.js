export default function (text) {
  let isInput = text.charAt(0) == '[' && text.slice(-1) == ']';
  if (!isInput) {
    return;
  }

  let varname = text.slice(1, -1);

  return {
    title: varname,
    component: 'CmsInput',
    props: {
      type: 'text',
      label: varname
    },
    "v-model": varname
  };
}