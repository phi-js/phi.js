const pageFiles = import.meta.glob('../pages/**/*.vue');
const pages = [];
for (const path in pageFiles) {
  let name = path.slice(9, -4) // remove .vue
  let isLocal = name.includes('.local');
  if (isLocal) {
    name = name.replace('.local', '');
  }

  pages.push({
    href: name,
    name,
    path,
    dir: path.replace('../', '').split('/').slice(0, -1).join('/'),
    import: pageFiles[path],
    isLocal
  });
}

const modules = import.meta.glob('../packages/**/*.docs.vue');
const componentDocs = [];
for (const path in modules) {
  let parts = path.split('/');
  let name = parts[parts.length - 1].slice(0, -9) // remove .docs.vue
  let isLocal = name.includes('.local');
  if (isLocal) {
    name = name.replace('.local', '');
  }

  componentDocs.push({
    href: 'component/' + name,
    name,
    path,
    dir: path.replace('../packages', '').split('/').slice(0, -1).join('/'),
    import: modules[path],
    isLocal
  });
}

export default [
  ...pages,
  ...componentDocs
]