export default function (text) {
  let parts = text.split("|");
  if (parts.length < 2) {
    return;
  }

  let options = [];

  parts.forEach(part => {
    let text = part.trim();
    if (text) {
      options.push({
        text,
        value: text.replace(/\s+/g, "_").toLowerCase()
      });
    }
  });

  return {
    component: "CmsInputSelect",
    title: "Opcion",
    props: {
      options: options
    },
    'v-model': 'select'
  };
}